<script>
import { HotTable } from "@handsontable/vue";
import {
    KeyValueOptions,
    KeyValueRenderer,
    KeyValueSelect
} from "handsontable-key-value-select";
import { clpRenderer } from "../handsontableCustom/renderers";
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
        col_name() {
            return this.input.col_name;
        }
    },
    watch: {
        handsontableData(val) {
            // console.log(val);
        }
    },
    data: () => ({
        columnsIds: [],
        handsontableData: [],
        entityInfo: null,
        handsontableSettings: {
            colHeaders: ["ID"],
            columns: [],
            width: "100%",
            height: "100%",
            rowHeights: 23,
            colWidths: 250,
            className: "htCenter htMiddle",
            hiddenColumns: {
                columns: [0, 1],
                indicators: false
            },
            contextMenu: {
                items: {
                    remove_row: {
                        name: "Eliminar fila"
                    }
                }
            },
            beforeOnCellContextMenu(event, coords, TD) {
                if (coords.row === 0) {
                    this.updateSettings({
                        contextMenu: false
                    });
                } else {
                    this.updateSettings({
                        contextMenu: {
                            items: {
                                remove_row: {
                                    name: "Eliminar fila"
                                }
                            }
                        }
                    });
                }
            },
            licenseKey: "non-commercial-and-evaluation"
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
                .get(
                    `/api/sheets/entity/info/${this.input.entity_type_pivot_fk}`
                )
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
                    this.$store.commit(`${this.state}/LOADING`, false);
                    this.hotTableLoaded = true;
                });
        },
        buildColHeaders() {
            this.handsontableSettings.colHeaders.push(
                this.input.col_fk_1_n.toUpperCase()
            );
            const mainPivot = this.entityInfo.columns.find(eInfo => {
                return eInfo.col_name === this.input.col_fk_1_n;
            });
            this.columnsIds = [
                { id: "id", column: { format: "TEXT" } },
                { id: mainPivot.id, column: mainPivot }
            ];
            this.entityInfo.columns.map(column => {
                if (
                    column.visible === 1 &&
                    column.show_in_edit_form > 0 &&
                    column.col_name !== this.input.col_fk_1_n
                ) {
                    this.handsontableSettings.colHeaders.push(
                        column.name.toUpperCase()
                    );
                    this.columnsIds.push({ id: column.id, column: column });
                }
            });
            this.columnsIds.map(format => {
                console.log("formato", format.column.format);
            });
        },
        buildHotTableColumns() {
            let columns = [];
            this.columnsIds.map(column => {
                let columnToPush = {};
                if (column.column) {
                    switch (column.column.format) {
                        case "CLP":
                            columnToPush.data = column.id;
                            columnToPush.type = "numeric";
                            columnToPush.renderer = clpRenderer;
                            break;
                        case "NUMBER":
                            columnToPush.data = column.id;
                            columnToPush.type = "numeric";
                            break;
                        case "TEXT":
                            columnToPush.data = column.id;
                            columnToPush.type = "text";
                            break;
                        case "SELECTOR":
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
                            columnToPush.renderer = KeyValueRenderer;
                            columnToPush.selectOptions = selectOptions;
                            break;
                        case "SiNo":
                            columnToPush.data = column.id;
                            columnToPush.type = "checkbox";
                        case "DATE":
                            columnToPush.data = column.id;
                            columnToPush.type = "date";
                            // TO DO: CHECK FORMAT
                            columnToPush.dateFormat = 'MM/DD/YYYY',
                            columnToPush.correctFormat = true;
                            columnToPush.datePickerConfig = {
                                firstDay: 0,
                                showWeekNumber: true,
                                numberOfMonths: 3,
                                licenseKey: "non-commercial-and-evaluation"
                            };
                        // case "DATETIME":
                        //     columnToPush.data = column.id;
                        //     columnToPush.type = "checkbox";
                        default:
                            columnToPush.data = column.id;
                            columnToPush.type = "text";
                            break;
                    }
                }
                columns.push(columnToPush);
            });

            this.handsontableSettings.columns = columns;
        },
        buildHotTableData() {
            const data = Object.values(this.pivots);
            this.handsontableData = data;
        },
        addRow() {
            const newRow = {};
            this.handsontableData.push(newRow);
        },
        logData() {
            console.log(this.handsontableData);
        }
    }
};
</script>
