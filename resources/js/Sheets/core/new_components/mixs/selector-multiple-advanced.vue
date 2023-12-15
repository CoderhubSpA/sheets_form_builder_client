<script>
/* eslint-disable camelcase */
import Handsontable from 'handsontable';
import CustomMultiSelectEditor from '../handsontableCustom/customMultiSelectEditor';
import {
    clpRenderer,
    customDateRenderer,
    customSelectRenderer,
    customMultiSelectRenderer,
    customTextRenderer,
    customRenderFormButton
} from '../handsontableCustom/renderers';
import 'handsontable-multi-select/dist/css/handsontable-multi-select.css';
import 'handsontable/dist/handsontable.full.css';
import Vue from 'vue';
import FormBuilder from '../form';
import GenericModal from '../utils/GenericModal';

export default {
    props: {
        input: {
            type: Object,
            required: true,
        },
        value: {
            type: Object,
            default: () => {},
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
    },
    computed: {
        label() {
            return this.input.name;
        },
        id() {
            return this.input.id;
        },
        autocomplete() {
            return !!this.input.autocomplete;
        },
        disabled() {
            return this.input.permission === 1;
        },
        readonly() {
            return this.input.readonly;
        },
        required() {
            return this.input.required === 1;
        },
        placeholder() {
            return this.input.placeholder;
        },
        pivots() {
            const globalPivots = this.$store.getters[`${this.state}/pivots`];
            let result = null;
            if (globalPivots) {
                result = globalPivots[this.input.id];
            }
            return result;
        },
        errors() {
            const globalErrors = this.$store.getters[`${this.state}/errorssma`];
            if (globalErrors === this.input.id) {
                return true;
            }
            return false;
        },
        col_name() {
            return this.input.col_name;
        },

        show_by_field_id() {
            return this.input.show_by_field_id;
        },
        show_by_field_value() {
            return this.input.show_by_field_value;
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
        defaultOptionLabel() {
            return this.$root.$refs.radioComponent ? this.$root.$refs.radioComponent.defaultOptionLabel : null;
        }
    },
    watch: {
        handsontableData() {
            this.changeData();
        },
        errors(val) {
            const elementos = this.$el.getElementsByClassName('htErrorWaiting');
            if (val === true) {
                // eslint-disable-next-line prefer-arrow-callback, func-names
                [].forEach.call(elementos, function (el) {
                    Handsontable.dom.addClass(el, 'htErrorConfirmed');
                });
            } else {
                // eslint-disable-next-line prefer-arrow-callback, func-names
                [].forEach.call(elementos, function (el) {
                    Handsontable.dom.removeClass(el, 'htErrorConfirmed');
                });
            }
        },
        show_field() {
            this.loadingSelector = true;
            setTimeout(() => {
                this.loadingSelector = false;
                this.addRow();
                this.handsontableData.pop();
            }, 500);
        },
    },
    data: () => ({
        loadingSelector: false,
        multipleSelectorsFormats: [
            'SELECTOR[MULTIPLE]',
            'SELECTOR[1XN][ALL]',
            'SELECTOR[1XN][AVAILABLES]',
        ],
        mainPivot: {},
        columnsIds: [],
        sendingIds: ['id'],
        handsontableData: [],
        entityInfo: null,
        handsontableSettings: {
            colHeaders: ['ID'],
            columns: [],
            stretchH: 'all',
            width: '100%',
            height: '100%',
            rowHeights: 23,
            className: 'htCenter htMiddle',
            observeChanges: true,
            hiddenColumns: {
                columns: [0, 1],
                indicators: false,
            },
            afterOnCellMouseUp(event, coords, TD) {
                if (
                    TD.classList.contains('custom-hot-oneclick-trigger') &&
                    event.target.classList.contains('htAutocompleteArrow')
                ) {
                    this.getActiveEditor().beginEditing();
                    this.getActiveEditor().setValue(this.getInstance().getValue());
                }
            },
            licenseKey: 'non-commercial-and-evaluation',
        },
        hotTableLoaded: false,
        optionsFiltered: [],
        mainLabel: "",
        disableAddRow: false,
        canCreateOverPivotTable: true,
    }),
    mounted() {
        this.getEntityInfo();

        if (this.input.permission === 1) {
            this.disableAddRow = true;
        }
    },
    methods: {
        getEntityInfo() {
            this.$store.commit(`${this.state}/LOADING`, true);
            this.loadingSelector = true;
            // eslint-disable-next-line no-undef
            axios
                .get(`/api/sheets/entity/info/${this.input.entity_type_pivot_fk}`)
                .then((response) => {
                    // GUARDO LA RESPUESTA PARA FUTURO
                    this.entityInfo = response.data.content.content;
                    // ARMO LOS HEADERS DE LA TABLA
                    this.buildColHeaders();
                    // ARMO EL FORMATO DE LAS COLUMNAS
                    this.buildHotTableColumns();
                    // ARMO EL CONTENIDO DE CADA ROW
                    this.buildHotTableData();
                    this.loadingSelector = false;

                    // determinar si se tiene permisos sobre tabla pivot para crear rows
                    // content.content.entity_type_permission
                    const { entity_type_permission } = response.data.content.content;
                    const canCreateOverPivotTable = entity_type_permission.filter(
                        (ettp) => parseInt(ettp.create, 10) === 1
                    );
                    this.canCreateOverPivotTable = canCreateOverPivotTable.length > 0;
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    this.loadingSelector = false;
                })
                .finally(() => {
                    this.hotTableLoaded = true;
                    this.loadingSelector = false;
                    // AGREGO LOS HOOKS
                    this.addHooks();
                });
        },
        buildColHeaders() {
            const selectorsFormats = [
                'SELECTOR',
                'SELECTOR[MULTIPLE]',
                'SELECTOR[1XN][ALL]',
                'SELECTOR[1XN][AVAILABLES]',
            ];
            this.handsontableSettings.colHeaders.push(this.input.col_fk_1_n);
            this.mainPivot = this.entityInfo.columns.find(
                (eInfo) => eInfo.col_name === this.input.col_fk_1_n
            );
            this.columnsIds = [
                { id: 'id', column: { format: 'TEXT' } },
                { id: this.mainPivot.id, column: this.mainPivot },
            ];
            this.sendingIds.push(this.mainPivot.id);
            // eslint-disable-next-line array-callback-return
            this.entityInfo.columns.map((column) => {
                const readonly = column.show_in_edit_form === 1;
                const sendtobackend = column.show_in_edit_form === 2;
                const isRequired =
                    column.col_name === this.input.col_fk_n_1 || column.required_in_create_form;

                if (
                    column.visible === 1 &&
                    column.show_in_edit_form > 0 &&
                    column.col_name !== this.input.col_fk_1_n
                ) {
                    if (selectorsFormats.indexOf(column.format) > -1) {
                        let options_name = [];

                        if (!column.entity_type_fk) {
                            options_name.push({ id: column.id, name: column.name });
                        } else {
                            options_name = this.entityInfo.entities_fk[column.entity_type_fk]
                        }

                        let longestOption = column.name;
                        options_name.forEach((option) => {
                            if (!!option.name && option.name.length > longestOption.length) {
                                longestOption = option.name;
                            }
                        });

                        const notRequiredHeader = `<div style="width: ${
                            longestOption.length * 10
                        }px; text-align: center;">${column.name}</div>`;
                        const requiredHeader = `<div style="width: ${
                            longestOption.length * 10
                        }px; text-align: center;">${
                            column.name
                        } <b style="color: red;">*</b></div>`;
                        const colHeader =
                            isRequired && !readonly ? requiredHeader : notRequiredHeader;

                        this.handsontableSettings.colHeaders.push(colHeader);
                    } else {
                        const colHeader =
                            isRequired && !readonly
                                ? `${column.name} <b style="color: red;">*</b>`
                                : column.name;
                        this.handsontableSettings.colHeaders.push(colHeader);
                    }
                    if (isRequired && !readonly) {
                        const requireField = {
                            fieldId: this.input.id,
                            name: column.col_name,
                            id: column.id,
                        };
                        this.$store.commit(`${this.state}/SMAREQUIREDFIELDS`, requireField);
                    }
                    if (sendtobackend) {
                        this.sendingIds.push(column.id);
                    }
                    this.columnsIds.push({
                        id: column.id,
                        column,
                        readonly,
                        sendtobackend,
                        isRequired: isRequired && !readonly,
                    });
                }
            });
        },
        buildHotTableColumns() {
            const columns = [];
            // eslint-disable-next-line array-callback-return
            this.columnsIds.map((column) => {
                const columnToPush = {};
                let options;
                let selectOptions;
                if (column.column) {
                    switch (column.column.format) {
                        case 'CLP':
                            columnToPush.data = column.id;
                            columnToPush.type = 'numeric';
                            columnToPush.renderer = clpRenderer;
                            columnToPush.readOnly = column.readonly || this.input.permission === 1;
                            break;
                        case 'NUMBER':
                            columnToPush.data = column.id;
                            columnToPush.type = 'numeric';
                            columnToPush.readOnly = column.readonly || this.input.permission === 1;
                            break;
                        case 'TEXT':
                            columnToPush.data = column.id;
                            columnToPush.type = 'text';
                            columnToPush.readOnly = column.readonly || this.input.permission === 1;
                            columnToPush.isRequired = column.isRequired;
                            columnToPush.renderer = customTextRenderer;
                            break;
                        case 'SELECTOR':
                            selectOptions = [];

                            if (column.column.options) {
                                options = this.entityInfo.columns.filter((col) => {
                                    if (col.id === column.id) {
                                        return col;
                                    }
                                });

                                const optionsParse = JSON.parse(options[0].options);

                                for (const [key, value] of Object.entries(optionsParse)) {
                                    selectOptions.push({
                                        value: key,
                                        label: value
                                    });
                                }
                            } else if (column.column.col_fk_filter) {
                                selectOptions = (row) => {
                                    // Guardamos la columna por la cual se debe filtrar
                                    const colFkFilter = column.column.col_fk_filter;
                                    // Guardamos tipo de entidad foránea de donde tomar las opciones
                                    const entityTypeFk = column.column.entity_type_fk
                                    // Obtenemos la lista de entidades foráneas
                                    let entitiesFk = this.entityInfo.entities_fk[entityTypeFk];

                                    // Solo podemos filtrar si tenemos la fila actual
                                    if(row > -1) {
                                        // Buscamos el id de la columna por la cual se debe filtrar
                                        const colFkFilterId = this.entityInfo.columns.find((col) => col.col_name === colFkFilter)?.id;
                                        // Obtenemos el valor de la columna por el cual filtrar
                                        const hotDataAtRowProp = this.$refs.hotTableComponent.hotInstance.getDataAtRowProp(row, colFkFilterId);
                                        // Filtramos las entidades foráneas por solo las que tengan el valor de la columna por la cual filtrar
                                        entitiesFk = entitiesFk.filter((entity) => { return entity[colFkFilter] === hotDataAtRowProp});
                                    }

                                    // Retornamos la lista de opciones
                                    const options = entitiesFk.reduce((acc,entity) => {
                                        acc[entity.id] = entity[column.column.col_name_fk || 'name'];
                                        return acc;
                                    }, {});

                                    return options;
                                }
                            } else {
                                options = this.entityInfo.entities_fk[column.column.entity_type_fk];

                                options.map((option) => {
                                    selectOptions.push({
                                        value: option.id,
                                        label:
                                            column.column.col_name_fk === null
                                                ? option.name
                                                : option[column.column.col_name_fk],
                                    });
                                });
                            }

                            columnToPush.data = column.id;
                            columnToPush.editor = 'select';
                            columnToPush.renderer = customSelectRenderer;
                            // Se convierte el array de opciones en un objeto para
                            // que el editor de "select" de Handsontable pueda leerlo
                            if(Array.isArray(selectOptions)) {
                                selectOptions = selectOptions.reduce((acc, option) => {
                                    acc[option.value] = option.label;
                                    return acc;
                                }, {});
                            }
                            columnToPush.selectOptions = selectOptions;
                            columnToPush.readOnly = column.readonly || this.input.permission === 1;
                            columnToPush.isRequired = column.isRequired;

                            break;
                        case 'SELECTOR[MULTIPLE]':
                        case 'SELECTOR[1XN][ALL]':
                            // eslint-disable-next-line no-case-declarations
                            options = this.entityInfo.entities_fk[column.column.entity_type_fk];
                            // eslint-disable-next-line no-case-declarations
                            selectOptions = [];
                            // eslint-disable-next-line array-callback-return
                            options.map((option) => {
                                selectOptions.push({
                                    value: option.id,
                                    label:
                                        column.column.col_name_fk === null
                                            ? option.name
                                            : option[column.column.col_name_fk],
                                });
                            });
                            columnToPush.data = column.id;
                            columnToPush.editor = CustomMultiSelectEditor;
                            columnToPush.renderer = customMultiSelectRenderer;
                            columnToPush.select = {
                                config: {
                                    separator: ';',
                                    valueKey: 'value',
                                    labelKey: 'label',
                                },
                                options: selectOptions,
                                availables: false,
                                currentData: this.handsontableData,
                                columnId: column.column.id,
                            };
                            columnToPush.selectOptions = selectOptions;
                            columnToPush.readOnly = column.readonly || this.input.permission === 1;
                            columnToPush.isRequired = column.isRequired;
                            break;
                        case 'SELECTOR[1XN][AVAILABLES]':
                            // eslint-disable-next-line no-case-declarations
                            options = this.entityInfo.entities_fk[column.column.entity_type_fk];
                            // eslint-disable-next-line no-case-declarations
                            selectOptions = [];
                            // eslint-disable-next-line array-callback-return
                            options.map((option) => {
                                selectOptions.push({
                                    value: option.id,
                                    label:
                                        column.column.col_name_fk === null
                                            ? option.name
                                            : option[column.column.col_name_fk],
                                    validator: option[column.column.col_fk_1_n],
                                });
                            });
                            columnToPush.data = column.id;
                            columnToPush.editor = CustomMultiSelectEditor;
                            columnToPush.renderer = customMultiSelectRenderer;
                            columnToPush.select = {
                                config: {
                                    separator: ';',
                                    valueKey: 'value',
                                    labelKey: 'label',
                                },
                                options: selectOptions,
                                availables: true,
                                currentData: this.handsontableData,
                                columnId: column.column.id,
                            };
                            columnToPush.selectOptions = selectOptions;
                            columnToPush.readOnly = column.readonly || this.input.permission === 1;
                            columnToPush.isRequired = column.isRequired;
                            break;
                        case 'SiNo':
                            columnToPush.data = column.id;
                            columnToPush.type = 'checkbox';
                            columnToPush.readOnly = column.readonly || this.input.permission === 1;
                            break;
                        case 'DATE':
                            columnToPush.data = column.id;
                            columnToPush.type = 'date';
                            columnToPush.renderer = customDateRenderer;
                            columnToPush.dateFormat = 'YYYY-MM-DD';
                            columnToPush.correctFormat = true;
                            columnToPush.datePickerConfig = {
                                firstDay: 0,
                                showWeekNumber: true,
                                numberOfMonths: 3,
                                licenseKey: 'non-commercial-and-evaluation',
                            };
                            columnToPush.readOnly = column.readonly || this.input.permission === 1;
                            break;
                        case 'DATETIME':
                            columnToPush.data = column.id;
                            columnToPush.type = 'date';
                            columnToPush.dateFormat = 'YYYY-MM-DD HH:mm:ss';
                            columnToPush.correctFormat = true;
                            columnToPush.datePickerConfig = {
                                firstDay: 0,
                                showWeekNumber: true,
                                numberOfMonths: 3,
                                licenseKey: 'non-commercial-and-evaluation',
                            };
                            columnToPush.readOnly = column.readonly || this.input.permission === 1;
                            break;
                        case 'FORM':
                            // const colNameToId = {};
                            columnToPush.main = { ...column.column };
                            columnToPush.entityInfo = { ...this.entityInfo }
                            // columnToPush.main = this;
                            columnToPush.data = column.id;

                            columnToPush.name = column.name;
                            columnToPush.renderer = (instance, td, row, column, prop, value, cellProperties) => {
                                const main = cellProperties.main;
                                const form_id = value;
                                const result = cellProperties.entityInfo.columns.find(c => c.col_name === main.col_name_fk)
                                const col_id = !!result ? result.id : null;

                                if (!col_id) {
                                    console.warn('col_id not Found🥲')
                                }

                                const entity_id = instance.getDataAtCell(row, col_id);
                                const entities_fk = cellProperties.entityInfo.entities_fk;
                                const entity_fk = cellProperties.main.entity_type_id;
                                const entity = entities_fk[main.entity_type_fk].find(e => e.id == form_id);

                                if (entity) {
                                    Handsontable.dom.empty(td);

                                    const span = document.createElement('span')
                                    span.classList.add(['w-100','btn','btn-custom-white'])
                                    span.innerHTML = entity.name || '???';

                                    td.appendChild(span)
                                    td.classList.add('htCenter');
                                    td.classList.add('htMiddle');
                                    td.classList.add('form-trigger')
                                    td.classList.add('custom-hot-oneclick-trigger');
                                    // td.classList.add('custom-hot-select');

                                    span.addEventListener('click', () => {
                                        const container = document.getElementById('modal-container')
                                        const divModal = document.createElement('div')
                                        divModal.id = `ref-${form_id}`
                                        container.appendChild(divModal);

                                        const record_id = instance.getDataAtCell(row, col_id);

                                        const GenericModalClass = Vue.extend(GenericModal);
                                        const genericModal = new GenericModalClass({
                                            propsData: {
                                                show: true,
                                            }
                                        });
                                        genericModal.$on('show', (val) => {
                                            if (!val) {
                                                const el = document.getElementById(`ref-${value}`);
                                                el.remove();
                                            }
                                        })
                                        const FormBuilderClass = Vue.extend(FormBuilder);
                                        const store = this.$store;
                                        const formBuilderInstance = new FormBuilderClass({
                                            propsData: {
                                                entityId: form_id,
                                                record_id: record_id,
                                                // is_nested: true
                                            },
                                            store
                                        });
                                        formBuilderInstance.$mount()
                                        genericModal.$mount();
                                        genericModal.$refs.content.appendChild(formBuilderInstance.$el);
                                        divModal.appendChild(genericModal.$el)
                                    })
                                }
                                td.height = 22;
                            }
                            break;
                        default:
                            columnToPush.data = column.id;
                            columnToPush.type = 'text';
                            columnToPush.readOnly = column.readonly || this.input.permission === 1;
                            break;
                    }
                }
                columns.push(columnToPush);
            });

            this.handsontableSettings.columns = columns;
        },
        async buildHotTableData() {
            if (this.pivots === null) {
                // Si pivot es identico a null,
                // significa que aun no a llegado la data
                // desde el store.
                // Esperamos y volvemos a intentar
                await this.sleep(500);
                this.buildHotTableData();
                return;
            }
            // Si no es null pero es falsy, esta vacio. Salir.
            if (!this.pivots) return;

            const pivots_raw = Object.values(this.pivots);

            const pivots = pivots_raw.reduce((acc, p) => {
                const f = Object.values(p);
                return acc.concat(f);
            }, []);

            if (!pivots) return;

            const data = Object.values(pivots);

            data.forEach((element) => {
                // eslint-disable-next-line array-callback-return
                Object.keys(element).map((key) => {
                    // eslint-disable-next-line array-callback-return
                    this.columnsIds.map((column) => {
                        const val = element[key];

                        if (column.id === key && column.column.format === 'SiNo') {
                            // eslint-disable-next-line no-param-reassign
                            element[key] = val === 1;
                        }

                        if (
                            column.id === key &&
                            this.multipleSelectorsFormats.indexOf(column.column.format) > -1
                        ) {
                            if (val) {
                                // eslint-disable-next-line no-param-reassign
                                element[key] = JSON.parse(val).join('; ');
                            } else {
                                // eslint-disable-next-line no-param-reassign
                                element[key] = '';
                            }
                        }
                    });
                });
            });

            data.sort((a, b) => {
                if (a.order > b.order) {
                    return 1;
                }

                if (b.order > a.order) {
                    return -1;
                }

                return 0;
            });

            this.handsontableData = data;
            // En caso de que la llegada de la data fue tardía y ya el componente se renderizó
            // cargar la data mediante el método loadData.
            // Esto puede pasar si los pivotes llegan tarde
            if (this.$refs.hotTableComponent) {
                // NO REMOVER!!!.
                // Si la data llega tarde, el componente ya se renderizó y debe cargarse de esta manera.
                // Si se elimina éste método. La data no se cargará y la tabla quedará vacía.
                // Esta línea corrige error reportado en la CHNC-408.
                this.$refs.hotTableComponent.hotInstance.loadData(data)
            }
        },
        addHooks() {
            // eslint-disable-next-line func-names
            this.$nextTick(function () {
                this.$refs.hotTableComponent.hotInstance.addHook('afterChange', () => {
                    this.changeData();
                });

                this.$refs.hotTableComponent.hotInstance.addHook('afterRemoveRow', (index) => {
                    this.deleteOptionsSeleted(index);
                });

                this.$refs.hotTableComponent.hotInstance.addHook('beforeOnCellContextMenu', (event, coords) => {
                    if (coords.row === -1 || this.input.permission === 1) {
                    this.$refs.hotTableComponent.hotInstance.updateSettings({
                        contextMenu: false,
                    });
                    } else {
                        this.$refs.hotTableComponent.hotInstance.updateSettings({
                            contextMenu: {
                                items: {
                                    remove_row: {
                                        name: 'Eliminar fila',
                                    },
                                },
                            },
                        });
                    }
                });

                this.$refs.hotTableComponent.hotInstance.addHook("afterChange", (changes) => {
                    if(!changes) return;

                    const [[row, prop, oldVal, newVal]] = changes;
                    const currentRow = row;

                    if(currentRow < 0) return;

                    const findColName = this.columnsIds.find((column) => column.column.id === prop)?.column?.col_name;
                    this.columnsIds.map((column) => {
                        if (column.column.col_fk_filter === findColName) {
                            const colIndex = this.$refs.hotTableComponent.hotInstance.propToCol(column.column.id);

                            setTimeout(() => {
                                this.$refs.hotTableComponent.hotInstance.selectCell(currentRow, colIndex);

                                let activeEditor = this.$refs.hotTableComponent.hotInstance.getActiveEditor();

                                activeEditor.beginEditing();
                                activeEditor.enableFullEditMode();
                                activeEditor.finishEditing();
                            }, 100);

                        }
                    });
                });

                this.$store.commit(`${this.state}/LOADING`, false);

                this.reRenderTable();
            });
        },
        addRow() {
            const newRow = {};
            const recordid = this.$store.getters[`${this.state}/record_id`];
            if (recordid) {
                newRow[this.mainPivot.id] = recordid;
            }
            // eslint-disable-next-line array-callback-return
            this.columnsIds.map((column) => {
                if (column.column.default_value !== null && column.id !== 'id') {
                    if (column.column.format === 'SiNo') {
                        newRow[column.id] = column.column.default_value === 1;
                    } else if (column.column.format.indexOf('SELECTOR') > -1) {
                        newRow[column.id] = column.column.default_value;
                    } else {
                        newRow[column.id] = column.column.default_value;
                    }
                } else if (column.column.default_value === null) {
                    if (column.column.format.indexOf('SELECTOR') > -1) {
                        newRow[column.id] = [];
                    }
                    newRow[column.id] = '';
                }
            });
            this.handsontableData.push(newRow);
        },
        logData() {
            // eslint-disable-next-line no-console
            const record_id = this.$store.getters[`${this.state}/record_id`];
        },
        changeData() {
            const dataToSend = {};
            this.$store.commit(`${this.state}/ERRORSSMA`, null);
            dataToSend[this.input.id] = {};
            dataToSend[this.input.id][this.input.entity_type_pivot_fk] = [];

            // eslint-disable-next-line array-callback-return
            this.handsontableData.map((hotData) => {
                const dataToPush = {};
                const multipleFormats = [
                    'SELECTOR[MULTIPLE]',
                    'SELECTOR[1XN][ALL]',
                    'SELECTOR[1XN][AVAILABLES]',
                ];
                Object.keys(hotData).forEach((key) => {
                    if (this.sendingIds.indexOf(key) >= 0) {
                        const formatFinder = this.columnsIds.find(
                            (column) => column.column.id === key
                        );

                        if (formatFinder) {
                            if (multipleFormats.indexOf(formatFinder.column.format) > -1) {
                                dataToPush[key] = hotData[key].split(';');
                            } else {
                                dataToPush[key] = hotData[key];
                            }
                        } else {
                            dataToPush[key] = hotData[key];
                        }
                    }
                });
                const record_id = this.$store.getters[`${this.state}/record_id`];
                if (record_id !== null && record_id !== undefined) {
                    dataToPush[this.mainPivot.id] = record_id;
                }
                if (Object.keys(dataToPush).length > 0) {
                    dataToSend[this.input.id][this.input.entity_type_pivot_fk].push(dataToPush);
                }
            });
            this.$emit('input', dataToSend);
            this.buildHotTableColumns();
        },
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },
        reRenderTable() {
            if (this.handsontableData.length === 0) {
                setTimeout(() => {
                    this.$refs.hotTableComponent.hotInstance.render();
                }, 1);
            }
        },
        deleteOptionsSeleted(index) {
            this.optionsFiltered = this.optionsFiltered.splice(index, 1);

            this.changeData();
        }
    },
};
</script>
<style>
.form-trigger {
    cursor: pointer;
    border: 2px solid #ccc !important;
    font-weight: 600;
}
.min-height-150 {
    min-height: 350px;
}
.selector-advanced-label {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    margin-right: 0.5rem;
}
.htErrorConfirmed,
.handsontable td.htInvalid {
    border: 2px solid #ff0000 !important;
    background-color: #ffbebe !important;
}
.multi-select__choices {
    z-index: 999;
    overflow-y: visible;
}
.multi-select__choices__list--multiple .multi-select__choices__item:after {
    content: '';
    background-image: '';
    background-size: cover;
    color: white;
    height: 0px;
    width: 0px;
    display: inline-block;
    margin-left: 0px;
}
.multi-select__choices__button {
    text-indent: -9999px;
    appearance: none;
    border: 0;
    background-color: transparent;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAABFFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIEvRKAAAAW3RSTlMAAgMEBggKERMVFxgZGiQlJygsLi80Njc4OTs8P0BBQkpPU1pbXGFiY2dpbG1ub3qAg4eJjo+TmKOlp6usrbC/xMXGyMrM19jZ3eHq6+zt7vDx8vP09fb4+/z+BeiT2AAAApBJREFUeNrswYEAAAAAw6D7Ux9k1QAAAAAAAAAAAICgU2sXyFVFQRCGJ2jc3YPDfXgUh7jnucz+14FDWVc1MkzR/w6+q8cGnu6en+086bXIrhVvjyt7G2OJjrs1/1rltsU1c+Rf66xdynKU/GePLKqluv9oK8kx3vI4CXC438mBvHQPlACHH3VlOK42PVICHO6TGZBR91AJcPi9DMiEx0qAw4sMSL/HSoDDVyyj/VgJcLS6UyCFR0qAwzctpcvbgZJF4DgesJx694DkYZjjYtKy6tsPkkDHlJmaJN4RJBFyEImQg0iEHEQi5CASIQeR6DiIpGS8BeAoY0dO/VAi5CASIQeRCDmIRMhBJEIOIhFyEImQg0iEHESi5gASvDo1//85gOSASqBj2kxCIuQgEiEHkQg5iETIQSRCDiLRcRDJuo6DSAQdZgNM8tUxYyYgEXUAiagDSEQdQCLqABJRB5CIOoBE0wEkh8DR0HPYfM1BhaRDUgIckhLgkJQAh6QEOCQlwCEpAQ5JCXCISoBDX4IcFyt7chLomML78YWew2QkxCEjIQ4ZCXHISIhDRkIcMhLiUJMgR/mnQ0VCHHwXW8AhIiEOGQlxyEiIQ0ZCHDIS4pCREIeMhDjUJNAxHXACR8BBJHKOeEm8Q0ZCHDIS4pCREIeMhDjUJHN/6yCSB0mOnpMwB5a0Z3Iga8AxE3qy4EOKo+s00oElgxmQoVgHlNzKgEwFO5CklAEZinYAyc2cdyTYASSDltFqrANI3ltKPceRDiBpT1tOs1X/3sWMRTWw79/r3LesRnf8a++GLa7rWx3/0tGyJbbw/PWrZ3MW28jjF2/Wb1yxf96n9uBAAAAAAADI/7URVFVVVVVVVVVVFZ13/lBHEGxnAAAAAElFTkSuQmCC);
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    width: 5px;
    height: 8px;
    position: relative;
    top: 6px;
    left: 2px;
}
.selector-advanced-container > .handsontable {
    overflow-y: auto !important;
}
.multi-select__choices__list--multiple .multi-select__choices__item {
    display: inline-block;
    vertical-align: middle;
    border-radius: 3px;
    padding: 2px 7px;
    font-size: 12px;
    font-weight: inherit;
    margin-right: 3.75px;
    margin-bottom: 3.75px;
    background-color: hsl(212deg 100% 98%);
    border: 1px solid hsl(212deg 30% 90%);
    color: #000;
    word-break: break-all;
    box-sizing: border-box;
}
</style>
