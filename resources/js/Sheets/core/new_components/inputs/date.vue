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
            type="date"
            :format="dateFormat"
            :placeholder="defaultValue"
            @input="onInput"
            v-model="picker"
        ></date-picker>
    </form-group>
</template>
<script>
import DatePicker from 'vue2-datepicker';
import mix from '../mixs/input.vue';
import mixDate from '../mixs/dates.vue';
import FormGroup from '../templates/form-group.vue';

export default {
    mixins: [mix, mixDate],
    components: {
        'form-group': FormGroup,
        'date-picker': DatePicker,
    },
};
</script>

<style></style>
