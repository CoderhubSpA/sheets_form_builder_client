<script>
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
        document_src: '',
        showModal: false,
        loading: false
    }),
    computed: {
        /**
         * Tipo de archivo que acepta el campo
         */
        accept() {
            return '*';
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
                const baseURL = this.$store.getters[`myStore0/base_url`];

                if (contentInfo) {
                    const entities = contentInfo.content.entities_fk[this.input.entity_type_fk];
                    const fileEntity = entities.find((ent) => ent.id === file[this.id]);

                    if (fileEntity) {
                        this.document_name = fileEntity.name;
                        this.document_src = `${baseURL}${fileEntity.src}`;
                        this.showDeleteBtn = true;
                    }
                }
            }
            return file[this.id] ? file[this.id] : '';
        },
        file_on_demand () {
            return this.$store.getters[`myStore0/file_on_demand`];
        },
        content_info () {
            return this.$store.getters[`myStore0/content_info`];
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
                        this.document_src = `${baseURL}${fileEntity.src}`;
                    }
                }
            }
        },
        file_on_demand (val) {
            if (Object.keys(val).length > 0) { 
                this.loading = true;
            }
        },
        content_info (val) {
            if (val) {
                const fileOnDemand = this.$store.getters[`myStore0/file_on_demand`];
                const baseURL = this.$store.getters[`myStore0/base_url`];
                const findDocument = val.content.entities_fk.document.find(doc => doc.id === fileOnDemand.value);

                if (findDocument) {
                    this.document_src = `${baseURL}${findDocument.src}`;
                    this.document_name = findDocument.name;
                    this.loading = false;
                } else {
                    this.loading = false;
                }
            } else {
                this.loading = false;
            }
        }
    },
    methods: {
        onChange(event) {
            const file = event.target.files[0];
            this.document_name = file.name;
            const data = { id: this.id, file: file };
            if (this.input.permission === 2) {
                this.$store.commit(`${this.state}/FILES`, data);
            }
        },
        onDeleteFile() {
            this.showDeleteBtn = false;
            this.$refs.inputFileRef.value = null;
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
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        }
    },
};
</script>
