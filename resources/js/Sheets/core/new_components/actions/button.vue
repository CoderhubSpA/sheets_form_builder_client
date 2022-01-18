<template>
    <button :class="styles" @click="trigger" :disabled="disabledaction || uploading">
        <span v-if="!uploading">{{ name }}</span>
        <div class="loader" v-if="uploading"></div>
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
.loader {
    margin: 15px auto;
    font-size: 5px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    position: relative;
    text-indent: -9999em;
    -webkit-animation: load5 1.1s infinite ease;
    animation: load5 1.1s infinite ease;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
}
@-webkit-keyframes load5 {
    0%,
    100% {
        box-shadow: 0em -2.6em 0em 0em #ffffff, 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
            2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
            0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
    }
    12.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em #ffffff,
            2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
            0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
    }
    25% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em #ffffff,
            1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    37.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7),
            1.75em 1.75em 0 0em #ffffff, 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    50% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
            1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em #ffffff,
            -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    62.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
            1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7),
            -1.8em 1.8em 0 0em #ffffff, -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    75% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
            1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
            -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em #ffffff,
            -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    87.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
            1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5), -2.6em 0em 0 0em rgba(255, 255, 255, 0.7),
            -1.8em -1.8em 0 0em #ffffff;
    }
}
@keyframes load5 {
    0%,
    100% {
        box-shadow: 0em -2.6em 0em 0em #ffffff, 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
            2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
            0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
    }
    12.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em #ffffff,
            2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
            0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
            -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
    }
    25% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em #ffffff,
            1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    37.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7),
            1.75em 1.75em 0 0em #ffffff, 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    50% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
            1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em #ffffff,
            -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    62.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
            1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7),
            -1.8em 1.8em 0 0em #ffffff, -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    75% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
            1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
            -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em #ffffff,
            -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    87.5% {
        box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
            1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
            1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
            -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5), -2.6em 0em 0 0em rgba(255, 255, 255, 0.7),
            -1.8em -1.8em 0 0em #ffffff;
    }
}
</style>
