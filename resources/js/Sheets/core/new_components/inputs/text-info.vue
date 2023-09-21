<template>
    <div v-html="info"></div>
</template>
<script>
import InputMix from '../mixs/input.vue';

export default {
    mixins: [InputMix],
    computed: {
        info() {
            return this.input.metadata;
        },
    },
};
</script>
