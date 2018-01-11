////////////////////////
// access_token.js
// find-tag: app_access_token_js
// author: Jim McNeely
// 12/27/2017
////////////////////////

const app_store_access_token = {
  state: {
    // test_message: 'Test'
    google_access_token: '',
    jwt: {
      token: '',
      refresh_token: '',
      expiration: null,
      token_type: ''
    },
    user: {
      user_id: '',
      name: '',
      userinitial: '',
      email: '',
      phone1: '',
      title: '',
      location: null,
      langcode: null
    },
  },
  getters: {
    google_token: state => {
      return state.google_access_token;
    },
    jwt: state => {
      return state.jwt;
    },
    user: state => {
      return state.user;
    }
  },
  mutations: {
    UPDATE_GOOGLE_ACCESS_TOKEN (state, gt) {
      state.google_token = gt;
    }
  },
  actions: {
    AUTHENTICATE_GOOGLE_ACCESS_TOKEN: function(context, token) {
      var params = {
        grant_type: 'google',
        bearer_token: token,
        client_id: client_id,
        client_secret: client_secret
      };
      axios.post(api_base_url + 'oauth2/token', params).then(function(response){
        console.log('auth response', response);
        context.commit('UPDATE_GOOGLE_ACCESS_TOKEN', token);
        context.commit('SET_JAVASCRIPT_WEB_TOKEN', response.data); //in login.js store
        context.dispatch('REFRESH_TOKEN');

        router.push('test1');
      })
      .catch(function(error){
        console.log('AUTHENTICATE_GOOGLE_ACCESS_TOKEN error: ', error.message);
        if(error.message == 'Invalid User'){
          var error_key = 'LOGIN_INVALID_USER';
        }
        else{
          var error_key = 'LOGIN_SERVER_ERROR'
        }
        context.commit('SET_LOGIN_ERROR', {err_msg: error_key});
        router.push('login');
      })
    }
  }
};

const app_access_token = Vue.component('appAccessToken',{
  props: {
    // showy: {default: true}
  },
  template: '#app-access-token-template',
  computed: {
    // test_howdy() {
    //   return this.$store.getters.test_howdy;
    // }
  },
  methods: {
  },
  beforeMount: function(){
    this.$store.registerModule('UPDATE_GOOGLE_ACCESS_TOKEN', app_store_access_token);
  },
  mounted: function() {
    console.log('app_access_token mounted!');
    //consult api to check for system authorization
    //save token to Vuex
    var route_params = this.$route.params.accessToken.split('&');
    var token = route_params[0];
    // this.$store.commit('UPDATE_GOOGLE_ACCESS_TOKEN', token);

    //redirect to default first screen
    this.$store.dispatch('AUTHENTICATE_GOOGLE_ACCESS_TOKEN', token);
  }
});
