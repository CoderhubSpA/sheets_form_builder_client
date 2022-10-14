<template>
    <div>
        <file-template
            :label="label"
            :id="id"
            :required="required"
            :placeholder="document_name"
            :showDeleteButton="showDeleteBtn"
        >
        <div class="input-group-prepend" v-if="previewLink">
            <span class="input-group-text bg-white text-info" @click="onShowFile()">
                <i class="fa fa-eye"></i>
            </span>
        </div>
        <div class="custom-file">
            <input
                type="file"
                class="custom-file-input"
                :id="id"
                :accept="accept"
                lang="es"
                :ref="dynamicRef"
                @change="onChange"
            />
            <label class="custom-file-label" :for="id" v-text="document_name" />
        </div>
        <div class="input-group-append" v-if="showDeleteBtn">
            <span class="input-group-text bg-danger text-light"  @click="onDeleteFile()">
                <i class="fa fa-trash"></i>
            </span>
        </div>
        </file-template>
        <div ref="preview"></div>
        <!-- <div class="form-group" v-if="can_select_sheets">
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
        <div class="row" v-if="input.default_value !== null">
            <div class="col">
                <p class="input-placeholder">Por defecto: {{ input.default_value }}</p>
            </div>
        </div> -->
    </div>
</template>

<script>
/* eslint-disable arrow-body-style */
import ExcelJs from 'exceljs';
import FileTemplate from '../templates/file.vue';
import mix from '../mixs/input.vue';
import mixFile from '../mixs/files.vue';
import DocumentViewer from '../utils/DocumentViewer.vue';

export default {
    mixins: [mix, mixFile],
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
        previewLink() {
            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                if (val) {
                    /* const prevVal = {};
                    prevVal[this.id] = val;
                    this.$emit('input', prevVal); */

                    this.$emit('input', val);
                    const contentInfo = this.$store.getters[`${this.state}/content_info`];

                    if (contentInfo) {
                        const entities = contentInfo.content.entities_fk[this.input.entity_type_fk];
                        const imgPre = entities.find((ent) => ent.id === val[this.id]);

                        (imgPre && imgPre.src) ? this.showDeleteBtn = true : '';
                        return (imgPre && imgPre.src) ? `${this.base_url}${imgPre.src}` : '';
                    }
                }
            }
            return null;
        },
        // @override
        accept() {
            return '.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,vnd.ms-excel';
        },
        disabled() {
            return this.options.length < 1;
        },
        multiple() {
            return false;
        },
        preFile() {
            const prevVal = {};
            const contentInfo = this.$store.getters[`${this.state}/content_info`];
            if (contentInfo) {
                const fields = this.$store.getters[`${this.state}/fields`];

                if (fields && fields.length > 0) {
                    const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                    if (val) {
                        prevVal[this.id] = val[this.id];
                        this.$emit('input', prevVal);
                        return prevVal[this.id];
                    }
                }
            }

            return prevVal[this.id] ? prevVal[this.id] : '';
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
        preFile(val) {
            console.log(val)
            if (val) {
                const contentInfo = this.$store.getters[`${this.state}/content_info`];
                if (contentInfo) {
                    const entities = contentInfo.content.entities_fk[this.input.entity_type_fk];
                    const fileEntity = entities.find((ent) => ent.id === val);

                    if (fileEntity) {
                        this.ph = fileEntity.name;
                        this.can_select_sheets = false;
                    }
                }
            }
        }
    },
    mounted() {
        // this.readPreFile();
    },
    methods: {
        onShowFile() {

            if (process.env.MIX_SHOW_DOCUMENT_OUTSIDE_IFRAME === 'true') {
                window.postMessage({
                    type: 'show_document_visualizer',
                    params: [
                        {
                            filename: this.document_name,
                            src: this.previewLink
                        }
                    ],
                })

            } else {
                window.postMessage({
                    type: 'expand_modal_container',
                    params: [
                        {
                            filename: this.document_name,
                            src: this.previewLink
                        }
                    ],
                })
                const documentViewerClass = Vue.extend(DocumentViewer);
                const instance = new documentViewerClass({
                    propsData: {
                        filename: this.document_name,
                        src: this.previewLink,
                        value: true
                    }
                });
                instance.$mount();
                this.$refs.preview.appendChild(instance.$el);
            }

        },
        readPreFile() {
            if (this.preFile) {
                const contentInfo = this.$store.getters[`${this.state}/content_info`];
                if (contentInfo) {
                    const entities = contentInfo.content.entities_fk[this.input.entity_type_fk];
                    const fileEntity = entities.find((ent) => ent.id === this.preFile);
                    if (fileEntity) {
                        this.ph = fileEntity.name;
                        this.can_select_sheets = false;
                    }
                }
            }
        },
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
            this.selected = [];
            if (this.extension !== 'xlsx') {
                this.can_select_sheets = false;

            } else this.can_select_sheets = true;
            this.file = f;
            if (event.target.files.lenght > 1) {
                this.document_name = `${event.target.files.lenght} archivos seleccionados`;
            } else {
                this.document_name = f.name;
            }
        },
    },
};
</script>

<style></style>
