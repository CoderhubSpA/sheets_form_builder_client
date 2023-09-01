<script>
import DocumentViewer from '../utils/DocumentViewer.vue';
import Vue from 'vue';
export default {
    props: {
        input: {
            type: Object,
        },
        value: {
            required: true,
        },
    },
    data: () => ({
        showDeleteBtn: false,
        document_name: '',
        viewer_open: false,
    }),
    computed: {
        /**
         * Tipo de archivo que acepta el campo
         */
        accept() {
            return '*';
        },
        disabled() {
            return this.input.permission === 1 || this.viewer_open;
        },
        existing_file() {
            let file = {};

            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];

                if (val) {
                    file = {};
                    file[this.id] = val[this.id];
                    this.$emit('input', file);
                }
            }

            if (file[this.id]) {
                const contentInfo = this.$store.getters[`${this.state}/content_info`];
                if (contentInfo) {
                    const entities = contentInfo.content.entities_fk[this.input.entity_type_fk];
                    const fileEntity = entities.find((ent) => ent.id === file[this.id]);

                    if (fileEntity) {
                        this.document_name = fileEntity.name;
                        this.showDeleteBtn = true;
                    }
                }
            }

            return file[this.id] ? file[this.id] : '';
        },
        dynamicRef() {
            return `file-${this.id}`;
        },
    },
    watch: {
        value(val) {
            if (Object.keys(val).length === 0) {
                this.onDeleteFile();
            }
        },
        existing_file(val) {
            if (val) {
                const contentInfo = this.$store.getters[`${this.state}/content_info`];
                if (contentInfo) {
                    const entities = contentInfo.content.entities_fk[this.input.entity_type_fk];
                    const fileEntity = entities.find((ent) => ent.id === val);

                    if (fileEntity) {
                        this.document_name = fileEntity.name;
                    }
                }
            }
        }
    },
    methods: {
        onChange(event) {
            const file = event.target.files[0];
            this.document_name = file.name;
            const data = { id: this.id, file };
            if (this.input.permission === 2) {
                this.$store.commit(`${this.state}/FILES`, data);
            }
        },
        onDeleteFile() {
            this.showDeleteBtn = false;
            this.$refs[this.dynamicRef].value = null;
            this.document_name = '';

            if (this.preview) {
                this.preview = '';
            }

            if (this.options && this.options.length > 0) {
                this.options = [];
            }
            if (this.selected && this.selected.length > 0) {
                this.selected = [];
            }
            this.$store.commit(`${this.state}/DELETE_FILE`, this.id);
            const validation = {};
            validation[this.id] = null;
            this.$emit('input', validation);
        },
        onShowFile() {
            this.viewer_open = true;
            if (process.env.MIX_SHOW_DOCUMENT_OUTSIDE_IFRAME === 'true') {
                window.postMessage({
                    type: 'show_document_visualizer',
                    params: [
                        {
                            filename: this.document_name,
                            src: this.previewLink,
                        },
                    ],
                });
            } else {
                window.postMessage({
                    type: 'expand_modal_container',
                    params: [
                        {
                            filename: this.document_name,
                            src: this.previewLink
                        }
                    ],
                })
                const DocumentViewerClass = Vue.extend(DocumentViewer);
                const instance = new DocumentViewerClass({
                    propsData: {
                        filename: this.document_name,
                        src: this.previewLink,
                        value: true,
                    },
                });
                instance.$on('input', () => {
                    this.viewer_open = false;
                });
                instance.$mount();
                this.$refs.preview.appendChild(instance.$el);
            }
        },
    },
};
</script>
