<template>
    <div>
        {{ label }} <span v-if="required" class="text-danger">*</span>
        <div class="custom-file">
            <slot />
            <label class="custom-file-label" :for="id">
                {{ placeholder }}
            </label>
        </div>
    </div>
</template>

<script>
import mixTemplate from '../mixs/template.vue';

export default {
    mixins: [mixTemplate],
    props: {
        placeholder: {
            type: String,
            default: '',
        },
    },
};
</script>
