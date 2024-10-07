<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 backdrop-filter backdrop-blur-lg bg-opacity-30">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="text-white font-bold text-xl">科研加速器</a>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/chat" class="nav-link">Chat</router-link>
            <router-link to="/knowledge-base" class="nav-link">Knowledge Base</router-link>
            <router-link to="/pdf-viewer" class="nav-link">PDF Viewer</router-link>
            <router-link v-if="authStore.isAuthenticated" to="/dashboard" class="nav-link">Dashboard</router-link>
            <button v-if="authStore.isAuthenticated" @click="logout" class="nav-link">Logout</button>
            <router-link v-else to="/login" class="nav-link">Login</router-link>
          </div>
        </div>
        <div class="md:hidden">
          <button @click="toggleMenu" class="text-white hover:text-gray-200 focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-if="isMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-900 bg-opacity-90">
        <router-link to="/" class="nav-link-mobile">Home</router-link>
        <router-link to="/chat" class="nav-link-mobile">Chat</router-link>
        <router-link to="/knowledge-base" class="nav-link-mobile">Knowledge Base</router-link>
        <router-link to="/pdf-viewer" class="nav-link-mobile">PDF Viewer</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/dashboard" class="nav-link-mobile">Dashboard</router-link>
        <button v-if="authStore.isAuthenticated" @click="logout" class="nav-link-mobile">Logout</button>
        <router-link v-else to="/login" class="nav-link-mobile">Login</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  @apply text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out relative overflow-hidden;
}

.nav-link::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-300 ease-in-out;
  z-index: -1;
}

.nav-link:hover::before {
  @apply opacity-100;
}

.nav-link-mobile {
  @apply text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out relative overflow-hidden;
}

.nav-link-mobile::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-300 ease-in-out;
  z-index: -1;
}

.nav-link-mobile:hover::before {
  @apply opacity-100;
}
</style>