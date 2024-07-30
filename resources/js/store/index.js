import Vue from 'vue';
import Vuex from 'vuex';
import Form from './form';
import PollStore from './poll';
import FormBuilder from './formBuilder';

Vue.use(Vuex);

export default function store() {
  return new Vuex.Store({
        modules: {
            form: Form,
            poll: PollStore,
            formBuilder: FormBuilder,
        },
    });
}
