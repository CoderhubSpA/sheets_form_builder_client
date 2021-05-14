import Vue from 'vue'
import Vuex from 'vuex'
import FormStore from './formStore'
import PollStore from './poll'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        form: FormStore,
        poll: PollStore
    }
})
