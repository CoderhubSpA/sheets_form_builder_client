<template>
    <div>
        <form-group
            :id="id"
            :label="label"
            :required="required"
            :linkTarget="this.input.link_url"
            :linkDescription="this.input.link_name"
            :tooltipInfo="this.input.description"
            v-if="show_field"
        >
            <v-select
                label="name"
                :id="id"
                :options="
                    this.input.options === null && this.input.entity_type_fk === null
                        ? optionsRemote
                        : options
                "
                :disabled="disabled"
                :multiple="false"
                v-model="selected"
                :searchable="true"
                :readonly="false"
                :filterBy="filterByFunc"
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
