<template>
    <sino
        :input="input"
        :value="value"
        :state="state"
        :base_url="base_url"
        v-on:input="emitData"
    />
</template>

<script>
import sino from './sino.vue';
import mixInput from '../mixs/input.vue';

export default {
    mixins: [mixInput],
    components: {
        sino: sino,
    },
    methods: {
        emitData(data) {
            this.$emit('input', data);
        }
    }
};
</script>

<style>
</style>