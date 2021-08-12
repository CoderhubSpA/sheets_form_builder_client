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
            return this.input.format === 'DATE' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'
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
            const searchRegExp = /\//gi
            const replaceWith = '-'

            let parseFormat = this.dateFormat.replace(searchRegExp, replaceWith)
            let value = new moment(val).format(parseFormat)

            let data = {}
            data[this.id] = value

            this.$emit('input', data)
        }
    }
}
</script>
