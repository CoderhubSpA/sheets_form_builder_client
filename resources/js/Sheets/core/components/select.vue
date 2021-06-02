<template>
    <div>
        <div class="form-group">
            <label for="">
                {{ label }} <span v-if="required" class="text-danger">*</span>
            </label>
            <v-select
                :class="applyStyle"
                v-model="selected"
                :id="id"
                :options="options"
                label="name"
                :disabled="this.field.disabled"
                :multiple="multiple"
                :reduce="option => option.id"
            >
            </v-select>

            <span v-if="errorMessages" class="text-danger">
                {{ errorMessages }}
            </span>
        </div>
        <loading-message :status="loading"></loading-message>
    </div>
</template>

<script>
/**
 *@author Jorge Peraza
 */
import LoadingMessage from "./loading-message";
export default {
    name: "sheet-input-select",
    components: {
        LoadingMessage
    },
    props: {
        field: {
            type: Object,
            default: () => {},
            require: true
        },
        styles: {
            type: Array,
            default: () => []
        }
    },
    data: () => ({
        loading: false,
        options: [],
        selected: null
    }),
    computed: {
        label() {
            return this.field.label;
        },
        applyStyle() {
            return this.styles.join(" ");
        },
        id() {
            return this.field.id;
        },
        multiple() {
            return this.field.multiple;
        },
        errorMessages() {
            if (this.$attrs["error-message"]) {
                return this.$attrs["error-message"].join(" ");
            }
            return null;
        },
        required() {
            return this.field.required;
        }
    },
    watch: {
        selected(val) {
            let value = null;
            if (this.multiple) {
                value = val;
            } else {
                value = val;
            }
            const data = {
                id: this.id,
                value
            };
            this.$emit("sheets-input-select-change", data);
        }
    },
    mounted() {
        this.getOptions();
    },
    methods: {
        parseOptions(options){
            return JSON.parse(options);
        },
        getOptions() {
            if (this.field.entity_type_fk == null) {
                if (this.field.options != null) {
                    let optionsTest = this.field.options;
                    if(typeof optionsTest === 'string'){
                        optionsTest = this.parseOptions(optionsTest);
                    }
                    let optionArray = [];
                    Object.keys(optionsTest).forEach(key => {
                        let newOption = {
                            id: key,
                            name: optionsTest[key]
                        };
                        optionArray.push(newOption);
                    });
                    this.options = optionArray;
                    const allValues = Object.assign(
                        {},
                        this.$store.getters["form/fieldsvalues"]
                    );
                    if (allValues[this.id]) {
                        if (allValues[this.id].includes('["')) {
                            this.selected = allValues[this.id];
                        } else {
                            this.selected = allValues[this.id];
                        }
                    } else {
                        this.selected = null;
                    }
                }
            } else {
                this.loading = true;
                const data = this.$store.getters["form/contentinfo"];
                this.loading = false;
                this.options =
                    data.content.entities_fk[this.field.entity_type_fk];
                const allValues = Object.assign(
                    {},
                    this.$store.getters["form/fieldsvalues"]
                );
                if (allValues[this.id]) {
                    if (allValues[this.id].includes('["')) {
                        this.selected = JSON.parse(allValues[this.id]);
                    } else {
                        this.selected = allValues[this.id];
                    }
                } else {
                    this.selected = null;
                }
            }
        }
    }
};
</script>
<style></style>
