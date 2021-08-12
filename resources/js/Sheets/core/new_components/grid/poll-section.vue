<template>
    <div class="sheets-poll-section col">
        <div class="title">
            <h3>
                {{ title }}
            </h3>
        </div>
        <!-- Field -->
        <div v-if="questions">
            <sheets-field v-for="(question, key) in questions"
                :key="key"
                :field="question"
                v-model="responses[key]"
                :error-messages="errors[key]">
            </sheets-field>
        </div>

        <!-- Prev/Next -->
        <div class="row">
            <div class="col">
                <button
                    v-if="can_previous"
                    @click="previous()"
                    class="btn btn-warning float-left sheets-btn">
                    Anterior
                </button>
                <button
                    v-if="can_next"
                    @click="next()"
                    class="btn btn-info float-right sheets-btn">
                    Siguiente
                </button>
            </div>
        </div>

        <code>
            <pre>
                {{ respuestas }}
            </pre>
        </code>
    </div>
</template>

<script>
import field from '../field.vue'
import Answer from '../classes/answer'
export default {
    components: {
        'sheets-field': field
    },
    props: {
        section: {
            type: Object,
            require: true
        },
        value: {
            required: true
        }
    },
    data: () => ({
        // almacena objetos {key: value} proveniente de un input
        responses: [],
        // almacena objetos Answer que han sido tratados a partir de response
        respuestas: [],
        // errores
        errors: []
    }),
    watch: {
        responses: {
            handler() {
                this.respuestas = this.responses.map(r => {
                    return new Answer(r, this.section, this.questions)
                })
                this.$emit('input', this.respuestas)
                // if (this.respuestas.every(respuesta => respuesta.autopass))
                //     this.next()
            },
            deep: true
        }
    },
    computed: {
        id() {
            return this.section.id
        },
        title() {
            return this.section.name
        },
        sm() {
            return `col-sm-${this.section.col_sm}`
        },
        md() {
            return `col-md-${this.section.col_md}`
        },
        xl() {
            return `col-xl-${this.section.col_xl}`
        },
        questions() {
            const questions = this.$store.getters['formBuilder/poll_questions']

            const qs = questions.filter(q => q.form_section_id === this.id)
                .sort((a, b) => { return a.order > b.order ? 1 : -1 })

            return qs
        },
        can_next() {
            const defaultNextSection = this.section.default_next_form_section

            const allQuestionsAnswered = this.respuestas.every(el => (el.required && !!el.answer) || !el.required)

            let allNull = true

            this.respuestas.map(el => {
                if (el.answer !== null) {
                    allNull = false
                }
            })
            const allAnswerHasNextSection = this.respuestas.every(el => el.next_section)

            console.log((allQuestionsAnswered && !!defaultNextSection) && !allNull && allAnswerHasNextSection)

            return (allQuestionsAnswered && !!defaultNextSection) && !allNull && allAnswerHasNextSection
        },
        can_previous() {
            const history = this.$store.getters['formBuilder/history']

            return history.length > 0
        }
    },
    methods: {
        previous() {
            this.$emit('prev-section')
        },
        next() {
            const data = {
                respuestas: this.respuestas,
                section: this.section
            }
            this.respuestas.map(respuesta => {
                this.$store.commit('formBuilder/HISTORY', respuesta)
            })

            if (this.validate_required_answer()) {
                this.$emit('next-section', data)
                this.responses = []
            }
        },
        // validacion para respuestas requeridas
        // y mensaje de error
        validate_required_answer() {
            this.respuestas.map((r, index) => {
                if (r.required && !r.answer) {
                    this.errors[index] = 'Complete los campos requeridos'
                }

            })
            return this.errors.length === 0
        }
    }
}
</script>

<style lang="scss">
.sheets-poll-section {
    padding: 5px;
    border: 1px solid green;
    .title {
        border: 1px solid blue;
    }
}
</style>
