<template>
    <div :class="`col col-${sm} col-${md} col-${xl}`">
        <label>
            {{ title }} <span v-if="required" class="question-required">*</span>
        </label>
        <v-select
            :options="options"
            v-model="selected">
        </v-select>
        <button class="btn btn-info mt-4 float-right" v-if="can_go_next_question" @click="next">
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
        }
    },
    data: () => ({
        selected: null
    }),
    computed: {
        title() {
            return this.question.name
        },
        sm() {
            return this.question.col_sm
        },
        md() {
            return this.question.col_md
        },
        xl() {
            return this.question.col_xl
        },
        options() {
            let options = []
            Object.keys(this.question.options).forEach(key => {
                options.push({
                    id: key,
                    label: this.question.options[key]
                })
            })
            return options
        },
        required() {
            return this.question.required == 1
        },
        can_go_next_question() {
            return this.required && !!this.selected
        }
    },
    methods: {
        next() {
            // this.$emit('next', this.selected.id)
            this.$store.dispatch('poll/nextQuestion', this.selected.id)
            .then(response => {
                console.log(response, this.$store.state.poll)
            })
            .catch(err => {
                console.log(err)
            })

        }
    }
}
</script>

<style lang="scss">
.question-required {
    color: red;
}
</style>
