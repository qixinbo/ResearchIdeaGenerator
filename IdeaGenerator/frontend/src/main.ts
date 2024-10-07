declare module '*.vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './views/Home.vue'
import Chat from './views/Chat.vue'
import KnowledgeBase from './views/KnowledgeBase.vue'
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/chat', component: Chat },
    { path: '/knowledge-base', component: KnowledgeBase },
    { path: '/dashboard', component: Dashboard },
    { path: '/login', component: Login },
  ]
})

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')