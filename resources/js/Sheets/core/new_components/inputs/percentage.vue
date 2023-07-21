<template>
    <input-group
        :character="'%'"
        :required="required"
        :label="label"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        
        v-if="show_field"
    >
        <input
            type="number"
            aria-label="Username"
            aria-describedby="basic-addon1"
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

<style></style>
