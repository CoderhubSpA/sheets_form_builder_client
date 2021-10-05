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
      //   console.log(this.input, contentInfo);
      if (contentInfo) {
        const fk = this.input.entity_type_fk;

        const entities = contentInfo.content.entities_fk[fk];

        if (entities) {
          options = entities.filter((e) => !e[this.input.col_fk_1_n]);
        }
      }
      return options;
    },
  },
  watch: {},
  methods: {
    optionIsSelected(id) {
      return !this.selected.some((option) => option.id === id);
    },
  },
};
</script>
