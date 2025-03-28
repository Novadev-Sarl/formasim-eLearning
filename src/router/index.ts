import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/HomeView.vue') },
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    { path: '/forgot-password', component: () => import('@/views/ForgotPasswordView.vue') },
    { path: '/reset-password', component: () => import('@/views/ResetPasswordView.vue') },
    { path: '/profile', component: () => import('@/views/ProfileView.vue') },
    { path: '/formations', component: () => import('@/views/FormationListView.vue') },
    { path: '/formations/:id', component: () => import('@/views/FormationView.vue') },
    { path: '/formations/:id/course', component: () => import('@/views/CourseView.vue') },
  ],
  // Scroll to the top of the page when the route changes
  scrollBehavior: () => {
    return {
      top: 0,
      left: 0,
      behavior: 'smooth',
    }
  },
})

// Manually redirect to the login page if the user is not authenticated on protected pages

export const authenticatedPages = [
  '/profile',
  '/formations',
  '/formations/:id',
  '/formations/:id/course',
]

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (!auth.user && authenticatedPages.includes(to.path)) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
