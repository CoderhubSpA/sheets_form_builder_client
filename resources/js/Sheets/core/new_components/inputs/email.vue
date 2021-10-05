<template>
    <form-group :id="id" :label="label" :required="required">
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
