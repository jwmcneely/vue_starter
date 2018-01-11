////////////////////////
// test.js
// find-tag: app_test_js
// author: Jim McNeely
// 12/19/2017
////////////////////////

const app_store_test = {
  state: {
    test_message: 'Test',
    sites: []
  },
  getters: {
    test_howdy: state => {
      return 'Howdy, ' + state.test_message + ' World!';
    },
    test_hello: state => {
      return 'Hello, ' + state.test_message + ' World!';
    },
    sites_test_getter: state => {
      return sites;
    }
  },
  mutations: {
    SET_SITES: (state, sites_array) => {
      state.sites = sites_array;
    }
  },
  actions: {
    GET_SITES: function() {
      query = `
      {
        allSites {
          id
          site_name
        }
      }`;

      axios.post(api_graphql_test, query)
      .then(response => {
        console.log('GET_SITES response: ', response);
        commit('SET_SITES', response.data);
      })
    }
  }
};

const app_test = Vue.component('appTest',{
  props: {
    showy: {default: true}
  },
  template: '#app-test-template',
  props:{
    showy: {default: true}
  },
  computed: {
    test_howdy() {
      return this.$store.getters.test_howdy;
    },
    test_hello() {
      return this.$store.getters.test_hello;
    }
  },
  methods: {
    add_alert (message, kind){
      alert_obj = {
        type: 'success',
        msg: 'testy mcgee'
      }
      this.$store.commit('ADD_ALERT', alert_obj);
    }
  },
  mounted: function(){
    console.log('test1 mounted!');
    this.$store.dispatch('GET_SITES');
  }
});
