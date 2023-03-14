import Vue from 'vue'
import Vuex from 'vuex'
import dealer from './modules/dealer'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: { dealer },
  strict: debug
})

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept([
    dealer,
    () => {
      const newModuleDealer = require('./modules/dealer').default
      // swap in the new actions and mutations
      store.hotUpdate({
        modules: {
          dealer: newModuleDealer
        }
      })
    }
  ])
}

export default store
