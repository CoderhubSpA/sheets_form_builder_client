<template>
  <form-group
    :id="id"
    :label="label"
    :required="required"
    :linkTarget="this.input.link_url"
    :linkDescription="this.input.link_name"
    :tooltipInfo="this.input.description"
  >
    <v-select
      label="name"
      :id="id"
      :options="options"
      :disabled="disabled"
      v-model="selected"
      :multiple="multiple"
      :option:deselected="deselected"
    >
    </v-select>
    <nested-form
      v-if="has_entity_type_permission_fk"
      :entity_type_permission_fk="entity_type_permission_fk"
      :state="state"
      @inserted="createdOption"
    />
  </form-group>
</template>

<script>
import mix from '../mixs/input.vue';
import mixSelector from '../mixs/selector2.vue';
import FormGroup from '../templates/form-group.vue';
import NestedForm from '../nested.vue';

export default {
  mixins: [mix, mixSelector],
  components: {
    'form-group': FormGroup,
    'nested-form': NestedForm,
  },
  data: () => ({
    selected: [],
  }),
  computed: {
    selectedValue() {
      let result = [];
      const fields = this.$store.getters[`${this.state}/fields`];
      if (fields && fields.length > 0) {
        const field = fields.filter((f) => Object.keys(f)[0] === this.id)[0];

        if (field) {
          const key = Object.keys(field)[0];
          const search = JSON.parse(field[key]);

          const contentInfo = this.$store.getters[`${this.state}/content_info`];

          if (contentInfo) {
            const fk = this.input.entity_type_fk;
            const entities = contentInfo.content.entities_fk[fk];
            result = Object.entries(search).map((s) => {
              return entities.find((e) => e.id === s[1]);
            });
          }
        }
        // console.log(result, field);
        this.selected = result;
      }

      return result;
    },
    multiple() {
      return true;
    },
    has_entity_type_permission_fk() {
      return !!this.input.entity_type_permission_fk;
    },
    entity_type_permission_fk() {
      return this.input.entity_type_permission_fk;
    },
    options() {
      let options = [];
      const contentInfo = this.$store.getters[`${this.state}/content_info`];

      // eslint-disable-next-line no-unused-vars
      const key = this.input.entity_type_fk;
      if (contentInfo) {
        const fk = this.input.entity_type_fk;
        const entities = contentInfo.content.entities_fk[fk];

        if (entities) {
          options = entities.filter((e) => !e[this.input.col_fk_1_n]);
        }
      }
      //   if (this.selected.length > 0) {
      //     options = options.filter((o) => this.selected.indexOf(o) < 0);
      //   }

      /** comparando con otros availables
       * que usen el mismo col_fk_1_n
       * y asi limitar las opciones entre ellos
       */
      // eslint-disable-next-line camelcase
      const col_fk_1_n_common = this.$store.getters[`${this.state}/col_fk_1_n_common`];
      // eslint-disable-next-line no-console
      if (col_fk_1_n_common[this.input.col_fk_1_n]) {
        options = options.filter((o) => col_fk_1_n_common[this.input.col_fk_1_n].indexOf(o) < 0);
      }
      return options;
    },
  },
  watch: {
    selected(val) {
      console.log(val);
      const data = {};
      data[this.id] = val.map((v) => v.id);

      this.$emit('input', data);
      const store = {};
      store[this.input.col_fk_1_n] = val;
      this.$store.commit(`${this.state}/COL_FK_1_N_COMMON`, store);
    },
  },
  methods: {
    deselected(o) {},
  },
};
</script>
