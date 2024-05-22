<template>
    <div>
        <div id="timeline">
            <ul id="progress">
                <li
                    v-for="(row, key) in rows"
                    :key="key"
                    :id="row.id"
                    :class="[
                        { active: key === currentStep},
                        { checked: checked.includes(row.id)},
                        { 'cursor-disabled': is_strict === '2' },
                        { 'errors-fields': row.errorsFields },
                        'progress-number',
                    ]"
                    @click="clickInProgressNumber(key)"
                >
                    <span :class="[{'errors-field-text': row.errorsFields}, 'progress-title']">{{ row.name }} </span>
                    <span v-show="row.errorsFields" class="errors-field-text" data-toggle="tooltip" data-placement="bottom" title="Existen errores de validación"><i class="bi bi-info-circle-fill"></i></span>
                </li>
            </ul>
        </div>
        <div class="timeline-mobile mb-4">
            <div class="progress-mobile">
                <button
                    @click="previousStep()"
                    :class="[{'bg-danger': ifErrorTextForMobile}, 'btn progress-mobile-action']"
                    :disabled="currentStep <= 0"
                >
                    <i class="bi bi-arrow-left"></i>
                </button>
                <div
                    v-for="(row, key) in rows"
                    :key="key"
                    :id="row.id"
                    v-show="key === currentStep"
                    :class="[
                        { active: key === currentStep },
                        { 'cursor-disabled': is_strict === '2' },
                        'progress-item-mobile',
                    ]"
                >
                    <div class="progress-number-mobile">
                        <div :class="[{ 'errors-fields-mobile': row.errorsFields }]">
                            {{ key + 1 }}
                        </div>
                    </div>
                    <span v-show="row.errorsFields">Existen errores de validación</span>
                </div>
                <button
                    @click="nextStep()"
                    :class="[{'bg-danger': ifErrorTextForMobile}, 'btn progress-mobile-action']"
                    :disabled="currentStep + 1 === formRows.length"
                >
                    <i class="bi bi-arrow-right"></i>
                </button>
            </div>
        </div>
        <div class="sheets-rows sheets-form-scrolling mb-4">
            <sheets-row
                v-for="(row, key) in formRows"
                v-show="key === currentStep"
                v-model="formAnswer[key]"
                :state="state"
                :key="key"
                :row="row"
                :base_url="baseUrl"
                :last_row="last_row"
                v-on:previous-row="previousStep"
                v-on:next-row="nextStep"
                v-on:has-groups="rowHasStepGroups"
                v-on:validate-require-fields="validateRequireFields"
            />
        </div>
        <div class="mb-4 text-right" v-if="!ifRowHasStepGroups">
            <button @click="previousStep()" class="btn btn-secondary" :disabled="currentStep <= 0">
                Anterior
            </button>
            <button
                @click="nextStep()"
                class="btn btn-success"
                :disabled="currentStep + 1 === formRows.length"
            >
                Siguiente
            </button>
        </div>
        <div v-if="ifErrorTextForMobile" class="general-error-message">
            <span>Existen errores de validación</span>
        </div>
    </div>
</template>

<script>
import Row from './row.vue';

export default {
    components: {
        'sheets-row': Row,
    },
    props: {
        value: {
            type: Array,
            require: true,
        },
        formRows: {
            type: Array,
            default: [],
        },
        state: {
            type: String,
            require: true,
        },
        baseUrl: {
            type: String,
            default: '',
        },
        is_strict: {
            type: [String, Number],
            default: 'false',
        },
    },
    data: () => {
        return {
            currentStep: 0,
            formAnswer: [],
            ifErrorTextForMobile: false,
            rowStepGroups:[],
            ifRowHasStepGroups: false,
            last_row: false,
            checked: []
        };
    },
    computed: {
        rows() {
            const errorsFields = this.$store.getters[`${this.state}/errors_fields`];

            let setErrorMessageForMobile = 0;

            const rows = this.formRows.map((formRow) => {
                formRow.checked = false;

                const section = Object.assign({}, formRow);
                let sectionWithErrorsFields = 0;

                formRow.sections.forEach((section) => {
                    section.fields.forEach((field) => {
                        Object.keys(errorsFields).forEach((objKey) => {
                            if (objKey === field.id && errorsFields[objKey] !== '') {
                                sectionWithErrorsFields++;
                                setErrorMessageForMobile++;
                            }
                        });
                    });
                });

                section.errorsFields = sectionWithErrorsFields > 0;

                return section;
            });

            setErrorMessageForMobile > 0 ? this.ifErrorTextForMobile = true : this.ifErrorTextForMobile = false;

            return rows;
        }
    },
    watch: {
        formAnswer(val) {
            if (val.length) {
                this.$emit('input', val);
            }
        },
        currentStep (val) {
            if (val ) {
                if (val + 1 !== this.formRows.length && this.is_strict == '2') {
                    this.$emit('show-actions', false);
                }

                if (val + 1 === this.formRows.length && this.is_strict == '2') {
                    this.$emit('show-actions', true);
                }
            }
        },
        rowStepGroups(val) {
            /* Check that the val variable has some elements. */
            if(val.length > 0) {
                /* Enable the buttons. */
                this.activePreviousNextButtons();
            }
        }
    },
    methods: {
        clickInProgressNumber(key) {
            //If the game is not set to strict, allow the user to click any number in the sequence
            if (this.is_strict !== '2') {
                //Set the current step to the key being clicked
                this.currentStep = key;
            }

            this.activePreviousNextButtons();
        },
        previousStep() {
            //If the current step is greater than 0, go back one step
            if(this.currentStep > 0) {
                this.last_row = false;
                this.currentStep--;
            }

            this.activePreviousNextButtons();
        },
        nextStep() {
            if(this.rows[this.currentStep].errorsFields === false) {
                this.checked.push(this.rows[this.currentStep].id);
            }

            //If the current step is less than the total number of rows, go forward one step
            if(this.currentStep + 1 < this.rows.length) {
                this.currentStep++;
            }
            
            //If the current step is the last step, set the last_row variable to true
            if(this.currentStep + 1 === this.rows.length) {
                this.last_row = true;
            }

            if(this.currentStep + 1 === this.rows.length && this.rows[this.currentStep].errorsFields === false) {
                this.checked.push(this.rows[this.currentStep].id);
            }

            this.activePreviousNextButtons();
        },
        rowHasStepGroups(value) {
            //If the row has step groups, set the ifRowHasStepGroups variable to true
            const findRow = this.rowStepGroups.find((row) => {
                return row === value.row.id;
            });

            if(!findRow) {
                this.rowStepGroups.push(value.row.id)
            }
        },
        activePreviousNextButtons() {
            // Find the row in the rowStepGroups array that matches the current form row
            const findRow = this.rowStepGroups.find((row) => {
                return row === this.formRows[this.currentStep].id;
            });

            // If the row has a step group, then enable the buttons
            if(findRow) {
                this.ifRowHasStepGroups = true;
            } else {
                this.ifRowHasStepGroups = false;
            }
        },
        validateRequireFields() {
            this.$emit('validate-require-fields');
        }
    },
};
</script>

<style>
#timeline {
    text-align: center;
    position: relative;
    margin-top: 20px;
}

#progress {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    overflow: hidden;
    color: var(--gray-scale-6, #8A8A8A);
    padding: 0;
}

#progress .active {
    color: var(--gray-scale-8, #191A1A);
}

#progress li {
    list-style-type: none;
    font-size: 12px;
    width: 10%;
    float: left;
    position: relative;
    counter-increment: line-number;
    cursor: pointer;
}

#progress li.progress-number:before {
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 auto 10px auto;
    padding: 2px;
    color: var(--primary-color, #00938f);
    background: var(--gray-scale-1, #fff);
    content: counter(line-number);
    line-height: 45px;
    font-size: 18px;
    border-radius: 50%;
    border: solid 2px var(--primary-color, #00938f);
}

#progress li.progress-number:after {
    position: absolute;
    left: 0;
    top: 25px;
    z-index: -1;
    width: 100%;
    height: 2px;
    content: '';
    background: var(--gray-scale-3, #E5E5E5);
}

#progress li.progress-number:first-child:after {
    left: 50%;
}

#progress li.progress-number:last-child:after {
    left: -50%;
}

#progress li.progress-number:not(.active):not(.checked):before {
    color: var(--gray-scale-4, #CCCCCC);
    background: var(--gray-scale-3, #E5E5E5);
    border-color: var(--gray-scale-3, #E5E5E5);
}

#progress li.active::before {
    font-weight: 900;
}

#progress li.active:after, #progress li.checked:before, #progress li.checked:after{
    background: var(--primary-color, #00938f);
    border: solid 1px var(--primary-color, #00938f);
    color: var(--gray-scale-1, #FFFFFF);
}

#progress li.progress-number:is(.errors-fields):not(.active):not(.checked):before {
    color: var(--error-color, #FE4B48);
    background: var(--gray-scale-1, #FFFFFF);
    border: dotted 2px var(--error-color, #FE4B48);
}

#progress li span.progress-title {
    color: var(--gray-scale-8, #191A1A);
    font-size: var(--font-size, 14px);
    font-weight: bold;
}

#progress li.errors-fields:before {
    color: var(--error-color, #FE4B48);
    background: var(--gray-scale-1, #FFFFFF);
    border: solid 2px var(--error-color, #FE4B48);
}

#progress li.errors-fields:after {
    color: var(--error-color, #FE4B48);
    background: var(--gray-scale-1, #FFFFFF);
    border: solid 1px var(--error-color, #FE4B48);
}

#progress li span.errors-field-text {
    color: red;
    font-weight: bold;
}

#progress li.cursor-disabled {
    cursor: inherit;
}

.progress-number-mobile {
    display: flex;
    justify-content: center;
    align-items: center;
}

.progress-number-mobile div {
    width: 50px;
    height: 50px;
    margin-top: 0;
    background-color: var(--primary-color, #00938f);
    border-radius: 50%;
    color: var(--gray-scale-1, #FFFFFF);
    font-size: 18px;
    text-align: center;
    line-height: 45px;
}

.timeline-mobile span {
    color: var(--error-color, #FE4B48);
    text-align: center;
    font-weight: bold;
}

.progress-mobile div.errors-fields-mobile {
    background: var(--error-color, #FE4B48);
}

.progress-mobile {
    display: none;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.progress-item-mobile {
    flex-grow: 4;
}

.progress-mobile button {
    color: var(--gray-scale-1, #FFFFFF);
    background: var(--primary-color, #00938f);
}

.progress-mobile span.errors-field-text-mobile {
    color: var(--error-color, #FE4B48);
    font-weight: bold;
}

.general-error-message {
    display: none;
    text-align: center;
    color: var(--error-color, #FE4B48);
    font-weight: bold;
}

@media only screen and (max-width: 996px) {
    #timeline {
        display: none;
    }
}

@media only screen and (max-width: 995px) {
    .timeline-mobile .progress-mobile {
        display: flex;
    }
    .general-error-message {
        display: block;
    }
}
</style>
