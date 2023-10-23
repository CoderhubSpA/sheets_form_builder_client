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
            api-key="no-api-key"
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
                    return column.valid == 1 && column.visible == 1 && column.format != 'DOCUMENT';
                })
                .map((column) => {
                    return {
                        name: `${response.data.content.content.entity_type.name} : ${column.name}`,
                        id: column.id,
                        entity_type_permission_fk: column.entity_type_permission_fk,
                        subdata: null,
                    };
                });
        },
        // Si una columna tiene entity_type_permission_fk se realiza nuevamente la request de sus columnas
        async fetchSubdata(column) {
            if (column.entity_type_permission_fk) {
                const columnfilteredData = await this.fetchValidColumns(
                    column.entity_type_permission_fk
                );
                column.name = column.name;
                column.subdata = columnfilteredData;
            }
        },
        //Se generan los items para el dropdown. Primero chequea si existe algun item con entidad relacionada, en caso de que si, se realiza la request de sus columnas
        async generateDropDownItems(filteredData) {
            const hasEntityTypePermissionFk = filteredData.some(
                (column) => column.entity_type_permission_fk
            );

            if (hasEntityTypePermissionFk) {
                await Promise.all(filteredData.map((column) => this.fetchSubdata(column)));
            }

            return filteredData.reduce((acc, item) => {
                acc[item.id] = item.subdata
                    ? {
                          name: item.name,
                          values: item.subdata.reduce((subAcc, subitem) => {
                              subAcc[subitem.id] = { name: subitem.name, id: subitem.id };
                              return subAcc;
                          }, {}),
                      }
                    : { name: item.name };
                return acc;
            }, {});
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
                const dropDownItemsFromData = await this.generateDropDownItems(filteredData);
                this.tinymceConfig = {
                    branding: false,
                    plugins: 'pagebreak table',
                    promotion: false,
                    height: 600,
                    toolbar:
                        'undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat | mybutton pagebreak',
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
                                        if (type == 'nestedmenuitem') {
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
                                        } else if (type == 'menuitem') {
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
                    },
                    pagebreak_separator: '<div class="pagebreak"></div>',
                    init_instance_callback: function (_) {
                        var freeTiny = document.querySelector('.tox .tox-notification--in');
                        freeTiny.style.display = 'none';
                    },

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
