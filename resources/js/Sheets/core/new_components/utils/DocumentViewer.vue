<template>
    <div class="sidebar" ref="sidebar">
        <div>
            <div class="sidebar-header">
                <h3>
                    {{ filename }}
                </h3>
                <span class="close" @click="close">&times;</span>
            </div>
            <div class="sidebar-body">
                <document-visualizer :src="src" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        filename: {
            default: ''
        },
        src: {
            type: String,
            require: true
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value(val) {
            if (val) {
                const sidebar = this.$refs.sidebar;
                sidebar.style.display = 'block'
            }
        }
    },
    methods: {
        close() {
            const sidebar = this.$refs.sidebar;
            sidebar.style.display = 'none'

            window.postMessage('message', {
                type: 'shrink_modal_container',
                params: [
                    {
                        close: true
                    }
                ],
            })
            this.$emit('input', false)
        }
    }
};
</script>
<style lang="scss">

.sidebar {
    height: 100%;
    width: 50%;
    position: fixed;
    right: 0;
    top: 0;
    padding-top: 40px;
    background-color: #fff;
    animation-name: showSidebar;
    animation-duration: 0.5s;
    box-shadow: -6px 0px 18px -7px rgba(0,0,0,0.75);
    -webkit-box-shadow: -6px 0px 18px -7px rgba(0,0,0,0.75);
    -moz-box-shadow: -6px 0px 18px -7px rgba(0,0,0,0.75);

    .sidebar-header {
        display: flex;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: space-between;
    }
}

@keyframes showSidebar {
    0% {
        width: 0%;
    }
    100% {
        width: 50%;
    }
}

.sidebar-body {
    margin: auto;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
