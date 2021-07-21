<template>
    <div class="row">
        <transition name="showsidebar">
            <div v-if="sidebarOn" class="sidebar col-6">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Alias, obcaecati eius? Optio dolorem laborum reiciendis nemo
                    sit placeat, harum ex perspiciatis rerum, totam consectetur
                    vel sequi autem ab provident eius?
                </p>
            </div>
        </transition>
        <div class="col-12">
            <poll-history :items="historyItems" />
        </div>
        <div class="col-12">
            <div class="___PollIndex-container">
                <div class="row">
                    <div class="col-8 text-left">
                        <h3>
                            {{ title }}
                        </h3>
                    </div>
                    <!-- <div class="col-4 text-right">
                        <button
                            :class="`btn btn-primary`"
                            @click="sidebarOn = !sidebarOn"
                        >
                            HISTORIAL
                        </button>
                    </div> -->
                </div>
                <div class="row">
                    <div class="col">
                        <poll-section
                            :section="active_section"
                            :questions="workingQuestions"
                            :identificador="identificador"
                            :allquestions="questions"
                            :requirederror="requiredError"
                            :fieldserror="fieldsError"
                            :historylength="historyItems.length"
                            @next-section="handleNextSection"
                            @previous-section="handlePreviousSection"
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
            </div>
        </div>
        <loading-message :status="loading"></loading-message>
    </div>
</template>

<script>
import LoadingMessage from "../loading-message";
import PollSection from "./section.vue";
import PollHistory from "./history.vue";

export default {
    components: {
        "poll-section": PollSection,
        "poll-history": PollHistory,
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
        identificador: null,
        windowName: `SheetsPollRendered${new Date().getTime()}`,
        sidebarOn: false,
        historyItems: [],
        requiredError: false,
        fieldsError: []
    }),
    computed: {
        workingQuestions() {
            return this.questions.filter(
                q => q.form_section_id === this.active_section.id
            );
        },
        show_guardar() {
            if (this.active_section.default_next_form_section === null) {
                return true;
            }
            return false;
        }
    },
    mounted() {
        window.name = this.windowName;
        this.window = window;
        this.reloadPoll();
    },
    methods: {
        reloadPoll() {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
            }, 1500);
            this.title = "";
            this.error = false;
            this.success = false;
            this.backendMsg = "";
            this.sections = [];
            this.questions = [];
            this.active_section = {};
            this.entity_type_id = null;
            this.identificador = Date.now().toString();
            this.$store.dispatch("poll/get_poll").then(poll => {
                this.title = poll.title;
                this.sections = poll.sections;
                this.questions = poll.questions;
                this.active_section = poll.active_section;
                this.entity_type_id = poll.entity_type_id;
                this.questions.map(
                    q =>
                        (q.answer = {
                            question: q.id,
                            answer: null,
                            next_section: null,
                            alternative: null
                        })
                );
            });
        },
        handleNextSection(answersArray, sectionId) {
            this.requiredError = false;
            this.fieldsError = [];
            answersArray.map(answer => {
                if (
                    answer.required === true &&
                    answer.answer === null &&
                    answer.section_id === sectionId
                ) {
                    this.requiredError = true;
                    this.fieldsError.push(answer.question);
                }
            });
            if (this.requiredError === true) {
                return;
            } else {
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
                this.historyItems = this.$store.getters["poll/history"];
            }
        },
        handlePreviousSection() {
            this.active_section = this.sections.find(section => {
                return (
                    section.id ===
                    this.historyItems[this.historyItems.length - 1].section_id
                );
            });
            this.historyItems.pop();
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
                field[val.question] =
                    val.alternative === null
                        ? val.answer
                        : val.alternative.to_string;
            });
            field['form_id'] = this.id;
            let formHistoryParsed = "";
            this.historyItems.map((item, index) => {
                if(item.alternative !== null){
                    formHistoryParsed = formHistoryParsed + `${index + 1}.- ${item.questiondesc} - R: ${item.alternative.name} \n `;
                }else{
                    formHistoryParsed = formHistoryParsed + `${index + 1}.- ${item.questiondesc} - R: ${item.answer} \n `;
                }
            })
            field['form_history'] = formHistoryParsed;
            let formFields = {};
            Object.keys(field).forEach(key => {
                let q = this.questions.find((item) => {return item.id === key})
                if(q !== undefined){
                    formFields[key] = q.form_field_id
                }
            });
            field['form_fields'] = formFields;
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
                            this.$store.commit("poll/HISTORY", []);
                            this.historyItems = [];
                            this.$store.commit("poll/CLEANRECORD");
                            this.reloadPoll();
                        }, 1500);
                    } else {
                        this.loading = false;
                        this.error = true;
                        this.backendMsg =
                            "Ocurrió un error al guardar la encuesta";
                    }
                    try {
                        this.window.parent.postMessage(
                            response.response.data,
                            "*"
                        );
                    } catch (e) {
                        console.warn(e);
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.error = true;
                    this.backendMsg = "Ocurrió un error al guardar la encuesta";
                    try {
                        this.window.parent.postMessage(err.response.data, "*");
                    } catch (e) {
                        console.warn(e);
                    }
                });
        }
    }
};
</script>

<style lang="scss">
.hide {
    display: none;
}
.sidebar {
    background-color: white;
    padding: 25px;
    border-right: 1px solid #dddddd;
    position: fixed;
    z-index: 99;
    min-height: 100vh;
}
.showsidebar {
    &-enter,
    &-leave-to {
        opacity: 0;
        transform: translateX(-60px);
    }
    &-enter-active,
    &-leave-active {
        transition: all 500ms;
    }
}
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
