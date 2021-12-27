<template>
    <file-template
        :label="label"
        :id="id"
        :required="required"
        :linkTarget="this.input.link_url"
        :linkDescription="this.input.link_name"
        :tooltipInfo="this.input.description"
        v-if="show_field"
    >
        <input
            type="file"
            class="custom-file-input"
            :id="id"
            :accept="accept"
            lang="es"
            @input="onInput"
            @change="onChange"
        />
        <div class="row">
            <div class="col">
                <div class="preview-container hide" id="preview-image-container">
                    <img :src="preview" alt="preview-image" />
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
    data: () => ({
        preview: null,
        storage_url: process.env.MIX_SHEETS_STORAGE_URL,
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
                    const contentInfo = this.$store.getters[`${this.state}/content_info`];
                    if (contentInfo) {
                        const entities = contentInfo.content.entities_fk[this.input.entity_type_fk];
                        const imgPre = entities.find((ent) => ent.id === val[this.id]);
                        return `${this.storage_url}${imgPre.src}`;
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
    },
    mounted() {
        if (this.previewLink) {
            this.preview = this.previewLink;
            const container = document.getElementById('preview-image-container');
            container.classList.remove('hide');
            container.classList.add('show');
        }
    },
    methods: {
        onChange(event) {
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
