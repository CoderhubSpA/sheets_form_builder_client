<script>
import Moment from 'moment';

export default {
    props: {
        input: {
            type: Object,
        },
        value: {
            required: true,
        },
        state: {
            type: String,
            default: 'formBuilder',
        },
    },
    data: () => ({
        picker: null,
        // VERIFICACIÓN DEL MODEL PARA LOS TEST
        vmodelcurrentvalue: {},
    }),
    computed: {
        dateFormat() {
            return this.input.format === 'DATE' ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm';
        },
        /**
         * interval between hours in time picker
         * @values 1 - 60
         * @default 1
         */
        hourStep() {
            return this.input.hour_step || 1;
        },
        /**
         * interval between minutes in time picker
         * @values 1 - 60
         * @default 1
         * */
        minuteStep() {
            return this.input.min_step || 1;
        },
        /**
         * interval between seconds in time picker
         * @values 1 - 60
         * @default 1
         */
        secondStep() {
            return this.input.sec_step || 1;
        },
        fieldValue() {
            const fields = this.$store.getters[`${this.state}/fields`];
            let result = null;
            if (fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] == this.id)[0];
                if (val) {
                    result = val[this.id];
                }
            }
            return result;
        },
    },
    watch: {
        fieldValue(val) {
            if (val) {
                this.picker = moment(this.fieldValue).toDate()
                this.onInput(val);
            }
        },
    },
    methods: {
        onInput(val) {
            const format = this.input.format === 'DATE' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm';
            const data = {};
            data[this.id] = new Moment(val).format(format);
            this.vmodelcurrentvalue = data;
            this.$emit('input', data);
            /**
             * mostrar/ocultar section
             */
            const field_section_show_hide = {};
            field_section_show_hide[this.form_field_id] = val;
            this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, field_section_show_hide);
        },
    },
};
</script>
