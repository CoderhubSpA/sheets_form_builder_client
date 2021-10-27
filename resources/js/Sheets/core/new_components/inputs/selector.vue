<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="this.input.link_url"
        :linkDescription="this.input.link_name"
        :tooltipInfo="this.input.description"
        v-if="show_field"
    >
        <v-select label="name" :id="id" :options="options" :disabled="disabled" v-model="selected">
        </v-select>
        <nested-form
            v-if="has_entity_type_permission_fk"
            :entity_type_permission_fk="entity_type_permission_fk"
            :state="state"
            @inserted="createdOption"
        />
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
};
</script>
