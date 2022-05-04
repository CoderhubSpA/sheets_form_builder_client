<template>
    <file-template
        :label="label"
        :id="id"
        :required="required"
        :placeholder="ph"
        :linkTarget="input.link_url"
        :linkDescription="input.link_name"
        :tooltipInfo="input.description"
        v-if="show_field"
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
                    @input="onInput"
                    @change="onChange"

                />
            </div>
            <div class="col" v-if="showDeleteBtn">
                <button class="btn btn-danger float-right" @click="onDeleteFile()">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="row" v-if="this.input.default_value !== null">
            <div class="col">
                <p class="input-placeholder">Por defecto: {{ this.input.default_value }}</p>
            </div>
        </div>

    </file-template>
</template>

<script>
/* eslint-disable object-shorthand */
import FileTemplate from '../templates/file.vue';
import mix from '../mixs/input.vue';
import mixFile from '../mixs/files.vue';

export default {
    mixins: [mix, mixFile],
    components: {
        'file-template': FileTemplate,
    },
    data: () => ({
        // placeholder
    }),
    computed: {
        accept() {
            return '*';
        },
        preFile() {
            let prevVal = {};
            const fields = this.$store.getters[`${this.state}/fields`];
            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];

                if (val) {
                    prevVal = {};
                    prevVal[this.id] = val[this.id];
                    this.$emit('input', prevVal);
                }
            }
            return prevVal[this.id];
        },
        ph() {
            let name = ''
            if (this.preFile) {
                const contentInfo = this.$store.getters[`${this.state}/content_info`];
                if (contentInfo) {
                    const entities = contentInfo.content.entities_fk[this.input.entity_type_fk];
                    const fileEntity = entities.find((ent) => ent.id === this.preFile);

                    if (fileEntity) {
                        name = fileEntity.name;
                        this.can_select_sheets = false;
                    }
                }
            }
            return name;
        }

    },
    watch: {

    },
    methods: {
        onChange(event) {
            this.showDeleteBtn = true;
            if (event.target.files.lenght > 1) {
                this.ph = `${event.target.files.lenght} archivos seleccionados`;
            } else {
                this.ph = `${event.target.files[0].name}`;
            }
            const file = event.target.files[0];

            const data = {
                id: this.id,
                file: file,
                col_name: this.input.col_name,
                entity_type_fk: this.input.entity_type_fk,
            };
            if (this.input.permission === 2) {
                this.$store.commit(`${this.state}/FILES`, data);
                const validation = {};
                validation[this.id] = 'file-pending';
                this.$emit('input', validation);
            }
        },
    },
};
</script>
