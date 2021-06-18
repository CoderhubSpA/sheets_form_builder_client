<template>
    <div class="___PollIndex-container">
        <h3>
            {{ title }}
        </h3>
        <div class="row">
            <div class="col">
                <poll-section
                    :section="active_section"
                    :questions="workingQuestions"
                    :identificador="identificador"
                    @next-section="handleNextSection"
                >
                </poll-section>
            </div>
        </div>
        <div class="row" v-if="show_guardar">
            <div class="col text-right" style="padding-right: 40px;">
                <button
                    :disabled="isDisabledSave()"
                    @click="savePoll()"
                    :class="`btn btn-success`"
                >
                    GUARDAR
                </button>
            </div>
        </div>
        <div class="row" v-if="error">
            <div class="col text-right" style="padding-right: 40px;">
                <br />
                <p class="text-danger">
                    {{ backendMsg }}
                </p>
            </div>
        </div>
        <div class="row" v-if="success">
            <div class="col text-right" style="padding-right: 40px;">
                <br />
                <p class="text-success">
                    {{ backendMsg }}
                </p>
            </div>
        </div>

        <loading-message :status="loading"></loading-message>
    </div>
</template>

<script>
import LoadingMessage from "../loading-message";
import PollSection from "./section.vue";

export default {
    components: {
        "poll-section": PollSection,
        LoadingMessage
    },
    props: {
        id: {
            type: String,
            require: true
        }
    },
    data: () => ({
        title: "",
        error: false,
        success: false,
        backendMsg: "",
        loading: false,
        sections: [],
        questions: [],
        active_section: {},
        entity_type_id: null,
        show_guardar: false,
        identificador: null
    }),
    computed: {
        workingQuestions() {
            return this.questions.filter(
                q => q.form_section_id === this.active_section.id
            );
        }
    },
    mounted() {
        this.loading = true;
        this.identificador = Date.now().toString();
        this.$store
            .dispatch("poll/get_poll", this.id)
            .then(response => {
                this.title = response.name;
                this.sections = response.sections;
                this.questions = response.questions;
                this.active_section = response.active_section;
                this.entity_type_id = response.entity_type_id;
                this.questions.map(
                    q =>
                        (q.answer = {
                            question: q.id,
                            answer: null,
                            next_section: null,
                            alternative: null
                        })
                );
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                this.loading = false;
            });
    },
    methods: {
        reloadPoll() {
            this.loading = true;
            this.title= "";
            this.error= false;
            this.success= false;
            this.backendMsg= "";
            this.sections= [];
            this.questions= [];
            this.active_section= {};
            this.entity_type_id= null;
            this.show_guardar= false;
            this.identificador = Date.now().toString();
            this.$store
                .dispatch("poll/get_poll", this.id)
                .then(response => {
                    this.title = response.name;
                    this.sections = response.sections;
                    this.questions = response.questions;
                    this.active_section = response.active_section;
                    this.entity_type_id = response.entity_type_id;
                    this.questions.map(
                        q =>
                            (q.answer = {
                                question: q.id,
                                answer: null,
                                next_section: null,
                                alternative: null
                            })
                    );
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleNextSection(answersArray, sectionId) {
            const firstAFound = answersArray.find(answer => {
                return (
                    answer.next_section !== null &&
                    answer.section_id === sectionId
                );
            });
            this.active_section = this.sections.find(section => {
                return section.id === firstAFound.next_section;
            });
            this.$store.commit("poll/RECORD", answersArray);
            if (this.active_section.default_next_form_section === null) {
                this.show_guardar = true;
            }
        },
        isDisabledSave() {
            const currentValues = this.$store.getters["poll/record"];
            var disabled = false;
            currentValues.map(val => {
                if (val.required === true && val.answer === null) {
                    disabled = true;
                }
            });
            return disabled;
        },
        savePoll() {
            this.loading = true;
            this.error = false;
            this.success = false;
            const formData = new FormData();
            formData.append("entityKey", this.entity_type_id);
            const data = [];
            data[this.entity_type_id] = [];
            const currentValues = this.$store.getters["poll/record"];
            let field = {};
            currentValues.map(val => {
                field[val.question] = val.answer;
            });
            data[this.entity_type_id].push(field);
            Object.keys(data).forEach(key => {
                formData.append(key, JSON.stringify(data[key]));
            });
            this.$store
                .dispatch("form/save_form", formData)
                .then(response => {
                    if (response.response.data.success === true) {
                        this.loading = false;
                        this.success = true;
                        this.backendMsg = "Encuesta guardada con exito";
                        setTimeout(() => {
                            this.$store.commit('poll/CLEANRECORD');
                            this.reloadPoll();
                        }, 1500);
                    } else {
                        this.loading = false;
                        this.error = true;
                        this.backendMsg =
                            "Ocurrió un error al guardar la encuesta";
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.error = true;
                    this.backendMsg = "Ocurrió un error al guardar la encuesta";
                });
        }
    }
};
</script>

<style lang="scss">
.___PollIndex-container {
    padding: 25px;
    margin: 15px;
    background: #dddddd;
    border: 1px solid #999999;
    border-radius: 5px;
}
.active_section {
    background-color: rgb(226, 226, 221);
    border: 1px solid red;
    // height: 100vh;
    justify-content: center;
    align-items: center;
    animation-name: activate_section;
    animation-duration: 1s;
}
.section_container {
    padding: 25px;
}
.inactive_section {
    display: none;
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
