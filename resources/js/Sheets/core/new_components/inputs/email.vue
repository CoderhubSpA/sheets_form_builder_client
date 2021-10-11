<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="this.input.link_url"
        :linkDescription="this.input.link_name"
        :tooltipInfo="this.input.description"
    >
        <input type="email" :id="id" :value="inputValue" @input="onInput" class="form-control" />
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
