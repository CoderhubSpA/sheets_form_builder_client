/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { isObject } from 'lodash';
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

let abort_request;

export default {
    namespaced: true,
    state: () => ({
        form_loaded: false,
        form_type: 'form',
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
        default_form: false,
        raw: {},
        col_fk_1_n: {},
        form_name: '',
        field_section_show_hide: {},
        field_show_hide: {},
        base_url: '',
        active_filter: [],
        selector_remote_filter: [],
        url_selector_remote: {},
        uuid: null,
        fields_as_object: [],
        entityPermissions: null,
        customMessages: {},
        current_user: {},
        form_data: {},
        parent_form_data: {},
    }),
    getters: {
        form_loaded: (state) => state.form_loaded,
        form_type: (state) => state.form_type,
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
        field_show_hide: (state) => state.field_show_hide,
        // url base
        base_url: (state) => state.base_url,
        active_filter: (state) => state.active_filter,
        selector_remote_filter: (state) => state.selector_remote_filter,
        url_selector_remote: (state) => state.url_selector_remote,
        uuid: (state) => state.uuid,
        fields_as_object: (state) => state.fields_as_object,
        entity_permissions: (state) => state.entityPermissions,
        customMessages: (state) => state.customMessages,
        current_user: (state) => state.current_user,
        form_data: (state) => state.form_data,
        parent_form_data: (state) => state.parent_form_data,
    },
    mutations: {
        FORM_LOADED(state, val) {
            state.form_loaded = val;
        },
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
        DELETE_FILE(state, val) {
            state.files[val] = null;
            let validation = false;
            state.files.forEach((file) => {
                if (file !== null) {
                    validation = true;
                }
            });
            state.hasFiles = validation;
        },
        FIELDS(state, val) {
            Vue.set(state.fields, state.fields.length, val);
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
        FORM_ID(state, val) {
            state.form_id = val;
        },
        FORM_TYPE(state, val) {
            state.form_type = val;
        },
        ERRORS_FIELD(state, val) {
            Vue.set(state.errors_fields, val.key, val.value);
        },
        CLEAR_ERROR_FIELD(state, keyfield) {
            state.errors_fields[keyfield] = '';
        },
        CLEAR_ERRORS_FIELDS(state) {
            state.errors_fields = {};
        },
        CLEARFIELDS(state, val) {
            state.clearfields = val;
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
            const key = Object.keys(val)[0];
            if (!state.col_fk_1_n[key]) {
                Vue.set(state.col_fk_1_n, key, val[key]);
            } else {
                state.col_fk_1_n[key] = val[key];
            }
        },
        FORM_NAME(state, val) {
            state.form_name = val;
        },
        /**
         * Registra el Objeto en forma {id: value}
         * del input para determinar si la seccion debe mostrarse o no
         * @param {*} state
         * @param {*} val
         */
        FIELD_SECTION_SHOW_HIDE(state, val) {
            if (val) {
                const key = Object.keys(val);
                Vue.set(state.field_section_show_hide, key, val[key]);
            }
        },
        FIELD_SHOW_HIDE(state, val) {
            if (val) {
                const key = Object.keys(val);
                Vue.set(state.field_show_hide, key, val[key]);
            }

            if (!val) {
                const key = Object.keys(val);
                Vue.delete(state.field_show_hide, key);
            }
        },
        BASE_URL(state, val) {
            state.base_url = val;
        },
        ACTIVE_FILTERS(state, val) {
            if (val.remote) {
                // Construye item de filtro activo
                const item = {
                    column: val.column,
                    id: `external-filter-${val.column.id}`,
                    order: 0,
                    search: val.search,
                    type: val.type,
                };
                // Busca si el item ya existe en el array de filtros activos
                const preitem = state.active_filter.find((it) => it.id === item.id);
                // Si el valor del filtro es diferente de vacio, null o undefined
                if (val.search !== '' && val.search !== null && val.search !== undefined) {
                    // Si el item ya existe en el array de filtros activos
                    if (preitem) {
                        // Busca el indice del item en el array de filtros activos
                        const preindex = state.active_filter.indexOf(preitem);
                        // Reemplaza el item en el array de filtros activos
                        state.active_filter[preindex] = item;
                    } else {
                        // Si no existe el item en el array de filtros activos
                        // Agrega el item al array de filtros activos
                        state.active_filter.push(item);
                    }
                } else {
                    // Si el valor del filtro es vacio, null o undefined
                    // Y si el item ya existe en el array de filtros activos
                    if (preitem) {
                        // Busca el indice del item en el array de filtros activos
                        const preindex = state.active_filter.indexOf(preitem);
                        // Si lo encuentra
                        if (preindex > -1) {
                            // Elimina el item del array de filtros activos
                            state.active_filter.splice(preindex, 1);
                        }
                    }
                }
                // Reordena los filtros activos
                state.active_filter.forEach((it, key) => {
                    it.order = key + 1;
                });
                // Construye el objeto de filtros activos
                // con solo los filtros que tienen valor (no vacios)
                const mainfilter = {
                    active_filters: state.active_filter.filter((f) => f.value !== ''),
                    searched_col: val.column,
                };
                // Codifica el objeto de filtros activos en formato JSON
                const url = `${encodeURIComponent(JSON.stringify(mainfilter))}`;

                // Comienza a construir el objeto de filtros activos a enviar al servidor
                Vue.set(state.url_selector_remote, val.column.id, url);
                Object.keys(state.url_selector_remote).forEach((key) => {
                    // Obtenemos la columna del filtro desde el entity_info
                    const column = state.contentInfo.content.columns.find((col) => col.id === key);
                    // Obtenemos el filtro actual (si es que se ha filtrado)
                    // TO DO: Deberia ser un find()
                    const filter = _.first(
                        (_.cloneDeep(state.active_filter) || []).filter(
                            (af) => af.column.id == column.id
                        )
                    );
                    // Duplicamos los filtros activos actuales (esto debido a un error de infinity loop)
                    let current_active_filters = _.cloneDeep(state.active_filter);
                    // Ordenamos los filtros segun el orden en que se seleccionaron
                    current_active_filters = current_active_filters.sort((a, b) => (a.order > b.order ? 1 : 0));
                    // Debido a que los filtros filtran filtros, hay que dejar solo los filtros con un order menor
                    // pues estos se seleccionaron antes y filtraran al filtro actual
                    if (filter){
                        current_active_filters = current_active_filters.filter(
                            (f) => f.order < filter.order
                        );
                    }
                    // Eliminamos el filtro actual (pues este no se debe filtrar a si mismo)
                    // Y solo filtramos si es que posee valor para filtrar
                    current_active_filters = current_active_filters
                        .filter((f) => f.column.id !== column.id)
                        .filter((f) => f.value !== '');

                    const newfilter = {
                        active_filters: current_active_filters,
                        searched_col: column,
                    };
                    const newurl = `${encodeURIComponent(JSON.stringify(newfilter))}`;
                    Vue.set(state.url_selector_remote, key, newurl);
                });
            }
        },
        SELECTOR_REMOTE_FILTER(state, val) {
            const item = {
                column: val.column,
                id: `external-filter-${val.column.id}`,
                order: 0,
                search: val.search,
                type: val.type,
            };
            const preitem = state.selector_remote_filter.find((it) => it.id === item.id);
            if (val.search !== '' && val.search !== null && val.search !== undefined) {
                if (preitem) {
                    const preindex = state.selector_remote_filter.indexOf(preitem);
                    state.selector_remote_filter[preindex] = item;
                } else {
                    state.selector_remote_filter.push(item);
                }
            } else {
                if (preitem) {
                    const preindex = state.selector_remote_filter.indexOf(preitem);
                    if (preindex > -1) {
                        state.selector_remote_filter.splice(preindex, 1);
                    }
                }
            }
            state.selector_remote_filter.forEach((it, key) => {
                it.order = key + 1;
            });
        },
        UUID(state, uuid) {
            state.uuid = uuid;
        },
        REMOTE_FILTERS_CLEAR(state, val) {
            state.selector_remote_filter = val;
        },
        FIELDS_AS_OBJECT(state, val) {
            val.forEach(v => state.fields_as_object.push(v));
        },
        ENTITY_PERMISSIONS(state, val) {
            state.entityPermissions = val;
        },
        CUSTOM_MESSAGES(state, val) {
            state.customMessages = val;
        },
        CURRENT_USER(state, val) {
            state.current_user = val;
        },
        FORM_DATA(state, val) {
            state.form_data = val;
        },
        PARENT_FORM_DATA(state, val) {
            state.parent_form_data = val;
        },
    },
    actions: {
        async get({ commit, dispatch, state }, payload) {
            commit('LOADING', true);

            const { id } = payload;
            const { params } = payload;
            const { recordid } = payload;
            const record = {
                entity_name: '',
                id: recordid,
            };
            const URL = recordid ? `/api/sheets/form/${id}/${recordid}` : `/api/sheets/form/${id}`;

            return new Promise((resolve, reject) => {
                axios
                    .get(URL)
                    .then((response) => {
                        const data = response.data.content;

                        // Set record_id to data properties
                        if(recordid) {
                            data.record_id = recordid;
                        }
                        // Set all form data to state
                        commit('FORM_DATA', data);

                        // asignacion del titulo de formulario
                        commit('FORM_NAME', data.name);
                        commit('RAW', data);
                        if (data.type) {
                            commit('FORM_TYPE', data.type);
                        }

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

                        commit('FIELDS_AS_OBJECT', data.fields);

                        commit('FORM_ID', data.id);

                        commit('ENTITY_ID', data.entity_type_id);

                        commit('ENTITY_NAME', data.entity_type_name);
                        record.entity_name = data.entity_type_name;
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

                        if(response.data.content.custom_messages && isObject(JSON.parse(response.data.content.custom_messages)) && Object.keys(JSON.parse(response.data.content.custom_messages)).length > 0) {
                            commit('CUSTOM_MESSAGES', JSON.parse(response.data.content.custom_messages));
                        }

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

                            if (record.id) dispatch('get_record', record);
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
        async get_mock({ commit, dispatch }, payload) {
            commit('LOADING', true);
            const { response, contentinfo } = payload;
            const { recordid } = payload;
            const record = {
                entity_name: '',
                id: recordid,
            };
            return new Promise((resolve, reject) => {
                const data = response.data.content;
                commit('FORM_NAME', data.name);
                commit('RAW', data);

                let actions = [];
                if (data.actions.length > 0) {
                    actions = data.actions.filter((action) => action.valid !== 0);
                } else {
                    actions = [DEFAULT_ACTION];
                }

                commit('FORM_ID', data.id);

                commit('ENTITY_ID', data.entity_type_id);

                commit('ENTITY_NAME', data.entity_type_name);
                record.entity_name = data.entity_type_name;
                commit('DEFAULT_FORM', data.default === 1);
                commit('NAME', data.name);

                const rows = data.rows.map((row) => {
                    const sections = data.sections.filter((sect) => sect.form_row_id === row.id);

                    sections.sort((a, b) => (a.order > b.order ? 1 : -1));

                    sections.forEach((section) => {
                        let fields = [];
                        if (Array.isArray(data.fields)) {
                            fields = data.fields.filter(
                                (f) =>
                                    f.form_section_id === section.id &&
                                    (f.permission !== 0 || (data.default && f.permission === 0))
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
                commit('CONTENT_INFO', contentinfo.data.content);
                commit('LOADING', false);
                resolve(form);
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
        get_filters({ commit }, data) {
            let params = Object.fromEntries(new URLSearchParams(data));
            params = Object.entries(params).map(([ key, val ]) => [ key, val ]);
            params = params[0].toString().replace(/\\/g, '');
            params = params.toString().replace(/,\s*$/, '');
            params = JSON.parse(params);

            abort_request = new AbortController()
            const signal = abort_request.signal;

            commit('LOADING', true);
            return new Promise((resolve, reject) => {
                axios
                    .post(`/api/sheets/getfilters`, params, { signal: signal })
                    .then((response) => {
                        resolve({
                            response: response.data.content.content,
                            success: true,
                        });
                    })
                    .catch((error) => {
                        resolve({
                            response: null,
                            success: false,
                        });
                    })
                    .finally(() => {
                        commit('LOADING', false);
                    });
            });
        },
        get_dimensions({ commit }, params) {
            commit('LOADING', true);
            return new Promise((resolve, reject) => {
                axios
                    .post(`/api/sheets/getDimensions`, params)
                    .then((response) => {
                        resolve({
                            response: response.data.content,
                            success: true,
                        });
                    })
                    .catch((error) => {
                        resolve({
                            response: null,
                            success: false,
                        });
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
                        return response.data.content;
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error);
                    })
                    .finally(() => {
                        commit('FORM_LOADED', true);
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
                axios
                    .post(`/api/sheets/save/file`, data.form, headers)
                    .then((response) => {
                        const id = response.data.content.content.inserted_id;
                        resolve({ id, data: data.file });
                    })
                    .catch((error) => {
                        resolve({ id: 'error-on-upload', data: data.file, error });
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
        remote_filters_clear({ commit }, val) {
            commit('REMOTE_FILTERS_CLEAR', val);
        },
        cancel_request({}, data) {
            if (data.cancel_request) {
                if (abort_request) {
                    abort_request.abort();
                }
            }
        },
        async get_entity_permissions({ commit }, id) {
            if (id) {
                commit('LOADING', true);
                await axios
                    .get(`/api/sheets/entity/info/${id}`)
                    .then((response) => {
                        commit('ENTITY_PERMISSIONS', response.data.content.content.entity_type_permission);
                    })
                    .catch((error) => {
                        // eslint-disable-next-line no-console
                        console.log(error);
                    })
                    .finally(() => {
                        commit('FORM_LOADED', true);
                        commit('LOADING', false);
                    });
            }
        },
        async get_current_user({ commit }) {
            await axios
                .get(`/api/sheets/user`)
                .then((response) => {
                    commit('CURRENT_USER', response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    //
                });
        }
    },
};
