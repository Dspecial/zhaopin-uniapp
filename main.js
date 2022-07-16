
// #ifndef VUE3
// 这边是不基于vue3.0的
import Vue from 'vue'
import App from './App'
import api from '@/api/api.js'; // 引入公共api
import globalUrl from '@/common/globalUrl.js'
import util from '@/common/util.js'

Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$globalUrl = globalUrl;
Vue.prototype.$util = util;


// Vue.config.ignoredElements.push('wx-open-subscribe');

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
// 这边是基于vue3.0的
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif