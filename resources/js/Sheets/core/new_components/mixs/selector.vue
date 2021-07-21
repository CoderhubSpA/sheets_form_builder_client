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
        selected: null
    }),
    watch: {
        selected(val) {
            let data = {}

            if (this.multiple) {
                data[this.id] = val.map(v => {
                    return v.id
                })
            }
            else
                data[this.id] = val.id

            this.$emit("input", data)
        }
    },
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
        },
        multiple() {
            return (this.input.format === 'SELECTOR[MULTIPLE]') || (this.input.format === 'SELECTOR[1XN][ALL]') || (this.input.format === 'SELECTOR[MULTIPLE][ADVANCED]')
        }
    }
}
</script>

<style>

</style>
