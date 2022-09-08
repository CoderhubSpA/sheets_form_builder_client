<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        v-if="show_field"
        :classes="errorInput ? ['field-error'] : []"
    >
        <div class="row">
            <div class="col-4">
                <date-picker
                    range
                    type="date"
                    v-model="dateStart"
                    format="DD/MM/YYYY"
                    placeholder="Fecha inicial"
                    :disabled="disabled"
                    @input="selectedDateRange"
                ></date-picker>
            </div>
        </div>
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
import mix from '../mixs/range-date.vue';
import mixInput from '../mixs/input.vue';
import Moment from 'moment';

export default {
    mixins: [mixInput,mix],
    components: {
        'form-group': FormGroup,
        'date-picker': DatePicker
    },
    methods: {
        selectedDateRange(val){
            if (val && val[0] && val[1]) {
                this.rangeValue.start = moment(val[0]).format('YYYY-MM-DD');
                this.rangeValue.end = moment(val[1]).format('YYYY-MM-DD');;
            } else {
                this.rangeValue.start = null;
                this.rangeValue.end = null;
            }

            this.handleInputData();
        }
    }
};
</script>
