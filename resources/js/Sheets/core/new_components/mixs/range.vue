<script>
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
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
        base_url: {
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
        errorInput: false,
        dateStart: null,
        dateEnd: null,
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
        rangeValue() {
            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                if (val) {
                    this.$emit('input', val);
                    return val[this.id];
                }
            }
            return { start: null, end: null };
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
        console.log('rangeValue', this.rangeValue);
        this.readInputValue();
    },
    methods: {
        readInputValue() {
            const dataToSelectorFilters = {
                key: this.input.col_name,
                value: this.rangeValue,
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
        },
        onInputStart(e) {
            this.rangeValue.start = Number(e.target.value);
            this.handleInputData();
        },
        onInputEnd(e) {
            this.rangeValue.end = Number(e.target.value);
            this.handleInputData();
        },
        selectedStart(val) {
            console.log('start', val);
            const start = val._i.split('/');
            if (Number(start[1]) <= 9) {
                start[1] = `0${start[1]}`;
            }
            this.rangeValue.start = Number(`${start[0]}${start[1]}`);
            this.handleInputData();
        },
        selectedEnd(val) {
            console.log('end', val);
            const end = val._i.split('/');
            if (Number(end[1]) <= 9) {
                end[1] = `0${end[1]}`;
            }
            this.rangeValue.end = Number(`${end[0]}${end[1]}`);
            this.handleInputData();
        },
        handleInputData() {
            this.errorInput = false;
            if (this.rangeValue.start !== null && this.rangeValue.end !== null) {
                if (this.rangeValue.start > this.rangeValue.end) {
                    this.errorInput = true;
                    return;
                }
            }
            const dataToSelectorFilters = {
                key: this.input.col_name,
                value: this.rangeValue,
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
            const data = {};
            data[this.id] = this.rangeValue;
            console.log('data', data);
            this.vmodelcurrentvalue = data;
            this.$emit('input', data);
            /**
             * mostrar/ocultar section
             */
            // eslint-disable-next-line camelcase
            const field_section_show_hide = {};
            field_section_show_hide[this.form_field_id] = this.rangeValue;
            this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, field_section_show_hide);
            /**
             * mostrar/ocultar field
             */
            // eslint-disable-next-line camelcase
            const field_show_hide = {};
            field_show_hide[this.form_field_id] = this.rangeValue;
            this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);
        },
    },
};
</script>
