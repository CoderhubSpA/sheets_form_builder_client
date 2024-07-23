<template>
    <div >
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
                :disabled="disabled"
                v-model="selected"
                @option:deselected="deselected"
            >
                <template #selected-option="{ name, id }">
                    <div style="display: inline-flex; justify-content: start; align-items: center">
                        <span>{{ name }}</span>
                        <span
                            @click="openNestedForEdit(id)"
                            class="actions"
                            ><i class="bi bi-pencil-fill"></i
                        ></span>
                    </div>
                </template>
            </v-select>
            <nested-form
                :createPermission="has_permissions_for_create"
                :entity_type_permission_fk="entity_type_permission_fk"
                :state="state"
                :openForm="openNested"
                :recordId="recordId"
                :parent_input_id="id"
                :showCreateNew="show_create_new"
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
    computed: {
        multiple() {
            return true;
        },
    },
};
</script>

<style lang="scss">
.actions {
    cursor: pointer;
    color: rgb(150, 150, 150);
    margin: 4px 2px 4px 8px;
    padding: 1px 4px;
    border: solid 1px rgb(150, 150, 150);
    border-radius: 4px;
    font-size: 12px;
}
</style>
