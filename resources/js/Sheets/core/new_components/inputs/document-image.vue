<template>
    <file-template
        :label="label"
        :id="id"
        :required="required"
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
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="preview-container hide" id="preview-image-container">
                    <img :src="preview" :class="`preview-image-${id}`" />
                </div>
            </div>
        </div>
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
    props: {
        base_url: {
            type: String,
            default: '',
        },
    },
    data: () => ({
        preview: null,
    }),
    computed: {
        accept() {
            return 'image/*';
        },
        previewId() {
            return `id-${this.id}`;
        },
        previewLink() {
            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                if (val) {
                    const prevVal = {};
                    prevVal[this.id] = val;
                    this.$emit('input', prevVal);
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
    watch: {
        previewLink(val) {
            this.preview = val;
            if (val) {
                const container = document.getElementById('preview-image-container');
                container.classList.remove('hide');
                container.classList.add('show');
            }
        },
        value(val) {
            if (Object.keys(val).length === 0)
                this.onDeleteFile()
        }
    },

   /*  mounted() {
        if (this.previewLink) {
            this.preview = this.previewLink;
            this.showDeleteBtn = true;
            const container = document.getElementById('preview-image-container');
            container.classList.remove('hide');
            container.classList.add('show');
        }
    }, */

    methods: {
        onChange(event) {
            this.showDeleteBtn = true;
            const f = event.target.files[0];
            const container = document.getElementById('preview-image-container');
            this.preview = URL.createObjectURL(f);
            container.classList.remove('hide');
            container.classList.add('show');
            //
            const data = {
                id: this.id,
                file: f,
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
<style lang="scss">
.preview-container {
    width: 100%;
    padding: 5px;
    // background-color: red;
    // height: 25px;

    img {
        max-width: 50%;
        height: auto;
        display: block;
        margin-left: auto;
        margin-right: auto;
        border-radius: 25px;
    }
}
.show {
    display: block;
}
.hide {
    display: none;
}
</style>
