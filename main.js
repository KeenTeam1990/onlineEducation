import Vue from 'vue'
import App from './App'
import store from './store'
import config from '@/app.config.js'

// 引入 uView UI
import uView from 'uview-ui';
Vue.use(uView);

// 引入 vk框架前端
import vk from 'uni_modules/vk-unicloud/vk_modules/vk-unicloud-page';
Vue.use(vk);

// 初始化 vk框架
Vue.prototype.vk.init({
  Vue,               // Vue实例
  config,	           // 配置
});

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
});
app.$mount();
