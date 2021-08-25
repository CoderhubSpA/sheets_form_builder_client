<template>
    <input-group :label="label" :required="required">
        <input
            type="number"
            class="form-control"
            :placeholder="placeholder"
            aria-label="Username"
            aria-describedby="basic-addon1"
            :value="inputValue"
            @input="onInput"
            @paste="onPaste">
    </input-group>
</template>

<script>
import InputGroup from '../templates/input-group.vue'
import mixInput from '../mixs/input.vue'
export default {
    mixins: [mixInput],
    components: {
        'input-group': InputGroup
    }
}
</script>

<style>

</style>
