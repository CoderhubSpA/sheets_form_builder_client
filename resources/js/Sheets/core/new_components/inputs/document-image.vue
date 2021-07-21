<template>
    <file-template :label="label" :id="id" :required="required">
        <input
            type="file"
            class="custom-file-input"
            :id="id"
            :accept="accept"
            lang="es"
            @input="onInput"
            @change="onChange">
            <div class="row " >
                <div class="col">
                    <div class="preview-container hide" id="preview-image-container">
                        <img :src="preview" alt="preview-image">
                    </div>
                </div>
            </div>

    </file-template>
</template>

<script>
import FileTemplate from '../templates/file.vue'
import mix from '../mixs/input.vue'
import mixFile from '../mixs/files'
export default {
    mixins: [mix, mixFile],
    components: {
        'file-template': FileTemplate
    },
    data: () => ({
        preview: null
    }),
    computed: {
        accept() {
            return 'image/*'
        },
        previewId() {
            return `id-${this.id}`
        }
    },
    methods: {
        onChange(event) {
            const file = event.target.files[0]
            let container = document.getElementById('preview-image-container')
            this.preview = URL.createObjectURL(file)
            container.classList.remove('hide')
            container.classList.add('show')
            //
            const data = {
                id: this.id,
                file: file
            }
            if (this.input.permission === 2) {
                this.$store.commit('formBuilder/FILES', data)
            }
        },
        onInput(event) {
            // console.log(event)
        }
    }
}
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

