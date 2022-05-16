<template>
    <file-template
        :label="label"
        :id="id"
        :required="required"
        :placeholder="document_name"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
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
        <div class="row" v-if="input.default_value !== null">
            <div class="col">
                <p class="input-placeholder">Por defecto: {{ input.default_value }}</p>
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
    methods: {
        onChange(event) {
            this.showDeleteBtn = true;
            if (event.target.files.lenght > 1) {
                this.document_name = `${event.target.files.lenght} archivos seleccionados`;
            } else {
                this.document_name = `${event.target.files[0].name}`;
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
