<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        :class="{hide}"
    >
        <v-select
            label="name"
            :id="id"
            :options="
                optionsFiltered.length === 0 &&
                this.input.col_filter_by === null &&
                this.input.col_fk_filter === null
                    ? options
                    : optionsFiltered
            "
            :disabled="disabled"
            :multiple="multiple"
            v-model="selected"
            :searchable="searchable"
            v-if="show_field"
        >
        </v-select>
        <nested-form
            v-if="has_permissions_for_create"
            :entity_type_permission_fk="entity_type_permission_fk"
            :state="state"
            @inserted="createdOption"
        />
        <div class="row" v-if="this.input.default_value !== null">
            <div class="col">
                <p class="input-placeholder">Por defecto: {{ defaultOption }}</p>
            </div>
        </div>
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue';
import mixSelector from '../mixs/selector2.vue';
import FormGroup from '../templates/form-group.vue';
import NestedForm from '../nested.vue';

export default {
    mixins: [mix, mixSelector],
    components: {
        'form-group': FormGroup,
        'nested-form': NestedForm,
    },
    data: () => ({
        selected: [],
    }),
};
</script>
