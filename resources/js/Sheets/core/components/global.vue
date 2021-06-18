<template>
    <div>
        <div class="form-group" v-if="types.includes(sheetType)">
            <label :for="name">
                {{ label }} <span v-if="required" class="text-danger">*</span>
            </label>
            <!-- INPUTS TIPO TEXT -->
            <div :class="originalType == 'CLP' ? 'input-group-prepend' : ''">
                <span
                    class="input-group-text"
                    id="basic-addon1"
                    v-if="originalType == 'CLP'"
                    >$</span
                >
                <input
                    :autocomplete="autocomplete"
                    :autofocus="autofocus"
                    :disabled="disabled"
                    :max="maximun"
                    :min="minimun"
                    :multiple="multiple"
                    :name="name"
                    :placeholder="placeholder"
                    :readonly="readonly"
                    :required="required"
                    :step="step"
                    :id="id"
                    :type="sheetType"
                    :class="applyStyles"
                    :value="value"
                    v-on:input="sheetsInputChange($event)"
                    v-on:blur="searchMap"
                    @paste="pasteInput($event)"
                />
            </div>
        </div>
        <!-- INPUTS TEXT[AREA] -->
        <div class="form-group" v-else-if="sheetType == 'textarea'">
            <label :for="name">
                {{ label }} <span v-if="required" class="text-danger">*</span>
            </label>
            <div>
                <textarea
                    :disabled="disabled"
                    :name="name"
                    :readonly="readonly"
                    :required="required"
                    :id="id"
                    :class="applyStyles"
                    v-on:input="sheetsInputChange($event)"
                    v-on:blur="searchMap"
                    cols="30"
                    rows="10"
                    :value="value"
                ></textarea>
            </div>
        </div>
        <!-- INPUTS FECHA -->
        <div v-else-if="sheetType == 'date' || sheetType == 'datetime'">
            <sheet-date :form="form"></sheet-date>
        </div>
        <!-- INPUT MAPA -->
        <div v-else-if="sheetType == 'map'">
            <sheet-map
                :form="form"
                :bus="bus"
                v-on:sheets-map-selector-change="mapSelectionChange"
            ></sheet-map>
        </div>
        <!-- INPUT CHECKBOX -->
        <div v-else-if="sheetType == 'checkbox'">
            <sheet-checkbox
                :label="label"
                :name="name"
                :id="id"
                :disabled="disabled"
                :required="required"
                v-on:sheets-checkbox-change="checkboxChange"
                v-model="checkboxResponse"
            ></sheet-checkbox>
        </div>
        <!-- INPUT FILE -->
        <div v-else-if="sheetType == 'file'">
            <sheet-document :form="form" v-on:sheets-file-change="fileChange" />
        </div>
        <!-- PREGUNTA PARA ENCUESTA -->
        <div v-else-if="sheetType == 'question'">
            <sheet-question
                :question="form"
                :valSelected="value"
                @optionSelected="option_selected"
            ></sheet-question>
        </div>
        <!-- INFO PARA ENCUESTA -->
        <div v-else-if="sheetType == 'info'">
            <sheet-info :form="form" @info="infoResponse" />
        </div>
        <small v-if="errorMessage" class="text-danger">
            {{ errorMessage }}
        </small>
    </div>
</template>

<script>
import abstract from "../mixins/mix";
import SheetDocument from "./document";
import SheetsCheckbox from "./checkbox";
import SheetsMapSelector from "./map";
import SheetsDate from "./dates";
import Question from "./question";
import Info from "./info";
export default {
    components: {
        "sheet-date": SheetsDate,
        "sheet-document": SheetDocument,
        "sheet-checkbox": SheetsCheckbox,
        "sheet-map": SheetsMapSelector,
        "sheet-question": Question,
        "sheet-info": Info
    },
    mixins: [abstract],
    props: {
        endForm: {
            type: Boolean,
            default: false
        },
        bus: {
            type: Object,
            default: () => ({})
        },
        active_section: {
            type: String,
            default: "",
            require: false
        },
        model: {
            type: Object,
            default: () => ({})
        }
    },
    data: () => ({
        types: ["text", "email", "number", "password", "datetime-local", "url"],
        // selected: '',
        checkboxResponse: false,
        selectedQuestion: null,
        value: null
    }),
    computed: {
        options() {
            return this.form.options;
        },
        item_text() {
            return this.form.option_key;
        }
    },
    watch: {
        checkboxResponse(val) {
            this.$emit("input", val);
        },
        active_section(val) {
            if (val == this.form.form_section_id) {
                this.infoResponse();
            }
        },
        model(val) {
            if (typeof val.answer === "string") {
                this.value = val.answer;
            } else {
                if (JSON.stringify(val) === JSON.stringify({})) {
                    this.validValuePoll();
                }
            }
        }
    },
    mounted() {
        this.getValue();
    },
    methods: {
        getValue() {
            if (this.originalType !== "PASSWORD") {
                const allValues = Object.assign(
                    {},
                    this.$store.getters["form/fieldsvalues"]
                );
                if (allValues[this.id]) {
                    let valueParsed = "";
                    if (
                        this.originalType === "NUMBER" ||
                        this.originalType === "CLP" ||
                        this.originalType === "PERCENTAGE"
                    ) {
                        if (isNaN(allValues[this.id])) {
                            valueParsed = allValues[this.id].replace(",", ".");
                        } else {
                            valueParsed = allValues[this.id];
                        }
                    } else {
                        valueParsed = allValues[this.id];
                    }
                    this.value = valueParsed;
                } else {
                    this.value = null;
                }
            } else {
                this.$emit("sheets-input-change", null, this.id);
                this.value = null;
            }
        },
        validValuePoll() {
            // verificar col_name para polls
            const currentValuesPoll = this.$store.getters["poll/record"];
            if (currentValuesPoll.length > 0) {
                currentValuesPoll.map(value => {
                    if (value.col_name === this.form.col_name) {
                        if (value.answer !== null) {
                            if (this.originalType === "QUESTION") {
                                const data = {
                                    id: this.form.id,
                                    alternative: null,
                                    section_owner: this.form.form_section_id,
                                    col_name: this.form.col_name
                                };
                                Object.keys(this.form.alternatives).forEach(
                                    key => {
                                        if (
                                            value.alternative.name ===
                                            this.form.alternatives[key].name
                                        ) {
                                            data.alternative = this.form.alternatives[
                                                key
                                            ];
                                        }
                                    }
                                );
                                this.option_selected(data);
                            } else {
                                this.$emit(
                                    "input",
                                    value.answer,
                                    this.form.id,
                                    this.form.col_name
                                );
                            }
                        }
                    }
                });
            }
        },
        infoResponse() {
            let data = {
                question: this.form.id,
                answer: this.form.form_field_id,
                next_section: !!this.form.next_form_section
                    ? this.form.next_form_section
                    : null
            };

            this.$emit("info-data", data);
        },
        option_selected(value) {
            this.$emit("question:selected", value);
            this.$emit("input", value);
        },
        sheetsInputChange(event) {
            if (this.originalType === "RUT") {
                const rutFormatted = this.formatRut(event.target.value);
                event.target.value = rutFormatted;
                this.$emit(
                    "sheets-input-change",
                    event.target.value,
                    this.id,
                    this.form.col_name
                );
            } else {
                this.$emit(
                    "sheets-input-change",
                    event.target.value,
                    this.id,
                    this.form.col_name
                );
            }
            this.$emit(
                "input",
                event.target.value,
                this.id,
                this.form.col_name
            );
        },
        pasteInput(event) {
            const regex = /^-?(0|[1-9]\d*)(\.\d+)?$/;
            const pasted = (
                event.clipboardData || window.clipboardData
            ).getData("text");
            if (
                this.originalType === "NUMBER" ||
                this.originalType === "CLP" ||
                this.originalType === "PERCENTAGE"
            ) {
                event.preventDefault();
                if (regex.test(pasted)) {
                    event.target.value = pasted;
                }
            }
            const changed = new Event("input");
            event.target.dispatchEvent(changed);
        },
        formatRut(rut) {
            let actual = rut.replace(/^0+/, "");
            if (actual != "" && actual.length > 1) {
                let sinPuntos = actual.replace(/\./g, "");
                let actualLimpio = sinPuntos.replace(/-/g, "");
                let inicio = actualLimpio.substring(0, actualLimpio.length - 1);
                let rutPuntos = "";
                let i = 0;
                let j = 1;
                for (i = inicio.length - 1; i >= 0; i--) {
                    let letra = inicio.charAt(i);
                    rutPuntos = letra + rutPuntos;
                    if (j % 3 == 0 && j <= inicio.length - 1) {
                        rutPuntos = "." + rutPuntos;
                    }
                    j++;
                }
                let dv = actualLimpio.substring(actualLimpio.length - 1);
                rutPuntos = rutPuntos + "-" + dv;
                return rutPuntos;
            } else {
                return actual;
            }
        },
        checkboxChange(fieldId, val) {
            this.$emit("sheets-input-change", val, fieldId);
        },
        fileChange(event, fieldId) {
            this.$emit("sheets-input-file-change", event, fieldId);
        },
        onClickSelectedOption(option) {},
        mapSelectionChange(data) {
            this.$emit("sheets-input-change", data.value, data.id);
        },
        searchMap(event) {
            this.$emit("sheets-input-search-map", event.target.value);
        },
        returnData(event) {
            if (this.sheetType == "checkbox") {
            }
        }
    }
};
</script>

<style></style>
