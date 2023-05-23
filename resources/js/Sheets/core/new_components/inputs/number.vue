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
            :id="id"
            class="form-control"
            aria-label="Username"
            aria-describedby="basic-addon1"
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
