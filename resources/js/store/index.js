import Vue from 'vue';
import Vuex from 'vuex';
import FormStore from './form';
import PollStore from './poll';
// import FormBuilder from './formBuilder';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        form: FormStore,
        poll: PollStore,
        // formBuilder: FormBuilder,
    },
});
