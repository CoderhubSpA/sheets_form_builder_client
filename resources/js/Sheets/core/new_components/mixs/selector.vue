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
    computed: {
        selectedValue() {
            let result = null;
            const fields = this.$store.getters['formBuilder/fields']

            if (fields.length > 0) {
                const field = fields.filter(f => Object.keys(f)[0] === this.id)[0]

                if (!!field) {
                    const key = Object.keys(field)[0]
                    let search = this.multiple ? JSON.parse(field[key]) : field[key].toString()


                    if (this.multiple && !!search) {
                        result = Object.entries(search).map(s => {
                            return this.options.find(o => o.id === s[1])
                        })
                    }
                    else if(!this.multiple && !!search) {
                        result = this.options.find(o => o.id === search)
                    }
                }
            }
            return result
        },
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
            const isMultiple = this.input.format === 'SELECTOR[MULTIPLE]'

            const is1xnAll = this.input.format === 'SELECTOR[1XN][ALL]'

            const isMultipleAdvanced = this.input.format === 'SELECTOR[MULTIPLE][ADVANCED]'

            return (isMultiple || is1xnAll || isMultipleAdvanced)
        }
    },
    watch: {
        selected(val) {
            if (!!val) {
                let data = {}

                if (this.multiple)
                    data[this.id] = val.map(v => { return v.id })
                else
                    data[this.id] = val.id

                this.$emit("input", data)
            }

        },
        selectedValue(val) {
            this.selected = val
        }
    },
}
</script>

<style>

</style>
