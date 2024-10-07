<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const login = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = 'Invalid email or password'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label for="email" class="block mb-1">Email</label>
        <input v-model="email" type="email" id="email" required class="input w-full">
      </div>
      <div>
        <label for="password" class="block mb-1">Password</label>
        <input v-model="password" type="password" id="password" required class="input w-full">
      </div>
      <div v-if="errorMessage" class="text-red-600">{{ errorMessage }}</div>
      <button type="submit" class="btn btn-primary w-full">Login</button>
    </form>
  </div>
</template>