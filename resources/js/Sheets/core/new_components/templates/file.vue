<template>
    <div>
        <div class="row">
            <div :class="getClass()">
                <a
                    class="float-right sheet-field-info-link"
                    :href="linkTarget"
                    target="_blank"
                    rel="noopener noreferrer"
                    v-if="linkTarget && linkTarget.length > 0"
                >
                    {{ linkDescription }}
                </a>
                <label :for="id">{{ label }}</label>
                <span v-if="required" class="text-danger">*</span>
                <span class="tooltip-custom" v-if="tooltipInfo && tooltipInfo.length > 0">
                    <span class="icon">&#9432;</span>
                    <span class="tooltiptext">
                        {{ tooltipInfo }}
                    </span>
                </span>
            </div>
        </div>
        <div class="input-group">
            <slot />
        </div>
        <!-- <div class="custom-file">
            <slot />
            <label
                class="custom-file-label"
                :class="showDeleteButton ? 'shrinklabel' : ''"
                :for="id"
            >
                {{ placeholder }}
            </label>
        </div> -->
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
        showDeleteButton: {
            type: Boolean,
            default: false,
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
<style scoped>
.shrinklabel {
    width: calc(100% - 43px);
}
</style>
