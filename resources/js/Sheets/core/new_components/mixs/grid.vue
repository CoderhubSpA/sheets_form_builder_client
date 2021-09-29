<script>
export default {
    props: {
        grid: Object
    },
    data: () => ({
        model: []
    }),
    watch: {
        rowModel() {
            this.$emit('input', this.model)
        }
    },
    computed: {
        id() {
            return this.grid.id
        },
        name() {
            return this.grid.name
        },
    }
}
</script>
