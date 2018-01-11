////////////////////////
// router.js
// find-tag: app_router_js
// author: Jim McNeely
// 12/19/2017
////////////////////////

const router = new VueRouter({
  routes: [
    {path: '/',
      components:
        {
          body: app_login,
          navbar: '',
          header: app_header_login
        }
    },
    {path: '/login',
      components:
        {
          body: app_login,
          navbar: '',
          header: app_header_login
        }
    },
    {
      path: '/access_token=:accessToken',
      components: {
        body: app_access_token,
        header: app_header_login
      }
    },
    {path: '/test1',
      components:
        {
          body: app_test,
          navbar: app_navbar,
          header: app_header
        }
    },
    {path: '/test2',
      components:
        {
          body: app_test2,
          navbar: app_navbar,
          header: app_header
        }
    },
    {path: '*',
      components:
      {
        body: app_noroute,
        navbar: app_navbar,
        header: app_header
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  //check the auth here before navigation
  //see https://router.vuejs.org/en/advanced/navigation-guards.html

  var pathy = _.replace(to.path, '/', '');
  let auth = Boolean(app_store.getters.auth_token.token);

  if(! auth){
    app_store.dispatch('DETERMINE_AUTH').then(function(auth){
      if(to.path == '/login' || to.path == '/' || _.includes(to.path, 'access_token') || auth){
        app_store.commit('SET_CURRENT_NAV', pathy);
        next();
      }
      else{
        app_store.commit('SET_CURRENT_NAV', 'login');
        next('/login');
      }
    })
    .catch(function(error){
      app_store.commit('SET_CURRENT_NAV', 'login');
      next('/login');
    });
  }
  else{
    app_store.commit('SET_CURRENT_NAV', pathy);
    next();
  }
});
