<template>
    <form-group :id="id" :label="label" :required="required">
        <input
            type="text"
            :id="id"
            :value="inputValue"
            @input="onInput"
            class="form-control">
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue'
import FormGroup from '../templates/form-group.vue'
export default {
    mixins: [mix],
    components: {
        'form-group': FormGroup
    },
    watch: {
        inputValue(val) {
            let data = {
                col_name: this.input.col_name,
                text: val
            }
            this.$store.commit('formBuilder/SEARCH_MAP', data)
        }
    }
}
</script>

<style>

</style>
