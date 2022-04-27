<script>
/* eslint-disable camelcase */
import Handsontable from 'handsontable';
import { KeyValueSelect } from 'handsontable-key-value-select';
import CustomMultiSelectEditor from '../handsontableCustom/customMultiSelectEditor';
import {
    clpRenderer,
    customDateRenderer,
    customSelectRenderer,
    customMultiSelectRenderer,
} from '../handsontableCustom/renderers';
import 'handsontable-multi-select/dist/css/handsontable-multi-select.css';
import 'handsontable/dist/handsontable.full.css';

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
            contextMenu: {
                items: {
                    remove_row: {
                        name: 'Eliminar fila',
                    },
                },
            },
            beforeOnCellContextMenu(event, coords) {
                if (coords.row === -1) {
                    this.updateSettings({
                        contextMenu: false,
                    });
                } else {
                    this.updateSettings({
                        contextMenu: {
                            items: {
                                remove_row: {
                                    name: 'Eliminar fila',
                                },
                            },
                        },
                    });
                }
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
            /* afterOnCellMouseOver(event, coords, TD){
                if(TD.classList.contains('custom-hot-select')){
                    this.selectCell(coords.row, coords.col);
                    this.getActiveEditor().setValue(this.getInstance().getValue());
                    this.getActiveEditor().beginEditing();
                }
            }, */
            licenseKey: 'non-commercial-and-evaluation',
        },
        hotTableLoaded: false,
    }),
    mounted() {
        this.getEntityInfo();
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
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error);
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
                const isRequired = column.col_name === this.input.col_fk_n_1;

                if (
                    column.visible === 1 &&
                    column.show_in_edit_form > 0 &&
                    column.col_name !== this.input.col_fk_1_n
                ) {
                    if (selectorsFormats.indexOf(column.format) > -1) {
                        const options = this.entityInfo.entities_fk[column.entity_type_fk];
                        let longestOption = column.name;
                        options.forEach((option) => {
                            if (option.name.length > longestOption.length) {
                                longestOption = option.name;
                            }
                        });

                        const notRequiredHeader = `<div style="width: ${longestOption.length * 10}px; text-align: center;">${column.name}</div>`;
                        const requiredHeader = `<div style="width: ${longestOption.length * 10}px; text-align: center;">${column.name} <b style="color: red;">*</b></div>`;
                        const colHeader = isRequired && !readonly ? requiredHeader : notRequiredHeader;

                        this.handsontableSettings.colHeaders.push(colHeader);
                    } else {
                        const colHeader = isRequired && !readonly ? `${column.name} <b style="color: red;">*</b>`: column.name;
                        this.handsontableSettings.colHeaders.push(colHeader);
                    }
                    if (isRequired && !readonly) {
                        const requireField = {
                            fieldId: this.input.id,
                            name: column.col_name,
                            id: column.id,
                        }
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
                        isRequired: (isRequired && !readonly),
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
                            columnToPush.readOnly = column.readonly;
                            break;
                        case 'NUMBER':
                            columnToPush.data = column.id;
                            columnToPush.type = 'numeric';
                            columnToPush.readOnly = column.readonly;
                            break;
                        case 'TEXT':
                            columnToPush.data = column.id;
                            columnToPush.type = 'text';
                            columnToPush.readOnly = column.readonly;
                            break;
                        case 'SELECTOR':
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
                            columnToPush.editor = KeyValueSelect;
                            columnToPush.renderer = customSelectRenderer;
                            columnToPush.selectOptions = selectOptions;
                            columnToPush.readOnly = column.readonly;
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
                            columnToPush.readOnly = column.readonly;
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
                            columnToPush.readOnly = column.readonly;
                            columnToPush.isRequired = column.isRequired;
                            break;
                        case 'SiNo':
                            columnToPush.data = column.id;
                            columnToPush.type = 'checkbox';
                            columnToPush.readOnly = column.readonly;
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
                            columnToPush.readOnly = column.readonly;
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
                            columnToPush.readOnly = column.readonly;
                            break;
                        default:
                            columnToPush.data = column.id;
                            columnToPush.type = 'text';
                            columnToPush.readOnly = column.readonly;
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

            let pivots_raw = Object.values(this.pivots);

            let pivots = pivots_raw.reduce( (acc,p) => {
                let f = Object.values(p);
                acc = acc.concat(f);
                return acc;
            },[]);

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

            this.handsontableData = data;
            // En caso de que la llegada de la data fue tardía y ya el componente se renderizó
            // cargar la data mediante el método loadData.
            // Esto puede pasar si los pivotes llegan tarde
            if (this.$refs.hotTableComponent) {
                // eslint-disable-next-line no-console
                console.log('SMA 406', this.$refs.hotTableComponent.hotInstance.loadData(data));
            }
        },
        addHooks() {
            // eslint-disable-next-line func-names
            this.$nextTick(function () {
                this.$refs.hotTableComponent.hotInstance.addHook('afterChange', () => {
                    this.changeData();
                });
                this.$refs.hotTableComponent.hotInstance.addHook('afterRemoveRow', () => {
                    this.changeData();
                });
                this.$store.commit(`${this.state}/LOADING`, false);
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
                        newRow[column.id] = column.column.default_value || [];
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
            console.log('this.handsontableData', this.handsontableData);
            // eslint-disable-next-line no-console
            console.log('this.mainPivot', this.mainPivot);
            const record_id = this.$store.getters[`${this.state}/record_id`];
            // eslint-disable-next-line no-console
            console.log('record_id', record_id);
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
    },
};
</script>
<style>
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
