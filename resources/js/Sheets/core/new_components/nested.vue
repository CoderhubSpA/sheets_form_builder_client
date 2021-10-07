<template>
  <div>
    <button class="btn btn-block btn-primary btn-sm sheets-nested-form" @click="open">+</button>
    <div class="nested-form" v-show="show">
      <div class="content">
        <div class="header">
          <div class="header-title">
            {{ form_name }}
          </div>
          <button @click="close">&times;</button>
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
  },
  data: () => ({
    show: false,
    form_name: '',
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
          is_nested: true,
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
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    width: 80%; /* Could be more or less, depending on screen size */

    .header {
      background-color: #fefefe;
      margin-bottom: 1rem;

      button {
        float: right;
      }
    }
  }
}
</style>
