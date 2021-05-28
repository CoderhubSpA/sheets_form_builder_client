<template>
    <div class="col-12">
        <div class="row SheetsFormRenderRow__container">
            <div
                v-for="(section, index) in formRow.sections"
                :key="index"
                :class="getClasses(section)"
            >
                <sheets-form-render-section
                    :section="section"
                    v-model="sectionModel[index]"
                    :bus="bus"
                    v-on:sheets-search-map-row="searchMap"
                ></sheets-form-render-section>
            </div>
        </div>
    </div>
</template>

<script>
import SheetsFormRenderSection from "./section.vue";
export default {
    components: { SheetsFormRenderSection },
    props: {
        row: {
            type: Object,
            default: () => {
                return {};
            }
        },
        value: {
            type: Array,
            default: () => {}
        },
        bus:{
            type: Object,
            default: () => {}
        }
    },
    data: () => ({
        sectionModel: []
    }),
    computed: {
        formRow() {
            return this.row;
        }
    },
    watch: {
        sectionModel(val) {
            this.$emit("input", val);
        }
    },
    methods: {
        searchMap(data){
            this.$emit('sheets-search-map-form', data);
        },
        getClasses(section) {
            return `col-sm-${section.col_sm} col-md-${section.col_md} col-xl-${section.col_xl}`;
        }
    }
};
</script>

<style>
.SheetsFormRenderRow__container {
    padding: 8px;
}
</style>
