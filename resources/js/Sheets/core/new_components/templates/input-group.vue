<template>
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon1">
                {{ character }}
            </span>
        </div>
        <slot />
    </div>
</template>
<script>
export default {
    props: {
        character: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        }
    }
}
</script>
