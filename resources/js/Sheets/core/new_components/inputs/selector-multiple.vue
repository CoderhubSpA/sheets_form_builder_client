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
                v-model="selected"
                class="sheets-select"
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
                :searchable="searchable"
                :ref="'ref-' + id"
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
    mixins: [mix, mixSelector],
    components: {
        'form-group': FormGroup,
        'nested-form': NestedForm,
    }
};
</script>
