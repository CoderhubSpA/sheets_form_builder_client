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
            :id="id"
            class="form-control"
            aria-label="Username"
            aria-describedby="basic-addon1"
            :placeholder="defaultValue"
            :value="inputValue"
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
