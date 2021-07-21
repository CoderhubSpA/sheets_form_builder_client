<template>
    <input-group :character="'$'" :label="label">
        <input
            type="number"
            class="form-control"
            :placeholder="label"
            aria-label="Username"
            aria-describedby="basic-addon1"
            @input="onInput"
            @paste="onPaste">
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
