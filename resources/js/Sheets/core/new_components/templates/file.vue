<template>
    <div class="custom-file">
        <slot />
        <label class="custom-file-label" :for="id">
            {{ label }} <span v-if="required" class="text-danger">*</span>
        </label>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style>
</style>
