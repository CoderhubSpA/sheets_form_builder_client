<script>
import moment from 'moment'
export default {
    props: {
        input: {
            type: Object
        },
        value: {
            required: true
        },
        state: {
            type: String,
            default: 'formBuilder',
        },
    },
    data: () => ({
        picker: null
    }),
    computed: {
        dateFormat() {
            return this.input.format === 'DATE' ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm'
        },
        /**
         * interval between hours in time picker
         * @values 1 - 60
         * @default 1
         */
        hourStep() {
            return this.input.hour_step || 1
        },
        /**
         * interval between minutes in time picker
         * @values 1 - 60
         * @default 1
         * */
        minuteStep() {
            return this.input.min_step || 1
        },
        /**
         * interval between seconds in time picker
         * @values 1 - 60
         * @default 1
         */
        secondStep() {
            return this.input.sec_step || 1
        },
        fieldValue() {
            const fields = this.$store.getters[`${this.state}/fields`]

            if (fields.length > 0) {
                const val = fields.filter(f => Object.keys(f)[0] === this.id)[0]
                if (!!val) {
                    return val[this.id]
                }
            }
            return
        }
    },
    watch: {
        fieldValue(val) {
            if (val) {
                this.picker = new Date(val)
                this.onInput(val)
            }

        }
    },
    methods: {
        onInput(val) {
            const format = this.input.format === 'DATE' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'
            let data = {}
            data[this.id] = new moment(val).format(format)

            this.$emit('input', data)
        }
    }
}
</script>
