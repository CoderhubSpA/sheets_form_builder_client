<template>
    <file-template
        v-if="show_field"
        :label="label"
        :id="id"
        :required="required"
        :placeholder="document_name"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        :showDeleteButton="showDeleteBtn"
    >
        <div class="input-group-prepend" v-if="previewLink">
            <button
                class="btn btn-outline-info bg-info text-light rounded-left"
                type="button"
                id="inputGroupFileAddon04"
                @click="onShowFile()"
            >
                <i class="fa fa-eye fa-lg"></i>
            </button>
        </div>
        <div class="custom-file">
            <input
                type="file"
                :id="id"
                :aria-describedby="id"
                :disabled="disabled"
                :accept="accept"
                :class="[{ 'form-control': disabled }, 'custom-file-input']"
                @input="onInput"
                @change="onChange"
                lang="es"
                :ref="dynamicRef"
            />
            <label
                class="custom-file-label"
                :for="id"
                v-text="document_name || input.default_value || ''" />
        </div>
        <div class="input-group-append" v-if="showDeleteBtn && !hasEditPermission">
            <button
                class="btn btn-outline-danger bg-danger text-light rounded-right"
                type="button"
                id="inputGroupFileAddon04"
                @click="onDeleteFile()"
            >
                <i class="fa fa-trash fa-lg"></i>
            </button>
        </div>
        <div ref="preview"></div>
    </file-template>
</template>

<script>
import FileTemplate from '../templates/file.vue';
import mix from '../mixs/input.vue';
import mixFile from '../mixs/files.vue';

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

                        return imgPre && imgPre.src ? `${this.base_url}${imgPre.src}` : '';
                    }
                }
            }

            return '';
        },
        hasEditPermission() {
            return this.input.permission === 1;
        },
    },
    watch: {
        previewLink(val) {
            if (val) {
                this.showDeleteBtn = true;
            }
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
        }
    },
};
</script>
