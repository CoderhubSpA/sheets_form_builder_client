<template>
    <input-group
        :character="'%'"
        :required="required"
        :label="label"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"

        v-if="show_field"
    >
        <input
            type="number"
            aria-label="Username"
            aria-describedby="basic-addon1"
            class="form-control number-to-right"
            :id="id"
            :placeholder="defaultValue"
            :value="inputValue"
            :disabled="disabled"
            @input="onInput"
            @paste="onPaste"
        />
    </input-group>
</template>

<script>
import mix from '../mixs/input.vue';
import InputGroup from '../templates/input-group.vue';

export default {
    mixins: [mix],
    components: {
        'input-group': InputGroup,
    },
    computed: {
        inputValue() {
            if (!this.updatedInput) {
                const result = {};

                const e = {
                    target: {
                        value: null,
                    },
                };

                const fields = this.$store.getters[`${this.state}/fields`];

                if (fields && fields.length > 0) {
                    const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                    if (val) {
                        result[this.id] = val[this.id];
                        e.target.value = val[this.id];
                    }
                }

                if (result[this.id]) {
                    this.onInput(e);
                    return this.formatNumberToES(result[this.id]);
                } else if (this.input.assign_default_value == 1) {
                    return this.input.default_value;
                } else {
                    return "";
                }

            } else if(this.updatedInput[this.id] === "" && this.input.default_value) {
                this.updatedInput[this.id] = this.input.default_value;

                return "";
            } else {
                return this.formatNumberToES(this.updatedInput[this.id]);
            }
        },
    },
};
</script>

<style></style>
