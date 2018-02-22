import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import router from './router'

fastclick.attach(document.body)

Vue.config.productionTip = false

import './common/stylus/index.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
