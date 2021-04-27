import Vue from 'vue'
import Vuex from 'vuex'
import FormStore from './formStore'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        form: FormStore
    }
})
