import { createRouter, createWebHistory } from 'vue-router'
import { api } from '../api/client'
import type { MeResponse } from '../api/types'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/auth/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/review',
      name: 'review',
      component: () => import('../components/review/ReviewPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../components/stats/StatsPage.vue'),
      meta: { auth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/review',
    },
  ],
})

let authChecked = false
let cachedMe: MeResponse | null = null

export function getCachedMe(): MeResponse | null {
  return cachedMe
}

export function setCachedMe(me: MeResponse | null) {
  cachedMe = me
}

router.beforeEach(async (to, _from, next) => {
  // Check auth on first navigation
  if (!authChecked) {
    try {
      cachedMe = await api<MeResponse>('/auth/me', { method: 'GET' })
      authChecked = true
    } catch {
      cachedMe = null
      authChecked = true
    }
  }

  const isAuthed = cachedMe !== null

  if (to.meta.auth && !isAuthed) {
    next('/login')
  } else if (to.meta.guest && isAuthed) {
    next('/review')
  } else {
    next()
  }
})

export default router
