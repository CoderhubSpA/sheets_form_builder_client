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
                v-if="this.input.options === null && this.input.entity_type_fk === null"
                label="name"
                v-model="selected"
                class="sheets-select"
                :id="id"
                :options="optionsRemote"
                :disabled="disabled"
                :multiple="true"
                :searchable="false"
                :readonly="false"
                v-on:open="getOptions()"
                v-on:option:deselected="deselectedMultipleOption"
                @search="(search, loading) => { filterByFuncDebounce(search) }"
            >
                <template #list-header>
                    <div v-if="loading" class="container-loading">
                        <div class="spinner-border text-success m-2" role="status">
                            <span class="sr-only">Loading...</span>
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
                v-on:open="getOptions()"
                v-on:option:deselected="deselectedMultipleOption"
            >
                 <template #list-header>
                    <div v-if="loading" class="container-loading">
                        <div class="spinner-border text-success m-2" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
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
    methods: {},
};
</script>
