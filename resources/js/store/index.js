import Vue from 'vue';
import Vuex from 'vuex';
import FormStore from './form';
import PollStore from './poll';

Vue.use(Vuex);

export default function store() {
  return new Vuex.Store({
        modules: {
            form: FormStore,
            poll: PollStore
        },
    });
}
