<template>
    <div class="SheetsPollRender__section">
        <div class="row SheetsPollRender__title">
            <div class="col">
                <h3>
                    {{ title }}
                </h3>
            </div>
        </div>
        <div class="row SheetsPollRender__field">
            <div
                v-for="(question, index) in questions"
                :key="index"
                :class="getFieldContainerClass(question.id, question)"
                style="margin-bottom: 20px;"
            >
                <sheet-input
                    :identificador="identificador"
                    :modelretrive="modelretrive"
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
        <div class="row" v-if="requirederror === true">
            <div class="col">
                <span class="mt-4 float-right text-danger">
                    Complete los campos requeridos
                </span>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button
                    @click="handlePrevious()"
                    :class="`btn btn-warning mt-4 float-left`"
                    v-if="can_previous()"
                >
                    Anterior
                </button>
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
        },
        requirederror: {
            type: Boolean,
            require: false,
            default: false
        },
        fieldserror: {
            type: Array,
            require: false,
            default: () => []
        },
        historylength: {
            type: Number,
            require: false,
            default: 0
        },
        modelretrive: {
            type: Array,
            require: true
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
        section(val) {
            const answeredQuestions = this.responses.filter(item => {
                return item.section_id === val.id;
            });
            answeredQuestions.map(item => {
                this.model = {};
                const index = this.responses.indexOf(item);
                this.responses.splice(index, 1);
            });
        },
        questions() {
            this.errors_messages = [];
            if (this.questions !== undefined) {
                this.questions.forEach((element, index) => {
                    let pre = {
                        question: element.id,
                        answer: null,
                        col_name: element.col_name,
                        required: !!element.required,
                        section_id: this.section.id
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
            }
        },
        responses(val) {
            this.$store.commit("poll/RECORD", val);
        },
        identificador(val) {
            // this.responses = [];
        },
        modelretrive(val) {
            console.log("new model", val);
        }
    },
    methods: {
        parsedFieldStyles(field) {
            return field.format === "DOCUMENT" ||
                field.format === "DOCUMENT[IMAGE]"
                ? ["custom-file-input"]
                : ["form-control"];
        },
        getFieldContainerClass(questionId, field) {
            let classes = `col col-${field.col_sm} col-${field.col_md} col-${field.col_xl}`;
            if (this.fieldserror.indexOf(questionId) !== -1) {
                classes += " SheetsPollRender__field-error";
            }
            return classes;
        },
        getAnswer(e, id = null, col_name = null) {
            let answer = {};
            let shouldAutoPass = true;
            if (typeof e != "object") {
                const eventQuestion = this.allquestions.find(q => {
                    return q.id === id;
                });
                answer = {
                    section_id: this.section.id,
                    question: id,
                    questiondesc: eventQuestion.name,
                    answer: e,
                    next_section: this.section.default_next_form_section,
                    alternative: null,
                    col_name,
                    response: false,
                    timestamp: Date.now()
                };
            } else {
                const eventQuestion = this.allquestions.find(q => {
                    return q.id === e.id;
                });
                shouldAutoPass = e.alternative.next_form_section ? true : false;
                answer = {
                    section_id: this.section.id,
                    question: e.id,
                    questiondesc: eventQuestion.name,
                    answer: e.alternative.id,
                    next_section: e.alternative.next_form_section
                        ? e.alternative.next_form_section
                        : this.section.default_next_form_section,
                    alternative: e.alternative,
                    col_name: e.col_name,
                    response: false,
                    timestamp: Date.now()
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
                if (e.exam !== undefined) {
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
                                    answer: [exam.entity_id.toString()],
                                    question: question.id,
                                    questiondesc: question.name,
                                    required: question.required,
                                    section_id: null,
                                    col_name: question.col_name,
                                    alternative: null,
                                    response: true
                                };
                                this.responses.push(answerProduct);
                            } else {
                                const indexOfAnswer = this.responses.indexOf(
                                    search
                                );
                                if (
                                    search.answer.indexOf(
                                        exam.entity_id.toString()
                                    ) === -1
                                ) {
                                    search.answer.push(
                                        exam.entity_id.toString()
                                    );
                                }
                            }
                        }
                    });
                }
            }
            if (shouldAutoPass) {
                if (typeof e === "object" && this.can_next()) {
                    if (e.format === "QUESTION") {
                        this.handleNext();
                    }
                }
            }
        },
        load_results() {
            const historyItems = this.$store.getters["poll/history"];
            let historyQuestions = [];
            historyItems.forEach(item => {
                historyQuestions.push(item.question);
            });
            const responsesNew = this.responses.filter(response => {
                return (
                    response.response === false &&
                    historyQuestions.indexOf(response.question) > -1
                );
            });
            this.responses = responsesNew;
            this.responses.map(response => {
                if (response.response === false) {
                    if (response.alternative !== null) {
                        response.alternative.products.forEach(product => {
                            let question = this.allquestions
                                .filter(
                                    q =>
                                        q.form_field_id == product.form_field_id
                                )
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
                                        answer: [product.entity_id.toString()],
                                        question: question.id,
                                        questiondesc: question.name,
                                        required: question.required,
                                        section_id: null,
                                        col_name: question.col_name,
                                        alternative: null,
                                        response: true
                                    };
                                    this.responses.push(answerProduct);
                                } else {
                                    const indexOfAnswer = this.responses.indexOf(
                                        search
                                    );
                                    if (
                                        search.answer.indexOf(
                                            product.entity_id.toString()
                                        ) === -1
                                    ) {
                                        search.answer.push(
                                            product.entity_id.toString()
                                        );
                                    }
                                }
                            }
                        });
                    }
                }
            });
        },
        can_next() {
            const responsesVal = this.responses.filter(item => {
                return item.section_id === this.section.id;
            });
            let valReturn =
                responsesVal.every(el => {
                    return (el.required && !!el.answer) || !el.required;
                }) && this.section.default_next_form_section !== null;
            let allNull = true;
            responsesVal.map(res => {
                if (res.answer !== null) {
                    allNull = false;
                }
            });
            return valReturn && !allNull;
        },
        handleNext() {
            let history = this.responses.filter(response => {
                return response.response === false;
            });
            this.$store.commit("poll/HISTORY", history);
            this.$emit("next-section", this.responses, this.section.id);
            this.model = {};
        },
        can_previous() {
            return this.historylength > 0 ? true : false;
        },
        handlePrevious() {
            const newresponses = this.responses.filter(item => {
                return item.section_id !== this.section.id;
            });
            this.responses = newresponses;
            this.$emit("previous-section");
            this.load_results();
        }
    }
};
</script>

<style lang="scss">
.SheetsPollRender__section {
    justify-content: center;
    align-items: center;
    animation-name: activate_section;
    animation-duration: 1s;
    padding: 25px;
}

.SheetsPollRender__field-error {
    padding: 15px;
    border: 1px solid red;
    border-radius: 10px;
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
