<template>
    <input-group :character="'%'" :required="required" :label="label">
        <input
            type="number"
            class="form-control"
            aria-label="Username"
            aria-describedby="basic-addon1"
            :value="inputValue"
            @input="onInput"
            @paste="onPaste"
        />
    </input-group>
</template>

<script>
import mix from '../mixs/input.vue'
import InputGroup from '../templates/input-group.vue'
export default {
    mixins: [mix],
    components: {
        'input-group': InputGroup
    }
}
</script>

<style>

</style>
