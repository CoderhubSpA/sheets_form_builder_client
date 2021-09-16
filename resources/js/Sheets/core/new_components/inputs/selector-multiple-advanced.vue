<template>
    <div class="container">
        <div class="row p-1">
            <div class="col-11">
                <h6 @click="logData">{{ this.input.name }}</h6>
            </div>
            <div class="col-1">
                <button class="btn btn-primary btn-sm float-right" @click="addRow">
                    &plus;
                </button>
            </div>
        </div>
        <div class="row" v-if="hotTableLoaded">
            <div class="col-12 min-height-150">
                <hot-table
                    ref="hotTableComponent"
                    :settings="handsontableSettings"
                    :data="handsontableData"
                    :rowHeaders="true"
                >
                </hot-table>
            </div>
        </div>
    </div>
</template>

<script>
import mix from "../mixs/selector-multiple-advanced.vue";
import { HotTable, HotColumn } from "@handsontable/vue";
export default {
    mixins: [mix],
    components: {
        HotTable,
        HotColumn
    },
    data: () => ({})
};
</script>
<style scoped>
.min-height-150 {
    min-height: 150px;
}
</style>
