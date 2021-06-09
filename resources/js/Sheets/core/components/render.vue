<template>
    <div>
        <div class="container-fluid SheetsFormRender__main-container">
            <div class="row">
                <div class="col text-center">
                    <h3 class="SheetsFormRender__form-title">
                        {{ title }}
                    </h3>
                </div>
            </div>
            <hr />
            <div
                class="row SheetsFormRender__container"
                v-for="(row, index) in rows"
                :key="index"
            >
                <sheets-form-render-row
                    :bus="bus"
                    :row="row"
                    v-on:sheets-search-map-form="searchMap"
                    v-model="result[index]"
                ></sheets-form-render-row>
            </div>
            <div class="row" v-if="error">
                <div class="col text-center">
                    <p class="text-danger">
                        {{ backendMsg }}
                    </p>
                </div>
            </div>
            <div class="row" v-if="success">
                <div class="col text-center">
                    <p class="text-success">
                        {{ backendMsg }}
                    </p>
                </div>
            </div>
            <div class="row text-center SheetsFormRender__form-btn-block">
                <div class="col" v-for="(action, key) in actions" :key="key">
                    <sheets-action
                        :action="action"
                        v-on:sheets-action-trigger="actionHandler"
                    ></sheets-action>
                </div>
            </div>
        </div>
        <loading-message :status="loading"></loading-message>
    </div>
</template>

<script>
/**
 * @author Sócrates Manaure
 */
import LoadingMessage from "./loading-message";
import SheetsFormRenderRow from "./row";
import SheetsAction from "./button";
export default {
    components: {
        LoadingMessage,
        SheetsFormRenderRow,
        "sheets-action": SheetsAction
    },
    props: {
        formid: {
            type: String,
            default: ""
        },
        recordid: {
            type: String,
            default: ""
        }
    },
    data: () => ({
        rows: [],
        loading: false,
        title: "RENDERIZADO DE FORMULARIO",
        result: [],
        error: false,
        success: false,
        backendMsg: "",
        actions: [],
        bus: new Vue(),
        windowName: `SheetsFormRendered${new Date().getTime()}`,
        parentWindow: null,
        parentIFrameURL: process.env.MIX_SHEETS_PARENT_IFRAME_URL,
    }),
    computed: {},
    created() {
        if (this.recordid === "") {
            this.$store.commit("form/CLEARFIELDSVALUES");
        }
    },
    mounted() {
        window.name = this.windowName;
        this.parentWindow = window.parent;
        this.getForm();
    },
    methods: {
        searchMap(data) {
            this.bus.$emit("searchMap", data);
        },
        getForm() {
            this.error = false;
            this.success = false;
            this.backendMsg = "";
            const fieldsValues = Object.assign(
                {},
                this.$store.getters["form/fieldsvalues"]
            );
            this.loading = true;
            if (this.recordid != "") {
                this.$store
                    .dispatch("form/get_form", this.formid)
                    .then(response => {
                        this.loading = true;
                        const entityname = this.$store.getters[
                            "form/entityname"
                        ];
                        const getEdit = {
                            recordid: this.recordid,
                            entityname
                        };
                        this.$store
                            .dispatch("form/get_row", getEdit)
                            .then(response => {
                                this.$store
                                    .dispatch("form/get_form", this.formid)
                                    .then(response => {
                                        this.loading = false;
                                        this.title = response.title;
                                        this.rows = response.rows;
                                        this.actions = response.actions;
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
                                            text_color: null,
                                            valid: 1
                                        };
                                        if (this.actions.length === 0) {
                                            this.actions.push(defaultAction);
                                        }
                                    })
                                    .catch(err => {
                                        this.loading = false;
                                        console.log("error", err);
                                    });
                            })
                            .catch(err => {
                                this.loading = false;
                                console.log("error", err);
                            });
                    })
                    .catch(err => {
                        this.loading = false;
                        console.log("error", err);
                        this.actions = response.actions;
                    });
            } else {
                this.$store
                    .dispatch("form/get_form", this.formid)
                    .then(response => {
                        this.loading = false;
                        this.title = response.title;
                        this.rows = response.rows;
                        this.actions = response.actions;
                    })
                    .catch(err => {
                        this.loading = false;
                        console.log("error", err);
                    });
            }
        },
        actionHandler(mustSaveForm, action) {
            if (action.id !== "DEFAULT-ACTION") {
                const action_id = {
                    key: "action_id",
                    value: action.id
                };
                this.$store.commit("form/FIELDSVALUES", action_id);
            }
            if (mustSaveForm) {
                this.saveForm();
            } else {
                if (this.recordid === "") {
                    this.resetForm();
                } else {
                    console.log("resetear formulario de edición?");
                }
            }
        },
        saveForm() {
            this.loading = true;
            this.error = false;
            this.backendMsg = "Ocurrió un error al guardar los datos";
            this.success = false;
            this.backendMsg = "";
            const files = this.$store.getters["form/files"];
            let fieldIds = [];
            this.rows.map(row => {
                row.sections.map(section => {
                    section.fields.map(field => {
                        if (field.permission === 2) {
                            fieldIds.push(field.id);
                        }
                    });
                });
            });
            if (files === true) {
                const filesArray = this.$store.getters["form/filearray"];
                Object.entries(filesArray).map(file => {
                    const formData = new FormData();
                    formData.append("file", file[1].file);
                    formData.append("fileid", file[1].fileid);
                    this.$store
                        .dispatch("form/save_file", formData)
                        .then(response => {
                            if (response.response.data.success === true) {
                                const dataResponse = {
                                    key: file[1].fileid,
                                    value:
                                        response.response.data.content.content
                                            .inserted_id
                                };
                                this.$store.commit(
                                    "form/FIELDSVALUES",
                                    dataResponse
                                );
                                this.$store.commit("form/UPLOADEDFILE");
                                this.sendForm(fieldIds);
                            } else {
                                this.loading = false;
                                this.error = true;
                                if (response.response.data.content) {
                                    if (response.response.data.content.errors) {
                                        Object.keys(
                                            response.response.data.content
                                                .errors
                                        ).forEach(key => {
                                            this.backendMsg =
                                                response.response.data.content.errors[
                                                    key
                                                ];
                                        });
                                    } else {
                                        this.backendMsg =
                                            "Ocurrió un error al guardar el formulario";
                                    }
                                } else {
                                    this.backendMsg =
                                        "Ocurrió un error al guardar el formulario";
                                }
                                console.log(
                                    "error de guardado",
                                    response.response.data.content
                                );
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            this.error = true;
                            console.log(
                                "error de guardado",
                                response.response.data.content
                            );
                            this.backendMsg =
                                "Ocurrió un error al guardar los datos";
                        });
                });
            } else {
                this.sendForm(fieldIds);
            }
        },
        resetForm() {
            this.rows = [];
            this.$store.commit("form/CLEARFIELDSVALUES");
            this.getForm();
        },
        sendForm(fieldsIds) {
            const pendingFiles = this.$store.getters["form/pendingfiles"];
            this.bus.$emit("cleanValidation", {});
            fieldsIds.push("action_id");
            if (pendingFiles === 0) {
                if (this.recordid != "") {
                    fieldsIds.push("id");
                }
                this.$store.commit("form/FILTERFIELDSVALUES", fieldsIds);
                const fieldsValues = Object.assign(
                    {},
                    this.$store.getters["form/fieldsvalues"]
                );
                let data = [];
                data[this.$store.getters["form/entityid"]] = [];
                data[this.$store.getters["form/entityid"]].push(fieldsValues);

                const formData = new FormData();
                formData.append(
                    "entityKey",
                    this.$store.getters["form/entityid"]
                );

                Object.keys(data).forEach(key => {
                    formData.append(key, JSON.stringify(data[key]));
                });
                if (this.recordid != "") {
                    this.$store
                        .dispatch("form/save_form_update", formData)
                        .then(response => {
                            if (response.response.data.success === true) {
                                this.loading = false;
                                this.success = true;
                                this.backendMsg =
                                    "Formulario enviado con exito";
                                setTimeout(() => {
                                    this.rows = [];
                                    this.$store.commit(
                                        "form/CLEARFIELDSVALUES"
                                    );
                                    this.getForm();
                                }, 1500);
                            } else {
                                this.loading = false;
                                this.error = true;
                                if (response.response.data.content) {
                                    if (response.response.data.content.errors) {
                                        Object.keys(
                                            response.response.data.content
                                                .errors
                                        ).forEach(key => {
                                            this.backendMsg =
                                                response.response.data.content.errors[
                                                    key
                                                ];
                                        });
                                    } else {
                                        this.backendMsg =
                                            "Ocurrió un error al guardar el formulario";
                                    }
                                } else {
                                    this.backendMsg =
                                        "Ocurrió un error al guardar el formulario";
                                }
                                console.log(
                                    "error de guardado",
                                    response.response.data.content
                                );
                            }
                            if(this.parentWindow.name !== this.windowName){
                                this.parentWindow.postMessage(response.response.data, this.parentIFrameURL);
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            console.log("error", err.response);
                            if(err.response.status === 400){
                                const failedFields = Object.keys(err.response.data.content.errors);
                                this.error = true;
                                this.backendMsg = err.response.data.content.message;
                                this.bus.$emit("requiredFailed", failedFields, err.response.data.content.errors);
                            }
                            if(this.parentWindow.name !== this.windowName){
                                this.parentWindow.postMessage(response.response.data, this.parentIFrameURL);
                            }
                        });
                } else {
                    this.$store
                        .dispatch("form/save_form", formData)
                        .then(response => {
                            if (response.response.data.success === true) {
                                this.loading = false;
                                this.success = true;
                                this.backendMsg =
                                    "Formulario enviado con exito";
                                setTimeout(() => {
                                    this.rows = [];
                                    this.$store.commit(
                                        "form/CLEARFIELDSVALUES"
                                    );
                                    this.getForm();
                                }, 1500);
                            } else {
                                this.loading = false;
                                this.error = true;
                                if (response.response.data.content) {
                                    if (response.response.data.content.errors) {
                                        Object.keys(
                                            response.response.data.content
                                                .errors
                                        ).forEach(key => {
                                            this.backendMsg =
                                                response.response.data.content.errors[
                                                    key
                                                ];
                                        });
                                    } else {
                                        this.backendMsg =
                                            "Ocurrió un error al guardar el formulario";
                                    }
                                } else {
                                    this.backendMsg =
                                        "Ocurrió un error al guardar el formulario";
                                }
                                console.log(
                                    "error de guardado",
                                    response.response.data.content
                                );
                            }
                            if(this.parentWindow.name !== this.windowName){
                                this.parentWindow.postMessage(response.response.data, this.parentIFrameURL);
                            }
                        })
                        .catch(err => {
                            this.loading = false;
                            if(err.response.status === 400){
                                const failedFields = Object.keys(err.response.data.content.errors);
                                this.error = true;
                                this.backendMsg = err.response.data.content.message;
                                this.bus.$emit("requiredFailed", failedFields, err.response.data.content.errors);
                            }
                            if(this.parentWindow.name !== this.windowName){
                                this.parentWindow.postMessage(response.response.data, this.parentIFrameURL);
                            }
                        });
                }
            }
        }
    }
};
</script>

<style>
.SheetsFormRender__main-container {
    padding: 25px;
    background: rgb(230, 230, 230);
    border-radius: 10px;
    margin-top: 15px;
    margin-bottom: 15px;
}
.SheetsFormRender__form-title {
    font-weight: bolder;
    font-size: 25px;
    letter-spacing: 0.25rem;
    text-transform: uppercase;
}
.SheetsFormRender__form-btn-block {
    margin-top: 2rem;
}
</style>
