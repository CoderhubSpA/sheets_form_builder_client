<template>
    <div class="container-fluid">
        <div class="row p-1 mb-2">
            <div class="col-12">
                <div class="row">
                    <div class="col-8">
                        <label :for="id">{{ this.input.name }}</label>
                        <span v-if="required" class="text-danger">*</span>
                        <span class="tooltip-custom" v-if="this.input.description">
                            <img src="/images/infoicon.png" />
                            <span class="tooltiptext">
                                {{ this.input.description }}
                            </span>
                        </span>
                    </div>
                    <div class="col-4" v-if="this.input.link_url">
                        <a
                            class="float-right sheet-field-info-link"
                            :href="this.input.link_url"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {{ this.input.link_name }}
                        </a>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" @click="addRow">&plus;</button>
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
        <div class="row" v-if="errors">
            <div class="col-12">
                <p class="text-danger">Por favor complete los campos requeridos</p>
            </div>
        </div>
    </div>
</template>

<script>
import { HotTable } from '@handsontable/vue';
import mix from '../mixs/selector-multiple-advanced.vue';

export default {
    mixins: [mix],
    components: {
        HotTable,
    },
    data: () => ({}),
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
.htErrorConfirmed {
    border: 2px solid #ff0000 !important;
    background-color: #ffbebe !important;
}
</style>
