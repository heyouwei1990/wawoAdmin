// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import tool from './util/tool'
// import VueResource from 'vue-resource'
// import axios from 'axios';

// Vue.use(VueResource)

Vue.use(ElementUI)
Vue.config.productionTip = false;
Vue.prototype.$http = tool.$http;
Vue.prototype.formatJson = tool.formatJson;
/* eslint-disable no-new */


router.beforeEach((to, from, next) => {
  let Jwt = window.sessionStorage.getItem("Jwt");
  if (to.path === '/login') {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("Jwt");
    sessionStorage.removeItem("rules");
    sessionStorage.removeItem("menuList");
  }
  if (!Jwt && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
});
// Vue.http.headers.common['Jwt'] = sessionStorage.getItem('Jwt');



new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>'
})

