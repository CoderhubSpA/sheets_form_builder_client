<template>
    <div>
        <button class="btn btn-block btn-primary btn-sm sheets-nested-form" @click="open">
            +
        </button>
        <div class="nested-form" v-show="show">
            <div class="content">
                <div class="header">
                    Header
                    <button @click="close">
                    &times;
                    </button>
                </div>
                <div class="body">
                    <div ref="nested" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import formbuilder from './form.vue';

export default {
    components: {
        formbuilder,
    },
    props: {
        entity_type_permission_fk: {
            type: String,
            require: true,
        },
        state: {
            type: String,
            require: true,
        },
    },
    data: () => ({
        show: false,
        vueInstance: null,
    }),
    methods: {
        open() {
            this.build();
            this.show = true;
        },
        close() {
            this.show = false;
            this.$refs.nested.innerHTML = '';
        },
        build() {
            const store = this.$store;
            const FormBuilderClass = Vue.extend(formbuilder);
            const instance = new FormBuilderClass({
                propsData: {
                    entityId: this.entity_type_permission_fk,
                    store: this.entity_type_permission_fk,
                },
                store,
            });
            instance.$on('input', () => {
                const data = this.$store.getters[`${this.state}/raw`];
                if (data.entity_type_id) {
                    this.$store.dispatch(`${this.state}/info`, data.entity_type_id);
                }
                this.close();
            });
            instance.$mount();

            this.$refs.nested.appendChild(instance.$el);
        },
    },
};
</script>
