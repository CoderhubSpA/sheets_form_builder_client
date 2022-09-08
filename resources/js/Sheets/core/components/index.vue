<template>
    <div class="index-container" :class="setTheme" :style="setStyles">
        <loading-message :status="loading"></loading-message>
        <div v-if="isPoll === false" class="not-is-poll">
            <sheets-form
                :entityId="id"
                :record_id="record_id"
                :params="params"
                :base_url="base_url"
                :is_test="form_test"
                :params_actions="actions"
            ></sheets-form>
        </div>
        <div v-if="isPoll === true" class="is-poll">
            <sheets-poll-render :id="id" />
        </div>
    </div>
</template>

<script>
/* eslint-disable no-console */
import SheetsForm from '../new_components/form.vue';
import SheetsPollRender from './poll/render.vue';
import LoadingMessage from './loading-message.vue';
import FormTestJson from '../../resources/formtestjson.json';

export default {
    components: {
        // SheetsFormRender,
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
            type: String,
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
    },

    data: () => ({
        loading: false,
        isPoll: undefined,
    }),
    mounted() {
        this.loading = true;
        if (this.form_test === 'false') {
            this.$store
                .dispatch('form/get_form', {
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
                            this.$store
                                .dispatch('form/load_form', response.fullResponse.data)
                                .then(() => {
                                    this.loading = false;
                                })
                                .catch((err) => {
                                    // eslint-disable-next-line no-console
                                    console.error('error cargando formulario', err);
                                });
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
