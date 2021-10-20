<script>
export default {
  props: {
    input: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      default: () => {},
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  computed: {
    label() {
      return this.input.name;
    },
    id() {
      return this.input.id;
    },
    autocomplete() {
      return !!this.input.autocomplete;
    },
    disabled() {
      return this.input.permission === 1;
    },
    readonly() {
      return this.input.readonly;
    },
    required() {
      return !!this.input.required;
    },
    placeholder() {
      return this.input.placeholder;
    },
    inputValue() {
      const fields = this.$store.getters[`${this.state}/fields`];

      if (fields && fields.length > 0) {
        const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
        if (val) {
          this.$emit('input', val);
          return val[this.id];
        }
      }
      return this.value ? this.value[this.id] : '';
    },
    col_name() {
      return this.input.col_name;
    },
    form_field_id() {
      return this.input.form_field_id;
    },
    show_by_field_id() {
      return this.input.show_by_field_id;
    },
    show_by_field_value() {
      return this.input.show_by_field_value;
    },
    show_field() {
      const fields = this.$store.getters[`${this.state}/field_show_hide`];
      let show_field = false;
      if (this.show_by_field_id) {
        if ( (fields[this.show_by_field_id] || false) == this.show_by_field_value) {
          show_field = true;
        }
        try{
          // Permite validar si entre un selector multiple existe el 
          // valor que condiciona que el elemento se vea o no
          if(Array.isArray(fields[this.show_by_field_id]) && fields[this.show_by_field_id].map(d=>d.id).includes(this.show_by_field_value)){
            show_section = true;
          }
        }catch(e){console.warn(e);}
      } else show_field = true;
      return show_field;
    },
  },
  mounted() {
    this.readInputValue();
  },
  methods: {
    readInputValue() {
      const dataToSelectorFilters = {
        key: this.input.col_name,
        value: this.inputValue,
      };
      this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
    },
    onInput(e) {
      const dataToSelectorFilters = {
        key: this.input.col_name,
        value: e.target.value,
      };
      this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
      const data = {};
      data[this.id] = e.target.value;
      this.$emit('input', data);
      /**
       * mostrar/ocultar section
       */
      const field_section_show_hide = {};
      field_section_show_hide[this.form_field_id] = e.target.value;
      this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, field_section_show_hide);
      /**
       * mostrar/ocultar field
       */
      const field_show_hide = {};
      field_show_hide[this.form_field_id] = e.target.value;
      this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);
    },
    // evitar pegado de informacion en el componente
    onPaste(event) {
      const regex = /^-?(0|[1-9]\d*)(\.\d+)?$/;
      const pasted = (event.clipboardData || window.clipboardData).getData(`text`);

      const isNumber = this.input.format === 'NUMBER';
      const isClp = this.input.format === 'CLP';
      const isPercentage =
        this.input.format === 'PERCENTAGE' || this.input.format === 'PERCENTAGE[X100]';

      if (isNumber || isClp || isPercentage) {
        event.preventDefault();
        if (regex.test(pasted)) {
          // eslint-disable-next-line no-param-reassign
          event.target.value = pasted;
        }
      }
      const changed = new Event('input');
      event.target.dispatchEvent(changed);
    },
  },
};
</script>
