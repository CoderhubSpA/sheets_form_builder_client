<script>
export default {
    props: {
        input: {
            type: Object
        },
        value: {
            required: true
        }
    },
    computed: {

    },
    methods: {
        onChange(event) {
            const file = event.target.files[0]
            const data = {
                id: this.id,
                file: file
            }
            if (this.input.permission === 2) {
                this.$store.commit('formBuilder/FILES', data)
            }
        }
    }
}
</script>
