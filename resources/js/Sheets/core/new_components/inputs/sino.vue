<template>
    <form-check
        :label="label"
        :id="id"
        :required="required"
        :linkTarget="this.input.link_url"
        :linkDescription="this.input.link_name"
        :tooltipInfo="this.input.description"
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
    },
    mounted() {
        if (this.inputValue === null) {
            if (this.input.default_value != null || this.input.default_value != undefined) {
                switch (this.input.default_value) {
                    case 1:
                    case '1':
                        this.indeterminate = false;
                        this.checked = true;
                        break;
                    case 0:
                    case '0':
                        this.indeterminate = false;
                        this.checked = false;
                        break;
                    default:
                        break;
                }
            }
        } else if (this.inputValue === 0) {
            this.indeterminate = false;
            this.checked = false;
        } else if (this.inputValue === 1) {
            this.indeterminate = false;
            this.checked = true;
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
            const dataToSelectorFilters = {
                key: this.input.col_name,
                value: data[this.id].toString(),
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
            this.$emit('input', data);
            /**
             * mostrar/ocultar section
             */
            // eslint-disable-next-line camelcase
            const field_section_show_hide = {};
            field_section_show_hide[this.form_field_id] = data[this.id];
            this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, field_section_show_hide);
            /**
             * mostrar/ocultar field
             */
            // eslint-disable-next-line camelcase
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
