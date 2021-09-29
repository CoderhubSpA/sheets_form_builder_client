<template>
    <form-group :label="label" :id="id" :required="required">
        <date-picker
            type="datetime"
            :format="dateFormat"
            :hour-step="hourStep"
            :minute-step="minuteStep"
            :secondStep="secondStep"
            @input="onInput"
            v-model="picker"></date-picker>
    </form-group>
</template>
<script>
import mix from '../mixs/input.vue'
import mixDate from '../mixs/dates.vue'
import FormGroup from '../templates/form-group.vue'
import DatePicker from 'vue2-datepicker';

export default {
    mixins: [mix, mixDate],
    components: {
        'form-group': FormGroup,
        'date-picker': DatePicker
    }
}
</script>

<style>

</style>
