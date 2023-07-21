<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        v-if="show_field"
        :class="{'field-error': errorInput }"
    >
        <date-picker
            range
            type="date"
            v-model="dateStart"
            format="DD/MM/YYYY"
            placeholder="Desde DD/MM/YYY ~ Hasta DD/MM/YYY"
            :disabled="disabled"
            :default-value="showDateAfterMonth()"
            :disabled-date="datesAvailableUntil"
            @input="selectedDateRange"
        ></date-picker>
  
        <div v-if="errorInput" class="row mt-3">
            <div class="col text-center">
                <p class="text-danger">El valor final debe ser superior al valor inicial</p>
            </div>
        </div>
    </form-group>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import FormGroup from '../templates/form-group.vue';
import mixDate from '../mixs/range.vue';
import mixRangeDate from '../mixs/range-date.vue';
import mixInput from '../mixs/input.vue';
import moment from 'moment';

export default {
    mixins: [mixInput,mixDate, mixRangeDate],
    components: {
        'form-group': FormGroup,
        'date-picker': DatePicker
    },
    methods: {
        selectedDateRange (val) {
            if (val && val[0] && val[1]) {
                this.rangeValue.start = moment(val[0]).format('YYYY-MM-DD');
                this.rangeValue.end = moment(val[1]).format('YYYY-MM-DD');
            } else {
                this.rangeValue.start = null;
                this.rangeValue.end = null;
            }

            this.handleInputData();
        },
        showDateAfterMonth () {
            if (this.dateRangeBeforeMonth) {
                return new Date().setMonth(this.getNewDate(this.dateRangeBeforeMonth).getMonth() - 1);
            }

            return new Date().setMonth(new Date().getMonth() - 1);
        },
        datesAvailableUntil (date) {
            if (this.dateRangeAvailableUntil) {
                return date > this.getNewDate(this.dateRangeAvailableUntil);
            }

            return date > new Date();
        },
        getNewDate (date) {
            const formatedDate = moment(date, "DD-MM-YYYY");

            return new Date(`${formatedDate.format('YYYY')}, ${formatedDate.format('M')}, ${formatedDate.format('D')}`);
        }
    }
};
</script>
