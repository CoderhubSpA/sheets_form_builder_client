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
                            :modelretrive="modelretrive"
                            :section="active_section"
                            :questions="workingQuestions"
                            :identificador="identificador"
                            :allquestions="questions"
                            :requirederror="requiredError"
                            :fieldserror="fieldsError"
                            :historylength="historyItems.length"
                            :bus="bus"
                            @next-section="handleNextSection"
                            @previous-section="handlePreviousSection"
                            :disablePrevious="actionDisabled"
                        >
                        </poll-section>
                    </div>
                </div>
                <div class="row" v-if="show_guardar">
                    <div
                        class="col text-center"
                        v-for="(action, key) in actions"
                        :key="key"
                    >
                        <sheets-action
                            :action="action"
                            v-on:sheets-action-trigger="actionHandler"
                            :disabled="actionDisabled"
                        ></sheets-action>
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
import SheetsAction from "../button";
import PollSection from "./section.vue";
import PollHistory from "./history.vue";

export default {
    components: {
        "poll-section": PollSection,
        "poll-history": PollHistory,
        "sheets-action": SheetsAction,
        LoadingMessage
    },
    props: {
        id: {
            type: String,
            require: true
        }
    },
    data: () => ({
        bus: new Vue(),
        title: "",
        error: false,
        success: false,
        backendMsg: "",
        loading: false,
        refresh: false,
        sections: [],
        questions: [],
        actions: [],
        actionSend: null,
        active_section: {},
        entity_type_id: null,
        identificador: null,
        windowName: `SheetsPollRendered${new Date().getTime()}`,
        sidebarOn: false,
        historyItems: [],
        requiredError: false,
        fieldsError: [],
        modelretrive: [],
        inicioForm: {
            name: "Inicio",
            timestamp: Date.now()
        },
        //
        actionDisabled: false
    }),
    computed: {
        workingQuestions() {
            if (this.active_section) {
                return this.questions.filter(
                    q => q.form_section_id === this.active_section.id
                );
            } else {
                this.error = true;
                this.backendMsg =
                    "Ocurrió un error con la siguiente sección, por favor verifique los campos.";
            }
        },
        show_guardar() {
            if (this.active_section) {
                if (this.active_section.default_next_form_section === null) {
                    return true;
                }
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
            this.actionDisabled = true;
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
            this.actionSend = null;
            this.$store.dispatch("poll/get_poll").then(poll => {
                this.actionDisabled = false;
                this.title = poll.title;
                this.sections = poll.sections;
                this.questions = poll.questions;
                this.active_section = poll.active_section;
                this.entity_type_id = poll.entity_type_id;
                this.questions.map(q => {
                    q.answer = {
                        question: q.id,
                        answer: null,
                        next_section: null,
                        alternative: null,
                        automatic: null
                    };
                    q.order = q.order === null ? 0 : q.order;
                });
                this.questions.sort((a, b) => {
                    return a.order > b.order ? 1 : -1;
                });
                this.$store.dispatch("form/get_loaded_form").then(form => {
                    this.actions = form.actions;
                    let defaultAction = {
                        area_id: "DEFAULT",
                        cancel_form: null,
                        cancel_process: null,
                        color: null,
                        created_by: "DEFAULT",
                        id: "DEFAULT-ACTION",
                        name: "Guardar",
                        owner_id: "DEFAULT",
                        process_id: null,
                        save_form: 1,
                        refresh_form: 1,
                        text_color: null,
                        valid: 1
                    };

                    if (this.actions.length === 0) {
                        this.actions.push(defaultAction);
                    }

                    this.actionDisabled = false;
                });
            });
        },
        handleNextSection(answersArray, sectionId) {
            this.requiredError = false;
            this.fieldsError = [];
            this.error = false;
            this.backendMsg = "";
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
                        answer.section_id === sectionId &&
                        answer.answer !== null
                    );
                });
                const valSection = this.sections.find(section => {
                    return section.id === firstAFound.next_section;
                });
                if (valSection !== undefined) {
                    this.active_section = valSection;
                    this.identificador = Date.now().toString();
                    this.$store.commit("poll/RECORD", answersArray);
                    this.historyItems = this.$store.getters["poll/history"];
                } else {
                    this.error = true;
                    this.backendMsg =
                        "Ocurrió un error con la siguiente sección, por favor verifique los campos.";
                    return;
                }
            }
        },
        handlePreviousSection() {
            this.active_section = this.sections.find(section => {
                return (
                    section.id ===
                    this.historyItems[this.historyItems.length - 1].section_id
                );
            });
            this.historyItems = this.historyItems.filter(item => {
                return item.section_id !== this.active_section.id;
            });
            this.$store.commit("poll/SETHISTORY", this.historyItems);
        },
        actionHandler(mustSaveForm, action) {
            if (action.refresh_form === 1) {
                this.refresh = true;
            } else {
                this.refresh = false;
            }
            if (action.id !== "DEFAULT-ACTION") {
                this.actionSend = {
                    key: "action_id",
                    value: action.id
                };
            }
            if (mustSaveForm) {
                this.savePoll();
            } else {
                this.reloadPoll();
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
            // deshabilitar acciones durante el guardado
            this.actionDisabled = true;
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
                if (!(val.answer === null || val.answer === undefined)) {
                    field[val.question] =
                        val.alternative === null ||
                        val.alternative === undefined
                            ? val.answer
                            : val.alternative.to_string;
                }
            });
            field["form_id"] = this.id;
            if (this.actionSend !== null) {
                field["action_id"] = this.actionSend.value;
            }
            let formHistoryParsed = [this.inicioForm];
            this.historyItems.map((item, index) => {
                let newItem = {
                    name: "",
                    timestamp: 0
                };
                if (item.alternative !== null) {
                    newItem.name = `${index + 1}.- ${item.questiondesc} - R: ${
                        item.alternative.name
                    }`;
                    newItem.timestamp = item.timestamp;
                } else {
                    newItem.name = `${index + 1}.- ${item.questiondesc} - R: ${
                        item.answer
                    }`;
                    newItem.timestamp = item.timestamp;
                }
                formHistoryParsed.push(newItem);
            });
            formHistoryParsed.push({
                name: "Guardar",
                timestamp: Date.now()
            });
            field["form_interactions"] = formHistoryParsed;
            let formFields = {};
            Object.keys(field).forEach(key => {
                let q = this.questions.find(item => {
                    return item.id === key;
                });
                if (q !== undefined) {
                    formFields[key] = q.form_field_id;
                }
            });
            field["form_fields"] = formFields;
            data[this.entity_type_id].push(field);
            Object.keys(data).forEach(key => {
                formData.append(key, JSON.stringify(data[key]));
            });
            this.$store
                .dispatch("form/save_form", formData)
                .then(response => {
                    //Pueden llegar varias acciones y varios scripts.
                    if (response.response.data.content.scripts[0].actions[0].type === 'update_column') {
                        const getInfoId = Object.keys(response.response.data.content.content.json_sent)[0];

                        this.$store.dispatch("myStore0/info", getInfoId);
                        this.$store.dispatch("myStore0/file_on_demand", response.response.data.content.scripts[0].actions[0].params[0]);
                    }

                    if (response.response.data.success === true) {
                        this.loading = false;
                        this.success = true;
                        this.backendMsg = "Encuesta guardada con exito";
                        this.handleResponseActions(
                            response.response.data.content
                        );
                        setTimeout(() => {
                            if (this.refresh === true) {
                                this.$store.commit("poll/CLEANHISTORY", []);
                                this.historyItems = [];
                                this.$store.commit("poll/CLEANRECORD");
                                this.bus.$emit("reloadedPoll", {});
                                this.reloadPoll();
                            }
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
                    this.actionDisabled = false;
                    this.loading = false;
                    this.error = true;
                    this.backendMsg = "Ocurrió un error al guardar la encuesta";
                    try {
                        this.window.parent.postMessage(err.response.data, "*");
                    } catch (e) {
                        console.warn(e);
                    }
                });
        },
        handleResponseActions(response) {
            for (const script in response.scripts) {
                for (const action in script.actions) {
                    switch (action.type) {
                        case "update_column":
                            for (const param in action.params) {
                                this.modelretrive.push({
                                    id: param.key,
                                    value: param.value
                                });
                            }
                            break;

                        default:
                            break;
                    }
                }
            }
            return;
        }
    }
};
</script>

<style lang="scss" scope>
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

.sheets-field{
    border: 1px solid #999999;
    border-radius: 5px;
}
</style>
