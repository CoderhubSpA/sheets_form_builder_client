<template>
    <div :id="id">

        <div v-for="(field, key) in fields" :key="key">
            <div v-for="(field, fieldKey) in fields" :key="fieldKey">

                <sheet-input
                    :form="field"
                    :styles="parsedFieldStyles(field)"
                    :active_section="$store.getters['poll/active_section']"
                    v-on:question:selected="getAnswer($event)"
                    @sheets-input-change="getAnswer($event, field.form_field_id)"
                    :error-message="errors_messages[fieldKey].msg"
                    ></sheet-input>
            </div>
            <button
                :class="`btn btn-info mt-4 float-right ${endForm ? 'hide' : 'show'}`"
                @click="go_next">
                Siguiente
            </button>
        </div>
    </div>
</template>

<script>
import global from '../global'
export default {
    components: {
        'sheet-input' : global
    },
    props: {
        section: {
            type: Object,
            require: true
        },
        fields: {
            type: Array,
            default: () => []
        },
        active_section: {
            type: String,
            default: ''
        }
    },
    data: () => ({
        responses: [],
        errors_messages: [{
            id: '',
            msg: []
        }],
        info: {}
    }),
    watch: {
        responses() {
            this.can_next()
        }
    },
    computed: {
        id() {
            return this.section.id
        },
        endForm() {
            let hasNext = false
            this.fields.forEach(field => {
                if (field.alternatives) {
                    for (const key in field.alternatives) {
                        hasNext = !!field.alternatives[key].next_form_section
                    }
                }
            })
            return !(hasNext || !!this.section.default_next_form_section)
        },
    },
    watch: {
        active_section(val) {
            this.fields.forEach(field => {
                if (field.format == "INFO" && field.form_section_id == val) {
                    let data = {
                        question: field.id,
                        answer: field.name, //info.form_field_id,
                        required: field.required == 1,
                        next_section: !!field.next_form_section ? field.next_form_section : null
                    }
                    this.$store.commit('poll/RECORD', data)
                }
            })
        }
    },
    mounted() {
        // limpiar errores
        this.errors_messages = []
        this.fields.forEach(element => {
            const pre = {
                question: element.form_field_id,
                answer: null,
                required: !!element.required
            }
            this.responses.push(pre)
            let err = {
                id: element.id,
                msg: []
            }
            this.errors_messages.push(err)
        })
        //
    },
    methods: {
        parsedFieldStyles(field) {
            return (field.format === "DOCUMENT") || (field.format === "DOCUMENT[IMAGE]") ? ["custom-file-input"] : ['form-control']
        },
        getAnswer(e, id = null) {
            let answer = {}
            if (typeof(e) != 'object') {
                answer = {
                    question: id,
                    answer: e,
                    next_section: null
                }
            }
            else {
                answer = {
                    question: e.id,
                    answer: e.selected_value.id,
                    next_section: e.alternative.next_form_section
                }
            }

            let q = this.responses.find(q => q.question === answer.question)

            answer['required'] = !!q.required
            const index = this.responses.indexOf(q)
            q = answer
            Vue.set(this.responses, index, q)
        },
        /**
         * Mostrar u ocultar
         * el btn de siguiente
         */
        can_next() {
            return this.responses.every(el => (el.required && !!el.answer) || (!el.required) )
        },
        /**
         * Ir a la siguiente seccion
         */
        go_next() {
            // limpiar posibles mensajes anteriores de error
            this.clear_errors()
            // validacion de todas las preguntas requeridas
            if (this.verify_answer()) {
                // guardar historial de preguntas
                this.responses.forEach(r => {
                    this.$store.commit('poll/RECORD', r)
                })
                // ir a la siguiente seccion
                this.$emit('next_section', this.responses[0].next_section)
            }

        },
        clear_errors() {
            for (let index = 0; index < this.errors_messages.length; index++) {
                this.errors_messages[index].msg = []
            }
        },
        verify_answer() {
            this.responses.map(r => {
                if (r.required && !r.answer) {
                    let err = this.errors_messages.find(error =>  error.id === r.question )
                    if (err) {
                        const index = this.errors_messages.indexOf(err)
                        err.msg = ['Campo Requerido']
                        Vue.set(this.errors_messages, index, err)
                    }
                }
            })

            return this.errors_messages.every(err => err.msg.length == 0 )
        }
    }
}
</script>

<style>

</style>
