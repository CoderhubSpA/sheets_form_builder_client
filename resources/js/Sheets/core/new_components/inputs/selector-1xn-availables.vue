<template>
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
            :disabled="disabled"
            v-model="selected"
            :multiple="multiple"
            :option:deselected="deselected"
        >
        </v-select>
        <nested-form
            v-if="has_permissions_for_create"
            :entity_type_permission_fk="entity_type_permission_fk"
            :state="state"
            :showCreateNew="show_create_new"
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
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-object-spread */
/* eslint-disable array-callback-return */
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
    computed: {
        selectedValue() {
            let result = [];
            const fields = this.$store.getters[`${this.state}/fields`];
            if (fields && fields.length > 0) {
                const field = fields.filter((f) => Object.keys(f)[0] === this.id)[0];

                if (field) {
                    const key = Object.keys(field)[0];
                    const search = JSON.parse(field[key]);

                    const contentInfo = this.$store.getters[`${this.state}/content_info`];

                    if (contentInfo) {
                        const fk = this.input.entity_type_fk;
                        const entities = contentInfo.content.entities_fk[fk];
                        result = Object.entries(search).map((s) =>
                            entities.find((e) => e.id === s[1])
                        );
                    }
                }
                // console.log(result, field);
                // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                this.selected = result;
            }

            if(result.length === 0 && this.input.assign_default_value === 1) {
                this.selected = this.options.find((o) => o.id == this.input.default_value);
            }

            return result;
        },
        multiple() {
            return true;
        },
        entity_type_permission_fk() {
            return this.input.entity_type_permission_fk;
        },
        options() {
            let options = [];
            let returnOptions = [];
            const contentInfo = this.$store.getters[`${this.state}/content_info`];

            // eslint-disable-next-line no-unused-vars
            const key = this.input.entity_type_fk;
            if (contentInfo) {
                const fk = this.input.entity_type_fk;
                const entities = contentInfo.content.entities_fk[fk];

                if (entities) {
                    options = entities.filter((e) => !e[this.input.col_fk_1_n]);
                }
            }
            //   if (this.selected.length > 0) {
            //     options = options.filter((o) => this.selected.indexOf(o) < 0);
            //   }

            /** comparando con otros availables
             * que usen el mismo col_fk_1_n
             * y asi limitar las opciones entre ellos
             */
            // eslint-disable-next-line camelcase
            const col_fk_1_n_common = this.$store.getters[`${this.state}/col_fk_1_n_common`];
            // eslint-disable-next-line no-console
            if (col_fk_1_n_common[this.input.col_fk_1_n]) {
                options = options.filter(
                    (o) => col_fk_1_n_common[this.input.col_fk_1_n].indexOf(o) < 0
                );
            }
            if (this.input.col_name_fk !== null) {
                options.map((opt) => {
                    returnOptions.push({ id: opt.id, name: opt[this.input.col_name_fk] });
                });
            } else {
                returnOptions = [...options];
            }
            if (this.input.default_value) {
                returnOptions.forEach((opt) => {
                    if (this.input.default_value === opt.id) {
                        this.defaultOption = opt.name;
                    }
                });
            }
            return returnOptions;
        },
    },
    watch: {
        selected(val) {
            const data = {};
            data[this.id] = val.map((v) => v.id);
            this.selectorvmodelsample = Object.assign({}, data);
            this.$emit('input', data);
            const store = {};
            store[this.input.col_fk_1_n] = val;
            this.$store.commit(`${this.state}/COL_FK_1_N_COMMON`, store);
            /**
             * mostrar/ocultar section
             */
            const field_section_show_hide = {};
            field_section_show_hide[this.form_field_id] = val;
            this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, field_section_show_hide);
        },
    },
    methods: {
        deselected(o) {},
    },
};
</script>
