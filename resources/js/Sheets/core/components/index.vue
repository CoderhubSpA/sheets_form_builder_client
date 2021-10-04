<template>
    <div>
        <loading-message :status="loading"></loading-message>
        <div v-if="isPoll === false">
            <sheets-form :entityId="id" :record_id="recordid" :params="params"></sheets-form>
        </div>
        <div v-if="isPoll === true">
            <sheets-poll-render :id="id" />
        </div>
    </div>
</template>

<script>
import SheetsForm from '../new_components/form.vue';
import SheetsPollRender from './poll/render.vue';
import LoadingMessage from './loading-message.vue';

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
        recordid: {
            type: String,
            default: '',
        },
        params: {
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
        this.$store
            .dispatch('form/get_form', {
                id: this.id,
                recordid: this.recordid,
                params: this.params,
            })
            .then((response) => {
                this.loading = false;
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
            })
            .catch((err) => {
                this.loading = false;
                this.isPoll = false;
                // eslint-disable-next-line no-console
                console.log('error', err);
            });
    },
    computed: {},
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
</style>
