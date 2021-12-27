<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="this.input.link_url"
        :linkDescription="this.input.link_name"
        :tooltipInfo="this.input.description"
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
