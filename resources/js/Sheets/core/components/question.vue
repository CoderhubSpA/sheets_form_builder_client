<template>
    <div :class="getClasses()">
        <label>
            {{ label }} <span v-if="required" class="question-required">*</span>
        </label>
        <v-select
            v-if="options.length > 0"
            :options="options"
            v-model="selected"
            :disabled="isResponse"
            :multiple="isResponse"
            :searchable="searchable"
        ></v-select>
        <p v-if="options.length === 0"><b>Esta lista está vacía</b></p>
    </div>
</template>

<script>
import abstract from "../mixins/mix";
export default {
    mixins: [abstract],
    props: {
        question: {
            type: Object,
            default: () => {},
            require: true
        },
        endForm: {
            type: Boolean,
            default: false
        },
        errors: {
            type: Array,
            default: () => []
        },
        valSelected: {
            type: String,
            default: null
        },
        optionsResponse: {
            type: Array,
            default: null,
            require: false
        }
    },
    data: () => ({
        selected: null,
        automatic: false
    }),
    computed: {
        label() {
            return this.question.name;
        },
        sm() {
            return this.question.col_sm;
        },
        md() {
            return this.question.col_md;
        },
        xl() {
            return this.question.col_xl;
        },
        options() {
            let options = [];
            let rOptions = [];
            if (this.question.format === "QUESTION") {
                if (this.question.options) {
                    Object.keys(this.question.options).forEach(key => {
                        options.push({
                            id: key,
                            label: this.question.options[key]
                        });
                    });
                }

                if (this.selected !== null) {
                    const validationSelected = options.find(option => {
                        return option.id === this.selected.id;
                    });
                    if (!validationSelected) {
                        this.selected = null;
                    }
                }
            } else {
                if (this.optionsResponse) {
                    options = [...this.optionsResponse];
                    this.selected = [...this.optionsResponse];
                    
                    if (this.optionsResponse.length > 1) {
                        this.selected = this.optionsResponse.filter((f) => {
                            return f.id !== "e00" && f.id !== "XX"
                        });
                    }
                    
                    console.log("🚀 ~ file: question.vue ~ line 94 ~ this.selected=this.optionsResponse.filter ~ this.selected", this.selected)
                }
            }
            options.sort((a, b) => {
                return a.label > b.label ? 1 : -1;
            });
            rOptions = [...options];
            return rOptions;
        },
        searchable() {
            return window.outerWidth > 1024;
        },
        required() {
            return this.question.required == 1;
        },
        isResponse() {
            return this.question.format === "RESPONSE" ? true : false;
        }
    },
    watch: {
        selected(val) {
            if (this.question.format === "QUESTION") {
                if (!!val) {
                    const data = {
                        id: this.question.id,
                        format: this.question.format,
                        selected_value: !!val ? val.label : "N/A",
                        alternative: !!val
                            ? this.question.alternatives[val.id]
                            : null,
                        section_owner: this.question.form_section_id,
                        form_field_id: this.question.form_field_id,
                        col_name: this.question.col_name,
                        exam: !!val
                            ? this.question.alternatives[val.id].products
                            : null,
                        automatic: this.automatic === true ? true : null
                    };
                    this.optionSelected(data);
                }
            }
            this.automatic = false;
        },
        valSelected(val) {
            if (val) {
                this.automatic = true;
                const validationSelected = this.options.find(opt => {
                    return opt.id === val;
                });
                if (this.selected !== null) {
                    if (this.selected.id !== validationSelected.id) {
                        this.selected = validationSelected;
                    }
                } else {
                    this.selected = validationSelected;
                }
            }
        }
    },
    mounted() {},
    methods: {
        getClasses() {
            let classes = `col col-${this.question.col_sm} col-${this.question.col_md} col-${this.question.col_xl}`;
            if (this.isResponse) {
                classes += " response-field";
            }
            return classes;
        },
        optionSelected(value) {
            this.$emit("optionSelected", value);
        }
    }
};
</script>

<style lang="scss">
.question-required {
    color: red;
}
.response-field .vs__selected-options {
    flex-direction: column;
}
.response-field .vs__deselect,
.response-field .vs__actions,
.response-field .vs__search {
    display: none;
}
.response-field .vs__selected {
    border: none;
}
</style>
