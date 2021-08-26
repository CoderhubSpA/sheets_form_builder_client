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
            return '*'
        }
    },
    methods: {
        onChange(event) {
            const file = event.target.files[0]
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

</style>

