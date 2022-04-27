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
    }),
    watch: {
        value(val) {
            if (Object.keys(val).length === 0) {
                this.onDeleteFile()
            }
        }
    },
    methods: {
        onChange(event) {
            const f = event.target.files[0];
            const data = { id: this.id, file: f };
            if (this.input.permission === 2) {
                this.$store.commit(`${this.state}/FILES`, data);
            }
        },
        onDeleteFile() {
            this.showDeleteBtn = false;
            this.$refs.inputFileRef.value = null;

            if (this.preview) {
                this.preview = '';
            }
            if (this.ph) {
                this.ph = '';
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
        }
    },
};
</script>
