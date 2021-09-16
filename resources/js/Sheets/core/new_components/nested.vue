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
                    <!-- <component :is="formbuilder"
                        :store="entity_type_permission_fk"
                        :entityId="entity_type_permission_fk"/> -->
                    <div ref="nested" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import Vue from 'vue';
import formbuilder from './form.vue';
// import FormBuilderStore from '../../../store/formBuilder';

export default {
    components: {
        formbuilder,
    },
    props: {
        entity_type_permission_fk: {
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
            const store = this.$store
            const FormBuilderClass = Vue.extend(formbuilder);
            const instance = new FormBuilderClass({
                propsData: {
                    entityId: this.entity_type_permission_fk,
                    store: this.entity_type_permission_fk,
                },
                store
            });
            instance.$mount();

            this.$refs.nested.appendChild(instance.$el);
        },
    },
};
</script>
