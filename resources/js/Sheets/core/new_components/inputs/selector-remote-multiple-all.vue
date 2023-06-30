<template>
    <div :class="{hide}">
        <form-group
            :id="id"
            :label="label"
            :required="required"
            :linkTarget="link_target"
            :linkDescription="link_description"
            :tooltipInfo="tooltip"
            v-if="show_field"
        >
            <v-select
                v-if="input.options === null && input.entity_type_fk === null"
                label="name"
                v-model="selected"
                class="sheets-select"
                :id="id"
                :options="optionsRemote"
                :disabled="disabled"
                :multiple="true"
                :searchable="false"
                :readonly="false"
                @search="(search, loading) => { filterByFuncDebounce(search); }"
                ref="SelectorRemoteMultipleAll"
                v-on:option:deselecting="removeOption"
                v-on:close="selectorClose"
            >
                <template #list-header>
                    <div v-if="optionsRemote.length > 0">
                        <div v-if="selectedOptions.length > 0 || selected && selected.length >= 2" class="all-remove">
                            <a href="javascript:void(0);" class="all-remove-link" @click="removeAllOptions">Remover todos</a>
                        </div>
                        <div class="all-add">
                            <a v-if="!selected || selected && optionsRemote.length !== selected.length" href="javascript:void(0);" class="all-add-link" @click="addAllOptions">Seleccionar todos</a>
                        </div>
                        <div style="clear:both;"></div>
                    </div>
                    <div v-if="selectedOptions.length > 0">
                        <p class="search-title">Opciones seleccionadas</p>
                        <div class="search">
                            <button class="search-button search-button-ok" @click="selectedOptonsFilter">OK</button>
                            <button class="search-button search-button-cancel" @click="selectorClose">Cancelar</button>
                        </div>
                        <div class="vs__selected-options">
                            <span v-for="option in selectedOptions" :key="option.id" class="vs__selected">
                                {{ option.name }} <button type="button" :title="'Deselect ' + option.name" :aria-label="'Deselect ' + option.name" class="vs__deselect" @click="removeOption(option)"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M6.895455 5l2.842897-2.842898c.348864-.348863.348864-.914488 0-1.263636L9.106534.261648c-.348864-.348864-.914489-.348864-1.263636 0L5 3.104545 2.157102.261648c-.348863-.348864-.914488-.348864-1.263636 0L.261648.893466c-.348864.348864-.348864.914489 0 1.263636L3.104545 5 .261648 7.842898c-.348864.348863-.348864.914488 0 1.263636l.631818.631818c.348864.348864.914773.348864 1.263636 0L5 6.895455l2.842898 2.842897c.348863.348864.914772.348864 1.263636 0l.631818-.631818c.348864-.348864.348864-.914489 0-1.263636L6.895455 5z"></path></svg></button>
                            </span>
                        </div>
                    </div>
                </template>
            </v-select>
            <v-select
                v-if="this.input.options !== null || this.input.entity_type_fk !== null"
                label="name"
                :id="id"
                :options="options"
                :disabled="disabled"
                :multiple="true"
                v-model="selected"
                :searchable="true"
                :readonly="false"
            >
            </v-select>
            <div class="row" v-if="this.defaultOption !== null">
                <div class="col">
                    <p class="input-placeholder">Por defecto: {{ defaultOption }}</p>
                </div>
            </div>
            <div v-if="loading" class="clearfix" style="margin: 15px">
                <div class="spinner-border float-right" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </form-group>
    </div>
</template>

<script>
/* eslint-disable no-console */
import mix from '../mixs/input.vue';
import mixSelector from '../mixs/selector-remote.vue';
import FormGroup from '../templates/form-group.vue';

export default {
    mixins: [mix, mixSelector],
    components: {
        'form-group': FormGroup,
    },
    data: () => ({}),
    computed: {
         styles() {
            const styles = [
                'sheets-action-btn',
                'btn',
                'btn-block',
                this.btn.cancel_form == 1 ? 'btn-warning' : 'btn-success',
            ];
            return styles.join(' ');
        },
    }
};
</script>
<style>
.all-remove {
    display: block;
    float: right;
    margin: 0 10px 0 0;
}

.all-remove-link {
    font-size: 0.8em;
}

.all-add {
   display: block;
   float: right;
}

.all-add-link {
   font-size: 0.8em;
   margin: 0 10px;
}

.search-title {
    text-align: center;
}

.search {
    display: block;
    text-align: right;
    margin: 10px 0;
}

.search-button {
    min-width: 64px;
    height: 22px;
    margin-right: 10px;
    padding: 1px 6px;
    border: 1px solid #d2d1d1;
    border-radius: 2px;
    font-family: inherit;
    font-size: .75em;
    font-weight: 700;
    text-align: center;
}

.search-button-ok {
    background-color: #0f9d58;
    color: #fff;
}

.search-button-cancel {
    background-color: #eee;
    color: #000;
}

</style>
