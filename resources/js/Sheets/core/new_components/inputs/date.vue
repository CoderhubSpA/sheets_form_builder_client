<template>
    <form-group
        :label="label"
        :id="id"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        :class="{'hide': hide}"
        v-if="show_field"
    >
        <date-picker
            type="date"
            v-model="picker"
            :format="dateFormat"
            :placeholder="defaultValue"
            :disabled="disabled"
            @input="onInput"
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
