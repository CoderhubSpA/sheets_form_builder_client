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
        }
    },
    methods: {
        onChange(event) {

        },
        onInput(event) {
            // console.log(event)
        }
    }
}
</script>
<style lang="scss">

</style>

