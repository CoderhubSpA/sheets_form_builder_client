<template>
    <file-template :label="label" :id="id" :required="required" :placeholder="ph">
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
import FileTemplate from '../templates/file.vue';
import mix from '../mixs/input.vue';
import mixFile from '../mixs/files';

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
    },
    methods: {
        onChange(event) {
            if (event.target.files.lenght > 1) {
                this.ph = `${event.target.files.lenght} archivos seleccionados`;
            } else {
                this.ph = `${event.target.files[0].name}`;
            }
            const file = event.target.files[0];

            const data = {
                id: this.id,
                file: file,
            };
            if (this.input.permission === 2) {
                this.$store.commit(`${this.state}/FILES`, data);
            }
        },
        onInput(event) {
            // console.log(event)
        },
    },
};
</script>
