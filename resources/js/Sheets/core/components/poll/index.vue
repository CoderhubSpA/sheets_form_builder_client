<template>
    <div class="container-fluid">
        <h3>
            {{ title }}
        </h3>
        <div class="row" v-for="(row, rowKey) in rows" :key="rowKey">
            <div v-for="(section, sectionKey) in row.sections"
                :key="sectionKey"
                :class="`col-${section.col_md} col-${section.col_sm} col-${section.col_xl} ${activeClass(active_section,section)} section_container`"
                :id="section.id">
                <h5>
                    {{ section.name }}
                </h5>
                <poll-section
                    :section="section"
                    :fields="section.fields"
                    :endform="!!section.default_next_form_section"
                    :active_section="active_section"
                    @next_section="changeSection(section, $event)"/>
            </div>
        </div>
        <br />
        <div class="row">
            <div class="col-12 text-right PollIndex___padding-0">
                <button
                    v-if="can_send_poll"
                    @click="sendForm"
                    class="btn btn-outline-primary float-right">
                    ENVIAR
                </button>
            </div>
        </div>
        <br />
        <div class="row" v-if="errorBackend">
            <div class="col-12 text-right PollIndex___padding-0">
                <span class="text-danger">{{ errorBackendMsg }}</span>
            </div>
        </div>
        <div class="row" v-if="pollsaved">
            <div class="col-12 text-right PollIndex___padding-0">
                <span class="text-success">Encuesta guardada exitosamente</span>
            </div>
        </div>
        <loading-message :status="loading"></loading-message>
        <code>
            Historial
            <pre>
                {{ historial }}
            </pre>
        </code>
    </div>
</template>

<script>
/**
 * @author Jorge Peraza
 */
import question from "./question";
import info from "./info";
import global from '../global'
import LoadingMessage from "../loading-message";
import section from './section'
export default {
    components: {
        'poll-section': section,
        "poll-question": question,
        "poll-info": info,
        'sheet-input': global,
        LoadingMessage,

    },
    props: {
        id: {
            type: String,
            require: true
        }
    },
    data: () => ({
        loading: false,
        errorBackend: false,
        errorBackendMsg: "Ocurrió un error inesperado al guardar la encuesta",
        pollsaved: false,
        rows: [],
        active_section: "",
        can_send_poll: false,
        data: {}
    }),
    computed: {
        historial() {
            return this.$store.getters['poll/record']
        },
        title() {
            return this.$store.getters["poll/title"];
        }
    },
    watch: {
        active_section(val) {
            const section = this.rows[0].sections.find(s => s.id == val)
            section.fields.forEach(f => {
                if (f.format == 'INFO' && !f.next_form_section) {
                    this.can_send_poll = true
                }
            })
        }
    },
    mounted() {
        this.loading = true;
        this.$store.dispatch("poll/getPoll", this.id)
            .then(response => {
                this.$store.commit("form/ENTITYID", response.entity_id);
                this.rows = response.rows;
                // this.active_section = response.active_section;
                this.active_section = this.$store.getters['poll/active_section']
            })
            .catch(err => {

                console.log(err);
            })
            .finally(() => {
                this.loading = false
            })
    },
    methods: {
        endForm(section) {
            return !section.default_next_form_section
        },
        changeSection(section, event) {
            if (event == null) {
                if (section.default_next_form_section == null)
                    this.can_send_poll = true
                else
                    this.active_section = section.default_next_form_section
            }
            else
                this.active_section = event
            // this.$store.commit('poll/ACTIVE_SECTION', this.active_section)

        },
        //
        setSelectedOption(id, val) {
            const action_id = {
                key: id,
                value: val.id
            };
            this.$store.commit("form/FIELDSVALUES", action_id);
            // this.sendForm();
        },
        inputSelectChange(data) {
            const field = {
                key: data.id,
                value: data.value
            };
            if (this.formField.permission === 2) {
                this.$store.commit("form/FIELDSVALUES", field);
            }
        },
        formatOptions(options) {
            let opts = [];
            Object.keys(options).forEach(key => {
                opts.push({
                    id: key,
                    label: options[key]
                });
            });
            return opts;
        },
        activeClass(active_section, section) {
            return active_section === section.id ? "active_section" : "inactive_section";
        },
        sendForm() {
            this.loading = true
            const record = this.$store.getters['poll/record']
            const entity_id = this.$store.getters['poll/entity_type_id']

            let req = []
            req[entity_id] = []

            let answers = []

            record.forEach(rec => {
                answers[rec.question] = rec.answer
            })

            req[entity_id].push(answers)

            let form = new FormData()
            form.append('entityKey', entity_id)

            Object.keys(req).forEach(key => {
                form.append(key, JSON.stringify(req[key]))
            })

            this.$store.dispatch('form/save_form', form)
            .then(response => {
                console.log(response.response)
                this.pollsaved = response.data.success
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                this.loading = false
            })
            // const record = this.$store.getters['poll/record']
            // const entity_type_id = this.$store.getters['poll/entity_type_id']

            // let req = []
            // req[entity_type_id] = []

            // let answers = {}
            // record.forEach(rec => {
            //     answers[rec.question] = rec.answer
            // })

            // req['entityKey'] = entity_type_id
            // req[entity_type_id] = []
            // req[entity_type_id].push(answers)

            // console.log(JSON.parse(req[entity_type_id]))

            // let form = new FormData()
            // form.append('entityKey', entity_type_id)

            // form.append(entity_id, JSON.parse(req[entity_id]))

            // this.$store.dispatch('form/save_form', form)
            // .then(response => {
            //     console.log(response)
            // })
            // .catch(error => {
            //     console.log(error)
            // })
            // .finally(() => {

            // })
        }
    }
};
</script>

<style lang="scss">
.active_section {
    background-color: rgb(226, 226, 221);
    border: 1px solid red;
    // height: 100vh;
    justify-content: center;
    align-items: center;
    animation-name: activate_section;
    animation-duration: 1s;
}
.section_container {
    padding: 25px;
}
.inactive_section {
    display: none;
}

@keyframes activate_section {
    0% {
        background-color: rgb(255, 255, 255);
        color: rgb(255, 255, 255);
    }
    50% {
        background-color: rgb(240, 240, 238);
        color: rgb(112, 112, 112);
    }
    100% {
        background-color: rgb(226, 226, 221);
        color: rgb(0, 0, 0);
    }
}
</style>
