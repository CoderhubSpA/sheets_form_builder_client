<template>
  <file-template
    :label="label"
    :id="id"
    :required="required"
    :linkTarget="this.input.link_url"
    :linkDescription="this.input.link_name"
    :tooltipInfo="this.input.description"
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
  }),
  computed: {
    accept() {
      return 'image/*';
    },
    previewId() {
      return `id-${this.id}`;
    },
    previewLink() {
      return this.$store.getters[`${this.state}/fields`];
    },
  },
  watch: {
    previewLink() {
      const fields = this.$store.getters[`${this.state}/fields`];

      if (fields.length > 0) {
        const value = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
        if (value) {
          // console.log(val, value)
        }
      }
    },
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
      }
    },
    // eslint-disable-next-line no-unused-vars
    onInput(event) {
      // console.log(event)
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
