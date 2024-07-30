<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        
        v-if="show_field"
    >
        *TODO*
        <input
            type="text"
            :id="id"
            :value="inputValue"
            :disabled="disabled"
            @input="onInput"
            :placeholder="defaultValue"
            class="form-control"
            maxlength="250"
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
            const dataToSelectorFilters = {
                key: this.input.col_name,
                value: val.toString(),
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
            this.$store.commit(`${this.state}/SEARCH_MAP`, data);
        },
    },
};
</script>

<style></style>
