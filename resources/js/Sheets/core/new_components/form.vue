<template>
    <div>
        <loading-message :status="loadingForm"></loading-message>
        <h3 class="sheets-form-title">
            {{ form_title }}
        </h3>
        <div v-if="is_step_row === 'false'">
            <div class="sheets-rows sheets-form-scrolling">
                <sheets-row
                    v-for="(row, key) in formRows"
                    :key="key"
                    :row="row"
                    :state="namespace"
                    :base_url="base_url"
                    v-model="formAnswer[key]"
                />
            </div>
            <div class="row text-center sheets-actions-container">
                <div class="col" v-for="(action, key) in formActions" :key="key">
                    <sheets-action
                        :disabledaction="disabledAction"
                        :action="action"
                        :uploading="uploadingForm"
                        :state="namespace"
                        @trigger="handlerAction"
                    ></sheets-action>
                </div>
            </div>
        </div>
        <div v-if="is_step_row === 'true'">
            <div class="sheets-rows sheets-form-scrolling">
                <sheets-row-as-step
                    :formRows="formRows"
                    :state="namespace"
                    :base_url="base_url"
                    :is_strict="is_strict_step_row"
                    v-model="formAnswer"
                    v-on:show-actions="showActionsFromStep"
                    v-on:sections-with-errors="sectionsWithErrors"
                />
            </div>
            <div class="row text-center sheets-actions-container" v-if="is_strict_step_row === 'true' && show_actions_from_step">
                <div class="col" v-for="(action, key) in formActions" :key="key">
                    <sheets-action
                        :disabledaction="disabledAction"
                        :action="action"
                        :uploading="uploadingForm"
                        :state="namespace"
                        @trigger="handlerAction"
                    ></sheets-action>
                </div>
            </div>
            <div class="row text-center sheets-actions-container" v-if="is_strict_step_row === 'false'">
                <div class="col" v-for="(action, key) in formActions" :key="key">
                    <sheets-action
                        :disabledaction="disabledAction"
                        :action="action"
                        :uploading="uploadingForm"
                        :state="namespace"
                        @trigger="handlerAction"
                    ></sheets-action>
                </div>
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
/* eslint-disable no-console */
import Row from './grid/row.vue';
import Action from './actions/button.vue';
import LoadingMessage from '../components/loading-message.vue';
import Snackbar from './utils/snackbar.vue';
import FormBuilderStore from '../../../store/formBuilder';
import registerStore from './utils/reusabale-store';
import FormBuilderResponseTest from '../../resources/formbuildertest.json';
import FormBuilderEntityInfoTest from '../../resources/entityinfotest.json';
import { v4 as uuidv4 } from 'uuid';
import RowAsStep from './grid/row-as-step.vue';

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
            default: '',
        },
        params: {
            type: String,
            require: false,
            default: '',
        },
        is_nested: {
            type: Boolean,
            default: false,
        },
        value: {
            require: false,
        },
        base_url: {
            type: String,
            default: '',
        },
        is_test: {
            type: String,
            default: 'false',
        },
        params_actions: {
            type: String,
            default: '',
        },
        is_step_row: {
            type: String,
            default: 'false',
        },
        is_strict_step_row: {
            type: String,
            default: 'false'
        }
    },
    components: {
        // "sheets-loading": Loading,
        'sheets-row': Row,
        'sheets-action': Action,
        'sheets-snackbar': Snackbar,
        'sheets-row-as-step': RowAsStep,
        LoadingMessage,
    },
    data: () => ({
        formRows: [],
        formActions: [],
        formAnswer: [],
        files: [],
        filesUploaded: [],
        snackbar: { message: '', success: false, show: false },
        action: {},
        disabledAction: false,
        errorsOnSMA: false,
        errorRequiredFields: false,
        errorOnLoadFiles: false,
        uploadingForm: false,
        loadingForm: false,
        CAN_SEE_EDIT: 2,
        show_actions_from_step: false
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
        form_type() {
            return this.$store.getters[`${this.namespace}/form_type`];
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
        form_title() {
            return this.$store.getters[`${this.namespace}/form_name`];
        },
        selector_remote_filter() {
            return this.$store.getters[`${this.namespace}/selector_remote_filter`];
        },
        form_loaded() {
            return this.$store.getters[`${this.namespace}/form_loaded`];
        },
    },
    watch: {
        name(val) {
            this.$emit('name', val);
        },
        formAnswer() {
            
        },
        form_loaded(val) {
            if (val) {
                setTimeout(() => {
                    this.handleParamsActions();
                }, 1500);
            }
        },
    },
    beforeCreate() {
        const { namespace } = registerStore(this.$store, FormBuilderStore, 'myStore');
        this.namespace = namespace;
    },
    created() {
        if (this.base_url) {
            this.$store.commit(`${this.namespace}/BASE_URL`, this.base_url);
        }
        this.$store.commit(`${this.namespace}/UUID`, uuidv4());
    },
    mounted() {
        window.name = this.windowName;
        this.window = window;
        this.initForm();
    },
    methods: {
        postMessage(data) {
            try {
                // eslint-disable-next-line no-param-reassign
                data.content.action = this.action;
                // Si no es un form nested
                if (!this.is_nested) {
                    // enviar postmessage
                    this.window.parent.postMessage(data, '*');
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.warn(error);
            }
        },
        initForm() {
            this.loadingForm = true;
            if (this.is_test === 'false') {
                this.$store
                    .dispatch(`${this.namespace}/get`, {
                        id: this.entityId,
                        recordid: this.record_id,
                        params: this.params,
                    })
                    .then((form) => {
                        this.loadingForm = false;
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
                        // this.get_record();
                    })
                    .catch((error) => {
                        this.loadingForm = false;
                        this.snackbar = {
                            message: error.message,
                            success: false,
                            show: true,
                        };
                    });
            } else {
                const responseTest = FormBuilderResponseTest;
                const entityinfoTest = FormBuilderEntityInfoTest;
                this.$store
                    .dispatch(`${this.namespace}/get_mock`, {
                        id: this.entityId,
                        recordid: null,
                        params: null,
                        response: responseTest,
                        contentinfo: entityinfoTest,
                    })
                    .then((form) => {
                        this.loadingForm = false;
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
                        // this.get_record();
                    })
                    .catch((error) => {
                        this.loadingForm = false;
                        this.snackbar = {
                            message: error.message,
                            success: false,
                            show: true,
                        };
                    });
            }
        },
        async handleParamsActions() {
            if (this.params_actions) {
                const paramsActions = JSON.parse(this.params_actions);
                const defaultAction = {
                    id: 'DEFAULT-ACTION',
                    name: 'Guardar por defecto',
                    save_form: 1,
                    refresh_form: null,
                    close_form: null,
                    cancel_form: 0,
                    cancel_process: 0,
                    process_id: null,
                    color: null,
                    text_color: null,
                    valid: 1,
                };
                paramsActions.forEach(async (action) => {
                    switch (action.type) {
                        case 'auto_submit':
                            await this.handlerAction(true, defaultAction);
                            break;

                        default:
                            break;
                    }
                });
            }
        },
        async get_record() {
            this.loadingForm = true;
            if (this.record_id) {
                const data = {
                    entity_name: this.$store.getters[`${this.namespace}/entity_name`],
                    id: this.record_id,
                };
                await this.$store.dispatch(`${this.namespace}/get_record`, data);
                this.loadingForm = false;
            }
        },
        async validateAllFields() {
            this.errorRequiredFields = false;
            const resultValidator = {};
            this.result.forEach((r) => {
                if (r) {
                    // eslint-disable-next-line prefer-object-spread
                    const obj = Object.assign({}, r);
                    const key = Object.keys(obj)[0];
                    resultValidator[key] = obj[key];
                }
            });

            this.formRows.forEach((row) => {
                row.sections.forEach((section) => {
                    section.fields.forEach(async (field) => {
                        if (field.required === 1 && field.default_value === null) {
                            if (Object.keys(resultValidator).includes(field.id)) {
                                if (
                                    resultValidator[field.id] === null ||
                                    resultValidator[field.id] === '' ||
                                    resultValidator[field.id] === undefined ||
                                    (Array.isArray(resultValidator[field.id]) &&
                                        resultValidator[field.id].length === 0)
                                ) {
                                    this.errorRequiredFields = true;
                                    const errorOnRequired = {
                                        key: field.id,
                                        value: `El campo ${field.name} es requerido`,
                                    };
                                    await this.$store.commit(
                                        `${this.namespace}/ERRORS_FIELD`,
                                        errorOnRequired
                                    );
                                }
                            } else {
                                this.errorRequiredFields = true;
                                const errorOnRequired = {
                                    key: field.id,
                                    value: `El campo ${field.name} es requerido`,
                                };
                                await this.$store.commit(
                                    `${this.namespace}/ERRORS_FIELD`,
                                    errorOnRequired
                                );
                            }
                        }
                    });
                });
            });
        },
        async verifySelectorMultipleAdvanced(fieldId, content) {
            const smarequiredfields = await this.$store.getters[
                `${this.namespace}/smarequiredfields`
            ];
            let valid = true;
            smarequiredfields.forEach((rf) => {
                if (fieldId === rf.fieldId) {
                    content.forEach((item) => {
                        const keys = Object.keys(item);
                        if (
                            !keys.includes(rf.id) ||
                            item[rf.id] === null ||
                            item[rf.id] === undefined ||
                            item[rf.id] === ''
                        ) {
                            valid = false;
                        } else if (typeof item[rf.id] === 'object') {
                            if (item[rf.id][0] === '') {
                                valid = false;
                            }
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
                this.formRows.forEach((row) => {
                    row.sections.forEach((section) => {
                        section.fields.forEach(async (field) => {
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
            this.uploadingForm = true;
            await this.validateAllFields();
            await this.getSMAValidation();
            if (this.errorRequiredFields === false && this.errorsOnSMA === false) {
                this.disabledAction = true;
                this.uploadingForm = true;
                const entityId = this.$store.getters[`${this.namespace}/entity_id`];

                const data = {};
                data[entityId] = [];
                // form fields
                if (!this.default_form) {
                    const formFields = {};
                    this.formRows.forEach((row) => {
                        row.sections.forEach((section) => {
                            section.fields.forEach((field) => {
                                this.result.forEach((r) => {
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

                let body = {};

                this.checkFieldPermissions(this.result, this.CAN_SEE_EDIT).forEach((r) => {
                    if (r) {
                        // eslint-disable-next-line prefer-object-spread
                        const obj = Object.assign({}, r);
                        const key = Object.keys(obj)[0];
                        body[key] = obj[key];
                    }
                });

                if (this.record_id) {
                    body.id = this.record_id;
                }
                body = { ...body, ...this.filesUploaded };
                data[entityId].push(body);

                const form = new FormData();

                form.append('entityKey', entityId);

                Object.keys(data).forEach((key) => {
                    form.append(key, JSON.stringify(data[key]));
                });
                const action = !this.record_id
                    ? `${this.namespace}/save`
                    : `${this.namespace}/update`;
                if (this.is_test !== 'false') {
                    this.snackbar = {
                        success: true,
                        show: true,
                        message: 'Datos enviados',
                    };
                    if (this.action.refresh_form === 1) {
                        this.resetForm();
                    }
                    this.disabledAction = false;
                } else {
                    this.$store
                        .dispatch(action, form)
                        .then((response) => {
                            this.uploadingForm = false;
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
                            this.uploadingForm = false;
                            this.disabledAction = false;
                        });
                }
            } else {
                this.disabledAction = false;
                this.uploadingForm = false;
                this.snackbar = {
                    message: 'Existen errores de validación',
                    success: false,
                    show: true,
                };
            }
        },
        async sendFiles() {
            this.errorOnLoadFiles = false;
            this.uploadingForm = true;
            const files = this.$store.getters[`${this.namespace}/files`];
            const promises = [];
            const req = [];
            Object.entries(files).forEach((file) => {
                req.push(file[1].id);
                const form = new FormData();

                form.append('file', file[1].file);
                form.append('fileid', file[1].id);
                if (file[1].metadata) {
                    form.append('metadata', JSON.stringify({ sheets: [file[1].metadata] }));
                }
                const data = {
                    form,
                    file: file[1],
                };
                promises.push(this.$store.dispatch(`${this.namespace}/upload_files`, data));
            });
            await Promise.all(promises).then((resp) => {
                for (let index = 0; index < resp.length; index += 1) {
                    if (resp[index].id !== 'error-on-upload') {
                        if (resp[index].data.col_name === 'id') {
                            if (!this.record_id && resp[index].data.entity_type_fk === 'document') {
                                this.filesUploaded[req[index]] = resp[index].id;
                                this.filesUploaded.id = resp[index].id;
                            }
                        } else {
                            this.filesUploaded[req[index]] = resp[index].id;
                        }
                    } else {
                        this.errorOnLoadFiles = true;
                    }
                }
            });
        },
        // eslint-disable-next-line no-unused-vars
        async handlerAction(saveForm, action) {
            await this.validateAllFields();

            if (action.refresh_form === 1 && !action.save_form) {
                this.resetForm();

                return;
            }

            if (this.errorRequiredFields === false && this.errorsOnSMA === false) {
                if (this.form_type === 'filter') {
                    this.handlerFilterData();
                    return;
                }

                this.$store.commit(`${this.namespace}/CLEARFIELDS`, false);

                this.$store.commit(`${this.namespace}/CLEAR_ERRORS_FIELDS`);

                if (
                    action.id !== 'DEFAULT-ACTION' &&
                    action.id.indexOf('default') === -1 &&
                    action.id.indexOf('DEFAULT') === -1
                ) {
                    this.formAnswer.push({ action_id: action.id });
                }
                if (saveForm) {
                    this.filesUploaded = [];
                    if (this.filesInForm) await this.sendFiles();
                    if (this.errorOnLoadFiles === false) {
                        await this.save();
                    } else {
                        this.snackbar = {
                            success: false,
                            show: true,
                            message: 'Ocurrió un error al cargar los archivos',
                        };
                    }
                }
                this.action = action;
            }
        },
        handlerFilterData() {
            const data = {
                uuid: this.$store.getters[`${this.namespace}/uuid`],
                type: 'filter_data',
                params: [
                    {
                        active_filters: this.selector_remote_filter,
                    },
                ],
            };
            console.log('data to postmessage', data);
            try {
                this.window.parent.postMessage(data, '*');
            } catch (error) {
                // eslint-disable-next-line no-console
                console.warn(error);
            }
        },
        resetForm() {
            this.$store.commit(`${this.namespace}/CLEARFIELDS`, true);

            this.$store.dispatch(`${this.namespace}/remote_filters_clear`, []);

            this.formAnswer = [];
        },

        /**
         * Filter fields by permission attribute.
         * @param  {Array} fieldsOfForm Field list, {"id": "value"}.
         * @param  {Number} permission The permission number, e.g: 0, 1 or 2.
         * @return {Array} Only fields with set permission param.
         */
        checkFieldPermissions(fieldsOfForm, permission) {
            const fieldsInStore = this.$store.getters[`${this.namespace}/fields_as_object`];
            const allowedFields = [];

            fieldsOfForm.forEach((fof) => {
                fieldsInStore.forEach((fis) => {
                    if (Object.keys(fof)[0] === fis.id && fis.permission === permission) {
                        allowedFields.push(fof);
                    }
                    // Allow Object.keys(fof)[0] form_id, form_fields,action_id
                    if (
                        Object.keys(fof)[0] === 'form_id' ||
                        Object.keys(fof)[0] === 'form_fields' ||
                        Object.keys(fof)[0] === 'action_id'
                    ) {
                        allowedFields.push(fof);
                    }
                });
            });

            return allowedFields;
        },
        showActionsFromStep (value) {
            this.show_actions_from_step = value;
        },
        sectionsWithErrors(sections) {
            this.formRows = sections;
        }
    },
};
</script>

<style lang="scss">
.sheets-actions-container {
    margin: 2rem 0;
}

.sheets-form-title {
    border: 1px solid gray;
    margin-bottom: 5px;
}
</style>
