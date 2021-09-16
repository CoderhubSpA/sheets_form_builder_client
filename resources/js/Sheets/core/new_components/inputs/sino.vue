<template>
    <form-check :label="label" :id="id" :required="required">
        <input
            class="form-check-input"
            type="checkbox"
            :id="id"
            :disabled="disabled"
            :indeterminate.prop="indeterminate"
            v-model="checked"
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
        indeterminate: true,
        checked: null
    }),
    computed: {
        inputValue() {
            const fields = this.$store.getters[`${this.state}/fields`]
            if (fields && fields.length > 0) {
                const val = fields.filter(f => Object.keys(f)[0] === this.id)[0]
                if (!!val) {
                    return val[this.id]
                }
            }
        }
    },
    watch: {
        inputValue(val) {
            this.indeterminate = false
            this.checked = val
        }
    },
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
