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
                @inserted="createdOption"
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
        contentInfo() {
            return this.$store.getters[`${this.state}/content_info`];
        },
        options() {
            const contentInfo = this.$store.getters[`${this.state}/content_info`];
            let options = [];

            if (contentInfo) {
                const fk = this.input.entity_type_fk;

                const entities = contentInfo.content.entities_fk[fk];
                if (entities) {
                    options = entities.map((e) => ({ id: e.id, name: e.name }));
                }
            }
            return options;
        },
    },
    methods: {
        async createdOption(id) {
            const RAW = this.$store.getters[`${this.state}/raw`];
            await this.$store.dispatch(`${this.state}/info`, RAW.entity_type_id);
            const result = this.options.find((o) => o.id === id);
            // console.log(result)
            this.selected.push(result);
        },
    },
};
</script>
