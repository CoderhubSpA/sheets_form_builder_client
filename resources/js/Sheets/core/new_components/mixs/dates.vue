<script>
import Moment from 'moment';
import { es } from '@sum.cumo/vue-datepicker/dist/locale/index.esm'

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
        disabledDates: {
            to: null,
            dates: [],
            from: null
        },
        es: es,
    }),
    mounted(){
        if(this.input.assign_default_value === 1 && this.input.default_value) {
            this.picker = moment(this.input.default_value).toDate();
            this.onInput(this.picker);
        }

        if(this.input.metadata) {
            this.setFunctionFromMetadata(this.input.metadata);
        }
    },
    computed: {
        dateFormat() {
            return this.input.format === 'DATE' ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm';
        },
        customDateFormat() {
            return this.input.format === 'DATE' ? 'dd/MM/yyyy' : '';
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
        clear() {
            return this.$store.getters[`${this.state}/clearfields`];
        },
    },
    watch: {
        fieldValue(val) {
            if (val) {
                this.picker = moment(this.fieldValue).toDate()
                this.onInput(val);
            }
        },
        clear(val) {
            if(val) {
               this.picker = null;
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
        setFunctionFromMetadata(data){
            let parseMetadata = JSON.parse(data);

            Object.keys(parseMetadata).forEach((key) => {
                if(key === "onlyDatesFromNow") {
                    if(parseMetadata[key] === true) {
                        this.disabledDates.to = new Date(new Date().toLocaleDateString('en-US'));
                    }
                }
            })

        }
    },
};
</script>
