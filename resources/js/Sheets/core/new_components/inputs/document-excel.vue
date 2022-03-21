<template>
    <div>
        <file-template
            :label="label"
            :id="id"
            :required="required"
            :placeholder="ph"
            :showDeleteButton="showDeleteBtn"
        >
            <div class="row">
                <div class="col">
                    <input
                        type="file"
                        class="custom-file-input"
                        :id="id"
                        :accept="accept"
                        lang="es"
                        ref="inputFileRef"
                        @change="onChange"
                    />
                </div>
                <div class="col" v-if="showDeleteBtn">
                    <button class="btn btn-danger float-right" @click="onDeleteFile()">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
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
        <div class="row" v-if="this.input.default_value !== null">
            <div class="col">
                <p class="input-placeholder">Por defecto: {{ this.input.default_value }}</p>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable arrow-body-style */
import ExcelJs from 'exceljs';
import FileTemplate from '../templates/file.vue';
import mix from '../mixs/input.vue';
// import mixFile from '../mixs/files.vue';
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
        showDeleteBtn: false,
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
                this.handleImport();
            }
        },
        selected(val) {
            if (val && val !== undefined) {
                const data = {};
                if (Array.isArray(val) && val[0] !== undefined) {
                    data[this.id] = val[0].id;
                } else {
                    data[this.id] = val.id;
                }
                this.$emit('input', data);
                let store = {};
                switch (this.extension) {
                    case 'xlsx':
                        store = { id: this.id, file: this.file, metadata: data[this.id] };
                        break;
                    case 'xls':
                    case 'csv':
                        store = { id: this.id, file: this.file };
                        break;
                    default:
                        break;
                }

                this.$store.commit(`${this.state}/FILES`, store);
            }
        },
    },
    methods: {
        async handleImport() {
            const wb = new ExcelJs.Workbook();
            const reader = new FileReader();
            reader.readAsArrayBuffer(this.file);
            switch (this.extension) {
                case 'xlsx':
                    reader.onload = () => {
                        const buffer = reader.result;
                        wb.xlsx.load(buffer).then((workbook) => {
                            this.options = workbook.worksheets.map((sheet) => {
                                return { id: sheet.name, name: sheet.name };
                            });

                            this.selected.push(this.options[0]);
                        });
                    };
                    break;
                case 'xls':
                case 'csv':
                    reader.onload = async () => {
                        this.selected.push({ id: 'file-pending', name: 'file-pending' });
                    };
                    break;

                default:
                    break;
            }
        },
        onChange(event) {
            this.showDeleteBtn = true;
            const f = event.target.files[0];
            const splited = f.name.split('.');
            this.extension = splited[splited.length - 1].toLowerCase();
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
        onDeleteFile() {
            this.showDeleteBtn = false;
            this.$refs.inputFileRef.value = null;
            this.ph = '';
            this.options = [];
            this.selected = [];
            this.$store.commit(`${this.state}/DELETE_FILE`, this.id);
            const validation = {};
            validation[this.id] = null;
            this.$emit('input', validation);
        },
    },
};
</script>

<style></style>
