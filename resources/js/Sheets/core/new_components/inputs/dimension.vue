<template>
    <selector-remote
        v-if="show_field"
        :input="input"
        :value="value"
        :state="state"
        :base_url="base_url"
    ></selector-remote>
</template>

<script>
import mix from '../mixs/input.vue';
import SelectorRemote from './selector-remote.vue';

export default {
    mixins: [mix],
    components: {
        'selector-remote': SelectorRemote,
    }
};
</script>
