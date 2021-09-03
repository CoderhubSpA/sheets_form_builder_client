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
                <!-- CLASSIC FIELDS -->
                <sheet-input
                    :identificador="identificador"
                    :modelretrive="modelretrive"
                    :form="question"
                    :styles="parsedFieldStyles(question)"
                    :model="model[question.id]"
                    :responses="responses"
                    v-if="!activeNewFields.includes(question.format)"
                    v-on:question:selected="
                        getAnswerFromQuestionSelected($event)
                    "
                    @sheets-input-change="
                        getAnswerFromInputChange(
                            $event,
                            question.id,
                            question.col_name
                        )
                    "
                />
                <!-- NEW FIELDS -->
                <sheets-field
                    v-if="activeNewFields.includes(question.format)"
                    :field="question"
                    :key="index"
                    v-model="sectionModel[index]"
                    @sheets-input-change="
                        getAnswerFromInputChange(
                            $event,
                            question.id,
                            question.col_name
                        )
                    "
                >
                </sheets-field>
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
                    :disabled="disablePreviousBtn"
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
import SheetsField from "../../new_components/field.vue";
export default {
    components: {
        "sheet-input": global,
        "sheets-field": SheetsField
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
        },
        bus: {
            type: Object,
            default: () => ({})
        },
        disablePrevious: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        answer: {},
        responses: [],
        errors_messages: [],
        model: [],
        activeNewFields: ["RADIO"],
        sectionModel: []
    }),
    computed: {
        title() {
            return this.section.name;
        },
        disablePreviousBtn() {
            return this.disablePrevious;
        }
    },
    watch: {
        section(val) {
            const answeredQuestions = this.responses.filter(item => {
                return item.section_id === val.id;
            });
            answeredQuestions.map(item => {
                this.model = [];
                const indexOf = this.responses.indexOf(item);
                if (item.automatic === null) {
                    this.responses.splice(indexOf, 1);
                }
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
                        section_id: this.section.id,
                        automatic: null
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
        responses(newVal, oldVal) {
            this.$store.commit("poll/RECORD", newVal);
        },
        identificador(val) {
            console.warn("new identificator", val);
        },
        modelretrive(val) {
            console.warn("new model", val);
        }
    },
    mounted() {
        this.bus.$on("reloadedPoll", args => {
            this.responses = [];
        });
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
        async getAnswerFromQuestionSelected(e) {
            let eventQuestion = this.allquestions.find(
                q => q.form_field_id === e.form_field_id
            );
            let answer = {
                section_id: this.section.id,
                question: e.id,
                questiondesc: eventQuestion.name,
                answer: e.alternative ? e.alternative.id : undefined,
                next_section:
                    e.alternative && e.alternative.next_form_section
                        ? e.alternative.next_form_section
                        : this.section.default_next_form_section,
                alternative: e.alternative,
                col_name: e.col_name,
                response: false,
                automatic: e.automatic ? true : null,
                timestamp: Date.now()
            };

            await this.getAnswer(e.id, answer);
            await this.getProduct(e.exam);

            let shouldAutoPass =
                e.alternative && e.alternative.next_form_section ? true : false;
            if (shouldAutoPass && this.can_next() && e.format === "QUESTION") {
                this.handleNext();
            }
        },
        getAnswerFromInputChange(e, id = null, col_name = null) {
            let eventQuestion = this.allquestions.find(q => q.id === id);

            let answer = {
                section_id: this.section.id,
                question: id,
                questiondesc: eventQuestion.name,
                answer: e,
                next_section: this.section.default_next_form_section,
                alternative: null,
                col_name: col_name,
                response: false,
                automatic: null,
                timestamp: Date.now()
            };

            this.getAnswer(id, answer);
        },
        getAnswer(id, answer) {
            const safeResponses = [...this.responses];
            this.model[id] = answer;
            let q = this.questions.find(q => q.id === answer.question) || {};
            answer["required"] = !!q.required;
            let a = safeResponses.find(r => r.question == answer.question);
            if (a) {
                let index = safeResponses.indexOf(a);
                Vue.set(this.responses, index, answer);
            }
            return;
        },
        getProduct(products) {
            if (!products) return;

            products.forEach(product => {
                let question = this.allquestions.find(
                    q => q.form_field_id == product.form_field_id
                );
                let search = this.responses.find(
                    r => r.question == question.id
                );
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
                        const indexOfAnswer = this.responses.indexOf(search);
                        if (
                            search.answer.indexOf(
                                product.entity_id.toString()
                            ) === -1
                        ) {
                            search.answer.push(product.entity_id.toString());
                        }
                    }
                }
            });
            return;
        },
        load_results() {
            const historyItems = this.$store.getters["poll/history"];
            let historyQuestions = [];
            historyItems.forEach(item => {
                historyQuestions.push(item.question);
            });
            const responsesNew = this.responses.filter(response => {
                return (
                    (response.response === false &&
                        historyQuestions.indexOf(response.question) > -1) ||
                    response.automatic === true
                );
            });
            this.responses = [...responsesNew];
            this.responses.map(response => {
                if (response.response === false) {
                    if (response.alternative !== null) {
                        response.alternative.products.forEach(product => {
                            let question = this.allquestions.find(
                                q => q.form_field_id == product.form_field_id
                            );
                            let search = this.responses.find(
                                r => r.question == question.id
                            );
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
            let historyNewItem = this.responses.filter(response => {
                return (
                    response.response === false &&
                    response.automatic === null &&
                    response.section_id === this.section.id
                );
            });
            this.$store.commit("poll/HISTORY", historyNewItem);
            let validationResponses;
            validationResponses = [...this.responses];
            this.$emit("next-section", validationResponses, this.section.id);
            this.responses = [...validationResponses];
            this.model = [];
        },
        can_previous() {
            return this.historylength > 0 ? true : false;
        },
        handlePrevious() {
            const newresponses = this.responses.filter(item => {
                return item.section_id !== this.section.id;
            });
            this.responses = [...newresponses];
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
