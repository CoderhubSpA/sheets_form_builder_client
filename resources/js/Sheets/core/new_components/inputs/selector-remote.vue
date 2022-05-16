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
                :id="id"
                :options="optionsRemote"
                :disabled="disabled"
                :multiple="false"
                v-model="selected"
                :searchable="false"
                :readonly="false"
                @search="
                    (search, loading) => {
                        filterByFuncDebounce(search);
                    }
                "
            >
            </v-select>
            <v-select
                v-if="this.input.options !== null || this.input.entity_type_fk !== null"
                label="name"
                :id="id"
                :options="options"
                :disabled="disabled"
                :multiple="false"
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
    methods: {},
};
</script>
