import axios from 'axios'
import { reject } from 'lodash'
import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        loading: false,
        entityId: '',
        entityName: '',
        files: [],
        contentInfo: null,
        hasFiles: false,
        fields: [],
        searchMap: {}
    },
    getters: {
        loading: state => state.loading,
        entity_id: state => state.entityId,
        entity_name: state => state.entityName,
        content_info: state => state.contentInfo,
        hasFiles: state => state.hasFiles,
        files: state => state.files,
        fields: state => state.fields,
        searchMap: state => state.searchMap

    },
    mutations: {
        LOADING(state, val) {
            state.loading = val
        },
        ENTITY_ID(state, val) {
            state.entityId = val
        },
        ENTITY_NAME(state, val) {
            state.entityName = val
        },
        CONTENT_INFO(state, val) {
            state.contentInfo = val
        },
        FILES(state, val) {
            state.hasFiles = true
            state.files[val.id] = val
        },
        FIELDS(state, val) {
            state.fields.push(val)
        },
        SEARCH_MAP(state, val) {
            Vue.set(state.searchMap, val.col_name, val.text)
        }
    },
    actions: {
        async get({ commit, dispatch }, id) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                axios.get(`/api/sheets/form/${id}`)
                .then(response => {
                    const data = response.data.content

                    commit('ENTITY_ID', data.entity_type_id)
                    commit('ENTITY_NAME', data.entity_type_name)

                    let rows = data.rows.map(row => {
                        let sections = data.sections.filter(sect => {
                            return sect.form_row_id === row.id
                        })

                        sections.sort((a, b) => {
                            return a.order > b.order ? 1 : -1;
                        })

                        sections.map(section => {
                            let fields = data.fields.filter(f => {
                                return f.form_section_id === section.id && f.permission !== 0
                            })
                            fields.sort((a, b) => {
                                return a.order > b.order ? 1 : -1;
                            })
                            section.fields = fields
                        })
                        row.sections = sections
                        return row
                    })
                    rows.sort((a, b) => {
                        return a.order > b.order ? 1 : -1
                    })
                    let form = {
                        rows: rows,
                        actions: data.actions.sort((a, b) => {
                                return a.save_form > b.save_form ? 1 : -1
                            }),
                        success: response.data.success,
                        message: response.data.message
                        }
                    resolve(form)

                    return response.data.content
                })
                .then(content => {
                    if (!!content) {
                        dispatch('info', content.entity_type_id)
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
        update({ commit }, data) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                axios.post(`/api/sheets/save/form/update`, data, {})
                .then(response => {
                    const data = response
                    resolve(data);
                }).catch(error => {
                    reject(error);
                }).finally(() => {
                    commit('LOADING', false)
                });
            });
        },
        get_record({ commit}, data) {
            commit('LOADING', true)

            return new Promise((resolve, reject) => {
                axios.get(`/api/sheets/getrecord/${data.entity_name}/${data.id}`)
                .then(response => {
                    const fields = response.data.content.data[0]
                    Object.keys(fields).forEach(key => {
                        let f = {}
                        f[key] = fields[key]

                        commit('FIELDS', f)
                    })
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
            })

        },
        info({ commit }, id) {
            if (!!id) {
                commit('LOADING', true)
                axios.get(`/api/sheets/entity/info/${id}`)
                .then(response => {
                    commit('CONTENT_INFO', response.data.content)
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
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
                    reject(error.response)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
            })
        },
        upload_files({ commit }, data) {
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
        }
    }
}
