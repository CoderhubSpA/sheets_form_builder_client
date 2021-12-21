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
                :options="options"
                :no-drop="true"
                :multiple="multiple"
                v-model="selected"
                @option:deselected="deselected"
            >
            </v-select>
            <nested-form
                v-if="has_entity_type_permission_fk"
                :entity_type_permission_fk="entity_type_permission_fk"
                :state="state"
                @inserted="createdOption"
            />
            <div class="row" v-if="this.input.default_value !== null">
                <div class="col">
                    <p class="input-placeholder">
                        {{ this.input.default_value || `Placeholder: ${this.input.format}` }}
                    </p>
                </div>
            </div>
        </form-group>
    </div>
</template>

<script>
import mix from '../mixs/input.vue';
import mixSelector from '../mixs/selector2.vue';
import FormGroup from '../templates/form-group.vue';
import NestedForm from '../nested.vue';

export default {
    components: {
        FormGroup,
        NestedForm,
    },
    mixins: [mix, mixSelector],
    data: () => ({
        selected: [],
    }),
    computed: {
        multiple() {
            return true;
        },
    },
    methods: {
        deselected(val) {
            const item = this.selected.find((option) => option.id === val.id);
            const index = this.selected.indexOf(item);
            this.selected.splice(index, 1);
        },
    },
};
</script>
