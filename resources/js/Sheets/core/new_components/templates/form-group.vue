<template>
    <div class="form-group">
        <label :for="id">
            {{ label }} <span v-if="required" class="text-danger">*</span>
        </label>
        <slot />
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
