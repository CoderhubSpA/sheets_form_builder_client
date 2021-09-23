<script>
export default {
    props: {
        input: {
            type: Object,
            required: true
        },
        value: {
            type: Object,
            default: () => {},
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    computed: {
        label() {
            return this.input.name;
        },
        id() {
            return this.input.id;
        },
        autocomplete() {
            return !!this.input.autocomplete;
        },
        disabled() {
            return this.input.permission === 1;
        },
        readonly() {
            return this.input.readonly;
        },
        required() {
            return !!this.input.required;
        },
        placeholder() {
            return this.input.placeholder;
        },
        inputValue() {
            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                const val = fields.filter(f => Object.keys(f)[0] === this.id)[0];
                if (val) {
                    this.$emit('input', val);
                    if (this.input.format !== 'PERCENTAGE[X100]') {
                        return val[this.id];
                    } else {
                        return val[this.id] * 100;
                    }
                }
            }
            if (this.input.format !== 'PERCENTAGE[X100]') {
                return this.value ? this.value[this.id] : '';
            } else {
                return this.value ? parseFloat(this.value[this.id]) * 100 : '';
            }
        },
        col_name() {
            return this.input.col_name;
        }
    },
    methods: {
        onInput(e) {
            const data = {};
            if (this.input.format !== 'PERCENTAGE[X100]') {
                data[this.id] = e.target.value;
            } else {
                data[this.id] = parseFloat(e.target.value) / 100;
            }
            this.$emit('input', data);
        },
        // evitar pegado de informacion en el componente
        onPaste(event) {
            const regex = /^-?(0|[1-9]\d*)(\.\d+)?$/;
            const pasted = (event.clipboardData || window.clipboardData).getData(`text`);

            const isNumber = this.input.format === 'NUMBER';
            const isClp = this.input.format === 'CLP';
            const isPercentage = this.input.format === 'PERCENTAGE';

            if (isNumber || isClp || isPercentage) {
                event.preventDefault();
                if (regex.test(pasted)) {
                    event.target.value = pasted;
                }
            }
            const changed = new Event('input');
            event.target.dispatchEvent(changed);
        }
    }
};
</script>
