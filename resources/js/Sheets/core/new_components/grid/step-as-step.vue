<template>
    <div class="container-fluid" v-if="groupedSections">
        <div class="row">
            <div class="col-md-2 col-lg-2">
                <div class='wrapper'>
                    <div class='steps' id='steps'>
                        <div class='step' v-for="(section, key) in groupedSections" :key="key">
                            <div :class="[{ 'active': section.complete }, 'number']" v-if="section.complete">
                                <i class="fa fa-solid fa-check"></i>
                            </div>
                            <div :class="[{'active': section.complete }, 'number']" v-else>{{ section.number }}</div>
                            <div class='info'>
                                <p class='title'>{{ key }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-10">
                <sheets-section
                    v-for="(sect, key) in sections"
                    v-show="sect.group_name === groupName"
                    v-model="rowModel[key]"
                    :key="key"
                    :section="sect"
                    :state="state"
                    :base_url="baseUrl"
                    v-on:input="emitData"
                >
                </sheets-section>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-end">
                    <button
                        type="button"
                        class="btn btn-secondary mr-1"
                        @click="previousStep()"
                    >
                        Anterior
                    </button>
                    <button
                        :disabled="currentStep + 1 === countSteps && lastRow"
                        type="button"
                        class="btn btn-success"
                        @click="nextStep()"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import section from './section.vue';

export default {
    name: 'step-as-step',
    components: {
        'sheets-section': section,
    },
    props: {
        groupedSections: {
            type: Object,
            require: true,
        },
        row: {
            type: Object,
            require: true,
        },
        state: {
            type: String,
            require: true,
        },
        baseUrl: {
            type: String,
            default: '',
        },
        lastRow: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        rowModel: [],
        groupName: "",
        currentStep: 0,
    }),
    mounted() {
        // Set the default group name to the first group name in the groupedSections object
        this.groupName = this.groupedSections[Object.keys(this.groupedSections)[0]][0].group_name;
    },
    computed: {
        sections() {
            return this.row.sections || [];
        },
        countSteps() {
            return Object.keys(this.groupedSections).length;
        },

    },
    watch: {
        rowModel() {
            let model = [];

            this.rowModel.forEach((s) => {
                model = model.concat(s);
            });

            this.$emit('input', model);
        }
    },
    methods: {
        // This function sets the sections of the groupedSections object to complete if all fields in the section have values. It sets the current group name to the new group if the new group is complete. If the new group is not complete, it sets the current group name to incomplete.
        setSections(groupKey) {
            // if the current section is complete, set that section to complete
            if(this.verifyFieldsWithValue(this.groupedSections[this.groupName])) {
                this.groupedSections[this.groupName].complete = true;
                // set the group name to the new group
                this.groupName = groupKey;

                return true;
            } else {
                // otherwise, set the current section to incomplete
                this.groupedSections[this.groupName].complete = false;
            }

            // if the new section is complete, set the group name to the new group
            if(this.groupedSections[groupKey].complete === true) {
                this.groupName = groupKey;
            }
        },
        // This code is used to verify that all required fields in a section have a value. It is used in the create and edit views of a module.
       verifyFieldsWithValue(sections) {
            // Get fields with value
            const fieldsInStore = this.$store.getters[`${this.state}/field_section_show_hide`];
            // Count required fields in section
            let requiredFields = [];
            // Count fields with value
            let requiredFieldsWithValue = 0;

            // Loop through each section
            sections.forEach((section) => {
                // Loop through each field
                section.fields.forEach((field) => {
                    // Check if field is required
                    if(field.required == '1') {
                        const findField = requiredFields.find((field) => {
                            return field === field.form_field_id;
                        });

                        if(!findField) {
                            requiredFields.push(field.form_field_id);
                        }
                    }
                });
            });

            // Loop through each required field
            requiredFields.forEach((field) => {
                // Check if field has value
                const findField = Object.keys(fieldsInStore).find((fieldKey) => {
                    return (fieldKey === field && fieldsInStore[fieldKey] !== null && fieldsInStore[fieldKey] !== '' && fieldsInStore[fieldKey] !== undefined);
                });

                if(findField) {
                    requiredFieldsWithValue++;
                }
            });

            // Check if all required fields have value
            if(requiredFields.length > 0 && requiredFieldsWithValue !== requiredFields.length) {
                return false;
            }

            return true;
        },
        // function to decrease the current step
        previousStep() {
            // if the current step is not the first step
            if(this.currentStep !== 0) {
                // decrease the current step
                this.currentStep--;

                // set the group name to the new group name
                this.groupName = Object.keys(this.groupedSections)[this.currentStep];
            }

            // if the current step is the first step
            if(this.currentStep === 0) {
                // emit the "previous-row" event
                this.$emit('previous-row');
            }
        },
        nextStep() {
            // Check if the sections were set
            this.validateRequireFields();
            if(this.setSections(Object.keys(this.groupedSections)[this.currentStep])) {
                // If they were set, move to the next step
                this.currentStep++;

                // Set the group name
                this.groupName = Object.keys(this.groupedSections)[this.currentStep];

                // If we are at the end of the steps, move to the next row
                if(this.currentStep === this.countSteps) {
                    this.currentRow++;
                    // emit event to move to the next row
                    this.$emit('next-row');
                }
            }
        },
        emitData(data) {
            this.$emit('input', data);
        },
        validateRequireFields() {
            this.$emit('validate-require-fields');
        }
    }
}
</script>

<style lang="scss">
$primary: #00938f;

*, *:before, *:after {
  box-sizing: border-box;
}

.wrapper {
    .steps {
    max-width: 300px;
    margin: 0 auto;
    }

    .step {
        display: flex;
        position: relative;
        height: 45px;

        &:after {
            content: "";
            position: absolute;
            left: 15px;
            top: 32px;
            height: 0;
            width: 2px;
            background-color: $primary;
        }

        .info {
            margin: 4px 0 20px;
        }
        .title {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 8px;
            color: $primary;
        }

        &:not(:last-child) {
                &:after {
                height: 30%;
                }
            }
    }

    .number {
        width: 32px;
        height: 32px;
        background-color: lightgray;
        border-radius: 50%;
        border: 2px solid #00938f;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 15px;
        font-weight: 600;
        margin-right: 14px;

        &.completed {
            background-color: $primary;
        }

        svg {
            width: 16px;
            height: 16px;
            object-fit: contain;

            path {
            fill: white;
            }
        }
    }

    .active {
        background-color: $primary;
    }
}

</style>

