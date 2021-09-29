<template>
    <div class="form-check">
        <slot />
        <label class="form-check-label" :for="id">
            {{ label }} <span v-if="required" class="text-danger">*</span>
        </label>
    </div>
</template>

<script>
import mixTemplate from '../mixs/template.vue'
export default {
    mixins: [mixTemplate]
}
</script>

<style>

</style>
