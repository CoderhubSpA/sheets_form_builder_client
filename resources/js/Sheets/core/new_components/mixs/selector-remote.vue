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
    }),
    computed: {
        multiple() {
            const isMultiple = this.input.format === 'SELECTOR[REMOTE][MULTIPLE]';

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
                    if (this.multiple && !!search) {
                        result = Object.entries(search).map((s) =>
                            this.options.find((o) => o.id == s[1])
                        );
                    } else if (!this.multiple && !!search) {
                        result = this.options.find((o) => o.id == search);
                    }
                }
            }
            return result;
        },
        options() {
            const contentInfo = this.$store.getters[`${this.state}/content_info`];
            let options = [];
            const key = this.input.col_name_fk || 'name';
            if (contentInfo) {
                const column = contentInfo.content.columns.find((col) => col.id === this.input.id);
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.remotecolumn = column;
                const type = this.input.format === 'SELECTOR[REMOTE][MULTIPLE]' ? 'IN' : 'EQUAL';
                let selectedValue = '';
                if (this.selected !== null) {
                    if (!this.multiple) {
                        selectedValue = this.selected.id;
                    } else {
                        selectedValue =
                            this.selected.length > 0 ? this.selected.map((v) => v.id) : '';
                    }
                }
                const filter = {
                    column,
                    id: `external-filter-${column.id}`,
                    order: 1,
                    search: selectedValue,
                    type,
                    remote: this.input.options === null && this.input.entity_type_fk === null,
                };
                this.$store.commit(`${this.state}/ACTIVE_FILTERS`, filter);
                this.$store.commit(`${this.state}/SELECTOR_REMOTE_FILTER`, filter);
                const fk = this.input.entity_type_fk;
                const entities = contentInfo.content.entities_fk[fk];
                if (entities) {
                    options = entities.map((e) => ({ id: e.id, name: e[key] }));
                } else {
                    const opt = this.input.options ? JSON.parse(this.input.options) : {};
                    Object.keys(opt).forEach((objKey) => {
                        options.push({ id: objKey, name: opt[objKey] });
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
                if (a.name > b.name) {
                    return 1;
                }
                if (b.name > a.name) {
                    return -1;
                }
                return 0;
            });
            return options;
        },
        /**
         * armado del url del request
         */
        urlrequest() {
            let url = '';

            const urlRequestFromStore = this.$store.getters[`${this.state}/url_selector_remote`];
            const contentInfo = this.$store.getters[`${this.state}/content_info`];

            if (contentInfo) {
                if (this.input.options === null && this.input.entity_type_fk === null) {
                    const column = contentInfo.content.columns.find(
                        (col) => col.id === this.input.id
                    );
                    url = urlRequestFromStore[column.id];
                }
            }

            return url;
        },
        /**
         * receptor de se;al para el limpiado del campo
         */
        clear() {
            return this.$store.getters[`${this.state}/clearfields`];
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
        form_field_id() {
            return this.input.form_field_id;
        },
        show_field() {
            const fields = this.$store.getters[`${this.state}/field_show_hide`];
            // eslint-disable-next-line camelcase
            let show_field = false;
            if (this.show_by_field_id) {
                // eslint-disable-next-line eqeqeq
                if ((fields[this.show_by_field_id] || false) == this.show_by_field_value) {
                    // eslint-disable-next-line camelcase
                    show_field = true;
                }
                try {
                    // Permite validar si entre un selector multiple existe el
                    // valor que condiciona que el elemento se vea o no
                    if (
                        Array.isArray(fields[this.show_by_field_id]) &&
                        fields[this.show_by_field_id]
                            .map((d) => d.id)
                            .includes(this.show_by_field_value)
                    ) {
                        // eslint-disable-next-line camelcase, no-undef
                        show_section = true;
                    }
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.warn(e);
                }
                // eslint-disable-next-line camelcase
            } else show_field = true;
            // eslint-disable-next-line camelcase
            this.$emit('tooglefield', show_field);
            return show_field;
        },
        active_filter() {
            return this.$store.getters[`${this.state}/active_filter`];
        },
    },
    watch: {
        /**
         * cuando una opcion es seleccionada
         * emite un @input para completar el vmodel
         * entregando un objeto con la estructura lista
         * para ser enviado al server
         */
        selected(val) {
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
                const type = this.input.format === 'SELECTOR[REMOTE][MULTIPLE]' ? 'IN' : 'EQUAL';
                const filter = {
                    column,
                    id: `external-filter-${column.id}`,
                    order: 1,
                    search: selectedValue,
                    type,
                    remote: this.input.options === null && this.input.entity_type_fk === null,
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
            }
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
                // console.log(this.input.format, this.input.name, val);
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
                this.$store.commit(`${this.state}/CLEARFIELDS`, false);
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
            if (this.input.options === null && this.input.entity_type_fk === null) {
                this.loading = true;
                const preoptions = await this.$store.dispatch(`${this.state}/get_filters`, url);

                if (preoptions.success) {
                    const optionsToSet = [];
                    preoptions.response.forEach((pre) => {
                        if (pre.id !== null && pre.text !== null) {
                            optionsToSet.push({
                                id: pre.id,
                                name: pre.text,
                            });
                            if (this.input.default_value == pre.id) {
                                this.defaultOption = pre.text;
                            }
                        }
                    });
                    this.optionsRemote = optionsToSet;
                }
            }
            this.loading = false;
            this.cleanReadOnly();
        },
        // eslint-disable-next-line prefer-arrow-callback
        filterByFuncDebounce: _.debounce(async function handleFilterBy(search) {
            this.cleanReadOnly();
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
        }, 400),
    },
};
</script>
