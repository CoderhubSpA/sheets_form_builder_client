<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        :class="{'hide': hide}"
        v-if="show_field"
    >
        <input
            type="password"
            class="form-control"
            maxlength="250"
            autocomplete="new-password"
            :id="id"
            :value="inputValue"
            :placeholder="defaultValue"
            @input="onInput"
        />
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

<style></style>
