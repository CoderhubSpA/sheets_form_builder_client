<template>
    <input-group
        :label="label"
        :required="required"
        :linkTarget="this.input.link_url"
        :linkDescription="this.input.link_name"
        :tooltipInfo="this.input.description"
        v-if="show_field"
    >
        <input
            type="number"
            :id="id"
            class="form-control"
            aria-label="Username"
            aria-describedby="basic-addon1"
            :placeholder="this.input.default_value"
            :value="inputValue"
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
