import Vue from "vue";

export default {
    namespaced: true,
    state: {
        poll: {
            title: null,
            sections: null,
            questions: null,
            entity_type_id: null,
            active_section: null
        },
        sections: [],
        questions: [],
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
        history: []
    },
    getters: {
        poll: state => state.poll,
        sections: state => state.sections,
        questions: state => state.questions,
        active_section: state => state.active_section,
        record: state => state.record,
        history: state => state.history
    },
    mutations: {
        POLL(state, val) {
            state.poll = val;
        },
        SECTIONS(state, val) {
            state.sections = val;
        },
        QUESTIONS(state, val) {
            state.questions = val;
        },
        ACTIVE_SECTION(state, val) {
            Object.keys(val).forEach(key => {
                Vue.set(state.active_section, key, val[key]);
            });
        },
        RECORD(state, val) {
            state.record = val;
        },
        CLEANRECORD(state) {
            state.record = [];
        },
        HISTORY(state, val) {
            val.map((item) => {
                state.history.push(item);
            })
        },
        SETHISTORY(state, val){
            state.history = val;
        },
        CLEANHISTORY(state,val){
            state.history = [];
        }
    },
    actions: {
        load_poll({ commit }, data) {
            return new Promise((resolve, reject) => {
                try {
                    commit("SECTIONS", data.content.sections);
                    commit("QUESTIONS", data.content.fields);
                    const loadedPoll = {
                        title: data.content.name,
                        sections: data.content.sections,
                        questions: data.content.fields,
                        entity_type_id: data.content.entity_type_id,
                        active_section: data.content.sections.find(
                            sec => sec.visible_on_load === 1
                        )
                    };
                    commit("POLL", loadedPoll);
                    resolve({ success: true, error: null });
                } catch (error) {
                    reject({ success: false, error });
                }
            });
        },
        get_poll({ commit }) {
            return new Promise((resolve, reject) => {
                resolve(this.state.poll.poll);
            });
        }
    }
};
