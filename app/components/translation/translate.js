////////////////////////
// translate.js
// find-tag: app_translate_js
// author: Jim McNeely III
// 12/20/2017
////////////////////////

const app_store_translate = {
  state: {
    translations: {},
    language_codes: ['en', 'es', 'fr', 'ja'],
    language_code: 'en'
  },
  getters: {
    translation_table: state => {
      return state.translations;
    },
    langcodes: state => {
      return state.language_codes;
    },
    langcode: state => {
      return state.language_code;
    }
  },
  mutations: {
    SET_TRANSLATION_TABLE: (state, {list, langcode}) => {
      state.translations = list;
      state.language_code = langcode;
    }
  },
  actions: {
    LOAD_TRANSLATION_TABLE: function(context, langcode) {
      axios.get('language/' + langcode + '.json').then(function(response){
        context.commit('SET_TRANSLATION_TABLE', {list: response.data, langcode: langcode});
        this.$cookies.set('language', langcode);
      })
      .catch(function(error){
        console.error('LOAD_TRANSLATION_TABLE error: ', error);
        context.commit('ADD_ALERT', {type: 'danger', msg: 'Cannot retrieve langauge table.'})
      })
    }
  }
};

Vue.filter('translate', function(key){
  let table = app_store.getters.translation_table;
  if(table[key]){
    return table[key];
  }
  else{
    return key;
  }
});

const app_translate = Vue.component('appTranslate', {
  template: '#app-translate-template',
  computed: {
    langcode: {
      get() {
        return this.$store.getters.langcode;
      },
      set(langcode) {
        this.refresh_language(langcode);
      }
    },
    langlist() {
      return this.$store.getters.langcodes;
    }
  },
  methods: {
    refresh_language: function(langcode){
      this.$store.dispatch('LOAD_TRANSLATION_TABLE', langcode);
    }
  },
  mounted: function() {
    var lang = this.$cookies.get('language');
    this.$store.dispatch('LOAD_TRANSLATION_TABLE', lang ? lang : 'en');
  }
});
