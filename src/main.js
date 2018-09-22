// The Vue build version to load with the import command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import router from './router'
import { mapActions } from 'vuex'
import App from './App'
import VeeValidate from 'vee-validate'
import VeeValidateRu from './const/VeeValidateRu'

Vue.use(VeeValidate, {
  inject: false,
  locale: 'ru',
  dictionary: {
    ru: {
      messages: VeeValidateRu.messages,
      attributes: VeeValidateRu.attributes
    }
  }
})

/* eslint-disable no-new */
window.vueApp = new Vue({
  el: document.querySelector('#vue-app'),
  store,
  router,
  data: {
  },
  components: { App },
  template: '<App />',
  created () {

  }
})