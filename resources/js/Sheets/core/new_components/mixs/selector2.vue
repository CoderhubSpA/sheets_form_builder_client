<script>
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
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
        optionsFiltered: [],
        openNested: false,
        recordId: '',
        has_permissions_for_create: false,
        deselectedOptions: []
    }),
    computed: {
        /**
         * Se encarga de mostrar el/los valor(es)
         * selecciondos
         */
        selectedValue() {
            let result = null;

            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                result = this.multiple ? [] : null;

                const field = fields.filter((f) => Object.keys(f)[0] == this.id)[0];

                if (field) {
                    const key = Object.keys(field)[0];

                    const search = this.multiple ? JSON.parse(field[key]) : field[key];

                    if (this.multiple && !!search) {
                        if (this.options.length !== 0) {
                            result = Object.entries(search).map((s) =>
                                this.options.find((o) => o.id == s[1])
                            );
                        }
                    } else if ((!this.multiple && !!search) || (!this.multiple && search === 0)) {
                        if (this.options.length !== 0) {
                            result = this.options.find((o) => o.id == search);
                        }
                    }
                }
            }

            return result;
        },
        selectorFilters() {
            const selectorfilters = this.$store.getters[`${this.state}/selectorfilters`];
            return selectorfilters;
        },
        /**
         * armado de las opciones para los selectores
         */
        options() {
            const contentInfo = this.$store.getters[`${this.state}/content_info`];
            let options = [];
            const key = this.input.col_name_fk || 'name';

            if (contentInfo) {
                const fk = this.input.entity_type_fk;

                const entities = contentInfo.content.entities_fk[fk];

                if (entities) {
                    if (entities.length > 0 && entities[0].image_src) {
                        options = entities.map((e) => ({
                            id: e.id,
                            name: e.name,
                            image: this.base_url + e.image_src,
                            selected: false,
                            order: e.order,
                        }));
                    } else {
                        options = entities.map((e) => ({ id: e.id, name: e[key], order: e.order }));
                    }
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
                if (a.order > b.order) {
                    return 1;
                }
                if (b.order > a.order) {
                    return -1;
                }
                return 0;
            });

            return options;
        },
        /**
         * determinar si es un selector multiple o no
         */
        multiple() {
            const isMultiple = this.input.format === 'SELECTOR[MULTIPLE]';

            const isMultipleImageList = this.input.format === 'SELECTOR[IMAGELIST]';

            const is1xnAll = this.input.format === 'SELECTOR[1XN][ALL]';

            const isMultipleAdvanced = this.input.format === 'SELECTOR[MULTIPLE][ADVANCED]';

            return isMultiple || isMultipleImageList || is1xnAll || isMultipleAdvanced;
        },
        /**
         * receptor de se;al para el limpiado del campo
         */
        clear() {
            return this.$store.getters[`${this.state}/clearfields`];
        },
        /**
         * evita el buscado de opciones
         * para determinadas resoluciones
         */
        searchable() {
            return window.outerWidth > 1024;
        },
        /**
         * Condicion para mostrar el btn +
         * y permitir la apertura de un nuevo form
         */
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
        error_messages() {
            const errors = this.$store.getters[`${this.state}/errors_fields`];
            let result = '';

            if (errors) {
                result = errors[this.input.id];
            }

            return result;
        },
        entity_permissions() {
            return this.$store.getters[`${this.state}/entity_permissions`];
        }
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
                    data[this.id] = [];
                } else {
                    data[this.id] = null;
                }

                if (val !== undefined && val !== null) {
                    if (this.multiple) {
                        if (val[0] !== undefined) {
                            data[this.id] = val.map((v) => v.id);
                        }
                    } else {
                        data[this.id] = val.id;
                    }
                }
                // eslint-disable-next-line prefer-object-spread
                this.selectorvmodelsample = Object.assign({}, data);

                const contentInfo = this.$store.getters[`${this.state}/content_info`];

                if (contentInfo) {
                    const column = contentInfo.content.columns.find(
                        (col) => col.id === this.input.id
                    );

                    if (Array.isArray(this.selected) && this.selected.length > 0) {
                        if (this.input.format === 'SELECTOR[IMAGELIST]') {
                            const type = 'IN';
                            let selectedValue = '';

                            if (this.selected !== null) {
                                selectedValue =
                                    this.selected.length > 0 ? this.selected.map((v) => v.id) : '';
                            }

                            const filter = {
                                column,
                                id: `external-filter-${column.id}`,
                                order: 1,
                                search: selectedValue,
                                type,
                                remote:
                                    this.input.options === null && this.input.entity_type_fk === null,
                            };

                            this.$store.commit(`${this.state}/ACTIVE_FILTERS`, filter);
                            this.$store.commit(`${this.state}/SELECTOR_REMOTE_FILTER`, filter);
                        }
                    } else if (Array.isArray(this.selected) && this.selected.length === 0) {
                        const column = contentInfo.content.columns.find(
                            (col) => col.id === this.input.id
                        );

                        const filter = {
                            column,
                            id: `external-filter-${column.id}`,
                        };

                        this.$store.commit(`${this.state}/ACTIVE_FILTERS`, filter);
                        this.$store.commit(`${this.state}/SELECTOR_REMOTE_FILTER`, filter);
                    } else {
                        const type = 'EQUAL';

                        const filter = {
                            column,
                            id: `external-filter-${column.id}`,
                            order: 1,
                            search: this.selected.id,
                            type,
                            remote: this.input.options === null && this.input.entity_type_fk === null,
                        };

                        this.$store.commit(`${this.state}/ACTIVE_FILTERS`, filter);
                        this.$store.commit(`${this.state}/SELECTOR_REMOTE_FILTER`, filter);
                    }
                }

                const dataToSelectorFilters = {
                    key: this.input.col_name,
                    value: data[this.id],
                };

                this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);

                /**
                 * mostrar/ocultar section
                 */
                // eslint-disable-next-line camelcase
                const field_section_show_hide = {};

                field_section_show_hide[this.form_field_id] = data[this.id];

                this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, field_section_show_hide);

                // eslint-disable-next-line camelcase
                const field_show_hide = {};

                field_show_hide[this.form_field_id] = data[this.id];

                this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);

                this.$emit('input', data);
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
                if (!val) return;

                if (!this.multiple) {
                    this.selected = val;
                }

                if (this.multiple && Array.isArray(val) && val.length > 0) {
                    if(this.deselectedOptions.length > 0) {
                        val.forEach((value) => {
                            let existOption = false;

                            this.deselectedOptions.forEach((option) => {
                                if (value.id === option.id) {
                                    existOption = true
                                }
                            })

                            if (!existOption) this.selected = val;
                        })

                    } else {
                        this.selected = val
                    }
                }
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

                if (this.input.format === 'SELECTOR[IMAGELIST]') {
                    this.selected = [];
                    this.optionSelectedAllRemove();
                }

                this.$nextTick(() => {
                    this.$store.commit(`${this.state}/CLEARFIELDS`, false);
                });
            }
        },
        options(val) {
            if (val.length > 1) {
                if (this.inserted) {
                    const option = this.options.find((options) => options.id === this.inserted);
                    if (this.multiple) {
                        if (this.selected) this.selected.push(option);
                        else this.selected = [option];
                    } else this.selected = option;
                }
            }
        },
        selectorFilters(val) {
            if (val && this.input.col_filter_by !== null && this.input.col_fk_filter !== null) {
                const contentInfo = this.$store.getters[`${this.state}/content_info`];
                let optionsFil = [];
                const key = this.input.col_name_fk || 'name';
                if (contentInfo) {
                    const fk = this.input.entity_type_fk;

                    const entities = contentInfo.content.entities_fk[fk];
                    if (
                        Object.keys(this.selectorFilters).indexOf(this.input.col_filter_by) >= 0 &&
                        this.selectorFilters[this.input.col_filter_by] !== undefined &&
                        this.selectorFilters[this.input.col_filter_by] !== null
                    ) {
                        const optionsfiltered = entities.filter(
                            (e) =>
                                e[this.input.col_fk_filter] ===
                                this.selectorFilters[this.input.col_filter_by].toString()
                        );
                        optionsFil = optionsfiltered.map((e) => ({ id: e.id, name: e[key] }));
                    }
                }
                this.optionsFiltered = optionsFil;
            }
        },
        entity_permissions(val) {
            if (val) {
                val.forEach((permission) => {
                    if (permission.create == "1" && permission.entity_type_id == this.input.entity_type_permission_fk) {
                        this.has_permissions_for_create = true;
                    }
                })
            }
        }
    },
    mounted() {
        this.getPermissionsForCreate();
    },
    methods: {
        createdOption(id) {
            const optionToSelect = this.options.find((option) => option.id === id);

            if (this.multiple) {
                const ifExistOption = this.selected.find((option) => option.id === id);

                if (ifExistOption)
                    this.selected = this.selected.filter((option) => option.id !== id);

                if (this.selected) this.selected.push(optionToSelect);
                else this.selected = [optionToSelect];
            } else this.selected = optionToSelect;

            this.recordId = '';
        },

        openNestedForEdit(id) {
            if (this.$refs['ref-' + this.id].$attrs.id === this.id) {
               this.$refs['ref-' + this.id].searchEl.blur();
            }

            this.recordId = id;
            this.openNested = !this.openNested;
        },
        async getPermissionsForCreate () {
            if (this.input.entity_type_permission_fk) {
               await this.$store.dispatch(`${this.state}/get_entity_permissions`, this.input.entity_type_permission_fk);
            }
        },
        deselected(val) {
            this.deselectedOptions.push(val);
        },
    },
};
</script>
