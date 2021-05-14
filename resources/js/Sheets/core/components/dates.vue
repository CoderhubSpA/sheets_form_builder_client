<template>
    <div>
        <label>
            {{ label }}<span class="text-danger" v-if="required">*</span>
        </label>
        <br>
        <date-picker
            :type="sheetType"
            :placeholder="placeholder"
            :format="dateFormat"
            :hour-step="hourStep"
            :minute-step="minuteStep"
            :secondStep="secondStep"
            v-model="picker"
            v-on:input="changeInput"></date-picker>

    </div>
</template>

<script>
/**
 * @author Jorge Peraza
 */
import * as moment from 'moment';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import abstract from "../mixins/mix";
export default {
    name: 'sheets-datepicker',
    mixins: [abstract],
    components: {
        DatePicker
    },
    data: ()=> ({
        picker: null
    }),
    computed: {
        dateFormat() {
            if(this.form.format === 'DATE'){
                return 'MM/DD/YYYY';
            }else{
                return 'MM/DD/YYYY HH:mm';
            }
        },
        /**
         * interval between hours in time picker
         * @values 1 - 60
         * @default 1
         */
        hourStep() {
            return this.form.hour_step
        },
        /**
         * interval between minutes in time picker
         * @values 1 - 60
         * @default 1
         * */
        minuteStep() {
            return this.form.min_step
        },
        /**
         * interval between seconds in time picker
         * @values 1 - 60
         * @default 1
         */
        secondStep() {
            return this.form.sec_step
        }
    },
    mounted(){
        this.getValue();
    },
    methods: {
        getValue(){
            const allValues = Object.assign(
                    {},
                    this.$store.getters["form/fieldsvalues"]
                );
                console.log('allValues[this.id]', allValues[this.id]);
            if(allValues[this.id]){
                const valueDate = allValues[this.id].split(' ');
                let dateToPicker = null;
                let preDate = null;
                if(valueDate.length > 1){
                    let dateStamp = valueDate[0].split('-');
                    let timeStamp = valueDate[1].split(':');
                    preDate = dateStamp.concat(timeStamp);
                    this.picker = new Date(parseInt(preDate[2]),parseInt(preDate[0]) - 1,parseInt(preDate[1]),parseInt(preDate[3]),parseInt(preDate[4]));
                }else{
                    preDate = valueDate[0].split('-');
                    this.picker = new Date(parseInt(preDate[2]),parseInt(preDate[0]) - 1,parseInt(preDate[1]));
                }
                this.editionParseDate(allValues[this.id]);
            }else{
                this.picker = null;
            }
        },
        changeInput(event){
            const searchRegExp = /\//gi;
            const replaceWith = '-';
            let parseFormat = this.dateFormat.replace(searchRegExp, replaceWith);
            let value = new moment(event).format(parseFormat);
            this.$emit('sheets-input-change', value, this.id);
        },
        editionParseDate(date){
            console.log(date)
            let searchRegExp = /\//gi;
            let replaceWith = '-';
            let parsed = date.replace(searchRegExp, replaceWith);
            searchRegExp = /T/gi;
            replaceWith = ' ';
            parsed = parsed.replace(searchRegExp, replaceWith);
            const fParsed = parsed.split(" ");
            const sParsed = fParsed[0].split('-');
            this.$emit('sheets-input-change', `${sParsed[1]}-${sParsed[2]}-${sParsed[0]} ${fParsed[1]}`, this.id);
        }
    }
}
</script>

<style>

</style>
