<template>
  <div class="col-12">
      <div class="row SheetsFormRenderRow__container">
          <div v-for="(section, index) in formRow.sections" :key="index" :class="getClasses(section)">
              <sheets-form-render-section :section="section" v-model="sectionModel[index]"></sheets-form-render-section>
          </div>
      </div>
  </div>
</template>

<script>
import SheetsFormRenderSection from './SheetsFormRenderSection.vue';
export default {
  components: { SheetsFormRenderSection },
    props: {
        row: {
            type: Object,
            default: () => {return {};}
        },
        value: {
            type: Array,
            default: () => {}
        }
    },
    data:() => ({
        sectionModel: []
    }),
    computed: {
        formRow(){
            return this.row;
        }
    },
    watch: {
        sectionModel(val) {
            this.$emit('input', val)
        }
    },
    methods: {
        getClasses(section){
            return `col-sm-${section.col_sm} col-md-${section.col_md} col-xl-${section.col_xl}`;
        }
    }
}
</script>

<style>
    .SheetsFormRenderRow__container{
        padding: 8px;
    }
</style>
