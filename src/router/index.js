import Vue from 'vue'
import Router from 'vue-router'
import Wallet from '@/components/Wallet'
import Error from '@/components/Error'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Wallet',
      component: Wallet
    },
    {
      path: '/error',
      name: 'Error',
      component: Error
    }
  ]
})
