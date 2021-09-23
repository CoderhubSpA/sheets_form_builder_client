<template>
    <div>
        <label>{{ label }}</label>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                    {{ character }}
                </span>
            </div>
            <slot />
        </div>
    </div>
</template>
<script>
import mixTemplate from '../mixs/template.vue';
export default {
    mixins: [mixTemplate],
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
};
</script>
