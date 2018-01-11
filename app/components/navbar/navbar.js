////////////////////////
// navbar.js
// find-tag: app_navbar_js
// author: Jim McNeely
// 12/20/2017
////////////////////////

const app_store_navbar = {
  state: {
    nav_choices: [
      {title: 'Test 1', name: 'TEST_1', route: 'test1'},
      {title: 'Test 2', name: 'TEST_2', route: 'test2'}
    ],
    nav_current: 'test1'
  },
  getters: {
    nav_buttons: state => {
      return state.nav_choices;
    },
    nav_current: state => {
      return state.nav_current;
    }

  },
  mutations: {
    SET_CURRENT_NAV: function (state, dest){
      state.nav_current = dest;
    }
  },
  actions: {}
};

const app_navbar = Vue.component('appNavbar', {
  template: '#app-navbar-template',
  computed: {
    nav_buttons() {
      return this.$store.getters.nav_buttons;
    },
    cur_nav(){
      return this.$store.getters.nav_current;
    },
    langlist(){
      return this.$store.getters.langcodes;
    }
  },
  methods: {
    navigate(dest){
      this.$store.commit('SET_CURRENT_NAV', dest);
      this.$router.push(dest);
    }
  }
});
