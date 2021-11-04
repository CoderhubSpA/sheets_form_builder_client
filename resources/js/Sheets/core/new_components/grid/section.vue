<template>
    <div :class="`${sm} ${md} ${xl}`" v-if="show_section">
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
            >
            </sheets-field>
        </div>
    </div>
</template>

<script>
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
    },
    data: () => ({
        sectionModel: [],
    }),
    watch: {
        sectionModel() {
            this.$emit('input', this.sectionModel);
        },
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
        show_section() {
            const fields = this.$store.getters[`${this.state}/field_section_show_hide`];
            // eslint-disable-next-line camelcase
            let show_section = false;
            // eslint-disable-next-line no-console
            console.log(`section.vue ${this.section.name}`, fields[this.show_by_field_id]);
            if (this.show_by_field_id) {
                // eslint-disable-next-line eqeqeq
                if ((fields[this.show_by_field_id] || false) == this.show_by_field_value) {
                    // eslint-disable-next-line camelcase
                    show_section = true;
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
            } else show_section = true;
            // eslint-disable-next-line camelcase
            return show_section;
        },
    },
};
</script>

<style lang="scss">
.sheets-section-title {
    color: black;
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
