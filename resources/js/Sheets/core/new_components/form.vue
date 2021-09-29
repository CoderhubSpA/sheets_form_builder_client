<template>
    <div class="">
        <sheets-row
            v-for="(row, key) in formRows"
            :key="key"
            :row="row"
            :state="namespace"
            v-model="formAnswer[key]"
        />

        <div class="row text-center sheets-actions-container">
            <div class="col" v-for="(action, key) in formActions" :key="key">
                <sheets-action
                    :disabledaction="disabledAction"
                    :action="action"
                    @trigger="handlerAction"
                ></sheets-action>
            </div>
        </div>
        <!-- <sheets-loading :status="loading" /> -->
        <sheets-snackbar
            :message="snackbar.message"
            v-model="snackbar.show"
            :type="snackbar.success"
        />
    </div>
</template>

<script>
import Row from './grid/row.vue';
import Action from './actions/button.vue';
// import Loading from "./utils/loading.vue";
import Snackbar from './utils/snackbar.vue';
import FormBuilderStore from '../../../store/formBuilder';
import registerStore from './utils/reusabale-store';

export default {
    name: 'sheets-form',
    props: {
        // ID de la entidad
        entityId: {
            type: String,
            require: true,
        },
        // ID del registro
        record_id: {
            type: String,
            require: false,
            default: null,
        },
        params: {
            type: String,
            require: false,
            default: null,
        },
        value: {
            require: false,
        },
    },
    components: {
        // "sheets-loading": Loading,
        'sheets-row': Row,
        'sheets-action': Action,
        'sheets-snackbar': Snackbar,
    },
    data: () => ({
        // filas de form
        formRows: [],
        // botones del formulario
        formActions: [],
        // informacion resultante del llenado del formulario
        formAnswer: [],
        // archivos cargados en el form
        files: [],
        // snackbar para recepcion de mensajes desde el server
        snackbar: { message: '', success: false, show: false },
        //
        action: {},
        disabledAction: false,
        errorsOnSMA: false,
    }),
    computed: {
        loading() {
            return this.$store.getters[`${this.namespace}/loading`];
        },
        result() {
            let arr = [];
            this.formAnswer.forEach((row) => {
                arr = arr.concat(row);
            });
            return arr;
        },
        filesInForm() {
            return this.$store.getters[`${this.namespace}/hasFiles`];
        },
        form_id() {
            return this.$store.getters[`${this.namespace}/form_id`];
        },
        default_form() {
            return this.$store.getters[`${this.namespace}/default_form`];
        },
        entityName() {
            return this.$store.getters[`${this.namespace}/entity_name`];
        },
        name() {
            return this.$store.getters[`${this.namespace}/name`];
        },
    },
    watch: {
        name(val) {
            this.$emit('name', val);
        },
    },
    beforeCreate() {
        const { namespace } = registerStore(this.$store, FormBuilderStore, 'myStore');
        this.namespace = namespace;
    },
    mounted() {
        window.name = this.windowName;
        this.window = window;
        this.initForm();
    },
    methods: {
        postMessage(data) {
            try {
                data.content.action = this.action;
                console.log(data.content, this.action);
                this.window.parent.postMessage(data, '*');
            } catch (error) {
                console.warn(error);
            }
        },
        initForm() {
            this.$store
                .dispatch(this.namespace + '/get', { id: this.entityId, params: this.params })
                .then((form) => {
                    if (form.success) {
                        this.formRows = form.rows;
                        this.formActions = form.actions;
                    } else {
                        this.snackbar = {
                            message: form.message,
                            success: form.success,
                            show: true,
                        };
                    }
                })
                .then(() => {
                    this.get_record();
                })
                .catch((error) => {
                    this.snackbar = {
                        message: error.message,
                        success: false,
                        show: true,
                    };
                });
        },
        async get_record() {
            if (this.record_id) {
                const data = {
                    entity_name: this.$store.getters[`${this.namespace}/entity_name`],
                    id: this.record_id,
                };
                await this.$store.dispatch(`${this.namespace}/get_record`, data);
            }
        },
        async verifySelectorMultipleAdvanced(fieldId, content) {
            const smarequiredfields = await this.$store.getters[
                `${this.namespace}/smarequiredfields`
            ];
            let valid = true;
            smarequiredfields.forEach((rf) => {
                if (fieldId === rf.fieldId) {
                    content.map((item) => {
                        const keys = Object.keys(item);
                        if (
                            !keys.includes(rf.id) ||
                            item[rf.id] === null ||
                            item[rf.id] === undefined ||
                            item[rf.id] === ''
                        ) {
                            valid = false;
                        }
                    });
                }
            });
            return valid;
        },
        async getSMAValidation() {
            this.$store.commit(`${this.namespace}/ERRORSSMA`, null);
            this.errorsOnSMA = false;
            await this.result.forEach((data) => {
                const fieldId = Object.keys(data)[0];
                this.formRows.map((row) => {
                    row.sections.map((section) => {
                        section.fields.map(async (field) => {
                            if (field.id === fieldId) {
                                if (field.format === 'SELECTOR[MULTIPLE][ADVANCED]') {
                                    const valid = await this.verifySelectorMultipleAdvanced(
                                        fieldId,
                                        data[fieldId][field.entity_type_pivot_fk]
                                    );
                                    if (!valid) {
                                        this.$store.commit(`${this.namespace}/ERRORSSMA`, field.id);
                                        this.errorsOnSMA = true;
                                    }
                                }
                            }
                        });
                    });
                });
            });
            return true;
        },
        async save() {
            const finishedvalidationsma = await this.getSMAValidation();
            if (this.errorsOnSMA === false) {
                this.disabledAction = true;
                const entityId = this.$store.getters[`${this.namespace}/entity_id`];

                const data = {};
                data[entityId] = [];
                // form fields
                if (!this.default_form) {
                    const formFields = {};
                    this.formRows.map((row) => {
                        row.sections.map((section) => {
                            section.fields.map((field) => {
                                this.result.map((r) => {
                                    if (Object.keys(r)[0] === field.id)
                                        formFields[field.id] = field.form_field_id;
                                });
                            });
                        });
                    });
                    this.formAnswer.push({ form_fields: formFields });

                    const formId = this.$store.getters[`${this.namespace}/form_id`];
                    if (formId) {
                        this.formAnswer.push({
                            form_id: formId,
                        });
                    }
                }
                const body = {};
                // console.log(this.formAnswer)
                // let result  = [];
                // this.formAnswer.forEach(element => {
                //     result.push(...element);
                // });
                this.result.map((r) => {
                    if (!!r) {
                        let obj = Object.assign({}, r);
                        let key = Object.keys(obj)[0];
                        body[key] = obj[key];
                    }
                });

                if (this.record_id) {
                    body.id = this.record_id;
                }

                data[entityId].push(body);

                const form = new FormData();

                form.append('entityKey', entityId);

                Object.keys(data).forEach((key) => {
                    form.append(key, JSON.stringify(data[key]));
                });
                const action = !this.record_id
                    ? `${this.namespace}/save`
                    : `${this.namespace}/update`;
                this.$store
                    .dispatch(action, form)
                    .then((response) => {
                        this.snackbar = {
                            success: response.success,
                            show: true,
                            message: response.content.message,
                        };

                        if (response.success) {
                            if (this.action.refresh_form === 1) {
                                this.resetForm();
                            }
                            this.$emit('input', response.content);
                            this.postMessage(response);
                            this.action = {};
                        }
                        this.disabledAction = false;
                    })
                    .catch((error) => {
                        this.$store.commit(`${this.namespace}/CLEARFIELDS`, false);
                        if (error.data) {
                            this.snackbar = {
                                message:
                                    error.data.content !== null
                                        ? error.data.content.message
                                        : 'Ocurrió un error inesperado',
                                success: false,
                                show: true,
                            };
                            this.postMessage(error.data);
                            this.action = {};
                        } else {
                            this.snackbar = {
                                message:
                                    error.response.data.content !== null
                                        ? error.response.data.content.message
                                        : 'Ocurrió un error inesperado',
                                success: false,
                                show: true,
                            };
                            this.postMessage(error.response.data);
                            this.action = {};
                        }

                        this.disabledAction = false;
                    });
            }
        },
        async sendFiles() {
            const files = this.$store.getters[`${this.namespace}/files`];

            const promises = [];
            const req = [];
            Object.entries(files).map((file) => {
                req.push(file[1].id);
                const form = new FormData();

                form.append('file', file[1].file);
                form.append('fileid', file[1].id);

                promises.push(this.$store.dispatch(`${this.namespace}/upload_files`, form));
            });
            await Promise.all(promises).then((resp) => {
                for (let index = 0; index < resp.length; index += 1) {
                    const obj = {};
                    obj[req[index]] = resp[index];
                    obj.id = resp[index];
                    this.formAnswer.push(obj);
                    this.formAnswer.push({ id: obj.id });
                    // this.formAnswer[0].push(obj);
                }
            });
        },
        async handlerAction(saveForm, action) {
            this.$store.commit(`${this.namespace}/CLEARFIELDS`, false);
            if (action.id !== 'DEFAULT-ACTION') {
                this.formAnswer.push({ action_id: action.id });
            }
            if (saveForm) {
                if (this.filesInForm) await this.sendFiles();
                await this.save();
            }
            this.action = action;
        },
        resetForm() {
            this.$store.commit(`${this.namespace}/CLEARFIELDS`, true);
            this.formAnswer = [];
        },
    },
};
</script>

<style>
.sheets-actions-container {
    margin: 2rem 0;
}
</style>
