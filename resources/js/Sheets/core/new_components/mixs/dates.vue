<script>
import moment from 'moment'
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
        picker: null
    }),
    computed: {
        dateFormat() {
            return this.input.format === 'DATE' ? 'DD-MM-YYYY' : 'DD-MM-YYYY HH:mm'
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
