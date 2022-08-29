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
                label="name"
                :id="id"
                :options="
                    optionsFiltered.length === 0 &&
                    this.input.col_filter_by === null &&
                    this.input.col_fk_filter === null
                        ? options
                        : optionsFiltered
                "
                :no-drop="true"
                :multiple="multiple"
                :ref="'ref-' + id"
                v-model="selected"
                @option:deselected="deselected"
            >
                <template #selected-option="{ name, id }">
                    <div style="display: inline-flex; justify-content: start">
                        <span>{{ name }}</span>
                        <span
                            @click="openNestedForEdit(id)"
                            style="margin-left: 6px; cursor: pointer; color: #969696"
                            ><i class="bi bi-pencil-fill"></i
                        ></span>
                    </div>
                </template>
            </v-select>
            <nested-form
                v-if="has_entity_type_permission_fk"
                :entity_type_permission_fk="entity_type_permission_fk"
                :state="state"
                :openForm="openNested"
                :recordId="recordId"
                v-on:opened-nested="recordId = ''"
                v-on:closed-nested="openNested = false"
                @inserted="createdOption"
            />
            <div class="row" v-if="this.input.default_value !== null">
                <div class="col">
                    <p class="input-placeholder">Por defecto: {{ defaultOption }}</p>
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
