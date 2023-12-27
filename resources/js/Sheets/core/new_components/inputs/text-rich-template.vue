<template>
    <form-group :id="id" :label="label" :required="required" :linkTarget="link_target" :linkDescription="link_description"
        :tooltipInfo="tooltip" v-if="show_field">
        <div v-if="loading" class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Cargando...</span>
            </div>
        </div>
        <Editor api-key="vdjygk7n8vw4laxwpwsmh1sb36zu318ltnp3u9f9wcrqx83g" :init="tinymceConfig" :id="id"
            v-else-if="tinymceConfig" v-model="content" />
        <h3 v-else>Seleccione una entidad para poder usar este campo</h3>
    </form-group>
</template>
<script>
import mix from '../mixs/input.vue';
import FormGroup from '../templates/form-group.vue';
import Editor from '@tinymce/tinymce-vue';
import Axios from 'axios';

export default {
    mixins: [mix],
    components: {
        'form-group': FormGroup,
        Editor,
    },
    data() {
        return {
            content: '',
            tinymceConfig: null,
            editorInstance: null,
            loading: false,
        };
    },
    computed: {
        selectorFilters() {
            const selectorfilters = this.$store.getters[`${this.state}/selectorfilters`];
            return selectorfilters;
        },
    },
    methods: {
        //Se realiza la request de las columnas de la entidad y se filtra las que son posibles ocupar en plantilla
        async fetchValidColumns(entityTypeId) {
            if (!entityTypeId) {
                return {};
            }

            const response = await Axios.get(`/api/sheets/entity/info/${entityTypeId}`);
            return response.data.content.content.columns
                .filter((column) => {
                    return (
                        column.valid == 1 &&
                        column.visible == 1 &&
                        column.format != 'DOCUMENT' &&
                        column.format != 'FORM'
                    );
                })
                .map((column) => {
                    return {
                        name: column.name,
                        entity_name: response.data.content.content.entity_type.name,
                        id: column.id,
                        entity_type_permission_fk: column.entity_type_permission_fk,
                        entity_type_pivot_fk: column.entity_type_pivot_fk,
                        subdata: null,
                        format: column.format,
                    };
                });
        },
        async groupAndFetchSubdata(filteredData, i = 0) {
            if (i == 2) {
                return filteredData;
            }
            let result = Object.values(
                filteredData.reduce((acc, item) => {
                    let key =
                        item.entity_type_permission_fk !== null
                            ? item.entity_type_permission_fk
                            : item.id;
                    if (acc[key]) {
                        acc[key].name += `, ${item.name}`;
                    } else {
                        acc[key] = { ...item };
                    }
                    return acc;
                }, {})
            );
            // make a group with all elements that have a entity_type_permission_fk different from null
            let groupedColumns = {};
            result.forEach((column) => {
                if (column.entity_type_permission_fk) {
                    groupedColumns[column.entity_type_permission_fk] = column;
                }
            });
            // fetch the data of the grouped columns
            await Promise.all(
                Object.values(groupedColumns).map((group) => this.fetchSubdata(group))
            );
            //replace in result the grouped columns with the subdata
            result = result.map((column) => {
                if (column.entity_type_permission_fk) {
                    column = groupedColumns[column.entity_type_permission_fk];
                }
                return column;
            });
            for (let item of result) {
                if (item.subdata) {
                    item.subdata = await this.groupAndFetchSubdata(item.subdata, i + 1);
                }
            }
            console.log(result);
            return result;
        },
        async generateDropDownItems(filteredData) {
            // Funcion recursiva que solamente se ocupa en el scope de la funcion generateDropDownItems
            function formatData(item) {
                return {
                    name: `${item.entity_name} : ${item.name}`,
                    id: item.id,
                    format: item.format,
                    values: item.subdata
                        ? item.subdata.reduce((subAcc, subitem) => {
                            subAcc[subitem.id] = formatData(subitem);
                            return subAcc;
                        }, {})
                        : null,
                };
            }
            filteredData = await this.groupAndFetchSubdata(filteredData);
            return filteredData.reduce((acc, item) => {
                if (item.entity_type_permission_fk) {
                    acc[item.id] = formatData(item);
                } else {
                    acc[item.id] = {
                        name: `${item.entity_name} : ${item.name}`,
                    };
                }
                return acc;
            }, {});
        },
        // Si una columna tiene entity_type_permission_fk se realiza nuevamente la request de sus columnas
        async fetchSubdata(column) {
            if (column.entity_type_permission_fk) {
                var columnfilteredData = await this.fetchValidColumns(
                    column.entity_type_permission_fk
                );
                if (columnfilteredData.length == 0) {
                    columnfilteredData = await this.fetchValidColumns(column.entity_type_pivot_fk);
                }
                column.name = column.name;
                column.subdata = columnfilteredData;
            }
        },
        createDropDown(data, editor, prevName = '') {
            return Object.entries(data).map(([id, values]) => {
                var type;
                if (values.values == null) {
                    type = 'menuitem';
                } else {
                    type = typeof values.values === 'object' ? 'nestedmenuitem' : 'menuitem';
                }

                if (
                    type == 'nestedmenuitem' &&
                    (values.format == 'SELECTOR[MULTIPLE]' ||
                        values.format == 'SELECTOR[MULTIPLE][ADVANCED]')
                ) {
                    return {
                        type: 'menuitem',
                        text: values.name,
                        icon: 'plus',
                        onAction: () => {
                            editor.execCommand('openCustomDialog', {
                                id: id,
                                values: values,
                            });
                        },
                    };
                } else if (
                    type == 'nestedmenuitem' &&
                    (values.format != 'SELECTOR[MULTIPLE]' ||
                        values.format != 'SELECTOR[MULTIPLE][ADVANCED]' ||
                        values.values != null)
                ) {
                    return {
                        type: 'nestedmenuitem',
                        text: values.name,
                        getSubmenuItems: () => {
                            return this.createDropDown(
                                values.values,
                                editor,
                                prevName + (prevName != '' ? ' : ' : '') + values.name + ' : '
                            );
                        },
                    };
                } else {
                    return {
                        type: 'menuitem',
                        text: values.name,
                        onAction: () => {
                            editor.insertContent(
                                `&nbsp;<strong data-id="${id}"><span contenteditable="false">{{${prevName}${values.name}}}</span></strong>&nbsp;`
                            );
                        },
                    };
                }
            });
        },
        tablepageconfig(multiselectorItem) {
            return {
                title: 'Insertar selector multiple',
                size: 'medium',
                body: {
                    type: 'panel',
                    items: [
                        {
                            type: 'label',
                            label: 'Seleccionar las columnas que aparecerán en el documento como tabla',
                            items: Object.entries(multiselectorItem.values.values).map(
                                ([id, values]) => {
                                    return {
                                        type: 'grid',
                                        columns: 2,
                                        items: [
                                            {
                                                type: 'checkbox',
                                                name: id,
                                                label: values.name,
                                                enabled: false,
                                            },
                                            {
                                                type: 'input',
                                                name: id + 'orden',
                                                placeholder: 'Orden',
                                                inputMode: 'numeric',
                                            },
                                        ],
                                    };
                                }
                            ),
                        },
                    ],
                },
                buttons: [
                    {
                        type: 'cancel',
                        text: 'Cancelar',
                    },
                    {
                        type: 'submit',
                        text: 'Insertar',
                        buttonType: 'primary',
                    },
                ],
                onSubmit: (api) => {
                    const data = api.getData();
                    const selectedColumns = Object.entries(multiselectorItem.values.values)
                        .map(([id, column]) => {
                            if (data[id] === false) {
                                return null;
                            }
                            return {
                                id,
                                name: column.name,
                                orden: data[id + 'orden'],
                            };
                        })
                        .filter((column) => column !== null)
                        .sort((a, b) => a.orden - b.orden);
                    const textToInsert = `&nbsp;<strong data-table-id="${multiselectorItem.id
                        }" data-columns-ids="${selectedColumns
                            .map((column) => column.id)
                            .join(',')}"><span contenteditable="false">{{<br/>Tabla de ${multiselectorItem.values.name
                        } <br/> con columnas: <br/> ${selectedColumns
                            .map((column) => column.name)
                            .join('<br/>')}<br/>}}</span></strong>&nbsp;`;
                    tinymce.activeEditor.execCommand('mceInsertContent', false, textToInsert);
                    api.close();
                },
            };
        },
        selectorpageconfig(multiselectorItem) {
            return {
                title: 'Selector multiple',
                size: 'medium',
                body: {
                    type: 'panel',
                    items: [
                        {
                            type: 'htmlpanel',
                            html: `<p>Quiere insertar una tabla o una lista a partir de la columna seleccionada?</p>`,
                        },
                    ],
                },
                buttons: [
                    {
                        type: 'custom',
                        name: 'lista',
                        text: 'Lista',
                        align: 'start',
                        buttonType: 'primary',
                    },
                    {
                        type: 'custom',
                        text: 'Tabla',
                        name: 'tabla',
                        align: 'end',
                        buttonType: 'primary',
                    },
                ],
                onAction: (api, details) => {
                    if (details.name == 'lista') {
                        api.redial(this.listpageconfig(multiselectorItem));
                    } else if (details.name == 'tabla') {
                        api.redial(this.tablepageconfig(multiselectorItem));
                    }
                },
            };
        },
        listpageconfig(multiselectorItem) {
            return {
                title: 'Insertar selector multiple',
                size: 'medium',
                body: {
                    type: 'panel',
                    items: [
                        {
                            type: 'label',
                            label: 'Insertar texto a mostrar en la lista',
                            items: [
                                {
                                    type: 'htmlpanel', // component type
                                    html: "<div contenteditable='true' style='margin: 10px; border: 1px solid black; padding: 10px; height: 100%;' id='textareaA'></div>",
                                },
                                {
                                    type: 'selectbox', // component type
                                    name: 'SelectA', // identifier
                                    label: 'Select Label',
                                    enabled: true, // enabled state
                                    size: 1, // number of visible values (optional)
                                    items: [
                                        { text: 'None', value: 'None' },
                                        ...Object.entries(multiselectorItem.values.values).map(
                                            ([id, values]) => {
                                                return {
                                                    text: values.name,
                                                    value: `&nbsp;<strong data-id="${id}"><span contenteditable="false">{{${values.name}}}</span></strong>&nbsp;`,
                                                };
                                            }
                                        ),
                                    ],
                                },
                            ],
                        },
                    ],
                },
                buttons: [
                    {
                        type: 'cancel',
                        text: 'Cancelar',
                    },
                    {
                        type: 'submit',
                        text: 'Insertar',
                        buttonType: 'primary',
                    },
                ],
                onChange: (api) => {
                    const data = api.getData();
                    if (data.SelectA == 'None') {
                        return;
                    }
                    const textareaA = document.getElementById('textareaA');
                    if (textareaA) {
                        textareaA.innerHTML += data.SelectA;
                    }
                    api.setData({
                        textareaA: data.textareaA,
                        SelectA: 'None',
                    });
                },
                onSubmit: (api) => {
                    const textareaA = document.getElementById('textareaA');
                    const textAreaHtml = textareaA.innerHTML;
                    const textToInsert = `&nbsp;<strong data-list-id="${multiselectorItem.id
                        }" data-inner-html="${btoa(
                            textAreaHtml
                        )}"><span contenteditable="false">{{Lista de ${multiselectorItem.values.name
                        } con forma  </br> : {{${textAreaHtml}}}</span></strong>&nbsp;`;
                    tinymce.activeEditor.execCommand('mceInsertContent', false, textToInsert);
                    api.close();
                },
            };
        },
        async onEntitySelected(entityTypeId) {
            this.loading = true;
            //Extract content from tinymce editor
            if (entityTypeId == null) {
                return;
            }
            if (this.editorInstance) {
                this.tinymceConfig = null;
            }
            try {
                const filteredData = await this.fetchValidColumns(entityTypeId);
                // Extract all items in filteredData that have a format of "SELECTOR[MULTIPLE]" in another variable and the rest pass to generateDropDownItems

                const dropDownItemsFromData = await this.generateDropDownItems(filteredData);
                this.tinymceConfig = {
                    toolbar_mode: 'wrap',
                    plugins: 'pagebreak table link image lists',
                    table_sizing_mode: 'relative',
                    height: 600,
                    toolbar:
                        'undo redo | mybutton | blocks | bold italic underline forecolor | link image | alignleft aligncenter alignright alignjustify lineheight | bullist numlist indent outdent | removeformat |  pagebreak',
                    setup: (editor) => {
                        // Add a custom button to the toolbar
                        editor.ui.registry.addMenuButton('mybutton', {
                            text: 'Entidad',
                            fetch: (callback) => {
                                const items = this.createDropDown(dropDownItemsFromData, editor);
                                callback(items);
                            },
                        });
                        // Funcion custom para agregar el dialogo correspondiente a un selector multiple
                        editor.addCommand('openCustomDialog', (multiselectorItem) => {
                            editor.windowManager.open(this.selectorpageconfig(multiselectorItem));
                        });
                    },
                    pagebreak_separator: '<div class="pagebreak"></div>',
                    // Estilo para semejanza a word
                    content_style: `
                    body {
                        background: #fff;
                    }

                    @media (min-width: 840px) {
                        html {
                            background: #eceef4;
                            min-height: 100%;
                            padding: 0 .5rem
                        }

                        body {
                            background-color: #fff;
                            box-shadow: 0 0 4px rgba(0, 0, 0, .15);
                            box-sizing: border-box;
                            margin: 1rem auto 0;
                            max-width: 787px;
                            min-height: calc(100vh - 1rem);
                            padding:4rem 6rem 6rem 6rem
                        }
                    }
                `,
                };
                this.editorInstance = true;
                this.loading = false;
            } catch (error) {
                console.log(error);
            }
        },
    },
    watch: {
        selectorFilters: {
            handler: function (val, old_val) {
                if (val[this.input.col_filter_by] != old_val[this.input.col_filter_by]) {
                    this.onEntitySelected(val[this.input.col_filter_by]);
                }
            },
            deep: true,
        },
        content: {
            handler: function (val) {
                if (val) {
                    const data = {};
                    data[this.id] = val;

                    this.$emit('input', data);
                }
            },
            deep: true,
        },
        inputValue: {
            handler: function (val, old_val) {
                if (val) {
                    this.content = val;
                }
            },
        },
    },
    mounted() {
        if (this.selectorFilters[this.input.col_filter_by]) {
            this.onEntitySelected(this.selectorFilters[this.input.col_filter_by]);
        }
        const fields = this.$store.getters[`${this.state}/fields`];
        this.content = this.inputValue;
    },
};
</script>
