<template>
    <div class="form-group">
        <label :for="id">
            {{ label }} <span v-if="required" class="text-danger">*</span>
        </label>
        <slot />
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
        },
        xs: {
            type: String,
            default: ''
        },
        sm: {
            type: String,
            default: ''
        },
        md: {
            type: String,
            default: ''
        }
    },
    computed: {
        cols() {
            return `col-xs-${xs} col-sm-${sm} col-md-${md}`
        }
    }
}
</script>

<style>

</style>
