<template>
    <form-check
        :label="label"
        :id="id"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        :disabled="disabled"
        
    >
        <input
            :class="getInputClasses()"
            type="checkbox"
            :id="id"
            :disabled="disabled"
            :indeterminate.prop="indeterminate"
            v-model="checked"
            @change="onInput"
        />
    </form-check>
</template>

<script>
/* eslint-disable eqeqeq */
import FormCheck from '../templates/form-check.vue';
import mix from '../mixs/input.vue';

export default {
    mixins: [mix],
    components: {
        'form-check': FormCheck,
    },
    data: () => ({
        indeterminate: true,
        checked: null,
    }),
    mounted() {
        if(this.input.assign_default_value == 1 && this.input.default_value == "1") {
            this.indeterminate = false;
            this.checked = true;
        }
    },
    computed: {
        inputValue() {
            const fields = this.$store.getters[`${this.state}/fields`];
            let result = null;
            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                if (val) {
                    result = val[this.id];
                }
            }
            return result;
        },
    },
    watch: {
        inputValue(val) {
            this.indeterminate = false;
            this.checked = val;
        },
        checked(val, old) {
            // !Emulando el objeto event del input
            const e = {
                target: {
                    checked: val
                }
            };
            this.onInput(e)
        }
    },
    methods: {
        getInputClasses() {
            if (this.input.link_url !== null && this.input.link_url !== undefined) {
                return this.input.link_url.length > 0
                    ? 'form-check-input has-more-info'
                    : 'form-check-input';
            }
            return 'form-check-input';
        },
        readInputValue() {
            const dataToSelectorFilters = {
                key: this.input.col_name,
                value: this.inputValue === 1 ? 'true' : 'false',
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
            if (this.inputValue) {
                this.indeterminate = false;
                this.checked = this.inputValue === 1;
            }
        },
        onInput(e) {
            const data = {};
            data[this.id] = e.target.checked;
            this.vmodelcurrentvalue = data;
            const filters = {
                key: this.input.col_name,
                value: data[this.id].toString(),
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, filters);
            this.$emit('input', data);
            /**
             * mostrar/ocultar section
             */
            // eslint-disable-next-line camelcase
            const show_hide = {};
            show_hide[this.form_field_id] = data[this.id];
            this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, show_hide);
            // * Mostrar/Ocultar campo
            const field_show_hide = {};
            field_show_hide[this.form_field_id] = data[this.id];
            this.$store.commit(`${this.state}/FIELD_SHOW_HIDE`, field_show_hide);
        },
    },
};
</script>
<style scoped>
input.has-more-info {
    margin-top: 1rem;
}
</style>
