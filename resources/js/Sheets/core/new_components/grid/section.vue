<template>
    <div :class="`${sm} ${md} ${xl}`" v-if="show_section || showSectionFromHiddenField" :id="section.id">
        <h5 class="sheets-section-title">
            {{ name }}
        </h5>
        <img :src="img" :alt="name" class="sheets-img-section" v-if="img" />

        <span class="tooltip-custom" v-if="this.section.description">
            <span class="icon">&#9432;</span>
            <span class="tooltiptext"> {{ this.section.description }} </span>
        </span>
        <div class="sheets-section-wrapper d-flex flex-wrap">
            <sheets-field
                v-for="(field, key) in fields"
                :field="field"
                :key="key"
                v-model="sectionModel[key]"
                :state="state"
                :base_url="base_url"
                :visible_class="field.visible == 0 ? 'hidden-config-field' : 'visible-config-field'"
            >
            </sheets-field>
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console */
import SheetsField from '../field.vue';

export default {
    components: {
        'sheets-field': SheetsField,
    },
    props: {
        section: {
            type: Object,
            require: true,
        },
        value: {
            required: true,
        },
        state: {
            type: String,
            require: true,
        },
        base_url: {
            type: String,
            default: '',
        },
    },
    data: () => ({
        sectionModel: [],
        showSectionFromHiddenField: false,
    }),
    watch: {
        sectionModel() {
            this.$emit('input', this.sectionModel);
        },
        field_section_show_hide(value) {
            if (Object.entries(value).length > 0) {
                Object.entries(value).forEach((f) => {
                    if (f[0] == this.show_by_field_id && f[1] == this.show_by_field_value) {
                        this.showSectionFromHiddenField = true;
                    }
                });
            }
        }
    },
    computed: {
        id() {
            return this.section.id;
        },
        name() {
            return this.section.name;
        },
        sm() {
            return `col-sm-${this.section.col_sm}`;
        },
        md() {
            return `col-md-${this.section.col_md}`;
        },
        xl() {
            return `col-xl-${this.section.col_xl}`;
        },
        fields() {
            return this.section.fields || [];
        },
        img() {
            let path = '';
            if (this.section.image) {
                const url = `${window.location.protocol}//${window.location.host}/`;
                // eslint-disable-next-line camelcase
                const base_url = this.$store.getters[`${this.state}/base_url`] || url;
                path = new URL(this.section.image, base_url).toString();
            }
            return path;
        },
        show_by_field_id() {
            return this.section.show_by_field_id;
        },
        show_by_field_value() {
            return this.section.show_by_field_value;
        },
        field_section_show_hide() {
            return this.$store.getters[`${this.state}/field_section_show_hide`];
        },
        show_section() {
            const fields = this.field_section_show_hide;
            // eslint-disable-next-line camelcase
            let show_section = false;
            if (this.show_by_field_id) {
                // eslint-disable-next-line eqeqeq
                if (fields[this.show_by_field_id] !== undefined && fields[this.show_by_field_id] == this.show_by_field_value) {
                    // eslint-disable-next-line camelcase
                    show_section = true;
                }
                // si no se encuentra el campo en el objeto fields, se busca en los campos como objetos
                if(Object.keys(fields).length === 0 && show_section == false) {
                    const hiddenFields = this.$store.getters[`${this.state}/fields_as_object`];

                    const findField = hiddenFields.find((field) => field.form_field_id == this.show_by_field_id && field.send_hidden_field == 1);

                    if(findField) {
                        const selectValue = this.selectedValue(findField);

                        if(selectValue !== null && selectValue == this.show_by_field_value) {
                            this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, {[findField.form_field_id]: selectValue});
                        }

                    }
                }

                try {
                    // Permite validar si entre un selector multiple existe el
                    // valor que condiciona que el elemento se vea o no
                    if (
                        Array.isArray(fields[this.show_by_field_id]) &&
                        fields[this.show_by_field_id]
                            .map((d) => d.id)
                            .includes(this.show_by_field_value)
                    ) {
                        // eslint-disable-next-line camelcase
                        show_section = true;
                    }
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.warn(e);
                }
                // eslint-disable-next-line camelcase
            } else {
                show_section = true;
            }
            // eslint-disable-next-line camelcase

            if (!show_section) {
                const remote_selectors = this.$store.getters[`${this.state}/selector_remote_filter`];
                const active_filters = this.$store.getters[`${this.state}/active_filter`];

                if (remote_selectors.length > 0) {
                    this.clean_filters(remote_selectors, "SELECTOR_REMOTE_FILTER");
                }

                if (active_filters.length > 0) {
                    this.clean_filters(active_filters, "ACTIVE_FILTERS");
                }
            }

            return show_section;
        },
    },
    methods: {
        clean_filters(filters, filterName) {
            this.section.fields.forEach((field) => {
                filters.forEach((selector) => {
                    if (field.id === selector.column.id) {
                        const contentInfo = this.$store.getters[`${this.state}/content_info`];

                        const column = contentInfo.content.columns.find(
                            (col) => col.id === field.id
                        );

                        const filter = {
                            column: column,
                            id: `external-filter-${column.id}`,
                        };

                        this.$store.commit(`${this.state}/${filterName}`, filter);
                    }
                });
            });
        },
        selectedValue(field) {
            let result = null;

            const fields = this.$store.getters[`${this.state}/fields`];

            if(fields && fields.length > 0) {
                const filterField = fields.filter((f) => Object.keys(f)[0] == field.id)[0];

                if(filterField) {
                    const key = Object.keys(filterField)[0];
                    result = filterField[key];
                }
            }

            return result;
        }
    },
};
</script>

<style lang="scss">
.sheets-section-title {
    color: inherit;
    display: inline-block;
}
.sheets-img-section {
    display: inline-block;
    max-height: 4rem;
    margin-left: 4px;
    margin-bottom: 2px;
    border: 1px solid red;
}
.tooltip-custom {
    position: relative;
    display: inline-block;
    cursor: pointer;
}
.tooltip-custom span.icon {
    font-size: 25px;
}

.tooltip-custom .tooltiptext {
    visibility: hidden;
    width: 250px;
    background-color: white;
    border: 1px solid black;
    color: black;
    text-align: center;
    border-radius: 6px;
    padding: 3px;
    position: absolute;
    width: 120px;
    top: 100%;
    left: 50%;
    z-index: 180;
}

.tooltip-custom:hover .tooltiptext {
    visibility: visible;
}
</style>
