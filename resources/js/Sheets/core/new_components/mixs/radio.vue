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
    data: () => ({
        picked: null
    }),
    computed: {
        options() {
            const contentInfo = this.$store.getters['formBuilder/content_info']

            if (!!contentInfo) {
                const entities = contentInfo.content.entities_fk[this.input.entity_type_fk]

                if (entities)
                    return entities.map(e => {
                        return { id: e.id, name: e.name }
                    })
                else {
                    let opt = JSON.parse(this.input.options)

                    let options  = []

                    Object.keys(opt).forEach(key => {
                        options.push({ id: key, name: opt[key] })
                    })

                    return options
                }
            }
            return []
        }
    },
    watch: {
        picked(val) {
            let data = {};
            data[this.input.id] = val;
            this.$emit('input', data)
        },
        clear(val) {
            if (val) {
                this.picked = null
                this.$store.commit('formBuilder/CLEARFIELDS', false)
            }
        }
    },
}
</script>

<style>

</style>
