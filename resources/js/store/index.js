import Vue from 'vue';
import Vuex from 'vuex';
import PollStore from './poll';
import FormBuilder from './formBuilder';

Vue.use(Vuex);

export default function store() {
  return new Vuex.Store({
        modules: {
            poll: PollStore,
            formBuilder: FormBuilder,
        },
    });
}
