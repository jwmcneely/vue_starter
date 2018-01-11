////////////////////////
// alerts.js
// find-tag: app_alerts_js
// author: Jim McNeely
// 1/1/2018
////////
// from any component, commit the ADD_ALERT mutation to display an alert
// {msg: 'message here', type: 'a bootstrap alert class, such as danger, warning, success, or primary'}
////////////////////////

const app_store_alerts = {
  state: {
    alerts: [],
    alert_types: [
      {type: 'danger', duration: 86400},
      {type: 'warning', duration: 4},
      {type: 'success', duration: 4},
      {type: 'primary', duration: 4},
      {type: 'default', duration: 4},
    ]
  },
  getters: {
    alerts_array: state => {
      return state.alerts;
    }
  },
  mutations: {
    ADD_ALERT: (state, alert_obj) => {
      alert_obj.id = _.uuid();
      state.alerts.push(alert_obj);
      console.log('alert_obj', alert_obj);
      var at = _.filter(state.alert_types, {type: alert_obj.type});
      seconds = at[0].duration;
      console.log('seconds: ', seconds);
      setTimeout(function(){
        for(n in state.alerts){
          if(state.alerts[n].id == alert_obj.id){
            state.alerts.splice(n,1);
            break;
          }
        }
      }, seconds * 1000);
    },
    REMOVE_ALERT: (state, alert_id) => {
      for(n in state.alerts){
        if(state.alerts[n].id == alert_id){
          state.alerts.splice(n,1);
          break;
        }
      }
    },
    REMOVE_ALL_ALERTS: (state) => {
      state.alerts = [];
    }
  },
  actions: {}
};

const app_alerts = Vue.component('appAlerts', {
  template: '#app-alerts-template',
  computed: {
    alerts_list() {
      return this.$store.getters.alerts_array;
    },
  },
  methods: {
    remove_alert(alert_id){
      this.$store.commit('REMOVE_ALERT', alert_id);
    },
    add_alert (msg, type){
      alert_obj = {
        type: 'success',
        msg: 'test success'
      }
      this.$store.commit('ADD_ALERT', alert_obj);
    }
  },
  created: function(){

  },
  mounted: function(){

  }
});
