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
            type="text"
            class="form-control number-to-right"
            :id="id"
            :placeholder="defaultValue"
            :value="inputValue"
            :disabled="disabled"
            @input="onInput"
            @paste="onPaste"
            lang="es"
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
                    const value = val[this.id];
                    return !Number.isNaN(value) ? this.formatNumberToES(value) : '';
                }
            }
            const value = !Number.isNaN(this.value) ? parseFloat(this.value[this.id]) : '';
            return value ? this.formatNumberToES(value) : '';
        },
    },
    methods: {
        onInput(e) {
            const { value } = e.target;

            if (this.formatNumberToES(value) === 'NaN') {
                this.value[this.id] = '';
                this.$emit('input', this.value);
                return;
            }

            this.value[this.id] = this.formatNumberToES(value);
            this.$emit('input', this.value);
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

<style></style>
