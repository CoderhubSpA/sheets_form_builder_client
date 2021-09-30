import axios from 'axios';
import Vue from 'vue';

const DEFAULT_ACTION = {
    cancel_form: 0,
    cancel_process: 0,
    color: null,
    id: 'DEFAULT-ACTION',
    name: 'Guardar',
    process_id: null,
    refresh_form: 1,
    save_form: 1,
    text_color: null,
};

export default {
    namespaced: true,
    state: () => ({
        loading: false,
        entityId: '',
        entityName: '',
        name: '',
        files: [],
        contentInfo: null,
        hasFiles: false,
        fields: [],
        pivots: null,
        searchMap: {},
        poll_sections: [],
        poll_questions: [],
        poll_active_section: {},
        history: [],
        clearfields: false,
        form_id: '',
        record_id: null,
        errors_fields: {},
        smarequiredfields:[],
        errorssma: null,
        /**
         * Si “default:1”, el Form Builder no debe enviar al backend:
         * form_id
         * form_fields
         * action_id
         */
        default_form: false,
        /**
         * respuesta del server sin tratar
         */
        raw: {},

    }),
    getters: {
        loading: state => state.loading,
        entity_id: state => state.entityId,
        entity_name: state => state.entityName,
        content_info: state => state.contentInfo,
        hasFiles: state => state.hasFiles,
        files: state => state.files,
        fields: state => state.fields,
        pivots: state => state.pivots,
        searchMap: state => state.searchMap,
        history: state => state.history,
        poll_sections: state => state.poll_sections,
        poll_questions: state => state.poll_questions,
        poll_active_section: state => state.poll_active_section,
        clearfields: state => state.clearfields,
        smarequiredfields: state => state.smarequiredfields,
        errorssma: state => state.errorssma,
        last_section: (state) => {
            const index = state.history.length -1

            const section = state.poll_sections.find(s => s.id === state.history[index].section_id)

            return section
        },
        form_id: state => state.form_id,
        record_id: state => state.record_id,
        errors_fields: state => state.errors_fields,
        default_form: state => state.default_form,
        raw: (state) => state.raw,
        name: (state) => state.name,
    },
    mutations: {
        LOADING(state, val) {
            state.loading = val;
        },
        SMAREQUIREDFIELDS(state, val){
            state.smarequiredfields.push(val)
        },
        ERRORSSMA(state, val){
            state.errorssma = val
        },
        ENTITY_ID(state, val) {
            state.entityId = val;
        },
        ENTITY_NAME(state, val) {
            state.entityName = val;
        },
        RECORD_ID(state, val) {
            state.record_id = val;
        },
        CONTENT_INFO(state, val) {
            state.contentInfo = val;
        },
        FILES(state, val) {
            state.hasFiles = true;
            state.files[val.id] = val;
        },
        FIELDS(state, val) {
            let newKey = Object.keys(val)[0];
            let found = false;
            state.fields.map((field, index) => {
                if(Object.keys(field)[0] === newKey){
                    state.fields[index] = val;
                    found = true;
                }
            });
            if(!found){
                state.fields.push(val);
            }
        },
        SEARCH_MAP(state, val) {
            Vue.set(state.searchMap, val.col_name, val.text);
        },
        POLL_SECTIONS(state, val) {
            state.poll_sections = val;
        },
        POLL_QUESTIONS(state, val) {
            state.poll_questions = val;
        },
        PIVOTS(state, val) {
            state.pivots = val;
        },
        POLL_ACTIVE_SECTION(state, val) {
            state.poll_active_section = val;
        },
        HISTORY(state, val) {
            state.history.push(val);
        },
        DELETE_LAST_HISTORY(state) {
            state.history.pop();
        },
        CLEARFIELDS(state, val) {
            state.clearfields = val;
        },
        FORM_ID(state, val) {
            state.form_id = val;
        },
        ERRORS_FIELD(state, val) {
            Vue.set(state.errors_fields, val.key, val.value);
        },
        CLEAR_ERROR_FIELD(state, keyfield) {
            state.errors_fields[keyfield] = '';
        },
        DEFAULT_FORM(state, val) {
            state.default_form = val;
        },
        RAW(state, val) {
            state.raw = val;
        },
        NAME(state, val) {
            state.name = val;
        },
    },
    actions: {
        async get({ commit, dispatch }, data) {
            commit('LOADING', true);
            const id = data.id;
            const params = data.params;
            // const URL = req.record_id ? `/api/sheets/form/${req.entity}/${req.record_id}` :
            return new Promise((resolve, reject) => {
                axios.get(`/api/sheets/form/${id}`)
                    .then((response) => {
                        const data = response.data.content;
                        commit('RAW', data);
                        // const actions = data.actions.length > 0 ? data.actions : [DEFAULT_ACTION];
                        let actions = null;
                        if (data.actions.length > 0)
                            actions = data.actions.filter((action) => action.valid !== 0);
                        else actions = [DEFAULT_ACTION];
                        // console.log(params)
                        if(params && params.length > 0){
                            const parametrosJson = JSON.parse(params);
                            data.fields.map((item) => {
                                Object.keys(parametrosJson).forEach((paramkey) => {
                                    if(paramkey === item.col_name){
                                        let f = {};
                                        f[item.id] = parametrosJson[paramkey];
                                        commit('FIELDS', f);
                                    }
                                });
                            });
                        }
                        commit('FORM_ID', data.id);

                        commit('ENTITY_ID', data.entity_type_id);

                        commit('ENTITY_NAME', data.entity_type_name);

                        commit('DEFAULT_FORM', data.default === 1);
                        commit('NAME', data.name);

                        let rows = data.rows.map((row) => {
                            let sections = data.sections.filter((sect) => {
                                return sect.form_row_id === row.id
                            })

                            sections.sort((a, b) => {
                                return a.order > b.order ? 1 : -1;
                            })

                            sections.map(section => {
                                let fields = [];
                                if (Array.isArray(data.fields)) {
                                    fields = data.fields.filter((f) => {
                                        return f.form_section_id === section.id && (f.permission !== 0 || (data.default && f.permission === 0))
                                    })
                                } else {
                                    fields = [...data.fields];
                                }
                                fields.sort((a, b) => {
                                    return a.order > b.order ? 1 : -1
                                })
                                section.fields = fields
                            })
                            row.sections = sections
                            return row
                        });
                        rows.sort((a, b) => {
                            return a.order > b.order ? 1 : -1
                        });
                        let form = {
                            rows: rows,
                            actions: actions.sort((a, b) => {
                                return a.save_form > b.save_form ? 1 : -1
                            }),
                            success: response.data.success,
                            message: response.data.message,
                        };
                        resolve(form);
                        return response.data.content;
                    })
                    .then((content) => {
                        if (content) {
                            dispatch('info', content.entity_type_id);
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    })
                    .finally(() => {
                        commit('LOADING', false);
                    });
            });
        },
        update({ commit }, data) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                axios.post(`/api/sheets/save/form/update`, data, {})
                .then(response => {
                    resolve(response.data)
                }).catch(error => {
                    reject(error);
                }).finally(() => {
                    commit('LOADING', false)
                });
            });
        },
        get_record({ commit}, data) {
            commit('LOADING', true)
            commit('RECORD_ID', data.id);
            return new Promise((resolve, reject) => {
                axios.get(`/api/sheets/getrecord/${data.entity_name}/${data.id}`)
                .then(response => {
                    const fields = response.data.content.data[0]
                    Object.keys(fields).forEach(key => {
                        let f = {}
                        f[key] = fields[key]

                        commit('FIELDS', f)
                    })
                    commit('PIVOTS', response.data.content.pivots);
                    resolve(response.data)
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
            })

        },
        async info({ commit }, id) {
            if (id) {
                commit('LOADING', true);
                await axios.get(`/api/sheets/entity/info/${id}`)
                    .then((response) => {
                        commit('CONTENT_INFO', response.data.content);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        commit('LOADING', false);
                    });
            }
        },
        save({ commit }, data) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                axios.post(`/api/sheets/save/form`, data)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    if (error.response.data.content) {
                        const content = error.response.data.content
                        if(typeof content === 'object'){
                            Object.keys(content.errors).map(key => {
                                let value = {
                                    key: key,
                                    value: content.errors[key]
                                }
                                commit('ERRORS_FIELD', value)
                            })
                        }
                    }
                    reject(error.response)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
            })
        },
        async upload_files({ commit }, data) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                const headers = {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
                axios.post(`/api/sheets/save/file`, data, headers)
                .then(response => {
                    const id = response.data.content.content.inserted_id
                    resolve(id)
                })
                .catch(error => {
                    reject(error)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
            });
        },
        get_poll({ commit, dispatch }, id) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                axios.get(`/api/sheets/form/${id}`)
                .then(response => {
                    const data = response.data.content

                    commit('POLL_SECTIONS', data.sections)

                    const active_section = data.sections.find(sec => sec.visible_on_load === 1)
                    commit('POLL_ACTIVE_SECTION', active_section)

                    commit('POLL_QUESTIONS', data.fields)

                    const actions = data.actions.sort((a, b) => { return a.save_form > b.save_form ? 1 : -1})
                    // commit('POLL_ACTIONS', actions)
                    return data.entity_type_id
                })
                .then(entity_type_id => {
                    if (!!entity_type_id) {
                        dispatch('info', entity_type_id)
                    }
                })
                .catch(error => {
                    reject(error)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
            })
        },
    },
};
