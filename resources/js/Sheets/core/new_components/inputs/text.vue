<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="this.input.link_url"
        :linkDescription="this.input.link_name"
        :tooltipInfo="this.input.description"
        v-if="show_field"
    >
        <input
            type="text"
            :id="id"
            :value="inputValue"
            :disabled="disabled"
            @input="onInput"
            class="form-control"
        />
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue';
import FormGroup from '../templates/form-group.vue';

export default {
    mixins: [mix],
    components: {
        'form-group': FormGroup,
    },
    watch: {
        inputValue(val) {
            const data = {
                col_name: this.input.col_name,
                text: val,
            };
            this.$store.commit(`${this.state}/SEARCH_MAP`, data);
        },
    },
};
</script>

<style></style>
