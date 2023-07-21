<template>
    <div >
        <selector-remote
            :input="input"
            :value="value"
            :state="state"
            :base_url="base_url"
            v-on:input="emitData"
        ></selector-remote>
    </div>
</template>

<script>
import mix from '../mixs/input.vue';
import SelectorRemote from './selector-remote.vue';

export default {
    mixins: [mix],
    components: {
        'selector-remote': SelectorRemote
    },
    methods: {
        emitData(data) {
            this.$emit('input', data);
        }
    }
};
</script>
