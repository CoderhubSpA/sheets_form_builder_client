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
        selected: null
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
                Object.keys(this.question.options).forEach(key => {
                    options.push({
                        id: key,
                        label: this.question.options[key]
                    });
                });
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
                    console.warn(this.selected);
                }
            }
            options.sort((a, b) => {
                return a.label > b.label ? 1 : -1;
            })
            rOptions = [...options];
            return rOptions;
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
                        col_name: this.question.col_name,
                        exam: !!val
                            ? this.question.alternatives[val.id].products
                            : null
                    };
                    this.optionSelected(data);
                }
            }
        },
        valSelected(val) {
            if (val) {
                this.selected = this.options.find(opt => {
                    return opt.id === val;
                });
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
            if (value) {
                this.$emit("input", value.selected_value.id);
            } else this.$emit("input", null);

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
