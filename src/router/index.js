import Vue from 'vue'
import Router from 'vue-router'
import Wallet from '@/components/Wallet'
import TTL from '@/components/TTL'
import Quotation from '@/components/Quotation'
import Error from '@/components/Error'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'wallet' }
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: Wallet
    },
    {
      path: '/ttl',
      name: 'ttl',
      component: TTL
    },
    {
      path: '/quotation',
      name: 'quotation',
      component: Quotation
    },
    {
      path: '/error',
      name: 'error',
      component: Error
    }
  ]
})
