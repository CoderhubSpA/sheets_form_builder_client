<template>
    <button :class="styles" @click="trigger" :disabled="disabledaction">
        {{ name }}
    </button>
</template>

<script>
export default {
    props: {
        action: {
            type: Object,
            default: () => {}
        },
        disabledaction: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        name() {
            return this.action.name;
        },
        styles() {
            const styles = [
                'btn',
                'btn-block',
                this.action.cancel_form == 1 ? 'btn-warning' : 'btn-success'
            ];
            return styles.join(' ');
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
        }
    }
};
</script>

<style></style>
