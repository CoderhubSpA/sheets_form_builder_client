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
    computed: {

    },
    methods: {
        onChange(event) {
            const f = event.target.files[0];
            const data = { id: this.id, file: f };
            if (this.input.permission === 2) {
                this.$store.commit(`${this.state}/FILES`, data);
            }
        },
    },
};
</script>
