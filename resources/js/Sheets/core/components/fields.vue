<template>
    <div :class="getClasses()" class="SheetsFormRenderField__main-container">
        <div class="SheetsFormRenderField__container">
            <sheets-input
                v-if="
                    formField.format !== 'SELECTOR' &&
                        formField.format !== 'SELECTOR[MULTIPLE]' &&
                        formField.format !== 'SELECTOR[MULTIPLE][ADVANCED]' &&
                        formField.format !== 'DATE' &&
                        formField.format !== 'DATETIME'
                "
                :form="fieldParsed"
                :styles="fieldParsed.styles"
                :bus="bus"
                v-on:sheets-input-change="inputChange"
                v-on:sheets-input-search-map="inputSearchMap"
                v-on:sheets-input-file-change="inputFileChange"
            ></sheets-input>
            <sheets-select
                v-if="
                    formField.format === 'SELECTOR' ||
                        formField.format === 'SELECTOR[MULTIPLE]' ||
                        formField.format === 'SELECTOR[1XN][ALL]' ||
                        formField.format === 'SELECTOR[MULTIPLE][ADVANCED]'
                "
                :field="fieldParsedSelect"
                v-on:sheets-input-select-change="inputSelectChange"
            />
            <sheets-datepicker
                v-if="
                    formField.format === 'DATE' ||
                        formField.format === 'DATETIME'
                "
                :form="fieldParsedDate"
                v-on:sheets-input-change="inputChange"
            ></sheets-datepicker>
            <br/>
            <small
                class="SheetsFormRenderFields__smallDefault"
                v-if="
                    (formField.format === 'DATE' ||
                        formField.format === 'DATETIME' ||
                        formField.format === 'SELECTOR' ||
                        formField.format === 'SELECTOR[1XN][ALL]' ||
                        formField.format === 'SELECTOR[MULTIPLE]' ||
                        formField.format === 'SELECTOR[MULTIPLE][ADVANCED]') &&
                        formField.default_value
                "
                >Por Defecto: {{ formField.default_value }}
            </small>
            <!--
                <sheets-input
                v-if="formField.format !== 'SELECTOR' &&
                        formField.format !== 'SELECTOR[MULTIPLE]' &&
                        formField.format !== 'SELECTOR[MULTIPLE][ADVANCED]'"
                :form="fieldParsed"
                :styles="fieldParsed.styles"
                v-on:sheets-input-change="inputChange"
                v-on:sheets-input-file-change="inputFileChange"/>
             -->
        </div>
    </div>
</template>

<script>
import SheetInput from "./global";
import SheetSelect from "./select";
import SheetDatePicker from "./dates";
export default {
    components: {
        "sheets-input": SheetInput,
        "sheets-select": SheetSelect,
        "sheets-datepicker": SheetDatePicker
    },
    props: {
        field: {
            type: Object,
            default: () => {
                return {};
            }
        },
        value: {
            type: Object,
            default: () => {}
        },
        bus:{
            type: Object,
            default: () => {}
        }
    },
    data: () => ({
        customInputDate: null,
        inputData: null,
        selected: [],
    }),
    watch: {
        inputData(val) {
            let data = {};
            data[this.formField.form_field_id] = val;

            this.$emit("input", data);
        }
    },
    computed: {
        formField() {
            return this.field;
        },
        fieldParsed() {
            let parsed = {
                ...this.field,
                required: this.field.required === 1,
                disabled: this.formField.permission === 1,
                placeholder: this.formField.default_value
                    ? this.formField.default_value
                    : "",
                label: this.formField.name,
                name: this.formField.col_name,
                styles:
                    this.formField.format === "DOCUMENT" ||
                    this.formField.format === "DOCUMENT[IMAGE]"
                        ? ["custom-file-input"]
                        : ["form-control"]
            };
            return parsed;
        },
        fieldParsedSelect() {
            return {
                ...this.field,
                label: this.field.name,
                entity_type_id: this.field.entity_type_id,
                entity_type_fk: this.field.entity_type_fk,
                options: this.field.options,
                multiple:
                    this.field.format == "SELECTOR[MULTIPLE][ADVANCED]" ||
                    this.field.format == "SELECTOR[MULTIPLE]" ||
                    this.field.format == "SELECTOR[1XN][ALL]",
                required: this.field.required === 1,
                disabled: this.formField.permission === 1
            };
        },
        fieldParsedDate() {
            return {
                ...this.field,
                label: this.field.name,
                entity_type_id: this.field.entity_type_id,
                entity_type_fk: this.field.entity_type_fk,
                options: this.field.options,
                format: this.field.format,
                required: this.field.required
            };
        }
    },
    mounted() {},
    methods: {
        getClasses() {
            return `col-sm-${this.formField.col_sm} col-md-${this.formField.col_md} col-xl-${this.formField.col_xl}`;
        },
        applyStyle() {
            return this.styles.join(" ");
        },
        inputSearchMap(value){
            const dataToSearch = {
                value,
                col_name: this.formField.col_name
            }
            this.searchMap(dataToSearch);
        },
        inputChange(value, fieldId) {
            const data = {
                key: fieldId,
                value
            };
            if (this.formField.permission === 2) {
                this.$store.commit("form/FIELDSVALUES", data);
            }
        },
        inputFileChange(event, fieldId) {
            const data = {
                id: fieldId,
                file: event.target.files[0]
            };
            if (this.formField.permission === 2) {
                this.$store.commit("form/FILES", data);
                this.$store.commit("form/PUSHFILES", data);
            }
        },
        inputSelectChange(data) {
            const field = {
                key: data.id,
                value: data.value
            };
            if (this.formField.permission === 2) {
                this.$store.commit("form/FIELDSVALUES", field);
            }
        },
        searchMap(data){
            this.$emit("sheets-search-map-section", data);
        }
    }
};
</script>

<style>
.SheetsFormRenderField__main-container {
    padding: 15px;
}
.SheetsFormRenderField__container {
    border: 1px solid #c1c1c1;
    margin-bottom: 10px;
    border-radius: 15px;
    padding: 15px;
}
.vs__dropdown-toggle {
    background-color: white;
}
.mx-datepicker {
    width: 100%;
}
.SheetsFormRenderFields__smallDefault {
    position: relative;
    top: -10px;
    right: -1px;
}
</style>
