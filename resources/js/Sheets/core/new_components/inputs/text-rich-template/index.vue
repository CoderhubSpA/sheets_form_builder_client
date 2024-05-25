<template>
    <form-group :id="id" :label="label" :required="required" :linkTarget="link_target" :linkDescription="link_description"
        :tooltipInfo="tooltip" v-if="show_field">
        <div v-if="loading" class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Cargando...</span>
            </div>
        </div>
        <Editor api-key="no-api-key" :init="tinymceConfig" :id="'Editor' + id"
            v-else-if="tinymceConfig" v-model="content" />
        <h3 v-else>
            Seleccione una entidad para poder usar este campo
        </h3>
    </form-group>
</template>
<script>
import mix from "../../mixs/input.vue";
import FormGroup from "../../templates/form-group.vue";
// import Editor from "@tinymce/tinymce-vue";
import Axios from "axios";
import Dialogs from "./dialogs";
import 'tinymce'
import Editor from "@tinymce/tinymce-vue"

/* Required TinyMCE components */
import 'tinymce/icons/default/icons.min.js';
import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/models/dom/model.min.js';

/* Import a skin (can be a custom skin instead of the default) */
import 'tinymce/skins/ui/oxide/skin.js';

/* Import plugins */
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/code';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';

/* content UI CSS is required */
import 'tinymce/skins/ui/oxide/content.js';

/* The default content CSS can be changed or replaced with appropriate CSS for the editor content. */
import 'tinymce/skins/content/default/content.js';

import tinymce from "tinymce";
export default {
    mixins: [mix],
    components: {
        "form-group": FormGroup,
        Editor,
    },
    data() {
        return {
            content: "",
            tinymceConfig: null,
            editorInstance: null,
            loading: false,
        };
    },
    computed: {
        selectorFilters() {
            const selectorfilters =
                this.$store.getters[`${this.state}/selectorfilters`];
            return selectorfilters;
        },
    },
    methods: {
        //Se realiza la request de las columnas de la entidad y se filtra las que son posibles ocupar en plantilla
        async fetchValidColumns(entityTypeId) {
            if (!entityTypeId) {
                return {};
            }

            const response = await Axios.get(
                `/api/sheets/entity/info/${entityTypeId}?ignore=["entity_type","column_privileges","entities_fk","table_options"]`
            );
            return response.data.content.content.columns
                .filter((column) => {
                    return (
                        column.valid == 1 &&
                        column.visible == 1 &&
                        column.format != "DOCUMENT" &&
                        column.format != "FORM"
                    );
                })
                .map((column) => {
                    return {
                        name: column.name,
                        entity_name:
                            response.data.content.content.entity_type.name,
                        id: column.id,
                        entity_type_permission_fk:
                            column.entity_type_permission_fk,
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
            let result = filteredData;
            // make a group with all elements that have a entity_type_permission_fk different from null
            let groupedColumns = {};
            result.forEach((column) => {
                if (column.entity_type_permission_fk) {
                    groupedColumns[column.id] = column;
                }
            });
            // fetch the data of the grouped columns
            await Promise.all(
                Object.values(groupedColumns).map((group) =>
                    this.fetchSubdata(group)
                )
            );
            //replace in result the grouped columns with the subdata
            result = result.map((column) => {
                if (column.entity_type_permission_fk) {
                    column = groupedColumns[column.id];
                }
                return column;
            });
            for (let item of result) {
                if (item.subdata) {
                    item.subdata = await this.groupAndFetchSubdata(
                        item.subdata,
                        i + 1
                    );
                }
            }
            return result;
        },
        async generateDropDownItems(filteredData) {
            function formatData(item) {
                return {
                    name: `${item.entity_name} : ${item.name}`,
                    simple_name: item.name,
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
                    columnfilteredData = await this.fetchValidColumns(
                        column.entity_type_pivot_fk
                    );
                }
                column.name = column.name;
                column.subdata = columnfilteredData;
            }
        },
        createDropDown(data, editor, prevName = "") {
            return Object.entries(data).map(([id, values, columns_parents]) => {
                var type;
                if (values.values == null) {
                    type = "menuitem";
                } else {
                    type =
                        typeof values.values === "object"
                            ? "nestedmenuitem"
                            : "menuitem";
                }

                if (
                    type == "nestedmenuitem" &&
                    (values.format == "SELECTOR[MULTIPLE]" ||
                        values.format == "SELECTOR[MULTIPLE][ADVANCED]" ||
                        values.format == "SELECTOR[1XN][ONLYNEW]")
                ) {
                    return {
                        type: "menuitem",
                        text: values.name,
                        icon: "plus",
                        onAction: () => {
                            editor.execCommand("openCustomDialog", {
                                id: id,
                                values: values,
                            });
                        },
                    };
                } else if (
                    type == "nestedmenuitem" &&
                    (values.format != "SELECTOR[MULTIPLE]" ||
                        values.format != "SELECTOR[MULTIPLE][ADVANCED]" ||
                        values.format != "SELECTOR[1XN][ONLYNEW]" ||
                        values.values != null)
                ) {
                    return {
                        type: "nestedmenuitem",
                        text: values.name,
                        getSubmenuItems: () => {
                            return this.createDropDown(
                                values.values,
                                editor,
                                prevName +
                                (prevName != "" ? " : " : "") +
                                values.name +
                                " : "
                            );
                        },
                    };
                } else {
                    return {
                        type: "menuitem",
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
                const dropDownItemsFromData = await this.generateDropDownItems(
                    filteredData
                );
                this.tinymceConfig = {
                    toolbar_mode: "wrap",
                    plugins: "pagebreak table link image lists",
                    table_sizing_mode: "relative",
                    promotion: false,
                    height: 600,
                    toolbar:
                        "undo redo | mybutton | blocks | bold italic underline forecolor | link image | alignleft aligncenter alignright alignjustify lineheight | bullist numlist indent outdent | removeformat |  pagebreak",
                    setup: (editor) => {
                        // Add a custom button to the toolbar
                        editor.ui.registry.addMenuButton("mybutton", {
                            text: "Entidad",
                            fetch: (callback) => {
                                const items = this.createDropDown(
                                    dropDownItemsFromData,
                                    editor
                                );
                                callback(items);
                            },
                        });
                        // Funcion custom para agregar el dialogo correspondiente a un selector multiple
                        editor.addCommand(
                            "openCustomDialog",
                            (multiselectorItem) => {
                                editor.windowManager.open(
                                    Dialogs.selectorpageconfig(multiselectorItem)
                                );
                            }
                        );
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
                if (
                    val[this.input.col_filter_by] !=
                    old_val[this.input.col_filter_by]
                ) {
                    this.onEntitySelected(val[this.input.col_filter_by]);
                }
            },
            deep: true,
        },
        content: {
            handler: function (val, old_val) {
                if (val != old_val) {
                    const data = {};
                    data[this.id] = val;

                    this.$emit("input", data);
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
        tinymce.execCommand('mceRemoveEditor', false, 'Editor' + this.id);
        if (this.selectorFilters[this.input.col_filter_by]) {
            this.onEntitySelected(
                this.selectorFilters[this.input.col_filter_by]
            );
        }
        const fields = this.$store.getters[`${this.state}/fields`];
        this.content = this.inputValue;
    },
};
</script>
