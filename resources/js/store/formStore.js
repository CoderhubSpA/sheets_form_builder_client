import axios from "axios";
import Vue from "vue";

export default {
    namespaced: true,
    state: {
        loading: false,
        title: "RENDERIZADO DE FORMULARIO",
        entityid: "0",
        fieldsvalues: {},
        files: false,
        filearray: [],
        pendingfiles: 0,
        entityname: null,
        recordid: null,
        entities_fk: null
    },
    getters: {
        loading: state => state.loading,
        title: state => state.title,
        entityid: state => state.entityid,
        fieldsvalues: state => state.fieldsvalues,
        files: state => state.files,
        filearray: state => state.filearray,
        pendingfiles: state => state.pendingfiles,
        entityname: state => state.entityname,
        recordid: state => state.recordid,
        entities_fk: state => state.entities_fk
    },
    mutations: {
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
            }
        },
        UPLOADEDFILE(state) {
            state.pendingfiles = state.pendingfiles - 1;
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
        }
    },
    actions: {
        get_form({ commit }, id) {
            return new Promise((resolve, reject) => {
                axios
                    .get(`/api/sheets/form/${id}`)
                    .then(response => {
                        let rows = [];
                        // CAMPO DE PRUEBA
                        // response.data.content.fields.push({
                        //     form_field_id: "b69c263a-8a8d-11eb-965c-test",
                        //     order: 4,
                        //     name: "FILE TEST",
                        //     permission: 1,
                        //     form_section_id: "cdaf5c0d-9522-47fe-b7d1-2e63f62666fc",
                        //     required: 1,
                        //     format: "DOCUMENT",
                        //     col_md: 6,
                        //     col_xl: 6,
                        //     col_sm: 12,
                        //     id: "04c0c94c-40dd-44e1-a5a2-3cd7e3016705",
                        //     column_group_id: null,
                        //     entity_type_id: "2168fdd5-840f-11eb-965c-test",
                        //     col_name: "test",
                        //     entity_type_fk: null,
                        //     entity_type_permission_fk: null,
                        //     col_name_fk: null,
                        //     pivot_table: null,
                        //     entity_type_pivot_fk: null,
                        //     default_value: null,
                        //     col_fk_1_n: null,
                        //     col_fk_n_1: null,
                        //     col_fk_filter: null,
                        //     col_filter_by: null,
                        //     options: null,
                        //     created_by: null,
                        //     width: null,
                        //     filter: null,
                        //     color: null,
                        //     text_color: null
                        // });
                        let apiResponse = response.data.content;
                        commit("ENTITYID", apiResponse.entity_type_id);
                        commit("ENTITYNAME", apiResponse.entity_type_name);
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
                                            responseField.permission !== 0
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
                        const actions = apiResponse.actions.sort((a, b) => {
                            return a.save_form > b.save_form ? 1 : -1;
                        });
                        const data = {
                            rows,
                            title: apiResponse.name.toUpperCase(),
                            actions
                        };
                        resolve(data);
                    })
                    .catch(error => {
                        reject(error);
                    })
                    .finally(() => {});
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
