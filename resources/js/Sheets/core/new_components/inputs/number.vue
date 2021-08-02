<template>
    <input-group>
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
export default {
    components: {
        'input-group': InputGroup
    }
}
</script>

<style>

</style>
