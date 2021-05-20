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
                    @paste="pasteInput($event)"
                />
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
            <label>
                {{ name }} <span v-if="required" class="text-danger">*</span>
            </label>
            <v-select :options="optionsQuestion" v-model="selectedQuestion"> </v-select>
            <button
                :class="`btn btn-info mt-4 float-right ${endForm ? 'hide' : 'show'}`"
                v-if="can_go_next_question"
                @click="next">
                Siguiente
            </button>
        </div>
        <!-- INFO PARA ENCUESTA -->
        <div v-else-if="sheetType == 'info'">
            <div v-html="name"></div>
            <button
                :class="`btn btn-info mt-4 float-right ${endForm ? 'hide' : 'show'}`"
                @click="next">
                Siguiente
            </button>
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
export default {
    components: {
        "sheet-date": SheetsDate,
        "sheet-document": SheetDocument,
        "sheet-checkbox": SheetsCheckbox,
        "sheet-map": SheetsMapSelector
    },
    mixins: [abstract],
    props: {
        endForm: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        types: ["text", "email", "number", "password", "datetime-local", "url"],
        // selected: '',
        checkboxResponse: false,
        selectedQuestion: null,
    }),
    computed: {
        options() {
            return this.form.options;
        },
        item_text() {
            return this.form.option_key;
        },
        value() {
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
                    return valueParsed;
                } else {
                    return null;
                }
            } else {
                this.$emit("sheets-input-change", null, this.id);
                return null;
            }
        },
        optionsQuestion() {
            let options = [];

            if (this.sheetType === 'question') {
                Object.keys(this.form.options).forEach(key => {
                    options.push({
                        id: key,
                        label: this.form.options[key]
                    });
                });
            }
            return options;
        },
        /**
         *
         */
        can_go_next_question() {
            if (this.sheetType != 'info')
                return (this.required && !!this.selected) || !this.required
            else
                return true
        },
    },
    watch: {
        checkboxResponse(val) {
            this.$emit("input", val);
        },
        selectedQuestion(val) {
            if (!!val) {
                this.next();
            }
        }
    },
    methods: {
        /**
         *
         */
        next() {
            const data = {
                selected_value: this.sheetType == 'question' ? this.selectedQuestion : null,
                alternative: !!this.selectedQuestion ? this.form.alternatives[this.selectedQuestion.id] : null,
                section_owner: this.form.form_section_id
            };

            if (this.sheetType == 'question') {
                this.$emit("input", this.selectedQuestion.id);
                this.$emit(
                    "optionSelected",
                    this.form.id,
                    this.form.alternatives[this.selectedQuestion.id]
                );
            }

            this.$emit("next", data);
        },
        sheetsInputChange(event) {
            if (this.originalType === "RUT") {
                const rutFormatted = this.formatRut(event.target.value);
                event.target.value = rutFormatted;
                this.$emit("sheets-input-change", event.target.value, this.id);
            } else {
                this.$emit("sheets-input-change", event.target.value, this.id);
            }
        },
        pasteInput(event) {
            if (
                this.originalType === "NUMBER" ||
                this.originalType === "CLP" ||
                this.originalType === "PERCENTAGE"
            ) {
                event.preventDefault();
            }
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
        onClickSelectedOption(option) {
            console.log(option);
        },
        mapSelectionChange(data) {
            this.$emit("sheets-input-change", data.value, data.id);
        },
        returnData(event) {
            if (this.sheetType == "checkbox") {
            }
        }
    }
};
</script>

<style></style>
