<script>
/* eslint-disable eqeqeq */
export default {
    props: {
        input: {
            type: Object,
        },
        value: {
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
    },
    data: () => ({
        pickedModel: null,
        /**
         * Valor por defecto
         */
        defaultOption: null,
    }),
    computed: {
        options() {
            let contentInfo = this.$store.getters[`${this.state}/content_info`];
            if (!contentInfo) {
                contentInfo = this.$store.getters['form/contentinfo'];
            }

            if (contentInfo) {
                const entities = contentInfo.content.entities_fk[this.input.entity_type_fk];

                if (entities) {
                    // eslint-disable-next-line arrow-body-style
                    return entities.map((e) => {
                        if (this.input.default_value == e.id) {
                            this.defaultOption = e.name;
                            this.pickedModel = this.input.default_value;
                        }
                        return { id: e.id, name: e.name };
                    });
                }
                const opt = JSON.parse(this.input.options);

                const optionsReturn = [];

                Object.keys(opt).forEach((key) => {
                    optionsReturn.push({ id: key, name: opt[key] });
                });
                if (this.input.default_value) {
                    optionsReturn.forEach((optV) => {
                        if (this.input.default_value == optV.id) {
                            this.defaultOption = optV.name;
                            this.pickedModel = this.input.default_value;
                        }
                    });
                }
                return optionsReturn;
            }
            return [];
        },
        picked() {
            const fields = this.$store.getters[`${this.state}/fields`];
            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] == this.id)[0];
                if (val !== null && val !== undefined) {
                    return val[this.id];
                }
            }
            return null;
        },
        clear() {
            return this.$store.getters[`${this.state}/clearfields`];
        },
        form_field_id() {
            return this.input.form_field_id;
        },
    },
    watch: {
        picked(val) {
            if (val !== null) {
                this.pickedModel = val;
            }
        },
        pickedModel(val) {
            if (val !== null) {
                const dataToSelectorFilters = {
                    key: this.input.col_name,
                    value: val.toString(),
                };
                this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
                const pickedValue = {};
                pickedValue[this.input.id] = val;
                this.$emit('poll-entry', val, this.input.id, this.input.col_name);
                this.$emit('input', pickedValue);
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
                // eslint-disable-next-line camelcase
                const field_show_hide = {};
                field_show_hide[this.form_field_id] = val;
                this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);
            }
        },
        clear(val) {
            const recordId = this.$store.getters[`${this.state}/record_id`];
            if (val && !recordId) {
                this.pickedModel = null;
            }
        },
    },
    mounted() {
        if (this.picked !== null && this.picked !== undefined) {
            this.pickedModel = this.picked;
        }
    },
};
</script>

<style></style>
