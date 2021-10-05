<script>
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
        selected: null,
        nested: false,
        inserted: null,
    }),
    computed: {
        selectedValue() {
            let result = null;
            const fields = this.$store.getters[`${this.state}/fields`];
            if (fields && fields.length > 0) {
                const field = fields.filter((f) => Object.keys(f)[0] === this.id)[0];

                if (field) {
                    const key = Object.keys(field)[0];
                    const search = this.multiple ? JSON.parse(field[key]) : field[key];

                    if (this.multiple && !!search) {
                        result = Object.entries(search).map((s) =>
                            this.options.find((o) => o.id === s[1])
                        );
                    } else if (!this.multiple && !!search) {
                        result = this.options.find((o) => o.id === search);
                    }
                }
            }
            return result;
        },
        selectorFilters() {
            const selectorfilters = this.$store.getters[`${this.state}/selectorfilters`];
            return selectorfilters;
        },
        options() {
            const contentInfo = this.$store.getters[`${this.state}/content_info`];
            let options = [];
            const key = this.input.col_name_fk || 'name';

            if (contentInfo) {
                const fk = this.input.entity_type_fk;

                const entities = contentInfo.content.entities_fk[fk];

                if (entities) {
                    if (this.input.col_filter_by === null && this.input.col_fk_filter === null) {
                        options = entities.map((e) => ({ id: e.id, name: e[key] }));
                    } else {
                        options = [];
                        if (
                            Object.keys(this.selectorFilters).indexOf(this.input.col_filter_by) >= 0
                        ) {
                            // eslint-disable-next-line array-callback-return,  consistent-return
                            const optionsfiltered = entities.filter(
                                (e) =>
                                    e[this.input.col_fk_filter] ===
                                    this.selectorFilters[this.input.col_filter_by]
                            );
                            options = optionsfiltered.map((e) => ({ id: e.id, name: e[key] }));
                        }
                    }
                } else {
                    const opt = this.input.options ? JSON.parse(this.input.options) : {};

                    Object.keys(opt).forEach((optKey) => {
                        options.push({ id: optKey, name: opt[optKey] });
                    });
                }
            }
            return options;
        },
        multiple() {
            const isMultiple = this.input.format === 'SELECTOR[MULTIPLE]';

            const is1xnAll = this.input.format === 'SELECTOR[1XN][ALL]';

            const isMultipleAdvanced = this.input.format === 'SELECTOR[MULTIPLE][ADVANCED]';

            return isMultiple || is1xnAll || isMultipleAdvanced;
        },
        clear() {
            return this.$store.getters[`${this.state}/clearfields`];
        },
        searchable() {
            return window.outerWidth > 1024;
        },
        /**
         * Condicion para mostrar el btn +
         * y permitir la apertura de un nuevo form
         */
        has_entity_type_permission_fk() {
            return !!this.input.entity_type_permission_fk;
        },
        entity_type_permission_fk() {
            return this.input.entity_type_permission_fk;
        },
    },
    watch: {
        selected(val) {
            if (val) {
                const dataToSelectorFilters = {
                    key: this.input.col_name,
                    value: val.id,
                };
                this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
                const data = {};

                if (this.multiple) {
                    data[this.id] = val.map((v) => v.id);
                } else {
                    data[this.id] = val.id;
                }
                this.$emit('input', data);
            } else if (val === null) {
                const dataToSelectorFilters = {
                    key: this.input.col_name,
                    value: '',
                };
                this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
                const data = {};
                data[this.id] = '';
                this.$emit('input', data);
            }
        },
        selectedValue(val) {
            this.selected = val;
        },
        clear(val) {
            if (val) {
                this.selected = null;
                this.$store.commit(`${this.state}/CLEARFIELDS`, false);
            }
        },
        options(val) {
            if (val) {
                let selectedPresent = false;
                if (this.selected && !Array.isArray(this.selected)) {
                    val.forEach((opt) => {
                        if (opt.id === this.selected.id) {
                            selectedPresent = true;
                        }
                    });
                }
                if (!selectedPresent) {
                    this.selected = null;
                }
                if (val.length > 1) {
                    if (this.inserted) {
                        const option = this.options.find((options) => options.id === this.inserted);
                        if (this.multiple) {
                            if (this.selected) this.selected.push(option);
                            else this.selected = [option];
                        } else this.selected = option;
                    }
                }
            }
        },
    },
    methods: {
        createdOption(id) {
            this.inserted = id;
            const optionToSelect = this.options.find((option) => option.id === id);

            if (this.multiple) {
                if (this.selected) this.selected.push(optionToSelect);
                else this.selected = [optionToSelect];
            } else this.selected = optionToSelect;
            this.inserted = null;
        },
    },
};
</script>
