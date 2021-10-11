<template>
    <div :class="`form-group ${templateClass}`">
        <div class="row">
            <div class="col-8">
                <label :for="id">{{ label }}</label>
                <span v-if="required" class="text-danger">*</span>
                <span class="tooltip-custom" v-if="tooltipInfo.length > 0">
                    <img src="/images/infoicon.png" />
                    <span class="tooltiptext">
                        {{ tooltipInfo }}
                    </span>
                </span>
            </div>
            <div class="col-4" v-if="linkTarget.length > 0">
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
    computed: {
        templateClass() {
            const { classes } = this.$attrs;
            let result = '';

            if (classes) result = classes.join(' ');
            return result;
        },
    },
};
</script>

<style></style>
