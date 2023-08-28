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
            class="form-control"
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
                    return val[this.id] * 100;
                }
            }
            return this.value ? parseFloat(this.value[this.id]) * 100 : '';
        },
    },
    methods: {
        onInput(e) {
            const data = {};
            if (Number.isNaN(parseFloat(e.target.value))) {
                data[this.id] = '';
            } else {
                data[this.id] = parseFloat(e.target.value) / 100;
            }
            this.vmodelcurrentvalue = data;
            const dataToSelectorFilters = {
                key: this.input.col_name,
                value: data[this.id].toString(),
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
            this.$emit('input', data);
        },
    },
};
</script>

<style></style>
