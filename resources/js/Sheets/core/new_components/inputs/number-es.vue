<template>
    <input-group
        :character="'№'"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"

        v-if="show_field"
    >
        <input
            type="text"
            :id="id"
            class="form-control number-to-right"
            aria-label="Username"
            aria-describedby="basic-addon1"
            :placeholder="defaultValue"
            :value="inputValue"
            :disabled="disabled"
            @input="onInput"
            @paste="onPaste"
        />
    </input-group>
</template>

<script>
import InputGroup from '../templates/input-group.vue';
import mixInput from '../mixs/input.vue';

export default {
    mixins: [mixInput],
    components: {
        'input-group': InputGroup,
    },
    computed: {
        inputValue() {
            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                if (val) {
                    this.$emit('input', val);
                    /**
                     * mostrar/ocultar section
                     */
                    // eslint-disable-next-line camelcase
                    const field_section_show_hide = {};
                    field_section_show_hide[this.form_field_id] = val;
                    this.$store.commit(
                        `${this.state}/FIELD_SECTION_SHOW_HIDE`,
                        field_section_show_hide
                    );
                    const value = val[this.id] * 100;
                    return this.formatNumberToES(value);
                }
            }
            const value = !Number.isNaN(this.value) ? parseFloat(this.value[this.id]) * 100 : '';
            return this.formatNumberToES(value);
        },
    },
    methods: {
        isValidNumer(num) {
            const regex = /^[1-9][0-9]*(\.[0-9]{1,5})?$/;
            return regex.test(num);
        },
        onInput(e) {
            const { value } = e.target;
            const selectorFilters = {
                key: this.input.col_name,
                value,
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, selectorFilters);

            const input = {};
            input[this.id] = value;

            this.updatedInput = input;
            this.$emit('input', input);
            /**
             * mostrar/ocultar section
             */
            // eslint-disable-next-line camelcase
            const field_section_show_hide = {};
            field_section_show_hide[this.form_field_id] = value;
            this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, field_section_show_hide);
            /**
             * mostrar/ocultar field
             */
            // eslint-disable-next-line camelcase
            const field_show_hide = {};
            field_show_hide[this.form_field_id] = value;
            this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);
        },
    },
};
</script>
<style scoped lang="scss">
.number-to-right {
    text-align: right;
}
</style>
