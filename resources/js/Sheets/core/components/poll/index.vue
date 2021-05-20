<template>
    <div class="container-fluid">
        <h3>
            {{ title }}
        </h3>
        <div class="row" v-for="(row, rowKey) in rows" :key="rowKey">
            <div v-for="(section, sectionKey) in row.sections"
                :key="sectionKey"
                :class="`col-${section.col_md} col-${section.col_sm} col-${section.col_xl} ${activeClass(active_section,section)} PollIndex___section-container`">
                <h5>
                    {{ section.name }}
                </h5>

                <div v-for="(field, fieldKey) in section.fields" :key="fieldKey">
                    <sheet-input
                        :form="field"
                        @next="nextSection"
                        @optionSelected="setSelectedOption"
                        @sheets-input-change="inputSelectChange"
                        :endForm="endForm(section)"></sheet-input>
                </div>
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
    </div>
</template>

<script>
/**
 * @author Jorge Peraza
 */
import question from "./question";
import info from "./info";
import global from '../global'
import LoadingMessage from "../LoadingMessage.vue";

export default {
    components: {
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
        title() {
            return this.$store.getters["poll/title"];
        }
    },
    watch: {},
    mounted() {
        this.loading = true;
        this.$store
            .dispatch("poll/getPoll", this.id)
            .then(response => {
                this.loading = false;
                this.$store.commit("form/ENTITYID", response.entity_id);
                this.rows = response.rows;
                this.active_section = response.active_section;
            })
            .catch(err => {
                this.loading = false;
                console.log(err);
            });
    },
    methods: {
        endForm(section) {
            return !section.default_next_form_section
        },
        /**
         * @param val => valor retornado por el evento
         */
        nextSection(val) {
            console.log(val)
            if (val.alternative) {
                if (!val.alternative.next_form_section)
                    this.can_send_poll = true;
                else
                    this.active_section = val.alternative.next_form_section
            } else {
                let section = this.rows[0].sections.filter(
                    section => section.id == val.section_owner
                );
                this.active_section = section[0].default_next_form_section
            }

            const sect = this.rows[0].sections.filter(section => section.id === this.active_section)
            if (!sect[0].default_next_form_section) {
                this.can_send_poll = true
            }

        },
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
            return active_section === section.id
                ? "active_section"
                : "inactive_section";
        },
        sendForm() {
            const fieldsValues = Object.assign(
                {},
                this.$store.getters["form/fieldsvalues"]
            );
            let data = [];
            data[this.$store.getters["form/entityid"]] = [];
            data[this.$store.getters["form/entityid"]].push(fieldsValues);

            const formData = new FormData();
            formData.append("entityKey", this.$store.getters["form/entityid"]);

            Object.keys(data).forEach(key => {
                formData.append(key, JSON.stringify(data[key]));
            });
            this.loading = true;
            this.$store
                .dispatch("form/save_form", formData)
                .then(response => {
                    this.loading = false;
                    if (response.response.data.success === true) {
                        this.pollsaved = true;
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        this.errorBackend = true;
                    }
                })
                .catch(err => {
                    this.loading = false;
                    this.errorBackend = true;
                    console.log("error", err);
                });
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
.PollIndex___section-container {
    padding: 25px;
}
.PollIndex___padding-0 {
    padding: 0;
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
