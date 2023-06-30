<template>
    <input-group
        :character="'$'"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        :class="{'hide': hide}"
        v-if="show_field"
    >
        <input
            type="number"
            aria-describedby="basic-addon1"
            aria-label="Username"
            class="form-control"
            :id="id"
            :placeholder="defaultValue"
            :value="inputValue"
            :disabled="disabled"
            @input="onInput"
            @paste="onPaste"
        />
    </input-group>
</template>

<script>
import mix from '../mixs/input.vue';
import InputGroup from '../templates/input-group.vue';

export default {
    mixins: [mix],
    components: {
        'input-group': InputGroup,
    },
};
</script>
