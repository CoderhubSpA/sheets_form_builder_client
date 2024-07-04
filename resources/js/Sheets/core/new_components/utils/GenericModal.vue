<template>
    <div class="modal" tabindex="-1" id="fb-modal" ref="modal">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header-title"></slot>
                    <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        @click="close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" ref="content">
                    <slot />
                </div>
                <slot name="footer">
                    <!-- <div class="modal-footer">

                    </div> -->
                </slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            require: true,
            default: false,
        },
        state: {
            type: String,
            require: false,
            default: '',
        },
        store: {
            type: Object,
            required: false,
            default: () => ({}),
        },
        context: {
            type: Object,
            required: false,
            default: () => ({}),
        }
    },
    computed: {
        dialog() {
            return this.show;
        },
        modalContexts() {
            return this.$store.getters[`${this.state}/modal_contexts`];
        }
    },
    watch: {
        dialog(value) {
            const { modal } = this.$refs;
            modal.style.display = value ? 'block' : 'none';
        },
        modalContexts(value) {
            if (value.length > 0) {
                const findContext = value.find((context) => context.id === this.context.id);

                if (findContext && findContext.show == false) {
                    this.$emit('show', false);
                    this.deleteContext();
                }
            }
        },
    },
    mounted() {
        this.$nextTick(() => {
            const { modal } = this.$refs;
            modal.style.display = this.dialog ? 'block' : 'none';
        });

        this.setContext();
    },
    methods: {
        close() {
            this.$emit('show', false);
        },
        setContext() {
            if(this.store && this.state && this.context) {
                this.store.dispatch(`${this.state}/add_modal_context`, this.context);
            }
        },
        deleteContext() {
            this.store.dispatch(`${this.state}/delete_modal_context`, this.context);
        }
    },
};
</script>
<style lang="scss">
// Container that the modal scrolls within
.modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: none;
    width: 100%;
    height: 100%;
    overflow: auto;
    // Prevent Chrome on Windows from adding a focus outline. For details, see
    // https://github.com/twbs/bootstrap/pull/10951.
    outline: 0;
    // We deliberately don't use `-webkit-overflow-scrolling: touch;` due to a
    // gnarly iOS Safari bug: https://bugs.webkit.org/show_bug.cgi?id=158342
    // See also https://github.com/twbs/bootstrap/issues/17695
}
</style>
