/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
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
        smarequiredfields: [],
        errorssma: null,
        selectorfilters: {},
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
        /**
         * Conjunto de opciones disponibles
         * para multiples selectore 1xn Availables
         * con la misma col_fk_1_n
         */
        col_fk_1_n: {},
        /**
         * Titulo del form
         */
        form_name: '',
        /**
         * Manipula el mostrar/ocultar
         * secciones segun su valor
         */
        field_section_show_hide: {},
        /**
         * Muestra/Oculta campos
         * segun el valor de otro campo
         */
        field_show_hide: {}
    }),
    getters: {
        loading: (state) => state.loading,
        entity_id: (state) => state.entityId,
        entity_name: (state) => state.entityName,
        content_info: (state) => state.contentInfo,
        hasFiles: (state) => state.hasFiles,
        files: (state) => state.files,
        fields: (state) => state.fields,
        pivots: (state) => state.pivots,
        searchMap: (state) => state.searchMap,
        history: (state) => state.history,
        poll_sections: (state) => state.poll_sections,
        poll_questions: (state) => state.poll_questions,
        poll_active_section: (state) => state.poll_active_section,
        clearfields: (state) => state.clearfields,
        smarequiredfields: (state) => state.smarequiredfields,
        errorssma: (state) => state.errorssma,
        last_section: (state) => {
            const index = state.history.length - 1;

            const section = state.poll_sections.find(
                (s) => s.id === state.history[index].section_id
            );

            return section;
        },
        form_id: (state) => state.form_id,
        record_id: (state) => state.record_id,
        errors_fields: (state) => state.errors_fields,
        default_form: (state) => state.default_form,
        raw: (state) => state.raw,
        name: (state) => state.name,
        col_fk_1_n_common: (state) => state.col_fk_1_n,
        selectorfilters: (state) => state.selectorfilters,
        form_name: (state) => state.form_name,
        /**
         * Entrega los valores seleccionados en los fields
         * para ser evaluados en las sections y determinar
         * si debe mostrarse o no
         * @param {*} state
         * @returns {Object}
         */
        field_section_show_hide: (state) => state.field_section_show_hide,
        /**
         * Entrega los valores seleccionado en los field
         * para ser evaluados y determinar si debe mostrarse o no
         */
        field_show_hide: (state) => state.field_show_hide
    },
    mutations: {
        LOADING(state, val) {
            state.loading = val;
        },
        SMAREQUIREDFIELDS(state, val) {
            state.smarequiredfields.push(val);
        },
        ERRORSSMA(state, val) {
            state.errorssma = val;
        },
        SELECTORFILTERS(state, val) {
            state.selectorfilters = {
                ...state.selectorfilters,
                [val.key]: val.value,
            };
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
            Vue.set(state.fields, state.fields.length, val)
            // state.fields.push(val);

            // const newKey = Object.keys(val)[0];
            // let found = false;
            // state.fields.forEach((field, index) => {
            //     if (Object.keys(field)[0] === newKey) {
            //         state.fields[index] = val;
            //         found = true;
            //     }
            // });
            // if (!found) {
            //     state.fields.push(val);
            // }
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
        COL_FK_1_N_COMMON(state, val) {
            const key = Object.keys(val)[0]
            if (!state.col_fk_1_n[key]) {
                Vue.set(state.col_fk_1_n, key, val[key])
            } else {
                state.col_fk_1_n[key] = val[key];
                console.log(state.col_fk_1_n[key].includes(val[key]))
            }
        },
        FORM_NAME(state, val) {
            state.form_name = val
        },
        /**
         * Registra el Objeto en forma {id: value}
         * del input para determinar si la seccion debe mostrarse o no
         * @param {*} state
         * @param {*} val
         */
        FIELD_SECTION_SHOW_HIDE(state, val) {
            if (val) {
                const key = Object.keys(val)
                Vue.set(state.field_section_show_hide, key, val[key])
            }
        },
        FIELD_SHOW_HIDE(state, val) {
            if (val) {
                const key = Object.keys(val)
                Vue.set(state.field_show_hide, key, val[key])
            }
        }
    },
    actions: {
        async get({ commit, dispatch }, payload) {
            commit('LOADING', true);

            const { id } = payload;
            const { params } = payload;
            const { recordid } = payload;
            let record = {
                entity_name: '',
                id: recordid
            };
            const URL = recordid ? `/api/sheets/form/${id}/${recordid}` : `/api/sheets/form/${id}`;
            // const URL = req.record_id ? `/api/sheets/form/${req.entity}/${req.record_id}` :
            return new Promise((resolve, reject) => {
                axios
                    .get(URL)
                    .then((response) => {
                        const data = response.data.content;

                        // asignacion del titulo de formulario
                        commit('FORM_NAME', data.name)
                        commit('RAW', data);
                        // const actions = data.actions.length > 0 ? data.actions : [DEFAULT_ACTION];
                        let actions = [];
                        if (data.actions.length > 0)
                            actions = data.actions.filter((action) => action.valid !== 0);
                        else actions = [DEFAULT_ACTION];
                        // console.log(params)
                        if (params && params.length > 0) {
                            const parametrosJson = JSON.parse(params);
                            data.fields.forEach((item) => {
                                Object.keys(parametrosJson).forEach((paramkey) => {
                                    if (paramkey === item.col_name) {
                                        const f = {};
                                        f[item.id] = parametrosJson[paramkey];
                                        commit('FIELDS', f);
                                    }
                                });
                            });
                        }
                        commit('FORM_ID', data.id);

                        commit('ENTITY_ID', data.entity_type_id);

                        commit('ENTITY_NAME', data.entity_type_name);
                        record.entity_name = data.entity_type_name
                        commit('DEFAULT_FORM', data.default === 1);
                        commit('NAME', data.name);

                        const rows = data.rows.map((row) => {
                            const sections = data.sections.filter(
                                (sect) => sect.form_row_id === row.id
                            );

                            sections.sort((a, b) => (a.order > b.order ? 1 : -1));

                            sections.forEach((section) => {
                                let fields = [];
                                if (Array.isArray(data.fields)) {
                                    fields = data.fields.filter(
                                        (f) =>
                                            f.form_section_id === section.id &&
                                            (f.permission !== 0 ||
                                                (data.default && f.permission === 0))
                                    );
                                } else {
                                    fields = [...data.fields];
                                }
                                fields.sort((a, b) => (a.order > b.order ? 1 : -1));
                                section.fields = fields;
                            });
                            row.sections = sections;
                            return row;
                        });
                        rows.sort((a, b) => (a.order > b.order ? 1 : -1));
                        const form = {
                            rows,
                            actions: actions.sort((a, b) => (a.save_form > b.save_form ? 1 : -1)),
                            success: response.data.success,
                            message: response.data.message,
                        };
                        resolve(form);
                        return response.data.content;
                    })
                    .then((content) => {
                        if (content) {
                            dispatch('info', content.entity_type_id);

                            if (record.id)
                                dispatch('get_record', record)
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
            commit('LOADING', true);
            return new Promise((resolve, reject) => {
                axios
                    .post(`/api/sheets/save/form/update`, data, {})
                    .then((response) => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        reject(error);
                    })
                    .finally(() => {
                        commit('LOADING', false);
                    });
            });
        },
        get_record({ commit }, data) {
            commit('LOADING', true);
            commit('RECORD_ID', data.id);
            return new Promise((resolve, reject) => {
                axios
                    .get(`/api/sheets/getrecord/${data.entity_name}/${data.id}`)
                    .then((response) => {
                        const fields = response.data.content.data[0];

                        Object.keys(fields).forEach((key) => {
                            const f = {};
                            f[key] = fields[key];

                            commit('FIELDS', f);
                        });
                        commit('PIVOTS', response.data.content.pivots);
                        resolve(response.data);
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        // console.log(error);
                        reject(error);
                    })
                    .finally(() => {
                        commit('LOADING', false);
                    });
            });
        },
        async info({ commit }, id) {
            if (id) {
                commit('LOADING', true);
                await axios
                    .get(`/api/sheets/entity/info/${id}`)
                    .then((response) => {
                        commit('CONTENT_INFO', response.data.content);
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error);
                    })
                    .finally(() => {
                        commit('LOADING', false);
                    });
            }
        },
        save({ commit }, data) {
            commit('LOADING', true);
            return new Promise((resolve, reject) => {
                axios
                    .post(`/api/sheets/save/form`, data)
                    .then((response) => {
                        resolve(response.data);
                    })
                    .catch((error) => {
                        if (error.response.data.content) {
                            const { content } = error.response.data;
                            if (typeof content === 'object') {
                                if (typeof content.errors === 'object') {
                                    Object.keys(content.errors).forEach((key) => {
                                        const value = {
                                            key,
                                            value: content.errors[key],
                                        };
                                        commit('ERRORS_FIELD', value);
                                    });
                                }
                            }
                        }
                        reject(error.response);
                    })
                    .finally(() => {
                        commit('LOADING', false);
                    });
            });
        },
        async upload_files({ commit }, data) {
            commit('LOADING', true);
            return new Promise((resolve, reject) => {
                const headers = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                };
                console.log(data.form)
                axios.post(`/api/sheets/save/file`, data.form, headers)
                    .then((response) => {
                        console.log(response.data)
                        const id = response.data.content.content.inserted_id;
                        resolve({ id: id, data: data.file });
                    }).catch((error) => {
                        reject(error);
                    })
                    .finally(() => {
                        commit('LOADING', false);
                    });
            });
        },
        get_poll({ commit, dispatch }, id) {
            commit('LOADING', true);
            return new Promise((resolve, reject) => {
                axios
                    .get(`/api/sheets/form/${id}`)
                    .then((response) => {
                        const data = response.data.content;

                        commit('POLL_SECTIONS', data.sections);

                        const activeSection = data.sections.find(
                            (sec) => sec.visible_on_load === 1
                        );
                        commit('POLL_ACTIVE_SECTION', activeSection);

                        commit('POLL_QUESTIONS', data.fields);

                        // eslint-disable-next-line no-unused-vars
                        const actions = data.actions.sort((a, b) =>
                            a.save_form > b.save_form ? 1 : -1
                        );
                        // commit('POLL_ACTIONS', actions)
                        return data.entity_type_id;
                    })
                    .then((entityTypeId) => {
                        if (entityTypeId) {
                            dispatch('info', entityTypeId);
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
    },
};
