<template>
  <div :class="`${sm} ${md} ${xl}`">
    <h5 class="sheets-section-title">
      {{ name }}
    </h5>
    <img :src="img" :alt="name" class="sheets-img-section" v-if="img" />

    <span class="tooltip-custom" v-if="this.section.description">
      <img src="/images/infoicon.png" />
      <span class="tooltiptext"> {{ this.section.description }} </span>
    </span>
    <div class="sheets-section-wrapper d-flex flex-wrap">
      <sheets-field
        v-for="(field, key) in fields"
        :field="field"
        :key="key"
        v-model="sectionModel[key]"
        :state="state"
      >
      </sheets-field>
    </div>
  </div>
</template>

<script>
import SheetsField from '../field.vue';

export default {
  components: {
    'sheets-field': SheetsField,
  },
  props: {
    section: {
      type: Object,
      require: true,
    },
    value: {
      required: true,
    },
    state: {
      type: String,
      require: true,
    },
  },
  data: () => ({
    sectionModel: [],
  }),
  watch: {
    sectionModel() {
      this.$emit('input', this.sectionModel);
    },
  },
  computed: {
    id() {
      return this.section.id;
    },
    name() {
      return this.section.name;
    },
    sm() {
      return `col-sm-${this.section.col_sm}`;
    },
    md() {
      return `col-md-${this.section.col_md}`;
    },
    xl() {
      return `col-xl-${this.section.col_xl}`;
    },
    fields() {
      return this.section.fields || [];
    },
    img() {
      return 'https://picsum.photos/200/300?random=1';
    },
  },
};
</script>

<style lang="scss">
.sheets-section-title {
  color: black;
  display: inline-block;
}
.sheets-img-section {
  display: inline-block;
  max-height: 4rem;
  margin-left: 4px;
  margin-bottom: 2px;
  border: 1px solid red;
}
.tooltip-custom {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.tooltip-custom img {
  width: 20px;
}

.tooltip-custom .tooltiptext {
  visibility: hidden;
  width: 250px;
  background-color: white;
  border: 1px solid black;
  color: black;
  text-align: center;
  border-radius: 6px;
  padding: 3px;
  position: absolute;
  width: 120px;
  top: 100%;
  left: 50%;
  z-index: 180;
}

.tooltip-custom:hover .tooltiptext {
  visibility: visible;
}
</style>
