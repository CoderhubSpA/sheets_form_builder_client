<template>
    <div :class="`${success_error} ${dialog ? 'show': ''}`" id="snackbar">
        {{ message }}
    </div>
</template>

<script>
/**
 * @author Jorge Peraza
 * @version 0.0.1
 */
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: ''
        },
        timeout: {
            type: Number,
            default: 5000
        },
        type: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        success_error() {
            return this.type ? 'success' : 'error'
        },
        dialog() {
            return this.value
        }
    },
    watch: {
        value(val) {
            if (val) {
                this.close()
            }
        }
    },
    methods: {
        close() {
            let snackbar = document.getElementById("snackbar")
            setTimeout(() => {
                snackbar.className = snackbar.className.replace("show", "")
                this.$emit('input', false)
            }, this.timeout)
        }
    }
}
</script>

<style lang="scss">
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
#snackbar {
  visibility: hidden;
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

#snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
</style>
