<template>
    <div>
        <h3 class="SheetsFormRenderSection__title">{{ formSection.name }}</h3>
        <div class="row SheetsFormRenderSection__container">
            <sheets-form-render-fields
                v-for="(field, index) in formSection.fields"
                :key="index"
                :field="field"
                :bus="bus"
                v-model="sectionModel[index]"
                v-on:sheets-search-map-section="searchMap"
            ></sheets-form-render-fields>
        </div>
    </div>
</template>

<script>
import SheetsFormRenderFields from "./fields.vue";
export default {
    components: { SheetsFormRenderFields },
    props: {
        section: {
            type: Object,
            default: () => {
                return {};
            }
        },
        bus:{
            type: Object,
            default: () => {}
        }
    },
    computed: {
        formSection() {
            this.section.fields = this.section.fields.filter(field => {
                if (field.permission == 0) {
                    return false;
                }
                return true;
            });
            return this.section;
        }
    },
    data: () => ({
        sectionModel: []
    }),
    watch: {
        sectionModel(val) {
            this.$emit("input", val);
        }
    },
    mounted() {},
    methods: {
        getModel(model) {},
        getClasses(section) {
            return `col-sm-${section.col_sm} col-md-${section.col_md} col-xl-${section.col_xl}`;
        },
        searchMap(data) {
            this.$emit('sheets-search-map-row', data);
        }
    }
};
</script>

<style>
.SheetsFormRenderSection__container {
    padding: 15px;
}
.SheetsFormRenderSection__title {
    font-weight: bolder;
    font-size: 15px;
    text-transform: uppercase;
    text-align: center;
}
</style>
