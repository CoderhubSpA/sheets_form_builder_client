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
        :class="{'hide': hide}"
    >

    <div class="input-group-prepend" v-if="previewLink">
        <span class="input-group-text bg-white text-info" @click="onShowFile()">
            <i class="fa fa-eye"></i>
        </span>
    </div>
    <div class="custom-file">
        <input type="file" class="custom-file-input"
            :id="id"
            :aria-describedby="id"
            :disabled="disabled"
            :accept="accept"
            @input="onInput"
            @change="onChange"
            lang="es"
            :ref="dynamicRef">
        <label class="custom-file-label"
            :for="id"
            v-text="document_name || input.default_value || ''" />
    </div>
    <div class="input-group-append" v-if="showDeleteBtn">
        <span class="input-group-text bg-danger text-light"  @click="onDeleteFile()" :disabled="disabled">
            <i class="fa fa-trash"></i>
        </span>
    </div>
    <div ref="preview"></div>
    </file-template>
</template>

<script>
/* eslint-disable object-shorthand */
import FileTemplate from '../templates/file.vue';
import mix from '../mixs/input.vue';
import mixFile from '../mixs/files.vue';
import DocumentViewer from '../utils/DocumentViewer.vue';

export default {
    mixins: [mix, mixFile],
    components: {
        'file-template': FileTemplate,
    },
    computed: {
        previewLink() {
            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                if (val) {
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

        }
    },
};
</script>
