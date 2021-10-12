<template>
    <form-group :id="id" :label="label" :required="required">
        <textarea
            class="form-control"
            :id="id"
            rows="3"
            :value="inputValue"
            :disabled="disabled"
            @input="onInput"
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
