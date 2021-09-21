<template>
    <div class="container-fluid">
        <div class="row p-1 mb-2">
            <div class="col-12">
                <span @click="logData" class="selector-advanced-label">{{ this.input.name }}</span>
                <button class="btn btn-primary btn-sm" @click="addRow">
                    &plus;
                </button>
            </div>
        </div>
        <div class="row" v-if="hotTableLoaded">
            <div class="col-12 min-height-150 selector-advanced-container">
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
import mix from '../mixs/selector-multiple-advanced.vue';
import { HotTable } from '@handsontable/vue';

export default {
    mixins: [mix],
    components: {
        HotTable
    },
    data: () => ({})
};
</script>
<style scoped>
.min-height-150 {
    min-height: 150px;
}
.selector-advanced-label {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    margin-right: 0.5rem;
}
</style>
