<template>
    <div class="index-container" :class="setTheme" :style="setStyles">
        <loading-message :status="loading"></loading-message>

        <sheets-form
            v-if="isPoll === false"
            class="not-is-poll"
            :entityId="id"
            :record_id="record_id"
            :params="params"
            :base_url="base_url"
            :is_test="form_test"
            :params_actions="actions"
            :is_step_row="is_step_row"
            :context="context"
            :data="form"
            :namespace="namespace"
        ></sheets-form>

        <sheets-poll-render v-if="isPoll === true" :id="id" class="is-poll"/>
    </div>
</template>

<script>
import SheetsForm from '../new_components/form.vue';
import SheetsPollRender from './poll/render.vue';
import LoadingMessage from './loading-message.vue';
import FormTestJson from '../../resources/formtestjson.json';
import FormBuilderStore from '../../../store/formBuilder';
import registerStore from '../new_components/utils/reusabale-store';

export default {
    name: 'form-builder-index',
    components: {
        SheetsForm,
        SheetsPollRender,
        LoadingMessage,
    },
    props: {
        id: {
            type: String,
            default: '',
        },
        record_id: {
            type: [String, Number],
            default: '',
        },
        params: {
            type: String,
            default: '',
        },
        base_url: {
            type: String,
            default: '',
        },
        form_test: {
            type: String,
            default: 'false',
        },
        actions: {
            type: String,
            default: '',
        },
        theme: {
            type: String,
            default: '',
        },
        custom_styles: {
            type: String,
            default: '',
        },
        context: {
            type: Object,
            default: () => ({}),
        },
    },
    data: () => ({
        loading: false,
        isPoll: undefined,
        is_step_row: null,
        form: null,
    }),
    beforeCreate() {
        const { namespace } = registerStore(this.$store, FormBuilderStore, 'myStore');
        this.namespace = namespace;
    },
    mounted() {
        this.loading = true;

        if (this.form_test === 'false') {
            this.$store
                .dispatch(`${this.namespace}/get`, {
                    id: this.id,
                    recordid: this.record_id,
                    params: this.params,
                })
                .then((response) => {
                    this.loading = false;

                    switch (response.type) {
                        case 'poll':
                            this.isPoll = true;
                            this.$store
                                .dispatch('poll/load_poll', response.fullResponse.data)
                                .then(() => {
                                    this.loading = false;
                                })
                                .catch((err) => {
                                    // eslint-disable-next-line no-console
                                    console.error('error cargando formulario', err);
                                });
                            break;

                        default:
                            this.isPoll = false;

                            if (response.is_step) {
                                this.is_step_row = response.is_step
                            }

                            this.form = response

                            this.loading = false;

                            break;
                    }

                    if (response.poll === 1) {
                        this.isPoll = true;
                        this.$store
                            .dispatch('poll/load_poll', response.fullResponse.data)
                            .then(() => {
                                this.loading = false;
                            })
                            .catch((err) => {
                                // eslint-disable-next-line no-console
                                console.error('error cargando formulario', err);
                            });
                    }
                })
                .catch((err) => {
                    this.loading = false;
                    this.isPoll = false;
                    // eslint-disable-next-line no-console
                    console.log('error', err);
                    // this.form = err.error;
                });
        } else {
            this.loading = false;
            const response = FormTestJson;
            if (response.poll === 1) {
                this.isPoll = true;
                this.$store
                    .dispatch('poll/load_poll', response.fullResponse.data)
                    .then(() => {
                        this.loading = false;
                    })
                    .catch((err) => {
                        // eslint-disable-next-line no-console
                        console.error('error cargando formulario', err);
                    });
            } else {
                this.isPoll = false;
                this.$store
                    .dispatch('form/load_form', response.fullResponse.data)
                    .then(() => {
                        this.loading = false;
                    })
                    .catch((err) => {
                        // eslint-disable-next-line no-console
                        console.error('error cargando formulario', err);
                    });
            }
        }
    },
    computed: {
        setTheme() {
            return `theme-${this.theme}`;
        },
        setStyles() {
            if(this.custom_styles) {
                return Object.fromEntries(Object.entries(JSON.parse(this.custom_styles)).map(([key, value]) =>
                    [`--${key}`, value]
                ));
            }

            return {};
        }
    }
};
</script>

<style>
pre {
    width: 100%;
    background-color: #f1f1f1;
}
code {
    font-family: Consolas, 'courier new';
    color: crimson;
    background-color: #f1f1f1;
    padding: 2px;
    font-size: 105%;
}
.loading-text {
    text-align: center;
    font-weight: bolder;
    font-size: 20px;
}

.index-container, .not-is-poll, .is-poll {
    height: 100%;
}

.not-is-poll > div{
    display: flex;
    flex-flow: column;
    height: 100%;
}
</style>
