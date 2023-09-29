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
        onEntitySelected(entityTypeId) {
            var htmlContent = '';
            //Extract content from tinymce editor
            if (entityTypeId == null) {
                return;
            }
            if (this.editorInstance) {
                this.tinymceConfig = null;
                const editor = tinymce.get(this.id);
                htmlContent = editor.getContent();
                this.content = htmlContent;
            }
            Axios.get(`/api/sheets/entity/info/${entityTypeId}`).then((response) => {
                const filteredData = response.data.content.content.columns
                    .filter((column) => column.valid == 1)
                    .map((column) => {
                        return {
                            name: `${response.data.content.content.entity_type.name}:${column.name}`,
                            id: column.id,
                        };
                    });
                const dropDownItemsFromData = filteredData.reduce(function (acc, item) {
                    acc[item.name] = item.id;
                    return acc;
                }, {});
                this.tinymceConfig = {
                    branding: false,
                    plugins: 'pagebreak table',
                    promotion: false,
                    toolbar:
                        'undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat | mybutton pagebreak',
                    setup: function (editor) {
                        // Add a custom button to the toolbar
                        editor.ui.registry.addMenuButton('mybutton', {
                            text: 'Entidad',
                            onAction: function (_) {
                                // Your custom button action code here
                                editor.insertContent('Custom button clicked!');
                            },
                            fetch: (callback) => {
                                const items = Object.entries(dropDownItemsFromData).map(
                                    ([name, value]) => ({
                                        type: 'menuitem',
                                        text: name,
                                        onAction: () =>
                                            editor.insertContent(
                                                `&nbsp;<strong data-id="${value}"><span contenteditable="false">{{${name}}}</span></strong>&nbsp;`
                                            ),
                                    })
                                );
                                callback(items);
                            },
                        });
                    },
                    pagebreak_separator: '<div class="pagebreak"></div>',
                    init: function (editor) {
                        editor.setContent(htmlContent);
                    },
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
            });
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
    },
    mounted() {
        if (this.selectorFilters[this.input.col_filter_by]) {
            this.onEntitySelected(this.selectorFilters[this.input.col_filter_by]);
        }
    },
};
</script>
