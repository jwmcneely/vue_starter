////////////////////////
// login.js
// find-tag: app_login_js
// author: Jim McNeely
// 12/20/2017
////////////////////////

const app_store_login = {
  state: {
    login_error: '',
    jwt_token: {token: ''},
    user: {},
    homepage: 'test2'
  },
  getters: {
    login_error_msg: state => {
      return state.login_error;
    },
    auth_token: state => {
      return state.jwt_token;
    },
    default_homepage: state => {
      return state.homepage;
    }
  },
  mutations: {
    SET_LOGIN_ERROR: (state, {err_msg}) => {
      state.login_error = err_msg;
    },
    SET_JAVASCRIPT_WEB_TOKEN (state, resp_obj) {
      state.jwt_token = {
        token: resp_obj.access_token,
        refresh_token: resp_obj.refresh_token,
        expiration: moment().add(resp_obj.expires_in, 'seconds').toDate(),
        token_type: resp_obj.token_type
      };
      state.user = {
        user_id: resp_obj.user_id,
        name: resp_obj.profile.name,
        userinitial: resp_obj.profile.userinitial,
        email: resp_obj.email,
        phone1: resp_obj.profile.phone1,
        title: resp_obj.profile.title,
        location: resp_obj.profile.location,
        langcode: resp_obj.profile.langcode
      };
      $cookies.set('token', state.jwt_token.token);
      $cookies.set('refresh_token', state.jwt_token.refresh_token);
      $cookies.set('token_expiration', state.jwt_token.expiration);
    },
    LOGOUT (state) {
      //clear vuex login store
      state.jwt_token = {
        token: null,
        refresh_token: null,
        expiration: null,
        token_type: null
      };
      state.user = {};

      //clear cookies is in the header.js calling method
    },
    SET_LOGIN_DATA: function(state, jwt_obj){
      state.jwt_token.token = jwt_obj.token;
      state.jwt_token.refresh_token = jwt_obj.refresh_token;
      state.jwt_token.expiration = jwt_obj.expire;

      $cookies.set('token', state.jwt_token.token);
      $cookies.set('refresh_token', state.jwt_token.refresh_token);
      $cookies.set('token_expiration', state.jwt_token.expiration);
    }
  },
  actions: {
    AUTHENTICATE_UPW: function(context, params){
      var params = {
        grant_type: 'password',
        username: params.username,
        password: params.password,
        client_id: client_id,
        client_secret: client_secret
      };
      axios.post(api_base_url + 'oauth2/token', params).then(function(response){
        console.log('AUTHENTICATE_UPW response: ', response);
        context.commit('SET_JAVASCRIPT_WEB_TOKEN', response.data);
        context.commit('SET_LOGIN_ERROR', {err_msg: ''});
        context.dispatch('REFRESH_TOKEN');
        router.push(context.getters.default_homepage); //TODO make this more dynamic
      })
      .catch(function(error){
        console.error('AUTHENTICATE_UPW_ACCESS_TOKEN error: ', error);
        if(typeof error.response != 'undefined'){
          if(error.response.data.message == 'Invalid username and password combination'){
            var error_key = 'LOGIN_INVALID_USER';
          }
          else{
            var error_key = 'LOGIN_SERVER_ERROR';
          }
        }
        else{
          var error_key = 'LOGIN_SERVER_ERROR';
        }
        context.commit('SET_LOGIN_ERROR', {err_msg: error_key});
      })
    },
    GET_AUTH: function(context){
      //if needful for security, send token to backend for confirmation of legit auth each time this is called.
      // Decided not to do this now, but set up as a promise in case I decide to do so.
      new Promise(function(resolve, reject){
        if(state.jwt_token.token){
          resolve(state.jwt_token.token);
        }
        else{
          reject('unauthorized');
        }
      })
    },
    DETERMINE_AUTH: function(context){ //called from router.beforeEach
      if(context.getters.auth_token.token){
        return true;
      }

      var jwt_token = $cookies.get('token');
      var refresh_token = $cookies.get('refresh_token');
      var token_expiration = moment($cookies.get('token_expiration'));

      if(jwt_token){
        // console.log('has token');
        // console.log('token_expiration: ', token_expiration.toDate());
        if(token_expiration.isAfter(moment())){
          // console.log('token not expired');
          //set renew job

          //set login data from cookies into vuex store
          context.commit('SET_LOGIN_DATA', {
            token: jwt_token,
            refresh: refresh_token,
            expire: token_expiration
          });
          return true;
        }
        else{ //has expired token
          // console.log('token expired');
          //clear expired cookies
          $cookies.remove('token');
          $cookies.remove('refresh_token');
          $cookies.remove('token_expiration');
          return false;
        }
      }
      else{
        // console.log('no token');
        return false;
      }
    },
    REFRESH_TOKEN: function(context){ //this is going to set a time based on the token expiration to refresh the token
      // console.log('REFRESH_TOKEN auth_token: ', context.getters.auth_token.token);
      console.log('launched REFRESH_TOKEN action');
      if(! $cookies.get('token_expiration')){
        return;
      }
      console.log('will set REFRESH_TOKEN timeout', $cookies.get('token_expiration'));

      var refresh_milliseconds = moment($cookies.get('token_expiration')).diff(moment()); //production
      // var refresh_milliseconds = 15000; //testing

      setTimeout(function(){
        refresh_params = {
          grant_type: 'refresh_token',
          refresh_token: $cookies.get('refresh_token'),
          client_id: client_id,
          client_secret: client_secret
        };
        // console.log('here is a timeout for ' + context.getters.auth_token.token);
        axios.post(api_base_url + 'oauth2/token', refresh_params).then(function(response){
          // console.log('timeout ajax response: ', response);
          //set login data from cookies into vuex store
          var jwt_obj = {
            token: response.data.access_token,
            refresh: response.data.refresh_token,
            expire: moment().add(response.data.expires_in, 'seconds').toDate()
          };
          context.commit('SET_LOGIN_DATA', jwt_obj);
        })
        .catch(function(error){
          console.error('refresh_token error: ', error);
          context.commit('ADD_ALERT', {
            type: 'danger',
            msg: 'Server error - coudn\'t refresh authentication token'
          })
        })
      }, refresh_milliseconds);
    }
  }
};

const app_login = Vue.component('appLogin', {
  template: '#app-login-template',
  computed: {
    error_message() {
      return this.$store.getters.login_error_msg;
    }
  },
  methods: {
    login_upw(){
      params = {
        username: this.login.username,
        password: this.login.password
      }
      this.$store.dispatch('AUTHENTICATE_UPW', params);
    },
    login_oauth2(){
      var response_url = window.location.protocol + "//" + window.location.host;
      var url="https://accounts.google.com/o/oauth2/auth?scope=email&client_id="+google_client_id+"&redirect_uri="+response_url+
    	"&response_type=token";
    	window.location.replace(url);
    }
  },
  created: function(){
    this.login = {
      username: '',
      password: ''
    };
  },
  mounted: function(){
    this.$refs.username_field.focus(); //sets focus to username field on page load
  }
});
