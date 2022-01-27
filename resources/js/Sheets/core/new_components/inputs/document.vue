<template>
    <file-template
        :label="label"
        :id="id"
        :required="required"
        :placeholder="ph"
        :linkTarget="this.input.link_url"
        :linkDescription="this.input.link_name"
        :tooltipInfo="this.input.description"
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
                    <i class="bi bi-trash-fill"></i>
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
        ph: '',
    }),
    computed: {
        accept() {
            return '*';
        },
        preFile() {
            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                if (val) {
                    const prevVal = {};
                    prevVal[this.id] = val;
                    this.$emit('input', prevVal);
                }
            }
            return null;
        },
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
        // eslint-disable-next-line no-unused-vars
        onInput(event) {
            // console.log(event)
        },
        onDeleteFile() {
            this.showDeleteBtn = false;
            this.$refs.inputFileRef.value = null;
            this.ph = '';
            this.$store.commit(`${this.state}/DELETE_FILE`, this.id);
            const validation = {};
            validation[this.id] = null;
            this.$emit('input', validation);
        },
    },
};
</script>
