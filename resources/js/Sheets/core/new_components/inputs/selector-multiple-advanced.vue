<template>
    <div class="container-fluid" :id="`sma-${id}`" :class="{ 'sma-not-visible': !show_field, 'hide': hide}">
        <div class="row p-1 mb-2">
            <div class="col-12">
                <div class="row">
                    <div :class="getClass()">
                        <a
                            class="float-right sheet-field-info-link"
                            :href="this.input.link_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            v-if="this.input.link_url"
                        >
                            {{ this.input.link_name }}
                        </a>
                        <label :for="id" @click="logData()">{{ defaultOptionLabel ? defaultOptionLabel : label }}</label>
                        <span v-if="required" class="text-danger">*</span>
                        <span class="tooltip-custom" v-if="this.input.description">
                            <span class="icon">&#9432;</span>
                            <span class="tooltiptext">
                                {{ this.input.description }}
                            </span>
                        </span>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" @click="addRow" :disabled="disableAddRow">&plus;</button>
            </div>
        </div>
        <div class="row" v-if="hotTableLoaded">
            <div class="col-12 min-height-handsontable selector-advanced-container">
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
        <div v-if="loadingSelector" class="clearfix" style="margin: 15px">
            <div class="spinner-border float-right" role="status">
                <span class="sr-only">Loading...</span>
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
    methods: {
        getClass() {
            if (this.input.link_url !== null && this.input.link_url !== undefined) {
                return this.input.link_url.length > 0 ? 'col has-more-info' : 'col';
            }
            return 'col';
        },
    },
};
</script>
<style scoped>
.sma-not-visible {
    display: none;
}
.min-height-handsontable {
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
.htCenter .htMiddle .handsontable .ht__selection--columns .htRowHeaders .htColumnHeaders {
    overflow-y: scroll !important;
}
</style>
