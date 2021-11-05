<template>
  <div class="">
    <h3 class="sheets-form-title">
      {{ form_title }}
    </h3>
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
    <sheets-snackbar :message="snackbar.message" v-model="snackbar.show" :type="snackbar.success" />
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
    errorRequiredFields: false,
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
    form_title() {
      return this.$store.getters[`${this.namespace}/form_name`];
    },
  },
  watch: {
    name(val) {
      this.$emit('name', val);
    },
    formAnswer() {
      //   console.log(this.formAnswer);
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
      this.$store
        .dispatch(`${this.namespace}/get`, {
          id: this.entityId,
          recordid: this.record_id,
          params: this.params,
        })
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
          // this.get_record();
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
            if (field.required === 1) {
              if (Object.keys(resultValidator).includes(field.id)) {
                if (
                  resultValidator[field.id] === null ||
                  resultValidator[field.id] === '' ||
                  resultValidator[field.id] === undefined
                ) {
                  this.errorRequiredFields = true;
                  const errorOnRequired = {
                    key: field.id,
                    value: `El campo ${field.name} es requerido`,
                  };
                  await this.$store.commit(`${this.namespace}/ERRORS_FIELD`, errorOnRequired);
                }
              } else {
                this.errorRequiredFields = true;
                const errorOnRequired = {
                  key: field.id,
                  value: `El campo ${field.name} es requerido`,
                };
                await this.$store.commit(`${this.namespace}/ERRORS_FIELD`, errorOnRequired);
              }
            }
          });
        });
      });
    },
    async verifySelectorMultipleAdvanced(fieldId, content) {
      const smarequiredfields = await this.$store.getters[`${this.namespace}/smarequiredfields`];
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
      await this.validateAllFields();
      await this.getSMAValidation();
      if (this.errorRequiredFields === false && this.errorsOnSMA === false) {
        this.disabledAction = true;
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
                  if (Object.keys(r)[0] === field.id) formFields[field.id] = field.form_field_id;
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

        this.result.forEach((r) => {
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

        data[entityId].push(body);

        const form = new FormData();

        form.append('entityKey', entityId);

        Object.keys(data).forEach((key) => {
          form.append(key, JSON.stringify(data[key]));
        });
        const action = !this.record_id ? `${this.namespace}/save` : `${this.namespace}/update`;
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
      } else {
        this.snackbar = {
          message: 'Existen errores de validación',
          success: false,
          show: true,
        };
      }
    },
    async sendFiles() {
      const files = this.$store.getters[`${this.namespace}/files`];

      const promises = [];
      const req = [];
      Object.entries(files).forEach((file) => {
        // console.log(388, file[1]);
        req.push(file[1].id);
        const form = new FormData();

        form.append('file', file[1].file);
        form.append('fileid', file[1].id);
        if (file[1].metadata) {
          form.append('metadata', JSON.stringify({ sheets: [file[1].metadata] }));
          //   form.append('metadata', JSON.stringify({ sheets: file[1].metadata }));
        }
        const data = {
          form,
          file: file[1],
        };
        promises.push(this.$store.dispatch(`${this.namespace}/upload_files`, data));
      });
      await Promise.all(promises).then((resp) => {
        for (let index = 0; index < resp.length; index += 1) {
          const obj = {};
          obj[req[index]] = resp[index].id;
          //   obj.id = resp[index].id;
          this.formAnswer.push(obj);
          const finded = this.formAnswer.find((ans) => !!ans.id);
          // eslint-disable-next-line no-console
          console.log(finded, !finded, resp[index], resp[index].data.entity_type_fk === 'document');
          if (
            !finded &&
            resp[index].data.col_name === 'id' &&
            resp[index].data.entity_type_fk === 'document'
          ) {
            // eslint-disable-next-line no-console
            console.log('agregando id');
            this.formAnswer.push({ id: resp[index].id });
          }

          // this.formAnswer[0].push(obj);
        }
      });
    },
    async handlerAction(saveForm, action) {
      this.$store.commit(`${this.namespace}/CLEARFIELDS`, false);
      if (
        action.id !== 'DEFAULT-ACTION' &&
        action.id.indexOf('default') === -1 &&
        action.id.indexOf('DEFAULT') === -1
      ) {
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
.sheets-form-title {
  border: 1px solid gray;
  margin-bottom: 5px;
}
</style>
