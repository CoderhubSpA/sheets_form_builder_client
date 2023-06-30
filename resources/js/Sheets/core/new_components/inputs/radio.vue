<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        :class="{'hide': hide}"
        v-if="show_field"
    >
        <div class="radio-list">
            <div class="custom-control custom-radio" v-for="(option, key) in options" :key="key">
                <input
                    type="radio"
                    :id="`${input.col_name}-${option.id}`"
                    :name="input.col_name"
                    :value="option.id"
                    :disabled="disabled"
                    :checked="pickedModel == option.id"
                    v-model="pickedModel"
                    class="custom-control-input"
                />
                <label class="custom-control-label" :for="`${input.col_name}-${option.id}`">{{
                    option.name
                }}</label>
            </div>
        </div>
        <div class="row" v-if="defaultOptionLabel">
            <div class="col">
                <p class="input-placeholder" v-text="`Por defecto: ${defaultOptionLabel}`" />
            </div>
        </div>
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue';
import FormGroup from '../templates/form-group.vue';

export default {
    mixins: [mix],
    components: {
        'form-group': FormGroup,
    },
    data: () => ({
        pickedModel: null,
    }),
    created() {
        this.$root.$refs.radioComponent = this;
    },
    computed: {
        /**
         * * Listado de opciones
         * @return { Array }
         */
        options() {
            let options = [];

            let content_info = this.$store.getters[`${this.state}/content_info`];

            if (content_info) {
                const entities = content_info.content.entities_fk[this.input.entity_type_fk];
                if (entities) {
                    options = entities.map((entity) => {
                        return { id: entity.id, name: entity.name };
                    });
                } else {
                    // * Listado de opciones que no dependen de una relacion (entities_fk)
                    // * y se encuentran dentro del registro del input
                    const input_options = JSON.parse(this.input.options);
                    options = Object.keys(input_options).map((key) => {
                        return { id: key, name: input_options[key] };
                    })
                }
            }
            return options;
        },
        /**
         * * En caso de ser un formulario de edicion
         * * debe mostrar el valor con el que fue registrado
         * * y en caso de no tenerlo, mostrar el valor por defecto
         * @return { Any }
         */
        inputValue() {
            let picked = null;

            const fields = this.$store.getters[`${this.state}/fields`];

            const value = fields.filter((field) => Object.keys(field)[0] == this.id)[0];

            if (value) {
                picked = value[this.id] ? value[this.id].toString() : '';
            } else if (this.defaultOption) this.pickedModel = this.defaultOption;

            return picked;
        },
        /**
         * * Obtener el valor por defecto que debe aparecer en caso de
         * * no haber alguna opcion seleccionada
         */
        defaultOption() {
            let default_option = null;

            if (this.input.options) {
                const options = JSON.parse(this.input.options);

                Object.keys(options).forEach((key) => {
                    if (this.input.default_value === parseInt(key, 10)) {
                        default_option = parseInt(key, 10);
                    }
                });
            } else {
                this.options.map(option => {
                    if (option.id == this.input.default_value) {
                        default_option = option.id.toString();
                    }
                })
            }
            // if (this.inputValue) {
            //     default_option = this.inputValue
            // }
            return default_option;
        },
        /**
         * * Obtiene la se;al de limpiado de campo
         * @return { Boolean }
         */
        clear() {
            return this.$store.getters[`${this.state}/clearfields`];
        },
        /**
         * * Texto a mostrar en caso de tener opcion por defecto
         */
        defaultOptionLabel() {
            let label = '';

            let default_option = this.options.find(option => option.id == this.defaultOption);

            if (default_option) {
                label = default_option.name;
            }

            return label;
        }
    },
    watch: {
        inputValue(value) {
            if (value) {
                this.pickedModel = value;
            }
        },
        pickedModel(value) {
            if (value) {
                // * Envio de data al componente padre
                const picked = {};
                picked[this.id] = value;
                this.$emit('input', picked)
                // TODO: Refactorizar el manejo de encuestas
                this.$emit('poll-entry', value, this.id, this.input.col_name);
                // * Envio de informacion al filtrado de selectores
                const selector_filters = {
                    key: this.input.col_name,
                    value: value.toString()
                };
                this.$store.commit(`${this.state}/SELECTORFILTERS`, selector_filters);
                // * Mostrado/ocultado de sections
                const show_hide = {};
                show_hide[this.form_field_id] = value;

                this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, show_hide);
                /**
                 * mostrar/ocultar field
                 */
                // eslint-disable-next-line camelcase
                const field_show_hide = {};
                field_show_hide[this.form_field_id] = value;
                this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);

            } else {
                const picked = {};
                picked[this.id] = this.defaultOption;
                this.$emit('input', picked)
            }
        },
        // TODO: Realizar limpiado de campo
        // TODO: o colocar nuevamente el valor
        clear(value) {
            console.log('TODO', value)
        }
    },
};
</script>

<style></style>
