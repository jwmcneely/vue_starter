////////////////////////
// main.js
// find-tag: app_main_js
// author: Jim McNeely
// 12/19/2017
////////////////////////

const app_store_main = {
  state: {
    cookies_permanent: ['language'],
    home_route: 'test1'
  },
  getters: {
    cookies_perm: state => {
      return state.cookies_permanent;
    }
  },
  mutations: {
  },
  actions: {

  }
};

const app_store = new Vuex.Store({
  modules: {
    main: app_store_main,
    login: app_store_login,
    access_token: app_access_token,
    header: app_store_header,
    header_login: app_store_header_login,
    alerts: app_store_alerts,
    navbar: app_store_navbar,
    noroute: app_store_noroute,
		test: app_store_test,
		test2: app_store_test2,
    translate: app_store_translate
  }
});

// var VueCookie = require('vue-cookie');
// Vue.use(VueCookie);

const app_main = new Vue({
  el: '#app-main',
  data: {},
  router,
  store: app_store,
  computed: {},
  methods: {},
  components: {},
  created: function() {

  },
  mounted: function() {
    this.$store.dispatch('REFRESH_TOKEN'); // in the login.js file
  }
});
