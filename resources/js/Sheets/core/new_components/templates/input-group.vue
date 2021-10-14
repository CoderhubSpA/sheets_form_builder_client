<template>
    <div>
        <div class="row">
            <div class="col-8">
                <label>{{ label }}</label> <span v-if="required" class="text-danger">*</span>
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
            default: '',
        },
        label: {
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
    },
};
</script>
