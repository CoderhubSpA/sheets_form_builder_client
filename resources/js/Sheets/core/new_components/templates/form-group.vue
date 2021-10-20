<template>
    <div :class="`form-group ${templateClass}`">
        <div class="row">
            <div :class="getClass()">
                <a
                    class="float-right sheet-field-info-link"
                    :href="linkTarget"
                    target="_blank"
                    rel="noopener noreferrer"
                    v-if="linkTarget"
                >
                    {{ linkDescription }}
                </a>
                <label :for="id">{{ label }}</label>
                <span v-if="required" class="text-danger">*</span>
                <span class="tooltip-custom" v-if="tooltipInfo">
                    <span class="icon">&#9432;</span>
                    <span class="tooltiptext">
                        {{ tooltipInfo }}
                    </span>
                </span>
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
    methods: {
        getClass() {
            if (this.linkTarget !== null && this.linkTarget !== undefined) {
                return this.linkTarget.length > 0 ? 'col has-more-info' : 'col';
            }
            return 'col';
        },
    },
};
</script>

<style></style>
