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
                const field = fields.filter((f) => Object.keys(f)[0] == this.id)[0];
                if (field) {
                    const key = Object.keys(field)[0];

                    const search = this.multiple ? JSON.parse(field[key]) : field[key];

                    if (this.multiple && !!search) {
                        result = Object.entries(search).map((s) =>
                            this.options.find((o) => o.id == s[1])
                        );
                    } else if ((!this.multiple && !!search) || (!this.multiple && search === 0)) {
                        result = this.options.find((o) => o.id == search);
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
                                        e[this.input.col_fk_filter] ===
                                        this.selectorFilters[this.input.col_filter_by].toString()
                                );
                                options = optionsfiltered.map((e) => ({ id: e.id, name: e[key] }));
                            }
                        }
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
         * determinar si es un selector multiple o no
         */
        multiple() {
            const isMultiple = this.input.format === 'SELECTOR[MULTIPLE]';

            const is1xnAll = this.input.format === 'SELECTOR[1XN][ALL]';

            const isMultipleAdvanced = this.input.format === 'SELECTOR[MULTIPLE][ADVANCED]';

            return isMultiple || is1xnAll || isMultipleAdvanced;
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
    },
    watch: {
        /**
         * cuando una opcion es seleccionada
         * emite un @input para completar el vmodel
         * entregando un objeto con la estructura lista
         * para ser enviado al server
         */
        selected(val) {
            const data = {};
            if (this.multiple) {
                data[this.id] = [];
            } else {
                data[this.id] = null;
            }
            if (val) {
                if (this.multiple) {
                    data[this.id] = val.map((v) => v.id);
                } else {
                    data[this.id] = val.id;
                }
            }
            // eslint-disable-next-line prefer-object-spread
            this.selectorvmodelsample = Object.assign({}, data);
            this.$emit('input', data);
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
    },
    mounted() {
        // console.log('selector', this.input);
    },
    methods: {
        createdOption(id) {
            const optionToSelect = this.options.find((option) => option.id === id);
            // eslint-disable-next-line no-console
            console.log(this.selected, optionToSelect);
            if (this.multiple) {
                if (this.selected) this.selected.push(optionToSelect);
                else this.selected = [optionToSelect];
            } else this.selected = optionToSelect;
        },
    },
};
</script>
