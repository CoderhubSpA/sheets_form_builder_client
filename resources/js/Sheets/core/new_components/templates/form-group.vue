<template>
    <div :class="`form-group ${templateClass}`">
        <label :for="id">
            {{ label }} <span v-if="required" class="text-danger">*</span>
        </label>
        <slot />
    </div>
</template>

<script>
import mixTemplate from '../mixs/template.vue';

export default {
    mixins: [mixTemplate],
    computed: {
        templateClass() {
            const {classes} = this.$attrs;
            let result = '';

            if (classes) result = classes.join(' ');
            return result;
        },
    },
};
</script>

<style>

</style>
