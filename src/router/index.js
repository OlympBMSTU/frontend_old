import Vue from 'vue'
import Router from 'vue-router'

import UploadManager from '../components/UploadManager'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/tasks/upload',
      component: UploadManager
    }
  ]
})