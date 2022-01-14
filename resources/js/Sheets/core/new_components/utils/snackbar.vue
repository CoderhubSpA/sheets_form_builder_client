<template>
    <transition name="fade" :duration="timeout">
        <div :class="`snackbar ${success_error}`" v-if="show">
            {{ text }}
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        message: {
            type: String,
            default: '',
        },
        timeout: {
            type: Number,
            default: 5000,
        },
        type: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        text() {
            return this.message;
        },
        show() {
            return this.value;
        },
        success_error() {
            return this.type ? 'success' : 'error';
        },
    },
    watch: {
        value(val) {
            if (val) {
                this.close();
            }
        },
    },
    methods: {
        close() {
            setTimeout(() => {
                this.$emit('input', false);
            }, this.timeout);
        },
    },
};
</script>

<style lang="scss">
.snackbar {
    min-width: 250px;
    margin-left: -125px;
    text-align: center;
    border-radius: 2px;
    padding: 16px;
    position: fixed;
    z-index: 1000;
    left: 50%;
    bottom: 30px;
    font-size: 17px;
}
.success {
    color: #0f5132;
    background-color: #d1e7dd;
    border-color: #badbcc;
}

.error {
    color: #842029;
    background-color: #f8d7da;
    border-color: #f5c2c7;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
