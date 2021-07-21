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
        label() {
            return this.input.name
        },
        id() {
            return this.input.id
        },
        autocomplete() {
            return !!this.input.autocomplete
        },
        disabled() {
            return this.input.permission === 1
        },
        readonly() {
            return this.input.readonly
        },
        required() {
            return (this.input.required == 1) ? true : false
        },
        placeholder() {
            return this.input.placeholder
        },
        inputValue() {
            return !!this.value ? this.value[this.id] : ''
        },

    },
    methods: {
        onInput(e) {
            let data = {}
            data[this.id] = e.target.value
            this.$emit('input', data)
        },
        // evitar pegado de informacion en el componente
        onPaste(event) {
            const regex = /^-?(0|[1-9]\d*)(\.\d+)?$/;
            const pasted = (event.clipboardData || window.clipboardData).getData("text")

            const isNumber = this.input.format === "NUMBER"
            const isClp = this.input.format === "CLP"
            const isPercentage =this.input.format === "PERCENTAGE"

            if (isNumber || isClp || isPercentage) {
                event.preventDefault();
                if (regex.test(pasted)) {
                    event.target.value = pasted;
                }
            }
            const changed = new Event("input");
            event.target.dispatchEvent(changed);
        }
    }

}
</script>
