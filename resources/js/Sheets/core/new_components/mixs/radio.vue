<script>
export default {
  props: {
    input: {
      type: Object,
    },
    value: {
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    pickedModel: null,
  }),
  computed: {
    options() {
      let contentInfo = this.$store.getters[`${this.state}/content_info`];
      if (!contentInfo) {
        contentInfo = this.$store.getters['form/contentinfo'];
      }

      if (contentInfo) {
        const entities = contentInfo.content.entities_fk[this.input.entity_type_fk];

        if (entities) {
          // eslint-disable-next-line arrow-body-style
          return entities.map((e) => {
            return { id: e.id, name: e.name };
          });
        }
        const opt = JSON.parse(this.input.options);

        const options = [];

        Object.keys(opt).forEach((key) => {
          options.push({ id: key, name: opt[key] });
        });

        return options;
      }
      return [];
    },
    picked() {
      const fields = this.$store.getters[`${this.state}/fields`];
      if (fields && fields.length > 0) {
        const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
        if (val !== null && val !== undefined) {
          return val[this.id];
        }
      }
      return null;
    },
    clear() {
      return this.$store.getters[`${this.state}/clearfields`];
    },
    form_field_id() {
      return this.input.form_field_id;
    },
  },
  watch: {
    picked(val) {
      if (val !== null) {
        this.pickedModel = val;
      }
    },
    pickedModel(val) {
      if (val !== null) {
        const dataToSelectorFilters = {
          key: this.input.col_name,
          value: val.toString(),
        };
        this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
        const pickedValue = {};
        pickedValue[this.input.id] = val;
        this.$emit('poll-entry', val, this.input.id, this.input.col_name);
        this.$emit('input', pickedValue);
        /**
         * mostrar/ocultar section
         */
        const field_section_show_hide = {};
        field_section_show_hide[this.form_field_id] = val;
        this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, field_section_show_hide);
        const field_show_hide = {};
        field_show_hide[this.form_field_id] = val;
        this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);
      }
    },
    clear(val) {
      const recordId = this.$store.getters[`${this.state}/record_id`];
      if (val && !recordId) {
        this.pickedModel = null;
      }
    },
  },
};
</script>

<style></style>
