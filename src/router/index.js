import Vue from 'vue'
import Router from 'vue-router'
import welcome from '../components/welcome'
import Login from '../components/Login'
import register from '../components/register'
import Menu from '../components/Menu'
import Board from '../components/Board'
import Friend from '../components/Friend'
import Search from '../components/Search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: welcome,
      children: [
        {
          path: '/login',
          component: Login
        },
        {
          path: '/register',
          component: register
        }
      ]
    },
    {
      path: '/menu',
      name: 'Menu',
      component: Menu,
      children: [
        {
          path: 'play',
          name: 'play',
          component: Board
        },
        {
          path: 'friend',
          component: Friend
        },
        {
          path: 'search',
          name: 'search',
          component: Search
        }
      ]
    }
  ]
})
