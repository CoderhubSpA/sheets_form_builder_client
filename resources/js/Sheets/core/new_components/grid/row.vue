<template>
    <div class="sheets-row">
        <h3 class="sheets-row-title">{{ name }}</h3>
        <div class="sheets-row-wrapper" :style="{ height: row_height }">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12" v-if="grouped_sections">
                        <step-as-step
                            :groupedSections="grouped_sections"
                            :row="row"
                            :state="state"
                            :base_url="base_url"
                            :lastRow="last_row"
                            v-on:previous-row="previousRow"
                            v-on:next-row="nextRow"
                            v-on:input="emitData"
                            v-on:validate-require-fields="validateRequireFields"
                        ></step-as-step>
                    </div>
                    <div class="col-12" v-if="!grouped_sections">
                        <sheets-section
                            v-for="(sect, key) in sections"
                            v-model="rowModel[key]"
                            :key="key"
                            :section="sect"
                            :state="state"
                            :base_url="base_url"
                        ></sheets-section>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import section from './section.vue';
import StepAsStep from './step-as-step.vue';

export default {
    components: {
        'sheets-section': section,
        "step-as-step": StepAsStep,
    },
    props: {
        row: {
            type: Object,
            require: true,
        },
        state: {
            type: String,
            require: true,
        },
        base_url: {
            type: String,
            default: '',
        },
        last_row: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        rowModel: [],
    }),
    computed: {
        id() {
            return this.row.id;
        },
        name() {
            return this.row.name;
        },
        sections() {
            return this.row.sections || [];
        },
        row_height() {
            if (this.row.height) {
                return `${this.row.height}px`;
            }
            return 'unset';
        },
        // filter sections without fields
        filtered_sections_with_fields() {
            // if there are no sections, return an empty array
            if(!this.row.sections) return [];

            // filter out sections without fields
            return this.sections.filter((s) => s.fields.length > 0);
        },
        // The grouped_sections() function filters the sections array to remove those sections that are not visible in the current view, and returns a new object with the sections grouped by group_name
        grouped_sections() {
            if(this.filtered_sections_with_fields.length > 0) {
                let number = 0;
                // Create a new object with the sections grouped by group_name
                const groupedSections = this.filtered_sections_with_fields.reduce((acc, obj) => {
                    let groupName = "";

                    // If the section has a group_name, use it. Otherwise, use "Sin grupo"
                    if(obj.group_name) {
                        groupName = obj.group_name;
                    } else {
                        groupName = "Sin grupo";
                        obj.group_name = "Sin grupo";
                    }

                    // If the group does not exist in the accumulator, add it
                    acc[groupName] = acc[groupName] || [];
                    // Add a "complete" property to the group
                    acc[groupName].complete = false;
                    // Add a "number" property to the group
                    acc[groupName].number = number;
                    // Increase the number
                    number++;

                    // Add the section to the group
                    acc[groupName].push(obj);
                    
                    return acc;
                }, {});

                let countGroups = Object.keys(groupedSections).length;

                if(countGroups === 1 && groupedSections["Sin grupo"]) {
                    return false;
                }

                // Checks if there are groups in the data
                this.$emit('has-groups', {row: this.row, hasGroup: true});

                return groupedSections;
            }

            return;
        },
    },
    watch: {
        rowModel() {
            let model = [];
            this.rowModel.forEach((s) => {
                model = model.concat(s);
            });
            this.$emit('input', model);
        },
    },
    methods: {
        // Emit the data model to the parent component
        emitData(data) {
            this.$emit('input', data);
        },
        // Notify the parent component that the user has moved to the previous row
        previousRow() {
            this.$emit('previous-row');
        },
        // Notify the parent component that the user has moved to the next row
        nextRow() {
            this.$emit('next-row');
        },
        validateRequireFields() {
            this.$emit('validate-require-fields');
        }
    }
};
</script>

<style lang="scss">
.sheets-row {
    .sheets-row-title {
        color: inherit;
        font-size: 26px;
    }
}
</style>
