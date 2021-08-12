<template>
    <div class="">
        <sheets-row v-for="(row, key) in formRows" :key="key" :row="row" v-model="formAnswer[key]">

        </sheets-row>

        <div class="row text-center">
            <div class="col" v-for="(action, key) in formActions" :key="key">
                <sheets-action :action="action" @trigger="handlerAction"></sheets-action>
            </div>
        </div>
        <sheets-loading :status="loading" />
        <sheets-snackbar :message="snackbar.message" :show="true" :type="snackbar.success"/>
    </div>
</template>

<script>
import Row from './grid/row.vue'
import Action from './actions/button.vue'
import Loading from './utils/loading.vue'
import Snackbar from './utils/snackbar.vue'
export default {
    name: 'sheets-form',
    props: {
        // ID de la entidad
        entityId: {
            type: String,
            require: true
        },
        // ID del registro
        record_id: {
            type: String,
            require: false,
            default: null
        }
    },
    components: {
        'sheets-loading': Loading,
        'sheets-row': Row,
        'sheets-action': Action,
        'sheets-snackbar': Snackbar
    },
    data: () =>({
        // filas de form
        formRows: [],
        // botones del formulario
        formActions: [],
        // informacion resultante del llenado del formulario
        formAnswer: [],
        // archivos cargados en el form
        files: [],
        snackbar: {
            message: '',
            success: false
        }
    }),
    computed: {
        loading() {
            return this.$store.getters['formBuilder/loading']
        },
        result() {
            let arr = []
            this.formAnswer.forEach(row => {
                arr = arr.concat(row)
            })
            return arr
        },
        filesInForm() {
            return this.$store.getters['formBuilder/hasFiles']
        }
    },
    mounted() {
        this.$store.dispatch('formBuilder/get', this.entityId)
        .then(form => {

            this.formRows = form.rows
            this.formActions = form.actions

            this.snackbar = {
                message: form.message,
                success: form.success
            }
        })
        .then(() => {
            this.get_record()
        }).catch(error => {
            this.snackbar ={
                message: error.message,
                success: false
            }
        })


    },
    methods: {
        async get_record() {
            if (!!this.record_id) {
                const data = {
                    entity_name: this.$store.getters['formBuilder/entity_name'],
                    id: this.record_id
                }
                await this.$store.dispatch('formBuilder/get_record', data)
            }
        },
        save() {
            const entityId = this.$store.getters['formBuilder/entity_id']

            let data = {}
            data[entityId] = []

            let body = {}
            this.result.map(r => {
                if (!!r) {
                    let obj = Object.assign({}, r)
                    let key = Object.keys(obj)[0]
                    body[key] = obj[key]
                }
            })

            data[entityId].push(body)
            let form = new FormData()
            form.append('entityKey', entityId)

            Object.keys(data).forEach(key => {
                form.append(key, JSON.stringify(data[key]))
            })

            const action = this.record_id != '' ?  'formBuilder/update' : 'formBuilder/save'
            console.log('guardado de form', action)
            this.$store.dispatch(action, form)
            .then(response => {
                this.resetForm()
            })
        },
        async sendFiles() {
            const files = this.$store.getters['formBuilder/files']

            Object.entries(files).map(file => {
                const form = new FormData()
                form.append("file", file[1].file)
                form.append("fileid", file[1].id)
                this.$store.dispatch('formBuilder/upload_files', form)
                .then(id => {
                    let f ={}
                    f[file[1].id] = id
                    console.log(id)
                    this.formAnswer.push(f)
                })
            })
        },
        async handlerAction(saveForm, action) {

            if (action.id !== "DEFAULT-ACTION") {
                this.formAnswer.push({'action_id': action.id})
            }

            if (saveForm){
                if (this.filesInForm) {
                    await this.sendFiles()

                }
                this.save()
            }
        },
        resetForm() {
            this.formAnswer = []
        }
    }
}
</script>

<style>

</style>

