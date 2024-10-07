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
  <nav class="bg-gray-800">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="text-white font-bold text-xl">OpenAI-inspired</a>
        </div>
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <router-link to="/" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</router-link>
            <router-link to="/chat" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Chat</router-link>
            <router-link to="/knowledge-base" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Knowledge Base</router-link>
            <router-link v-if="authStore.isAuthenticated" to="/dashboard" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</router-link>
            <button v-if="authStore.isAuthenticated" @click="logout" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
            <router-link v-else to="/login" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</router-link>
          </div>
        </div>
        <div class="md:hidden">
          <button @click="toggleMenu" class="text-gray-300 hover:text-white focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-if="isMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link to="/" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</router-link>
        <router-link to="/chat" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Chat</router-link>
        <router-link to="/knowledge-base" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Knowledge Base</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/dashboard" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</router-link>
        <button v-if="authStore.isAuthenticated" @click="logout" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Logout</button>
        <router-link v-else to="/login" class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</router-link>
      </div>
    </div>
  </nav>
</template>