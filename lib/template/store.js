import actionsFn from "./api"

let sessionStorage = JSON.parse(window.sessionStorage.getItem("vuex")) || {}
const state = sessionStorage.___this_name_will_replace_again___ || {}

const mutations = {}

const actions = {
  ...actionsFn
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
