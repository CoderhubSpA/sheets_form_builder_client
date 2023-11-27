<template>
    <input-group
        :character="'№'"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"

        v-if="show_field"
    >
        <input
            type="number"
            class="form-control"
            step="16"
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
import InputGroup from '../templates/input-group.vue';
import mixInput from '../mixs/input.vue';

export default {
    mixins: [mixInput],
    components: {
        'input-group': InputGroup,
    },
};
</script>
