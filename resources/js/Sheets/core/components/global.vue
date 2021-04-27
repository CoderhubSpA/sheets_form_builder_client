<template>
    <div>
        <div class="form-group" v-if="types.includes(sheetType)">
            <label :for="name">
                {{ label }} <span v-if="required" class="text-danger">*</span>
            </label>
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
                    v-on:input="
                        $emit('sheets-input-change', $event.target.value, id)
                    "
                />
            </div>
        </div>
        <div v-else-if="sheetType == 'date' || sheetType == 'datetime'">
            <sheet-date :form="form"></sheet-date>
        </div>
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
        <div v-else-if="sheetType == 'file'">
            <sheet-document
                :form="form"
                v-on:sheets-file-change="fileChange"
            ></sheet-document>
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
import SheetsDate from "./dates";
export default {
    components: {
        "sheet-date": SheetsDate,
        "sheet-document": SheetDocument,
        "sheet-checkbox": SheetsCheckbox
    },
    mixins: [abstract],
    props: {},
    data: () => ({
        types: ["text", "email", "number", "password", "datetime-local", "url"],
        // selected: '',
        checkboxResponse: false
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
                        valueParsed = allValues[this.id].replace(",", ".");
                    } else {
                        valueParsed = allValues[this.id];
                    }
                    return valueParsed;
                } else {
                    return null;
                }
            } else {
                this.$emit('sheets-input-change', null, this.id)
                return null;
            }
        }
    },
    watch: {
        checkboxResponse(val) {
            this.$emit("input", val);
        }
    },
    methods: {
        checkboxChange(fieldId, val) {
            this.$emit("sheets-input-change", val, fieldId);
        },
        fileChange(event, fieldId) {
            this.$emit("sheets-input-file-change", event, fieldId);
        },
        onClickSelectedOption(option) {
            console.log(option);
        },
        returnData(event) {
            if (this.sheetType == "checkbox") {
            }
        }
    }
};
</script>

<style></style>
