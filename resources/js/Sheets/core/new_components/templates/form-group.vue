<template>
    <div :class="`form-group ${templateClass}`">
        <label :for="id">
            {{ label }} <span v-if="required" class="text-danger">*</span>
        </label>
        <slot />
    </div>
</template>

<script>
import mixTemplate from '../mixs/template.vue'
export default {
    mixins: [mixTemplate],
    computed: {
        templateClass() {
            let classes = this.$attrs.classes
            if (classes)
                return classes.join(' ')
            else
                return ''
        }
    }
}
</script>

<style>

</style>
