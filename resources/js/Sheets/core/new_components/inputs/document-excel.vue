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
            <button class="btn btn-outline-info bg-info text-light rounded-left" type="button" id="inputGroupFileAddon04" @click="onShowFile()">
                <i class="fa fa-eye fa-lg"></i>
            </button>
        </div>
        <div class="custom-file">
            <input
                type="file"
                :class="[{'form-control': disabled }, 'custom-file-input']"
                :id="id"
                :accept="accept"
                :disabled="disabled"
                :ref="dynamicRef"
                lang="es"
                @change="onChange"
            />
            <label class="custom-file-label" :for="id" v-text="document_name" />
        </div>
        <div class="input-group-append" v-if="showDeleteBtn">
            <button class="btn btn-outline-danger bg-danger text-light rounded-right" type="button" id="inputGroupFileAddon04" @click="onDeleteFile()">
                <i class="fa fa-trash fa-lg"></i>
            </button>
        </div>
        <div ref="preview"></div>
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
import ExcelJs from 'exceljs';
import FileTemplate from '../templates/file.vue';
import mix from '../mixs/input.vue';
import mixFile from '../mixs/files.vue';

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
