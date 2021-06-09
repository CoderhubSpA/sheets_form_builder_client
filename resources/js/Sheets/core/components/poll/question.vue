<template>
    <div :class="`col col-${sm} col-${md} col-${xl}`">

        <label>
            {{ label }} <span v-if="required" class="question-required">*</span>
        </label>
        <v-select
            :options="options"
            v-model="selected"></v-select>
    </div>
</template>

<script>
import abstract from "../../mixins/mix"
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
        }
    },
    data: () => ({
        selected: null
    }),
    computed: {
        label() {
            return this.question.name
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
                    id: this.question.form_field_id,
                    selected_value: val,
                    alternative: !! val ? this.question.alternatives[val.id] : null,
                    section_owner: this.question.form_section_id
                }
                this.optionSelected(data)
            }
        }
    },
    mounted() {},
    methods: {
        optionSelected(value) {
            if (value){
                this.$emit('input', value.selected_value.id)
            }
            else
                this.$emit('input', null)

            this.$emit("optionSelected", value)
        }
        // next() {
        //     const data = {
        //         selected_value: this.selected,
        //         alternative: !!this.selected ? this.question.alternatives[this.selected.id] : null,
        //         section_owner: this.question.form_section_id
        //     };
        //     this.$emit("input", this.selected.id);
        //     this.$emit(
        //         "optionSelected",
        //         this.question.id,
        //         this.question.alternatives[this.selected.id]
        //     );
        //     this.$emit("next", data);
        // }
    }
}
</script>

<style lang="scss">
.question-required {
    color: red;
}
</style>
