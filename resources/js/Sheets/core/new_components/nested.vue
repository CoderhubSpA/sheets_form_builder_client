<template>
    <div>
        <button class="btn btn-block btn-primary btn-sm sheets-nested-form" @click="open">+</button>
        <div class="nested-form" v-show="show">
            <div class="content">
                <div class="header p-2">
                    <div class="header-title">
                        <i class="fa fa-list-alt text-black-25 ml-2"></i>
                    </div>
                    <div @click="close">
                        <i class="fa fa-times float-right text-black-50 close"></i>
                    </div>
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
    props: {
        entity_type_permission_fk: {
            type: String,
            require: true,
        },
        state: {
            type: String,
            require: true,
        },
        openForm: {
            type: Boolean,
            require: false,
            default: false
        },
        recordId: {
            type: String,
            require: false,
            default: ''
        },
        parent_input_id: {
            type: String,
            require: true,
            default: ''
        },
    },
    data: () => ({
        show: false,
        form_name: '',
    }),
    watch: {
      openForm(val) {
        if (val) {
            this.open();
        }
      }
    },
    methods: {
        open() {
            this.build();
            this.show = true;
            this.$emit("opened-nested", this.show);
        },
        close() {
            this.show = false;
            this.$refs.nested.innerHTML = '';
            this.$emit("closed-nested", this.show);
        },
        build() {
            const store = this.$store;
            const FormBuilderClass = Vue.extend(formbuilder);
            // Get the parent form data from the store
            const parent_form_data = this.$store.getters[`${this.state}/form_data`];

            if (parent_form_data){
                parent_form_data.parent_input_id = this.parent_input_id;
            }

            const instance = new FormBuilderClass({
                propsData: {
                    entityId: this.entity_type_permission_fk,
                    record_id: this.recordId,
                    store: this.entity_type_permission_fk,
                    is_nested: true,
                    // Set the parent form data
                    parent_form_data: parent_form_data ? parent_form_data : {},
                },
                store,
            });
            instance.$on('input', (val) => {
                const id = val.content.inserted_id;

                const data = this.$store.getters[`${this.state}/raw`];
                if (data.entity_type_id) {
                    this.$store.dispatch(`${this.state}/info`, data.entity_type_id).then(() => {
                        this.$emit('inserted', id);
                    });
                }
                this.close();
            });

            instance.$on('name', (val) => {
                this.form_name = this.capitalize(val);
            });
            instance.$mount();

            this.$refs.nested.appendChild(instance.$el);
        },
        capitalize(str) {
            let result = '';

            if (str) {
                const lower = str.toLowerCase();
                result = str.charAt(0).toUpperCase() + lower.slice(1);
            }

            return result;
        },
    },
};
</script>
<style lang="scss">
.nested-form {
    position: fixed;
    z-index: 170;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.151); /* Black w/ opacity */
    border: 1px solid rgb(240, 239, 239);
    border-radius: 4px;

    .content {
        background-color: #fefefe;
        width: 80%; /* Could be more or less, depending on screen size */
        margin: 15% auto; /* 15% from the top and centered */
        padding: 0px !important;
        border-radius: 5px;

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 1rem;
            background-color: #fefefe;
            border-bottom: solid 1px #dee2e6;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;

            .header-title {
                color: #dee2e6;
            }

            .close {
                font-size: 1.35rem;
                font-weight: 700;
                line-height: 1;
                opacity: .5;
                text-shadow: 0 1px 0 #fff;
            }
        }
        .body {
            padding: 0px 15px 15px 15px;
        }
    }
}
</style>
