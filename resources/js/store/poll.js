import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        loading: false,
        titlePoll: '',
        active_section: '',
        record: []
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
        },
        RECORD(state, val) {
            state.record.push(val)
        }
    },
    actions: {
        getPoll({ commit }, id) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                axios.get(`/api/sheets/form/${id}`)
                .then(response => {
                    const data = response.data
                    // const data = require('./json.json')
                    // console.log(data)
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
                        if (field) {
                            section.fields.push(field)
                        }


                        rows[index].sections.push(section)

                    });

                    rows.forEach(row => {
                        row.sections.sort((a, b) => a.order > b.order ? 1 : b.order > a.order ? -1 : 0)
                    })
                    let active_section = ''
                    for (let i = 0; i < rows[0].sections.length; i++) {
                        if (rows[0].sections[i].visible_on_load === 1) {
                            active_section = rows[0].sections[i].id
                            break
                        }
                    }
                    // console.log(active_section)
                    commit('ACTIVE_SECTION', active_section)
                    resolve({
                        rows: rows,
                        // active_section: active_section,
                        entity_id: data.content.entity_type_id
                    })
                })
                .catch(error => {
                    reject(error.response)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
            })
        },
    },
    getters: {
        title: state => state.titlePoll,
        active_section: state => state.active_section,
        loading: state => state.loading,
        record: state => state.record
    }
}
