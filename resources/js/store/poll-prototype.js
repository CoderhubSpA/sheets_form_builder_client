import axios from 'axios'
import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        sections: [],
        questions: [],
        // title: '',
        active_section: {
            id: "",
            order: null,
            form_id: "",
            form_row_id: "",
            name: "",
            color: null,
            text_color: null,
            area_id: "",
            owner_id: "",
            valid: 1,
            col_md: 12,
            col_xl: 12,
            col_sm: 12,
            visible_on_load: 1,
            default_next_form_section: ""
        },
        record: [],
        exams: []
        // entity_type_id: ''
    },
    getters: {
        sections: state => state.sections,
        questions: state => state.questions,
        active_section: state => state.active_section,
        record: state => state.record,
        exams: state => state.exams
    },
    mutations: {
        SECTIONS(state, val) {
            state.sections = val
        },
        QUESTIONS(state, val) {
            state.questions = val
        },
        ACTIVE_SECTION(state, val) {
            Object.keys(val).forEach(key => {
                Vue.set(state.active_section, key, val[key])
            })
            console.log(state.active_section)
        },
        RECORD(state, val) {
            state.record = val;
        },
        ADD_EXAM(state, val) {
            val.forEach(exam => {
                console.log(exam)
                Vue.set(state.exams, state.exams.length, exam.entity_id)
            })

        }
    },
    actions: {
        get_poll({ commit }, id) {
            return new Promise((resolve, reject) => {
                axios.get(`/api/sheets/form/${id}`)
                .then(response => {
                    const data = response.data
                    // commit AS
                    commit("SECTIONS",data.content.sections);
                    commit("QUESTIONS",data.content.fields);
                    resolve({
                        title: data.content.name,
                        sections: data.content.sections,
                        questions: data.content.fields,
                        entity_type_id: data.content.entity_type_id,
                        active_section: data.content.sections.find(sec => sec.visible_on_load === 1)
                    })
                })
                .catch(error => {
                    console.log(error)
                    reject(error.response)
                })
                .finally(() => {

                })
            })
        },
    },

}
