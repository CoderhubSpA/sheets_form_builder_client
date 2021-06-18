<template>
    <div :class="`col col-${sm} col-${md} col-${xl}`">
        <label>
            {{ label }} <span v-if="required" class="question-required">*</span>
        </label>
        <v-select :options="options" v-model="selected"></v-select>
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
            return options;
        },
        required() {
            return this.question.required == 1;
        }
    },
    watch: {
        selected(val) {
            if (!!val) {
                const data = {
                    id: this.question.id,
                    selected_value: !!val ? val.label : "N/A",
                    alternative: !!val
                        ? this.question.alternatives[val.id]
                        : null,
                    section_owner: this.question.form_section_id,
                    col_name: this.question.col_name
                };
                this.optionSelected(data);
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
</style>