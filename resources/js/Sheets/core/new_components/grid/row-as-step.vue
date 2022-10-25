<template>
    <div>
        <div id="timeline">
            <ul id="progress">
                <li
                    v-for="(row, key) in rows"
                    :key="key"
                    :id="row.id"
                    :class="[
                        { active: key === currentStep },
                        { 'cursor-disabled': is_strict === 'true' },
                        { 'errors-fields': row.errorsFields },
                        'progress-number',
                    ]"
                    @click="clickInProgressNumber(key)"
                >
                    <strong>{{ row.name }}</strong>
                    <br />
                    <small v-show="row.errorsFields" class="errors-field-text"
                        >Existen errores de validación</small
                    >
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
                        { 'cursor-disabled': is_strict === 'true' },
                        'progress-item-mobile',
                    ]"
                >
                    <div class="progress-number-mobile">
                        <div :class="[{ 'errors-fields-mobile': row.errorsFields }]">
                            {{ key + 1 }}
                        </div>
                    </div>
                    <small v-show="row.errorsFields">Existen errores de validación</small>
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
                state="myStore0"
                :key="key"
                :row="row"
                :base_url="baseUrl"
                v-model="formAnswer[key]"
            />
        </div>
        <div class="mb-4 text-right">
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
            <small>Existen errores de validación</small>
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
        is_strict: {
            type: String,
            default: 'false',
        },
    },
    data: () => {
        return {
            currentStep: 0,
            formAnswer: [],
            ifErrorTextForMobile: false
        };
    },
    computed: {
        rows() {
            const errorsFields = this.$store.getters[`${this.state}/errors_fields`];

            let setErrorMessageForMobile = 0;

            const rows = this.formRows.map((formRow) => {
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
                if (val + 1 !== this.formRows.length && this.is_strict) {
                    this.$emit('show-actions', false);
                }

                if (val + 1 === this.formRows.length && this.is_strict) {
                    this.$emit('show-actions', true);
                }
            }
        }
    },
    methods: {
        clickInProgressNumber(key) {
            if (this.is_strict !== 'true') {
                this.currentStep = key;
            }
        },
        previousStep() {
            this.currentStep--;
        },
        nextStep() {
            this.currentStep++;
        },
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
    color: lightgrey;
    padding: 0;
}

#progress .active {
    color: #000000;
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

.progress-number:before {
    content: counter(line-number);
}

#progress li:before {
    width: 50px;
    height: 50px;
    line-height: 45px;
    display: block;
    font-size: 18px;
    color: #ffffff;
    background: lightgray;
    border-radius: 50%;
    margin: 0 auto 10px auto;
    padding: 2px;
}

#progress li:after {
    content: '';
    width: 100%;
    height: 2px;
    background: lightgray;
    position: absolute;
    left: 0;
    top: 25px;
    z-index: -1;
}

#progress li.active:before,
#progress li.active:after {
    background: skyblue;
}

#progress li.active:before,
#progress li.active:after {
    background: skyblue;
}

#progress li.errors-fields:before,
#progress li.errors-fields:after {
    background: red;
}

#progress li small.errors-field-text {
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
    background-color: skyblue;
    border-radius: 50%;
    color: #ffffff;
    font-size: 18px;
    text-align: center;
    line-height: 45px;
}

.timeline-mobile small {
    color: red;
    text-align: center;
    font-weight: bold;
}

.progress-mobile div.errors-fields-mobile {
    background: red;
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
    color: #fff;
    background: skyblue;
}

.progress-mobile small.errors-field-text-mobile {
    color: red;
    font-weight: bold;
}

.general-error-message {
    display: none;
    text-align: center;
    color: red;
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