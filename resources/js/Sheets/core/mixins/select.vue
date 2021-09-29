<script>
export default {
    props: {
        field: {
            type: Object,
            required: true,
            default: () => {}
        },
    },
    data: () => ({
        options: [],
        selected: '',//this.options.length > 0 ? this.options[0] : null,
        focus: false
    }),
    computed: {
        label() {
            return this.field.label
        },
        required() {
            return !this.field.required
        },
        multiple() {
            return false
        }
    },
    mounted() {
        this.getOptions()
    },
    methods: {
        onFocus() {
            this.focus = true
        },
        onBlur() {
            this.open = false
            this.focus = false
        },
        clickOnSelected(event) {
            event.stopPropagation()
            console.log(this.selected)
            this.open = false
        },
        selectOption(option) {
            this.selected = option
            this.open = false
            this.$emit('input', option)
        },
        getOptions() {
            const options = this.field.options
            if (options == null) {
                axios.get(`/api/sheets/entity/info/${this.field.entity_type_id}`)
                .then(response => {
                    const data = JSON.parse(response.data.content)
                    this.options = data.content.entities_fk[this.field.entity_type_fk]
                    this.selected = this.options[0]
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }
}
</script>
<style lang="scss">
    .sheet-select {
        border: 1px solid #858586;
        border-radius: 6px;
        cursor: pointer;
        height: 45px;
        padding-left: 8px;
        padding-top: 5px;
        text-align: left;
        user-select: none;
        width: 100%;
        outline: none;
        line-height: 25px;
        position: relative;

        .selected-region {
            background-color: #fff;
            padding-left: 5px;
            padding-right: 10px;

            .item-selected {
                display: inline-block;
                padding: 2px 5px;
                font-size: 12px;
                border: 2px solid  rgba(223, 219, 219, 0.809);
                border-radius: 3px;
                background-color:rgba(221, 218, 218, 0.919);
            }
        }

        .sheet-select-items {
            background-color: #fff;
            border-radius: 3px;
            border: 1px solid #858586;
            color: #000;
            left: 0;
            margin-top: 10px;
            max-height: 150px;
            position: absolute;
            overflow-y: scroll;
            right: 0;
            // overflow: hidden;
            box-shadow: 10px 10px 10px rgba(223, 219, 219, 0.809);

            .sheet-select-item {
                color: rgb(55, 55, 55);
                padding-left: 8px;
                cursor: pointer;
                user-select: none;
                min-height: 30px;
                &:hover {
                    background-color: rgba(248, 244, 244, 0.933);
                }
            }
        }
    }
    .sheet-select.active {
        border: 1px solid #1779c4ab;
        box-shadow: 5px 30px #000;
    }
    .selectHide {
        display: none;
    }
</style>

