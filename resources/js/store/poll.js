import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        loading: false,
        titlePoll: '',
        active_section: 'waiting for id'
    },
    mutations: {
        LOADING(state, val) {
            state.loading = val
        },
        TITLE_POLL(state, val) {
            state.titlePoll = val
        },
        ACTIVE_SECTION: (state , val) => {
            state.active_section = val
        }
    },
    actions: {
        getPoll({ commit }, id) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                axios.get(`/api/sheets/form/${id}`)
                .then(response => {
                    const data = response.data

                    commit('TITLE_POLL', data.content.name)
                    let rows = data.content.rows.map(row =>{
                        row['sections'] = []
                        return row
                    })

                    data.content.sections.forEach(section => {
                        let row = rows.find(r => r.id === section.form_row_id)
                        const index = rows.indexOf(row)
                        section['fields'] = []

                        let field =  data.content.fields.find(f => f.form_section_id === section.id)
                        section.fields.push(field)

                        rows[index].sections.push(section)

                    });

                    rows.forEach(row => {
                        row.sections.sort((a, b) => a.order > b.order ? 1 : b.order > a.order ? -1 : 0)
                    })

                    commit('ACTIVE_SECTION', rows[0].sections[0].id)

                    resolve(rows)
                })
                .catch(error => {
                    reject(error.response)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
            })
        },
        nextQuestion({ commit }, section_id) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                try {
                    commit('ACTIVE_SECTION', section_id)
                    resolve(section_id)
                } catch (error) {
                    reject(error)
                }
                finally {
                    commit('LOADING', false)
                }
            })
        }
    },
    getters: {
        title: state => state.titlePoll,
        active_section: state => state.active_section,
        loading: state => state.loading
    }
}
