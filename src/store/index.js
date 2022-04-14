import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    wsState: false
  },
  mutations: {
    updateWsState(state, payload) {
      state.wsState = payload;
    }
  },
  actions: {},
  modules: {}
});
