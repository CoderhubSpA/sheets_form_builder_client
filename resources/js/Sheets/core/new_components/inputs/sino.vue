<template>
    <form-check :label="label" :id="id" :required="required">
        <input
            class="form-check-input"
            type="checkbox"
            value=""
            :id="id"
            :disabled="disabled"
            :indeterminate.prop="indeterminate"
            @change="onInput">
    </form-check>
</template>

<script>
import FormCheck from '../templates/form-check.vue'
import mix from '../mixs/input.vue'
export default {
    mixins: [mix],
    components: {
        'form-check': FormCheck
    },
    data: () => ({
        indeterminate: true
    }),
    methods: {
        onInput(e) {
            let data = {}
            data[this.id] = e.target.checked
            this.$emit('input', data)
        }
    }
}
</script>

<style>

</style>
