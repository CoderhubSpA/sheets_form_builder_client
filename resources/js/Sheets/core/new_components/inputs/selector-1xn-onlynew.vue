<template>
  <div>
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
        :no-drop="true"
        :multiple="multiple"
        :value="selected"
        @option:deselected="deselected"
      >
      </v-select>
      <br />
      <nested-form
        v-if="has_entity_type_permission_fk"
        :entity_type_permission_fk="entity_type_permission_fk"
        :state="state"
        @inserted="createdOption"
      />
    </form-group>
  </div>
</template>

<script>
import mix from '../mixs/input.vue';
import mixSelector from '../mixs/selector2.vue';
import FormGroup from '../templates/form-group.vue';
import NestedForm from '../nested.vue';

export default {
  components: {
    FormGroup,
    NestedForm,
  },
  mixins: [mix, mixSelector],
  data: () => ({
    selected: [],
  }),
  computed: {
    multiple() {
      return true;
    },
  },
  watch: {
    selected(val) {
      if (val) {
        const data = {};

        data[this.id] = val.map((v) => v.id);

        this.$emit('input', data);
      }
    },
  },
  methods: {
    deselected(val) {
      const item = this.selected.find((option) => option.id === val.id);
      const index = this.selected.indexOf(item);
      this.selected.splice(index, 1);
    },
  },
};
</script>
