<template>
    <div class="modal" tabindex="-1" id="fb-modal" ref="modal">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
            <div class="modal-header">
                <slot name="header-title">

                </slot>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" ref="content">
                <!--  -->
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
            require: true
        }
    },
    mounted() {
        const modal = this.$refs.modal;
        modal.style.display = 'block'
        // this.$nextTick(() => {
        //     modal.style.display = 'block';
        // });
    },
    methods: {
        close() {
            this.$emit('show', false)
        }
    }
};
</script>
