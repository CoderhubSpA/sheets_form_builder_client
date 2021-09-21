import axios from "axios";
import Vue from "vue";

export default {
    namespaced: true,
    state: {
        form:{
            rows: null,
            title: null,
            actions: null
        },
        loading: false,
        title: "RENDERIZADO DE FORMULARIO",
        entityid: "0",
        fieldsvalues: {},
        files: false,
        filearray: [],
        pendingfiles: 0,
        pendingfilesBck: 0,
        entityname: null,
        recordid: null,
        entities_fk: null,
        contentinfo: null
    },
    getters: {
        form: state => state.form,
        loading: state => state.loading,
        title: state => state.title,
        entityid: state => state.entityid,
        fieldsvalues: state => state.fieldsvalues,
        files: state => state.files,
        filearray: state => state.filearray,
        pendingfiles: state => state.pendingfiles,
        pendingfilesBck: state => state.pendingfilesBck,
        entityname: state => state.entityname,
        recordid: state => state.recordid,
        entities_fk: state => state.entities_fk,
        contentinfo: state => state.contentinfo
    },
    mutations: {
        FORM(state,form){
            state.form = form;
        },
        LOADING(state, loading) {
            state.loading = loading;
        },
        TITLE(state, title) {
            state.title = title;
        },
        ENTITYID(state, id) {
            state.entityid = id;
        },
        ENTITYNAME(state, name) {
            state.entityname = name;
        },
        RECORDID(state, id) {
            state.recordid = id;
        },
        FIELDSVALUES(state, data) {
            state.fieldsvalues[data.key] = data.value;
        },
        FILES(state, file) {
            state.files = true;
            if (!(file.id in state.filearray)) {
                state.pendingfiles = state.pendingfiles + 1;
                state.pendingfilesBck = state.pendingfiles;
            }
        },
        UPLOADEDFILE(state) {
            state.pendingfiles = state.pendingfiles - 1;
        },
        FAILEDFILEFORMUPLOAD(state) {
            state.pendingfiles = state.pendingfilesBck;
        },
        PUSHFILES(state, file) {
            const data = {
                fileid: file.id,
                file: file.file
            };
            state.filearray[file.id] = data;
        },
        CLEARFIELDSVALUES(state) {
            state.fieldsvalues = {};
            state.files = false;
            state.filearray = [];
        },
        FILTERFIELDSVALUES(state, ids) {
            const fieldsValues = Object.assign({}, state.fieldsvalues);
            state.fieldsvalues = {};
            ids.map(id => {
                if (fieldsValues[id] !== null) {
                    state.fieldsvalues[id] = fieldsValues[id];
                }
            });
        },
        ENTITIESFK(state, entities_fk) {
            state.entities_fk = entities_fk;
        },
        CONTENTINFO(state, contentinfo) {
            state.contentinfo = contentinfo;
        }
    },
    actions: {
        load_form({commit}, data){
            return new Promise((resolve, reject) => {
                try {
                    resolve({ success: true, error: null });
                } catch (error) {
                    reject({ success: false, error });
                }
            });
        },
        get_loaded_form({commit}){
            return new Promise((resolve, reject) => {
                resolve(this.state.form.form);
            });
        },
        get_form({ commit }, id) {
            commit("LOADING", true);
            return new Promise((resolve, reject) => {
                axios
                    .get(`/api/sheets/form/${id}`)
                    .then(response => {
                        let rows = [];
                        let apiResponse = response.data.content;
                        commit("ENTITYID", apiResponse.entity_type_id);
                        commit("ENTITYNAME", apiResponse.entity_type_name);
                        axios
                            .get(
                                `/api/sheets/entity/info/${apiResponse.entity_type_id}`
                            )
                            .then(responseInfo => {
                                commit(
                                    "CONTENTINFO",
                                    responseInfo.data.content
                                );
                                apiResponse.rows.map(responseRow => {
                                    let rowToPush = responseRow;
                                    rowToPush["sections"] = null;

                                    rowToPush.sections = apiResponse.sections.filter(
                                        responseSection => {
                                            return (
                                                responseSection.form_row_id ===
                                                responseRow.id
                                            );
                                        }
                                    );
                                    rowToPush.sections.sort((a, b) => {
                                        return a.order > b.order ? 1 : -1;
                                    });
                                    rowToPush.sections.map(sectionToPush => {
                                        sectionToPush.fields = apiResponse.fields.filter(
                                            responseField => {
                                                return (
                                                    responseField.form_section_id ===
                                                        sectionToPush.id &&
                                                    responseField.permission !==
                                                        0
                                                );
                                            }
                                        );
                                        sectionToPush.fields.sort((a, b) => {
                                            return a.order > b.order ? 1 : -1;
                                        });
                                    });
                                    rows.push(rowToPush);
                                });

                                rows.sort((a, b) => {
                                    return a.order > b.order ? 1 : -1;
                                });
                                const actions = apiResponse.actions.sort(
                                    (a, b) => {
                                        return a.save_form > b.save_form
                                            ? 1
                                            : -1;
                                    }
                                );
                                const data = {
                                    rows,
                                    title: apiResponse.name.toUpperCase(),
                                    actions,
                                    poll: apiResponse.poll,
                                    fullResponse: response
                                };
                                const form = {
                                    rows,
                                    title: apiResponse.name.toUpperCase(),
                                    actions
                                }
                                commit('FORM', form);
                                resolve(data);
                            })
                            .catch(error => {
                                reject(error);
                            });
                    })
                    .catch(error => {
                        console.log(error)
                        reject(error);
                    })
                    .finally(() => {
                        commit("LOADING", false);
                    });
            });
        },
        get_row({ commit }, data) {
            commit("RECORDID", data.recordid);
            return new Promise((resolve, reject) => {
                axios
                    .get(
                        `/api/sheets/getrecord/${data.entityname}/${data.recordid}`
                    )
                    .then(response => {
                        const notApplicableKeys = [
                            "contract_type_id",
                            "path_id",
                            "tiene_permiso_crear",
                            "tiene_permiso_lectura",
                            "tiene_permiso_edicion"
                        ];
                        const fields = response.data.content.data[0];
                        Object.keys(fields).forEach(key => {
                            const commitData = {
                                key,
                                value: fields[key]
                            };
                            if (!notApplicableKeys.includes(key)) {
                                commit("FIELDSVALUES", commitData);
                            }
                        });
                        commit("ENTITIESFK", response.data.content.entities_fk);

                        resolve({});
                    })
                    .catch(error => {
                        reject(error);
                    })
                    .finally(() => {});
            });
        },
        save_file({ commit }, formData) {
            return new Promise((resolve, reject) => {
                axios
                    .post(`/api/sheets/save/file`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })
                    .then(response => {
                        const data = {
                            response
                        };
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    })
                    .finally(() => {});
            });
        },
        save_form({ commit }, formData) {
            return new Promise((resolve, reject) => {
                axios
                    .post(`/api/sheets/save/form`, formData, {})
                    .then(response => {
                        const data = {
                            response
                        };
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    })
                    .finally(() => {});
            });
        },
        save_form_update({ commit }, formData) {
            return new Promise((resolve, reject) => {
                axios
                    .post(`/api/sheets/save/form/update`, formData, {})
                    .then(response => {
                        const data = {
                            response
                        };
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    })
                    .finally(() => {});
            });
        }
    }
};
