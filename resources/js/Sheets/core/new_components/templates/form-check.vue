<template>
    <div class="form-check">
        <div class="row">
            <div class="col-12" v-if="linkTarget && linkTarget.length > 0">
                <a
                    class="float-right sheet-field-info-link"
                    :href="linkTarget"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {{ linkDescription }}
                </a>
            </div>
        </div>
        <slot />
        <label class="form-check-label" :for="id">
            {{ label }} <span v-if="required" class="text-danger">*</span>
            <span class="tooltip-custom" v-if="tooltipInfo && tooltipInfo.length > 0">
                <span class="icon">&#9432;</span>
                <span class="tooltiptext">
                    {{ tooltipInfo }}
                </span>
            </span>
        </label>
    </div>
</template>

<script>
import mixTemplate from '../mixs/template.vue';

export default {
    mixins: [mixTemplate],
    props: {
        linkTarget: {
            type: String,
            default: '',
        },
        linkDescription: {
            type: String,
            default: 'Más información',
        },
        tooltipInfo: {
            type: String,
            default: '',
        },
    },
};
</script>

<style></style>
