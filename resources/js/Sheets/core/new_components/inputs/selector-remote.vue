<template>
    <div>
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
                v-if="input.col_filter_by !== null && input.col_fk_filter !== null"
                v-model="selected"
                label="name"
                :class="[{'sheets-select-error': error_messages}, 'sheets-select']"
                :id="id"
                :options="optionsByColFilter"
                :required="required"
                :disabled="disabled"
                :multiple="false"
                :searchable="false"
                :readonly="false"
                :clearable="false"
                @input="deselectedSingleOption"
                @search="(search, loading) => { filterByFuncDebounce(search) }"
            >
                <template #list-header>
                    <div v-if="loading">
                        <div class="container-loading">
                            <div class="spinner-border m-2" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <div>
                            <p class="text-center">Buscando...</p>
                        </div>
                    </div>
                </template>
                <template #no-options="{}">
                    <div v-if="!loading"></div>
                    <div v-if="!loading && optionsRemote.length === 0">
                        <p class="mb-0">Sin datos.</p>
                    </div>
                </template>
            </v-select>
            <v-select
                v-if="input.options === null && input.entity_type_fk === null"
                v-model="selected"
                label="name"
                :class="[{'sheets-select-error': error_messages}, 'sheets-select']"
                :id="id"
                :options="optionsRemote"
                :required="required"
                :disabled="disabled"
                :multiple="false"
                :searchable="false"
                :readonly="false"
                :clearable="false"
                v-on:open="getOptions()"
                @input="deselectedSingleOption"
                @search="(search, loading) => { filterByFuncDebounce(search) }"
            >
                <template #list-header>
                    <div v-if="loading">
                        <div class="container-loading">
                            <div class="spinner-border m-2" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <div>
                            <p class="text-center">Buscando...</p>
                        </div>
                    </div>
                </template>
                <template #no-options="{}">
                    <div v-if="!loading"></div>
                    <div v-if="!loading && optionsRemote.length === 0">
                        <p class="mb-0">Sin datos.</p>
                    </div>
                </template>
            </v-select>
            <v-select
                v-if="input.col_filter_by === null && (input.options !== null || input.entity_type_fk !== null)"
                v-model="selected"
                label="name"
                :class="[{'sheets-select-error': error_messages}, 'sheets-select']"
                :id="id"
                :options="options"
                :required="required"
                :disabled="disabled"
                :multiple="false"
                :searchable="true"
                :readonly="false"
                :clearable="false"
                v-on:open="getOptions()"
                @input="deselectedSingleOption"
            >
                <template #list-header>
                    <div v-if="loading">
                        <div class="container-loading">
                            <div class="spinner-border m-2" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <div>
                            <p class="text-center">Buscando...</p>
                        </div>
                    </div>
                </template>
                <template #no-options="{}">
                    <div v-if="!loading"></div>
                    <div v-if="!loading && options.length === 0">
                        <p class="mb-0">Sin datos.</p>
                    </div>
                </template>
            </v-select>
            <div class="row" v-if="this.defaultOption !== null">
                <div class="col">
                    <p class="input-placeholder">Por defecto: {{ defaultOption }}</p>
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
};
</script>
