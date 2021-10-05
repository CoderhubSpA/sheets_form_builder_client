<template>
  <form-group :id="id" :label="label" :required="required">
    <v-select
      label="name"
      :id="id"
      :options="options.filter((o) => selected.indexOf(o) < 0)"
      :disabled="disabled"
      v-model="selected"
      :multiple="multiple"
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
import mixSelector from '../mixs/selector.vue';
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
    multiple() {
      return true;
    },
    options() {
      let options = [];
      const contentInfo = this.$store.getters[`${this.state}/content_info`];
      const key = this.input.entity_type_fk;
      if (contentInfo) {
        const fk = this.input.entity_type_fk;

        const entities = contentInfo.content.entities_fk[fk];

        if (entities) {
          options = entities.filter((e) => !e[this.input.col_fk_1_n]);
        }
      }
      options = options.filter((o) => this.selected.indexOf(o) < 0);
      /** comparando con otros availables
       * que usen el mismo col_fk_1_n
       * y asi limitar las opciones entre ellos
       */
      const col_fk_1_n_common = this.$store.getters[`${this.state}/col_fk_1_n_common`];
      if (col_fk_1_n_common[this.input.col_fk_1_n]) {
        options = options.filter((o) => col_fk_1_n_common[this.input.col_fk_1_n].indexOf(o) < 0);
      }
      return options;
    },
  },
  watch: {
    selected(val) {
      const data = {};

      data[this.id] = val.map((v) => v.id);

      this.$emit('input', data);
      ////
      const store = {};
      store[this.input.col_fk_1_n] = val;
      this.$store.commit(`${this.state}/COL_FK_1_N_COMMON`, store);
    },
  },
  methods: {
    optionIsSelected(id) {
      return !this.selected.some((option) => option.id === id);
    },
  },
};
</script>
