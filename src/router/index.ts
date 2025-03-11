import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/HomeView.vue') },
    { path: '/login', component: () => import('@/views/LoginView.vue') },
    { path: '/forgot-password', component: () => import('@/views/ForgotPasswordView.vue') },
    { path: '/reset-password', component: () => import('@/views/ResetPasswordView.vue') },
    { path: '/dashboard', component: () => import('@/views/DashboardView.vue') },
    { path: '/profile', component: () => import('@/views/ProfileView.vue') },
    { path: '/formations', component: () => import('@/views/FormationListView.vue') },
    { path: '/formations/:id', component: () => import('@/views/FormationView.vue') },
    { path: '/formations/:id/course', component: () => import('@/views/CourseView.vue') },
  ],
})

export default router
