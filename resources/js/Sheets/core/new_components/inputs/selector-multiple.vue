<template>
    <div>
        <form-group :id="id" :label="label" :required="required">
            <v-select
                label="name"
                :id="id"
                :options="options"
                :disabled="disabled"
                :multiple="multiple"
                v-model="selected"
                :searchable="searchable"
            >
            </v-select>
            <nested-form
                v-if="has_entity_type_permission_fk"
                :entity_type_permission_fk="entity_type_permission_fk"
                :state="state"
            />
        </form-group>
    </div>
</template>

<script>
import mix from '../mixs/input.vue';
import mixSelector from '../mixs/selector.vue';
import FormGroup from '../templates/form-group.vue';
import NestedForm from '../nested.vue';

export default {
    mixins: [mix, mixSelector],
    components: {
        'form-group': FormGroup,
        'nested-form': NestedForm,
    },
};
</script>

<style>

</style>
