<template>
    <form-group
        :label="label"
        :id="id"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        
        v-if="show_field"
    >
        <date-picker
            v-model="picker"
            wrapper-class="form-control"
            input-class="date-input"
            :id="id"
            :format="customDateFormat"
            :placeholder="defaultValue"
            :disabled-dates="disabledDates"
            :disabled="disabled"
            :language="es"
            @input="onInput"
        ></date-picker>
    </form-group>
</template>
<script>
import mix from '../mixs/input.vue';
import mixDate from '../mixs/dates.vue';
import FormGroup from '../templates/form-group.vue';
import DatePicker from '@sum.cumo/vue-datepicker';
import '@sum.cumo/vue-datepicker/dist/Datepicker.css'

export default {
    mixins: [mix, mixDate],
    components: {
        'form-group': FormGroup,
        'date-picker': DatePicker,
    },
};
</script>

<style></style>
