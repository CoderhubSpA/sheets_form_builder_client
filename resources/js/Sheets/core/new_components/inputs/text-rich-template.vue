<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        v-if="show_field"
    >
        <Editor
            api-key="vdjygk7n8vw4laxwpwsmh1sb36zu318ltnp3u9f9wcrqx83g"
            :init="tinymceConfig"
            :id="id"
            v-if="tinymceConfig"
            v-model="content"
        />
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
        async generateDropDownItems(filteredData) {
            const hasEntityTypePermissionFk = filteredData.some(
                (column) => column.entity_type_permission_fk
            );

            if (hasEntityTypePermissionFk) {
                const groupedColumns = {};
                const usedEntities = {};
                // Se agrupan los elementos con la misma entity_type_permission_fk, de esa forma no aparecen duplicados en el dropdown
                filteredData.forEach((column) => {
                    if (column.entity_type_permission_fk) {
                        if (!groupedColumns[column.entity_type_permission_fk]) {
                            groupedColumns[column.entity_type_permission_fk] = {
                                name: '',
                                entity_name: column.entity_name,
                                column: column,
                                subdata: null,
                            };
                        }
                        groupedColumns[column.entity_type_permission_fk].name += column.name + ', ';
                    }
                });
                // Se realiza el fetch de la data de las columnas agrupadas
                await Promise.all(
                    Object.values(groupedColumns).map((group) => this.fetchSubdata(group.column))
                );

                //Tomando la data original, la transformamos a los elementos finales para el dropdown
                return filteredData.reduce((acc, item) => {
                    // Si el elemento tiene un entity_type_permission_fk y no ha sido usado, se agrega al dropdown
                    if (
                        item.entity_type_permission_fk &&
                        !usedEntities[item.entity_type_permission_fk]
                    ) {
                        acc[item.id] = {
                            name: `${
                                groupedColumns[item.entity_type_permission_fk].entity_name
                            } : ${groupedColumns[item.entity_type_permission_fk].name.slice(
                                0,
                                -2
                            )}`,
                            format: item.format,
                            values: groupedColumns[
                                item.entity_type_permission_fk
                            ].column.subdata.reduce((subAcc, subitem) => {
                                subAcc[subitem.id] = {
                                    name: subitem.name,
                                    id: subitem.id,
                                };
                                return subAcc;
                            }, {}),
                        };
                        usedEntities[item.entity_type_permission_fk] = true;
                    }
                    // Si el elemento tiene un entity_type_permission_fk y ya ha sido usado, no se agrega al dropdown
                    else if (
                        item.entity_type_permission_fk &&
                        usedEntities[item.entity_type_permission_fk]
                    ) {
                        return acc;
                    }
                    // Si el elemento no tiene un entity_type_permission_fk, se agrega al dropdown
                    else {
                        acc[item.id] = {
                            name: `${item.entity_name} : ${item.name}`,
                        };
                    }
                    return acc;
                }, {});
            }

            return filteredData.reduce((acc, item) => {
                acc[item.id] = { name: item.name };
                return acc;
            }, {});
        },
        // Si una columna tiene entity_type_permission_fk se realiza nuevamente la request de sus columnas
        async fetchSubdata(column) {
            if (column.entity_type_permission_fk) {
                let columnfilteredData = await this.fetchValidColumns(
                    column.entity_type_permission_fk
                );
                if (columnfilteredData.length == 0) {
                    columnfilteredData = await this.fetchValidColumns(column.entity_type_pivot_fk);
                }
                column.name = column.name;
                column.subdata = columnfilteredData;
            }
        },
        async onEntitySelected(entityTypeId) {
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
                    plugins: 'pagebreak table link image lists',
                    table_sizing_mode: 'relative',
                    height: 600,
                    toolbar:
                        'undo redo | mybutton | blocks | bold italic underline forecolor | link image | alignleft aligncenter alignright alignjustify lineheight | bullist numlist indent outdent | removeformat |  pagebreak',
                    setup: function (editor) {
                        // Add a custom button to the toolbar
                        editor.ui.registry.addMenuButton('mybutton', {
                            text: 'Entidad',
                            onAction: function (_) {
                                // Your custom button action code here
                            },
                            fetch: (callback) => {
                                const items = Object.entries(dropDownItemsFromData).map(
                                    ([id, values]) => {
                                        const type =
                                            typeof values.values === 'object'
                                                ? 'nestedmenuitem'
                                                : 'menuitem';
                                        if (
                                            type == 'nestedmenuitem' &&
                                            (values.format == 'SELECTOR[MULTIPLE]' ||
                                                values.format == 'SELECTOR[MULTIPLE][ADVANCED]')
                                        ) {
                                            return {
                                                type: 'menuitem',
                                                text: values.name + '*',
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
                                                values.format != 'SELECTOR[MULTIPLE][ADVANCED]')
                                        ) {
                                            return {
                                                type: 'nestedmenuitem',
                                                text: values.name,
                                                getSubmenuItems: () => {
                                                    return Object.entries(values.values).map(
                                                        ([subid, subvalues]) => {
                                                            return {
                                                                type: 'menuitem',
                                                                text: subvalues.name,
                                                                onAction: () => {
                                                                    editor.insertContent(
                                                                        `&nbsp;<strong data-id="${subid}"><span contenteditable="false">{{${values.name} : ${subvalues.name}}}</span></strong>&nbsp;`
                                                                    );
                                                                },
                                                            };
                                                        }
                                                    );
                                                },
                                            };
                                        } else {
                                            return {
                                                type: 'menuitem',
                                                text: values.name,
                                                onAction: () => {
                                                    editor.insertContent(
                                                        `&nbsp;<strong data-id="${id}"><span contenteditable="false">{{${values.name}}}</span></strong>&nbsp;`
                                                    );
                                                },
                                            };
                                        }
                                    }
                                );
                                callback(items);
                            },
                        });
                        // Funcion custom para agregar el dialogo correspondiente a un selector multiple
                        editor.addCommand('openCustomDialog', function (multiselectorItem) {
                            editor.windowManager.open({
                                title: 'Insertar selector multiple',
                                body: {
                                    type: 'panel',
                                    items: [
                                        {
                                            type: 'label',
                                            label: 'Seleccionar las columnas que aparecerán en el documento como tabla',
                                            items: Object.entries(
                                                multiselectorItem.values.values
                                            ).map(([id, values]) => {
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
                                            }),
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
                                    const selectedColumns = Object.entries(
                                        multiselectorItem.values.values
                                    )
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
                                    const textToInsert = `&nbsp;<strong data-table-id="${
                                        multiselectorItem.id
                                    }" data-columns-ids="${selectedColumns
                                        .map((column) => column.id)
                                        .join(
                                            ','
                                        )}"><span contenteditable="false">{{<br/>Tabla de ${
                                        multiselectorItem.values.name
                                    } <br/> con columnas: <br/> ${selectedColumns
                                        .map((column) => column.name)
                                        .join('<br/>')}<br/>}}</span></strong>&nbsp;`;
                                    tinymce.activeEditor.execCommand(
                                        'mceInsertContent',
                                        false,
                                        textToInsert
                                    );
                                    api.close();
                                },
                            });
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
