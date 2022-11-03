<template>
    <button :class="styles" @click="trigger" :disabled="disabledaction || uploading || !mandatoryFieldsAccepted">
        <span
            :class="!uploading ? 'transparentcolor' : ''"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
        ></span>
        {{ name }}
    </button>
</template>

<script>
/* eslint-disable eqeqeq */
export default {
    props: {
        action: {
            type: Object,
            default: () => {},
        },
        disabledaction: {
            type: Boolean,
            default: false,
        },
        uploading: {
            type: Boolean,
            default: false,
        },
        state: {
            type: String,
            require: true,
        }
    },
    data: () => ({
        mandatoryFields: [],
        mandatoryFieldsAccepted: true
    }),
    mounted() {
        this.findMandatoryFields();
    },
    computed: {
        name() {
            return this.action.name;
        },
        styles() {
            const styles = [
                'btn',
                'btn-block',
                this.action.save_form === 1 ? 'btn-success' :
                this.action.cancel_form === 1 ? 'btn-warning' :
                this.action.refresh_form === 1 || this.action.close_form === 1 ? 'btn-secondary' : 'btn-info'
            ];

            return styles.join(' ');
        },
        selectorFilters () {
            return this.$store.getters[`${this.state}/selectorfilters`];
        }
    },
    watch: {
        selectorFilters (val) {
            if (val) {
                let countMandatoryFieldsAccepted = 0;

                this.mandatoryFields.forEach(field => {
                    Object.keys(val).forEach((objKey) => {
                        if (objKey === field.col_name && val[objKey] === "true") {
                            countMandatoryFieldsAccepted++;
                        }
                    });
                });

                if(countMandatoryFieldsAccepted === this.mandatoryFields.length) {
                    this.mandatoryFieldsAccepted = true;
                } else {
                    this.mandatoryFieldsAccepted = false;
                }
            }
        }
    },
    methods: {
        trigger() {
            if (!this.disabledaction) {
                if (this.action.save_form === 1) {
                    this.$emit('trigger', true, this.action);
                } else {
                    this.$emit('trigger', false, this.action);
                }
            }
        },
        findMandatoryFields () {
            let getMandatoryFields = this.$store.getters[`${this.state}/fields_as_object`];

            getMandatoryFields = getMandatoryFields.filter((field) => {
                return field.format === "CHECKBOX[MANDATORY]" && field.permission === 2 && (field.visible === undefined || field.visible === 1);
            });

            if(getMandatoryFields.length > 0 && this.action.save_form === 1) {
                this.mandatoryFields = getMandatoryFields;
                this.mandatoryFieldsAccepted = false;
            }
        },
    },
};
</script>
<style scoped>
.transparentcolor {
    color: transparent;
}
</style>
