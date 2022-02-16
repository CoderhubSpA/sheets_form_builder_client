<template>
    <button :class="styles" @click="trigger" :disabled="disabledaction || uploading">
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
    },
    computed: {
        name() {
            return this.action.name;
        },
        styles() {
            const styles = [
                'sheets-action-btn',
                'btn',
                'btn-block',
                this.action.cancel_form == 1 ? 'btn-warning' : 'btn-success',
            ];
            return styles.join(' ');
        },
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
    },
};
</script>
<style scoped>
.transparentcolor {
    color: transparent;
}
</style>
