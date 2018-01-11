////////////////////////
// test2.js
// find-tag: app_test2_js
// author: Jim McNeely
// 12/19/2017
////////////////////////

const app_store_test2 = {
  state: {
    test2_message: 'test2'
  },
  getters: {
    test2_howdy: state => {
      return 'Howdy, ' + state.test2_message + ' World!';
    },
    test2_hello: state => {
      return 'Hello, ' + state.test2_message + ' World!';
    }
  },
  mutations: {},
  actions: {}
};

const app_test2 = Vue.component('appTest2',{
  template: '#app-test2-template',
  computed: {
    test2_howdy() {
      return this.$store.getters.test2_howdy;
    },
    test2_hello() {
      return this.$store.getters.test2_hello;
    },
  },
  methods: {
    add_alert (message, kind){
      alert_obj = {
        type: 'danger',
        msg: 'testy mcgee'
      }
      this.$store.commit('ADD_ALERT', alert_obj);
    }
  }
});
