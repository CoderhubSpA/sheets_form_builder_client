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
        col_name: this.input.col_name,
        entity_type_fk: this.input.entity_type_fk,
      };
      if (this.input.permission === 2) {
        this.$store.commit(`${this.state}/FILES`, data);
      }
    },
    // eslint-disable-next-line no-unused-vars
    onInput(event) {
      // console.log(event)
    },
  },
};
</script>
