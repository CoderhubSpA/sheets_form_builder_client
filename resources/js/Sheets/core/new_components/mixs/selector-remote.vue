<script>
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import _ from 'lodash';

export default {
    /**
     * las props: input, state y value
     * son heredades del mix de input
     */
    data: () => ({
        /**
         * elemento seleccionado, debe terminar siendo un Array o String
         */
        selected: null,
        /**
         * Manejo del modal para formulario anidado
         */
        nested: false,
        /**
         * Receptor del id insertado en el
         * formulario anidado
         */
        inserted: '',
        /**
         * Descriptor del estado acutal del vmodel para unit test
         */
        selectorvmodelsample: null,
        /**
         * Valor por defecto
         */
        defaultOption: null,
        /**
         * Valor por defecto
         */
        optionsRemote: [],
        loading: false,
        remotecolumn: null,
        selectedOptions: [],
        options: [],
        urlrequest: '',
        searchingNow: false,
        applyDefaultValue: false
    }),
    computed: {
        multiple() {
            const isMultiple = this.input.format === 'SELECTOR[REMOTE][MULTIPLE]' || this.input.format === 'SELECTOR[REMOTE][MULTIPLE][ALL]' || this.input.format === 'DIMENSION[MULTIPLE]' || this.input.format === 'DIMENSION[MULTIPLE][NOTIN]';

            return isMultiple;
        },
        /**
         * Se encarga de mostrar el/los valor(es)
         * selecciondos
         */
        selectedValue() {
            let result = null;
            const fields = this.$store.getters[`${this.state}/fields`];
            if (fields && fields.length > 0) {
                const field = fields.filter((f) => Object.keys(f)[0] == this.id)[0];
                if (field) {
                    const key = Object.keys(field)[0];
                    const search = this.multiple ? JSON.parse(field[key]) : field[key];

                    if (this.options.length === 0) {
                        this.getOptions();
                    }

                    if (this.multiple && !!search) {
                        result = Object.entries(search).map((s) =>
                            this.options.find((o) => {
                                return o.id == s[1]
                            })
                        );

                        if (result.length === 0) {
                            result = this.options.filter((o) => {
                                return o.id == search
                            });
                        }
                    } else if (!this.multiple && !!search) {
                        result = this.options.find((o) => o.id == search);
                    }
                }
            }
            return result;
        },
        /**
         * receptor de se;al para el limpiado del campo
         */
        clear() {
            return this.$store.getters[`${this.state}/clearfields`];
        },
        entity_type_permission_fk() {
            return this.input.entity_type_permission_fk;
        },
        form_field_id() {
            return this.input.form_field_id;
        },
        active_filter() {
            return this.$store.getters[`${this.state}/active_filter`];
        },
        error_messages() {
            const errors = this.$store.getters[`${this.state}/errors_fields`];
            let result = '';

            if (errors) {
                result = errors[this.input.id];
            }

            return result;
        },
         selectorFilters() {
            const selectorfilters = this.$store.getters[`${this.state}/selectorfilters`];
            return selectorfilters;
        },
        optionsByColFilter() {
            const contentInfo = this.$store.getters[`${this.state}/content_info`];
            const key = this.input.col_name_fk || 'name';
            let options = [];

            this.selected = null;

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
                            if (this.selectorFilters[this.input.col_filter_by]) {
                                // eslint-disable-next-line array-callback-return,  consistent-return
                                const optionsfiltered = entities.filter(
                                    (e) =>
                                        e[this.input.col_fk_filter] ==
                                        this.selectorFilters[this.input.col_filter_by].toString()
                                );
                                options = optionsfiltered.map((e) => ({ id: e.id, name: e[key] }));
                            }
                        }
                    }
                } else {
                    const opt = this.input.options ? JSON.parse(this.input.options) : {};

                    Object.keys(opt).forEach((optKey) => {
                        options.push({ id: optKey, name: opt[optKey] });
                    });
                }
            }

            if(options.length > 0 && this.input.assign_default_value == 1 && !this.applyDefaultValue) {
                this.applyDefaultValue = true;
                this.setDefaultValue(options);
            }

            return options;
        }
    },
    watch: {
        optionsByColFilter(options) {
            if(options.length > 0){
                this.setSelectedFromOptions(options)
            }
        },
        options(options) {
            if(options.length > 0) {
                this.setSelectedFromOptions(options)
            }
        },
        optionsRemote(options) {
            if (options.length > 0) {
                this.setSelectedFromOptions(options)
            }
        },

        /**
         * cuando una opcion es seleccionada
         * emite un @input para completar el vmodel
         * entregando un objeto con la estructura lista
         * para ser enviado al server
         */
        selected(val) {
            this.setSelectedValue(val)
        },
        /**
         * Observador para selectedValue
         */
        selectedValue: {
            /**
             * Manejo del observador
             */
            // eslint-disable-next-line func-names, object-shorthand
            handler: function (val) {
                if (val) this.selected = val;
            },
            /**
             * Examina los cambios de manera profunda,
             * de esa manera observa al obj y a sus hijos
             */
            deep: true,
            immediate: true,
        },
        clear(val) {
            if (val) {
                this.selected = null;

                this.$nextTick(() => {
                    this.$store.commit(`${this.state}/CLEARFIELDS`, false);
                });
            }
        },
        options(val) {
            if (val) {
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
        urlrequest(val) {
            this.getNewOptions(val);
        },
    },
    mounted() {
        this.cleanReadOnly();
    },
    methods: {
        setSelectedFromOptions(options) {
            const fields = this.$store.getters[`${this.state}/fields`];
            const optionId = fields.find(field => field[this.id] !== undefined)?.[this.id];

            if (!this.selected && optionId) {
                this.selected = options.find(option => option.id === optionId);
            }
        },
        getOptions() {
            this.loading = true;

            const contentInfo = this.$store.getters[`${this.state}/content_info`];
            const key = this.input.col_name_fk || 'name';
            let options = [];

            if (contentInfo) {
                const column = contentInfo.content.columns.find((col) => col.id === this.input.id);
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.remotecolumn = column;
                const type = this.input.format === 'SELECTOR[REMOTE][MULTIPLE]' || this.input.format === 'SELECTOR[REMOTE][MULTIPLE][ALL]' ? 'IN' : 'EQUAL';
                let selectedValue = '';
                 if (this.selected && typeof this.selected === 'object') {
                    if (!this.multiple) {
                        selectedValue = this.selected?.id || '';
                    } else {
                        selectedValue = this.selected.length > 0 ? this.selected.map((v) => v.id) : '';
                    }
                }
                const filter = {
                    column,
                    id: `external-filter-${column.id}`,
                    order: 1,
                    search: selectedValue,
                    type,
                    remote: true
                };
                this.$store.commit(`${this.state}/ACTIVE_FILTERS`, filter);
                this.$store.commit(`${this.state}/SELECTOR_REMOTE_FILTER`, filter);
                const fk = this.input.entity_type_fk;
                const entities = contentInfo.content.entities_fk[fk];
                if (entities) {
                    options = entities.map((e) => ({ id: e.id, name: e[key], order: e.order ? e.order : null }));
                } else {
                    const opt = this.input.options ? JSON.parse(this.input.options) : {};
                    Object.keys(opt).forEach((objKey) => {
                        options.push({ id: objKey, name: opt[objKey], order: opt[objKey] ? opt[objKey] : null});
                    });
                }
                if (this.input.default_value) {
                    options.forEach((opt) => {
                        if (this.input.default_value == opt.id) {
                            this.defaultOption = opt.name;
                        }
                    });
                }
            }

            options.sort((a, b) => {
                if (a.order > b.order) {
                    return 1;
                }
                if (b.order > a.order) {
                    return -1;
                }
                return 0;
            });

            this.options = options;

            this.setUrlrequest();

            this.loading = false;

            return options;
        },

        deselectedSingleOption(event) {
            if (!event) {
                this.getOptions();

                this.$emit('input', {});
            }
        },

        deselectedMultipleOption() {
            this.getOptions();

            this.$emit('input', {});
        },

        async setUrlrequest() {
            let url = '';

            const urlRequestFromStore = await this.$store.getters[`${this.state}/url_selector_remote`];
            const contentInfo = await this.$store.getters[`${this.state}/content_info`];

            if (contentInfo) {
                if (this.input.options === null && this.input.entity_type_fk === null) {
                    const column = contentInfo.content.columns.find(
                        (col) => col.id === this.input.id
                    );
                    url = urlRequestFromStore[column.id];
                }
            }

            this.urlrequest = url;

            return url;
        },

        cleanReadOnly() {
            const searchInputs = document.getElementsByClassName('vs__search');
            for (const item of searchInputs) {
                item.removeAttribute('readonly');
            }
        },
        createdOption(id) {
            const optionToSelect = this.options.find((option) => option.id === id);
            if (this.multiple) {
                if (this.selected) this.selected.push(optionToSelect);
                else this.selected = [optionToSelect];
            } else this.selected = optionToSelect;
        },
        async getNewOptions(url) {
            if (url && this.input.options === null && this.input.entity_type_fk === null) {
                this.loading = true;

                let preoptions = null;

                let thisInputFormatIsDimension = this.input.format === 'DIMENSION' || this.input.format === 'DIMENSION[MULTIPLE]' || this.input.format === 'DIMENSION[MULTIPLE][NOTIN]'

                if (thisInputFormatIsDimension) {
                    const params = {
                        show_by_field_value: this.input.show_by_field_value,
                        col_name: this.input.col_name
                    }

                   preoptions = await this.$store.dispatch(`${this.state}/get_dimensions`, params);
                } else {
                    preoptions = await this.$store.dispatch(`${this.state}/get_filters`, url);
                }

                if (preoptions.success) {
                    const optionsToSet = [];

                    if (preoptions.response && preoptions.response.length > 0) {
                        preoptions.response.forEach((pre) => {
                            if (pre.id !== null && pre.text !== null) {
                                optionsToSet.push({
                                    id: pre.id,
                                    name: (thisInputFormatIsDimension) ? pre.value : pre.text,
                                });
                                if (this.input.default_value == pre.id) {
                                    this.defaultOption = (thisInputFormatIsDimension) ? pre.value : pre.text;
                                }
                            }
                        });
                    }

                    this.optionsRemote = optionsToSet;
                }
            }

            if (!this.searchingNow) this.loading = false;

            this.cleanReadOnly();
            this.searchingNow = false;
        },
        // eslint-disable-next-line prefer-arrow-callback
        filterByFuncDebounce: _.debounce(async function handleFilterBy(search) {
            this.cleanReadOnly();

            if (this.searchingNow) {
                this.$store.dispatch(`${this.state}/cancel_request`, { cancel_request: true });
                this.searchingNow = false;
            }

            this.searchingNow = true;

            if (
                this.input.options === null &&
                this.input.entity_type_fk === null &&
                search !== ''
            ) {
                const item = {
                    column: this.remotecolumn,
                    id: `external-filter-${this.remotecolumn.id}`,
                    order: 1,
                    search,
                    type: 'EQUAL',
                };
                const filters = this.active_filter.slice();
                const preitem = filters.find(
                    (it) => it.id === `external-filter-${this.remotecolumn.id}`
                );
                if (preitem) {
                    const preindex = filters.indexOf(preitem);
                    filters[preindex] = item;
                } else {
                    filters.push(item);
                }
                filters.forEach((it, key) => {
                    // eslint-disable-next-line no-param-reassign
                    it.order = key + 1;
                });
                const mainfilter = {
                    active_filters: filters,
                    searched_col: this.remotecolumn,
                };

                await this.getNewOptions(encodeURIComponent(JSON.stringify(mainfilter)));
            }
        }, 1000),
        addAllOptions() {
            if (this.optionsRemote.length > 0) {
                const allOptions = [];

                this.optionsRemote.forEach((option) => {
                    allOptions.push(option);
                })

                this.selectedOptions = allOptions;
            }
        },
        removeOption(option) {
           this.selectedOptions = this.selectedOptions.filter((opt) => {
                return opt.id !== option.id
            });
        },
        removeAllOptions() {
            if (this.optionsRemote.length > 0) {
                this.selected = [];
                this.selectedOptions = [];
            }
        },
        selectedOptonsFilter() {
              if (this.selectedOptions.length > 0) {
                const options = [];

                this.selectedOptions.forEach((option) => {
                    options.push(option);
                })

                this.selected = options;

                this.selectorClose();
            }
        },
        selectorClose() {
            const searchEl = this.$refs.SelectorRemoteMultipleAll.searchEl;

            searchEl ? searchEl.blur() : null;

            this.seleted ? this.selected : this.selectedOptions = [];
        },
        clean_filters_for_dimensions(filters, filterName, selected_value) {
            const fields_as_object = this.$store.getters[`${this.state}/fields_as_object`];

            const get_fields_by_selected_value = fields_as_object.filter((fis) => fis.show_by_field_value === selected_value);

            filters.forEach((filter) => {
                get_fields_by_selected_value.forEach((field)=> {
                    if (field.id !== filter.column.id) {
                        const contentInfo = this.$store.getters[`${this.state}/content_info`];

                        const column = contentInfo.content.columns.find(
                            (col) => col.id === field.id
                        );

                        const filter = {
                            column: column,
                            id: `external-filter-${column.id}`,
                        };

                        this.$store.commit(`${this.state}/${filterName}`, filter);
                    }
                });
            });
        },
        setDefaultValue(options) {
            if(options.length > 0 && this.input.assign_default_value == 1) {
                const optionByDefault = options.find((opt) => {
                    return opt.id === this.input.default_value;
                });

                if(optionByDefault) {
                    this.selected = optionByDefault;
                }
            }
        },
        setSelectedValue(val) {
            if (val) {
                const data = {};

                if (this.multiple) {
                    data[this.id] = val.map((v) => v.id);
                } else {
                    data[this.id] = val.id;
                }

                // eslint-disable-next-line prefer-object-spread
                this.selectorvmodelsample = Object.assign({}, data);

                const contentInfo = this.$store.getters[`${this.state}/content_info`];

                const column = contentInfo.content.columns.find((col) => col.id === this.input.id);

                let selectedValue = '';

                if (val !== null) {
                    if (!this.multiple) {
                        selectedValue = val.id;
                    } else {
                        selectedValue = val.length > 0 ? val.map((v) => v.id) : '';
                    }
                }

                let type = null;
                switch(this.input.format) {
                    case 'SELECTOR[REMOTE][MULTIPLE]':
                    case 'SELECTOR[REMOTE][MULTIPLE][ALL]':
                    case 'DIMENSION[MULTIPLE]':
                        type = "IN";//generar una copia del selector, pero con tipo NOT_IN
                        break;
                    case 'DIMENSION[MULTIPLE][NOTIN]':
                        type = "NOT_IN";//generar una copia del selector, pero con tipo NOT_IN
                        break;
                    case 'SELECTOR[METRIC]':
                        type = "METRIC";
                        break;
                    default:
                        type = "EQUAL";
                        break;
                }

                const filter = {
                    column,
                    id: `external-filter-${column.id}`,
                    order: 1,
                    search: selectedValue,
                    type,
                    remote: true
                };

                this.$store.commit(`${this.state}/ACTIVE_FILTERS`, filter);
                this.$store.commit(`${this.state}/SELECTOR_REMOTE_FILTER`, filter);

                this.$emit('input', data);
                /**
                 * mostrar/ocultar section
                 */
                // eslint-disable-next-line camelcase
                const field_section_show_hide = {};

                field_section_show_hide[this.form_field_id] = data[this.id];

                this.$store.commit(
                    `${this.state}/FIELD_SECTION_SHOW_HIDE`,
                    field_section_show_hide
                );

                // eslint-disable-next-line camelcase
                const field_show_hide = {};

                field_show_hide[this.form_field_id] = data[this.id];

                this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);

                if (type === "METRIC") {
                        const remote_selectors = this.$store.getters[`${this.state}/selector_remote_filter`];
                        const active_filters = this.$store.getters[`${this.state}/active_filter`];

                        if (remote_selectors.length > 0) {
                            this.clean_filters_for_dimensions(remote_selectors, "SELECTOR_REMOTE_FILTER", data[this.id]);
                        }

                        if (active_filters.length > 0) {
                            this.clean_filters_for_dimensions(active_filters, "ACTIVE_FILTERS", data[this.id]);
                    }
                }
            }

            if (!val) {
                const field_show_hide = {};

                field_show_hide[this.form_field_id] = null;

                this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);
            }
        }
    },
};
</script>
