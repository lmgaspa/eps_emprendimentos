import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import DashboardPage from '../components/DashboardPage.vue'
import RegistrarTicket from '../components/RegistrarTickerForm.vue'
import SearchTickets from '../components/SearchTickets.vue'
import ForgotPassword from '../components/ForgotPassword.vue'
import ResetPassword from '../components/ResetPassword.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/esqueci-senha', component: ResetPassword },
  {
    path: '/dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  { path: '/registrar-ticket',
    component: RegistrarTicket,
    meta: { requiresAuth: true }
  },
  { path: '/search-ticket',
    component: SearchTickets,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login') // 🔒 redireciona para login se não tiver token
  } else {
    next()
  }
})

export default router
