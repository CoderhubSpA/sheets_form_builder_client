<template>
    <div :class="`col col-${sm} col-${md} col-${xl}`">
        <label>
            {{ title }} <span v-if="required" class="question-required">*</span>
        </label>
        <v-select :options="options" v-model="selected"> </v-select>
        <button
            :class="`btn btn-info mt-4 float-right ${endForm ? 'hide' : 'show'}`"
            v-if="can_go_next_question"
            @click="next">
            Siguiente
        </button>
    </div>
</template>

<script>
export default {
    props: {
        question: {
            type: Object,
            default: () => {},
            require: true
        },
        endForm: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        selected: null,
        show_send_poll: false
    }),
    computed: {
        title() {
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
            return options;
        },
        required() {
            return this.question.required == 1;
        },
        can_go_next_question() {
            return (this.required && !!this.selected) || this.required == false;
        }
    },
    watch: {
        selected(val) {
            if (!!val) {
                this.next();
            }
        }
    },
    mounted() {},
    methods: {
        next() {
            const data = {
                selected_value: this.selected,
                alternative: !!this.selected
                    ? this.question.alternatives[this.selected.id]
                    : null,
                section_owner: this.question.form_section_id
            };
            this.$emit("input", this.selected.id);
            this.$emit(
                "optionSelected",
                this.question.id,
                this.question.alternatives[this.selected.id]
            );
            this.$emit("next", data);
        }
    }
};
</script>

<style lang="scss">
.question-required {
    color: red;
}
</style>
