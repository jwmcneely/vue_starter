////////////////////////
// header.js
// find-tag: app_header_js
// author: Jim McNeely
// 12/20/2017
////////////////////////

const app_store_header = {
  state: {},
  getters: {},
  mutations: {},
  actions: {}
};

const app_header = Vue.component('appHeader', {
  template: '#app-header-template',
  computed: {

  },
  methods: {
    logout(){
      //remove the non-permanent cookies
      cookies_remove = _.difference(this.$cookies.keys(),this.$store.getters.cookies_perm);
      for(i in cookies_remove){
        this.$cookies.remove(cookies_remove[i]);
      }
      //clear vuex login stores
      this.$store.commit('LOGOUT');
      //navigate to login page
      this.$router.push('/login');
    }
  }
});
