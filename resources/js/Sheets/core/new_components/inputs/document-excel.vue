<template>
  <div>
    <file-template :label="label" :id="id" :required="required" :placeholder="ph">
      <input
        type="file"
        class="custom-file-input"
        :id="id"
        :accept="accept"
        lang="es"
        @change="onChange"
      />
    </file-template>
    <div class="form-group" v-if="can_select_sheets">
      <label :for="id"> Página del Excel </label>
      <v-select
        label="name"
        :id="id"
        :options="options"
        :disabled="disabled"
        v-model="selected"
        :multiple="multiple"
      />
    </div>
  </div>
</template>

<script>
import FileTemplate from '../templates/file.vue';
import mix from '../mixs/input.vue';
// import mixFile from '../mixs/files.vue';
import ExcelJs from 'exceljs';
export default {
  mixins: [mix],
  components: {
    FileTemplate,
  },
  data: () => ({
    selected: [],
    file: null,
    options: [],
    ph: '',
    can_select_sheets: true,
    extension: '',
  }),
  computed: {
    accept() {
      return '.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,vnd.ms-excel';
    },
    disabled() {
      return this.options.length < 1;
    },
    multiple() {
      return false;
    },
  },
  watch: {
    file(val) {
      if (val) {
        if (this.extension === 'xlsx') {
          this.handleImport();
        }
      }
    },
    selected(val) {
      if (val) {
        const data = {};
        data[this.id] = val.id;
        this.$emit('input', data);

        const store = { id: this.id, file: this.file, metadata: data[this.id] };
        this.$store.commit(`${this.state}/FILES`, store);
      }
    },
  },
  methods: {
    handleImport() {
      const wb = new ExcelJs.Workbook();
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.file);

      reader.onload = () => {
        const buffer = reader.result;
        wb.xlsx.load(buffer).then((workbook) => {
          this.options = workbook.worksheets.map((sheet) => {
            return { id: sheet.name, name: sheet.name };
          });

          this.selected.push(this.options[0]);
        });
      };
    },
    onChange(event) {
      const f = event.target.files[0];
      const splited = f.name.split('.');
      this.extension = splited[splited.length - 1];
      this.options = [];
      if (this.extension !== 'xlsx') {
        this.can_select_sheets = false;
        this.selected = [];
      } else this.can_select_sheets = true;
      this.file = f;
      if (event.target.files.lenght > 1) {
        this.ph = `${event.target.files.lenght} archivos seleccionados`;
      } else {
        this.ph = `${event.target.files[0].name}`;
      }
    },
  },
};
</script>

<style>
</style>
