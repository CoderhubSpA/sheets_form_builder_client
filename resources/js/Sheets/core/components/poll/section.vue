<template>
    <div class="section">
        <div class="row">
            <div class="col">
                <h3>
                    {{ title }}
                </h3>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-for="(question, index) in questions" :key="index">
                    <sheet-input
                        :form="question"
                        :styles="parsedFieldStyles(question)"
                        :model="model"
                        :responses="responses"
                        v-on:question:selected="getAnswer($event)"
                        @sheets-input-change="
                            getAnswer($event, question.id, question.col_name)
                        "
                    />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button
                    @click="handleNext()"
                    :class="`btn btn-info mt-4 float-right`"
                    v-if="can_next()"
                >
                    Siguiente
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import global from "../global";
export default {
    components: {
        "sheet-input": global
    },
    props: {
        section: {
            type: Object,
            require: true
        },
        questions: {
            type: Array,
            require: true,
            default: () => []
        },
        allquestions: {
            type: Array,
            require: true,
            default: () => []
        },
        identificador: {
            type: String,
            default: ""
        }
    },
    data: () => ({
        answer: {},
        responses: [],
        errors_messages: [],
        model: {}
    }),
    computed: {
        title() {
            return this.section.name;
        }
    },
    watch: {
        questions() {
            this.errors_messages = [];

            this.questions.forEach((element, index) => {
                let pre = {
                    question: element.id,
                    answer: null,
                    col_name: element.col_name,
                    required: !!element.required
                };
                if (element.format === "INFO") {
                    pre.answer = element.form_field_id;
                }
                const validation = this.responses.find(resp => {
                    return resp.question === element.id;
                });
                if (!validation) {
                    this.responses.push(pre);
                }

                let err = {
                    id: element.id,
                    msg: []
                };
                this.errors_messages.push(err);
            });
        },
        responses(val) {
            this.$store.commit("poll/RECORD", val);
        },
        identificador(val) {
            this.responses = [];
        }
    },
    methods: {
        parsedFieldStyles(field) {
            return field.format === "DOCUMENT" ||
                field.format === "DOCUMENT[IMAGE]"
                ? ["custom-file-input"]
                : ["form-control"];
        },
        getAnswer(e, id = null, col_name = null) {
            let answer = {};
            if (typeof e != "object") {
                answer = {
                    section_id: this.section.id,
                    question: id,
                    answer: e,
                    next_section: this.section.default_next_form_section,
                    alternative: null,
                    col_name
                };
            } else {
                answer = {
                    section_id: this.section.id,
                    question: e.id,
                    answer: e.alternative.id,
                    next_section: e.alternative.next_form_section
                        ? e.alternative.next_form_section
                        : this.section.default_next_form_section,
                    alternative: e.alternative,
                    col_name: e.col_name
                };
            }

            let q = this.questions.find(q => q.id === answer.question);
            answer["required"] = !!q.required;
            let a = this.responses
                .filter(r => r.question == answer.question)
                .shift();
            const index = this.responses.indexOf(a);
            this.model = answer;
            Vue.set(this.responses, index, answer);
            if (typeof e == "object") {
                e.exam.forEach(exam => {
                    let question = this.allquestions
                        .filter(q => q.form_field_id == exam.form_field_id)
                        .shift();
                    let search = this.responses
                        .filter(r => r.question == question.id)
                        .shift();
                    if (question.format !== "RESPONSE") {
                        console.warn(
                            "Campo de formato no válido para guardar producto"
                        );
                    } else {
                        if (search === undefined) {
                            const answerProduct = {
                                answer: [exam.entity_id],
                                question: question.id,
                                required: question.required,
                                section_id: null,
                                col_name: question.col_name,
                                alternative: null
                            };
                            this.responses.push(answerProduct);
                        } else {
                            const indexOfAnswer = this.responses.indexOf(
                                search
                            );
                            if(search.answer.indexOf(exam.entity_id) === -1){
                                search.answer.push(exam.entity_id);
                            }
                        }
                    }
                });
            }
            if (typeof e === "object" && this.can_next()) {
                this.$store.commit("poll/ADD_EXAM", e.exam);
                if (e.format === "QUESTION") {
                    this.handleNext();
                }
            }
        },
        /**
         * Mostrar u ocultar
         * el btn de siguiente
         */
        can_next() {
            return (
                this.responses.every(el => {
                    return (el.required && !!el.answer) || !el.required;
                }) && this.section.default_next_form_section !== null
            );
        },
        handleNext() {
            this.$emit("next-section", this.responses, this.section.id);
            this.model = {};
        }
    }
};
</script>

<style lang="scss">
.section {
    justify-content: center;
    align-items: center;
    animation-name: activate_section;
    animation-duration: 1s;
    padding: 25px;
}

@keyframes activate_section {
    0% {
        background-color: rgb(255, 255, 255);
        color: rgb(255, 255, 255);
    }
    50% {
        background-color: rgb(240, 240, 238);
        color: rgb(112, 112, 112);
    }
    100% {
        background-color: rgb(226, 226, 221);
        color: rgb(0, 0, 0);
    }
}
</style>
