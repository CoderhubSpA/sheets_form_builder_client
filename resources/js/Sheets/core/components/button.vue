<template>
    <button :class="styles" @click="triggerAction">
        {{ name }}
    </button>
</template>

<script>
export default {
    props: {
        action: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        name() {
            return this.action.name
        },
        styles() {
            const styles = [
                'btn',
                'btn-block',
                this.action.cancel_process == 0 ? 'btn-warning' : 'btn-success'
            ]
            return styles.join(' ')
        }
    },
    methods: {
        triggerAction(){
            if(this.action.save_form === 1){
                this.$emit("sheets-action-trigger", true, this.action);
            }else{
                this.$emit("sheets-action-trigger", false, this.action);
            }
        }
    }
}
</script>

<style>

</style>
