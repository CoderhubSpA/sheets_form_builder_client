<script>
import Handsontable from 'handsontable';
import { KeyValueSelect } from 'handsontable-key-value-select';
import {
    clpRenderer,
    customDateRenderer,
    customSelectRenderer
} from '../handsontableCustom/renderers';
export default {
    props: {
        input: {
            type: Object,
            required: true
        },
        value: {
            type: Object,
            default: () => {},
            required: true
        },
        state: {
            type: String,
            required: true
        }
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
            return this.input.required == 1 ? true : false;
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
            } else {
                return false;
            }
        },
        col_name() {
            return this.input.col_name;
        }
    },
    watch: {
        handsontableData() {
            this.changeData();
        },
        errors(val) {
            const elementos = this.$el.getElementsByClassName('htErrorWaiting');
            if (val === true) {
                [].forEach.call(elementos, function(el) {
                    Handsontable.dom.addClass(el, 'htErrorConfirmed');
                });
            } else {
                [].forEach.call(elementos, function(el) {
                    Handsontable.dom.removeClass(el, 'htErrorConfirmed');
                });
            }
        }
    },
    data: () => ({
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
            hiddenColumns: {
                columns: [0, 1],
                indicators: false
            },
            contextMenu: {
                items: {
                    remove_row: {
                        name: 'Eliminar fila'
                    }
                }
            },
            beforeOnCellContextMenu(event, coords, TD) {
                if (coords.row === -1) {
                    this.updateSettings({
                        contextMenu: false
                    });
                } else {
                    this.updateSettings({
                        contextMenu: {
                            items: {
                                remove_row: {
                                    name: 'Eliminar fila'
                                }
                            }
                        }
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
            /*afterOnCellMouseOver(event, coords, TD){
                if(TD.classList.contains('custom-hot-select')){
                    this.selectCell(coords.row, coords.col);
                    this.getActiveEditor().setValue(this.getInstance().getValue());
                    this.getActiveEditor().beginEditing();
                }
            },*/
            licenseKey: 'non-commercial-and-evaluation'
        },
        hotTableLoaded: false
    }),
    mounted() {
        this.getEntityInfo();
    },
    methods: {
        getEntityInfo() {
            this.$store.commit(`${this.state}/LOADING`, true);
            axios
                .get(`/api/sheets/entity/info/${this.input.entity_type_pivot_fk}`)
                .then(response => {
                    // GUARDO LA RESPUESTA PARA FUTURO
                    this.entityInfo = response.data.content.content;
                    // ARMO LOS HEADERS DE LA TABLA
                    this.buildColHeaders();
                    // ARMO EL FORMATO DE LAS COLUMNAS
                    this.buildHotTableColumns();
                    // ARMO EL CONTENIDO DE CADA ROW
                    this.buildHotTableData();
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    this.hotTableLoaded = true;
                    // AGREGO LOS HOOKS
                    this.addHooks();
                });
        },
        buildColHeaders() {
            this.handsontableSettings.colHeaders.push(this.input.col_fk_1_n);
            this.mainPivot = this.entityInfo.columns.find(eInfo => {
                return eInfo.col_name === this.input.col_fk_1_n;
            });
            this.columnsIds = [
                { id: 'id', column: { format: 'TEXT' } },
                { id: this.mainPivot.id, column: this.mainPivot }
            ];
            this.sendingIds.push(this.mainPivot.id);
            this.entityInfo.columns.map(column => {
                if (
                    column.visible === 1 &&
                    column.show_in_edit_form > 0 &&
                    column.col_name !== this.input.col_fk_1_n
                ) {
                    this.handsontableSettings.colHeaders.push(
                        column.col_name !== this.input.col_fk_n_1
                            ? column.name
                            : `${column.name} <b style="color: red;">*</b>`
                    );
                    if (column.col_name === this.input.col_fk_n_1) {
                        this.$store.commit(`${this.state}/SMAREQUIREDFIELDS`, {
                            fieldId: this.input.id,
                            name: column.col_name,
                            id: column.id
                        });
                    }
                    const readonly = column.show_in_edit_form === 1 ? true : false;
                    const sendtobackend = column.show_in_edit_form === 2 ? true : false;
                    const isRequired = column.col_name === this.input.col_fk_n_1 ? true : false;
                    if (sendtobackend) {
                        this.sendingIds.push(column.id);
                    }
                    this.columnsIds.push({
                        id: column.id,
                        column: column,
                        readonly,
                        sendtobackend,
                        isRequired
                    });
                }
            });
        },
        buildHotTableColumns() {
            let columns = [];
            this.columnsIds.map(column => {
                let columnToPush = {};
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
                            const options = this.entityInfo.entities_fk[
                                column.column.entity_type_fk
                            ];
                            const selectOptions = [];
                            options.map(option => {
                                selectOptions.push({
                                    value: option.id,
                                    label: option.name
                                });
                            });
                            columnToPush.data = column.id;
                            columnToPush.editor = KeyValueSelect;
                            columnToPush.renderer = customSelectRenderer;
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
                                licenseKey: 'non-commercial-and-evaluation'
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
                                licenseKey: 'non-commercial-and-evaluation'
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

            const data = Object.values(this.pivots);
            data.forEach(element => {
                Object.keys(element).map(key => {
                    this.columnsIds.map(column => {
                        let val = element[key];
                        if (column.id === key && column.column.format === 'SiNo') {
                            element[key] = val === 1 ? true : false;
                        }
                        // if (column.id === key && column.column.format === 'DATE') {
                        //     let date = val.split(' ');
                        //     val = date[0];
                        // }
                    });
                });
            });

            this.handsontableData = data;
            // En caso de que la llegada de la data fue tardía y ya el componente se renderizó
            // cargar la data mediante el método loadData.
            // Esto puede pasar si los pivotes llegan tarde
            if (this.$refs['hotTableComponent'])
                console.log(this.$refs['hotTableComponent'].hotInstance.loadData(data));
        },
        addHooks() {
            this.$nextTick(function() {
                this.$refs['hotTableComponent'].hotInstance.addHook('afterChange', changes => {
                    this.changeData();
                });
                this.$refs['hotTableComponent'].hotInstance.addHook(
                    'afterRemoveRow',
                    (index, amount, physicalRows) => {
                        this.changeData();
                    }
                );
                this.$store.commit(`${this.state}/LOADING`, false);
            });
        },
        addRow() {
            const newRow = {};
            const recordid = this.$store.getters[`${this.state}/record_id`];
            if (recordid) {
                newRow[this.mainPivot.id] = recordid;
            }
            this.columnsIds.map(column => {
                if (column.column.default_value !== null && column.id !== 'id') {
                    if (column.column.format === 'SiNo') {
                        newRow[column.id] = column.column.default_value === 1 ? true : false;
                    } else {
                        newRow[column.id] = column.column.default_value;
                    }
                }
            });
            this.handsontableData.push(newRow);
        },
        logData() {
            console.log('this.handsontableData', this.handsontableData);
        },
        changeData() {
            const dataToSend = {};
            dataToSend[this.input.id] = {};
            dataToSend[this.input.id][this.input.entity_type_pivot_fk] = [];
            this.handsontableData.map(hotData => {
                let dataToPush = {};
                Object.keys(hotData).forEach(key => {
                    if (this.sendingIds.indexOf(key) >= 0) {
                        dataToPush[key] = hotData[key];
                    }
                });
                if (Object.keys(dataToPush).length > 0) {
                    dataToSend[this.input.id][this.input.entity_type_pivot_fk].push(dataToPush);
                }
            });
            this.$emit('input', dataToSend);
        },
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
};
</script>
