<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        v-if="show_field"
    >
        <textarea
            class="form-control"
            :id="id"
            rows="3"
            :placeholder="defaultValue"
            :value="inputValue"
            :disabled="disabled"
            @input="onInput"
            maxlength="1000"
        >
        </textarea>
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue';
import FormGroup from '../templates/form-group.vue';

export default {
    mixins: [mix],
    components: {
        'form-group': FormGroup,
    },
};
</script>
