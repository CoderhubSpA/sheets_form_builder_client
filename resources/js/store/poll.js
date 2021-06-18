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
        // entity_type_id: ''
    },
    getters: {
        sections: state => state.sections,
        questions: state => state.questions,
        active_section: state => state.active_section,
        record: state => state.record,

        // title: state => state.titlePoll,
        // active_section: state => state.active_section,
        // loading: state => state.loading,
        
        // entity_type_id: state => state.entity_type_id
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
        CLEANRECORD(state){
            state.record = [];
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
