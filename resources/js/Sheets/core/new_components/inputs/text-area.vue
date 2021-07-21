<template>
    <form-group :id="id" :label="label">
        <textarea
            class="form-control"
            :id="id"
            rows="3"
            :value="inputValue"
            @input="onInput">
        </textarea>
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue'
import FormGroup from '../templates/form-group.vue'
export default {
    mixins: [mix],
    components: {
        'form-group': FormGroup
    }
}
</script>

<style>

</style>
