<script>
/* eslint-disable camelcase */
export default {
    props: {
        input: {
            type: Object,
            required: true,
        },
        value: {
            type: Object,
            default: () => {},
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
    },
    data: () => ({
        // VERIFICACIÓN DEL MODEL PARA LOS TEST
        vmodelcurrentvalue: {},
        maxlengths: {
            URL: 250,
            EMAIL: 250,
            PASSWORD: 250,
            RUT: 250,
            TEXT: 250,
        },
    }),
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
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                if (val) {
                    this.$emit('input', val);
                    return val[this.id];
                }
            }
            return this.value ? this.value[this.id] : '';
        },
        col_name() {
            return this.input.col_name;
        },
        form_field_id() {
            return this.input.form_field_id;
        },
        show_by_field_id() {
            return this.input.show_by_field_id;
        },
        show_by_field_value() {
            return this.input.show_by_field_value;
        },
        show_field() {
            const fields = this.$store.getters[`${this.state}/field_show_hide`];
            // eslint-disable-next-line camelcase
            let show_field = false;
            if (this.show_by_field_id) {
                // eslint-disable-next-line eqeqeq
                if ((fields[this.show_by_field_id] || false) == this.show_by_field_value) {
                    // eslint-disable-next-line camelcase
                    show_field = true;
                }
                try {
                    // Permite validar si entre un selector multiple existe el
                    // valor que condiciona que el elemento se vea o no
                    if (
                        Array.isArray(fields[this.show_by_field_id]) &&
                        fields[this.show_by_field_id]
                            .map((d) => d.id)
                            .includes(this.show_by_field_value)
                    ) {
                        // eslint-disable-next-line camelcase, no-undef
                        show_section = true;
                    }
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.warn(e);
                }
                // eslint-disable-next-line camelcase
            } else show_field = true;
            // eslint-disable-next-line camelcase
            this.$emit('tooglefield', show_field);
            return show_field;
        },
        defaultValue() {
            if (this.input.default_value) {
                return `Por defecto: ${this.input.default_value}`;
            }
            return null;
        },
    },
    mounted() {
        this.readInputValue();
    },
    methods: {
        readInputValue() {
            const dataToSelectorFilters = {
                key: this.input.col_name,
                value: this.inputValue,
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
        },
        onInput(e) {
            const formatWithMaxLength = Object.keys(this.maxlengths);
            let valueParsed;
            if (formatWithMaxLength.indexOf(this.input.format) > -1) {
                valueParsed = e.target.value.substring(0, this.maxlengths[this.input.format]);
            } else if (this.input.format === 'TEXT[AREA]') {
                valueParsed = e.target.value.substring(0, 1000);
            } else {
                valueParsed = e.target.value;
            }

            if (this.input.format === 'EMAIL') {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valueParsed)) {
                    this.$emit('input', '');
                    valueParsed = '';
                }
            }
            const dataToSelectorFilters = {
                key: this.input.col_name,
                value: valueParsed,
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
            const data = {};
            data[this.id] = valueParsed;

            this.vmodelcurrentvalue = data;

            this.$emit('input', data);
            /**
             * mostrar/ocultar section
             */
            // eslint-disable-next-line camelcase
            const field_section_show_hide = {};
            field_section_show_hide[this.form_field_id] = valueParsed;
            this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, field_section_show_hide);
            /**
             * mostrar/ocultar field
             */
            // eslint-disable-next-line camelcase
            const field_show_hide = {};
            field_show_hide[this.form_field_id] = valueParsed;
            this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);
        },
        // evitar pegado de informacion en el componente
        onPaste(event) {
            const regex = /^-?(0|[1-9]\d*)(\.\d+)?$/;
            const pasted = (event.clipboardData || window.clipboardData).getData(`text`);

            const isNumber = this.input.format === 'NUMBER';
            const isClp = this.input.format === 'CLP';
            const isPercentage =
                this.input.format === 'PERCENTAGE' || this.input.format === 'PERCENTAGE[X100]';

            if (isNumber || isClp || isPercentage) {
                event.preventDefault();
                if (regex.test(pasted)) {
                    // eslint-disable-next-line no-param-reassign
                    event.target.value = pasted;
                }
            }
            const changed = new Event('input');
            event.target.dispatchEvent(changed);
        },
    },
};
</script>
