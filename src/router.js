/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'
import AuthRequired from "./utils/AuthRequired.js";

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes: [

        {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
            path: '/',
            component: () => import('./layouts/main/Main.vue'),
            beforeEnter: AuthRequired,
            children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
              {

                path: '/',

                name: 'home',
                component: () => import('./views/Home.vue')
              },
              {
                path: '/users',
                name: 'users',
                component: () => import('./views/users/UserList.vue')
              },
              {
                path: '/userbets',
                name: 'userbets',
                component: () => import('./views/UserBets.vue')
              },
              {
                path: '/user-edit/:userId',
                name: 'user-edit',
                component: () => import('./views/users/UserEdit.vue')
              },

            ],
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/pages/Login.vue')
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/pages/error-404'
        }
    ],
})

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

export default router
