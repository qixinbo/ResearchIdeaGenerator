import { defineStore } from 'pinia'
import { ref } from 'vue'

// Add this type definition at the top of the file
type User = { email: string } | null

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User>(null)
  const isAuthenticated = ref(false)

  const login = async (email: string) => {
    // 模拟登录逻辑
    user.value = { email } // 简化的用户对象
    isAuthenticated.value = true
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
  }

  const checkAuth = () => {
    // 模拟检查认证状态
    // 这里可以根据需要实现，例如检查本地存储
    return isAuthenticated.value
  }

  return { user, isAuthenticated, login, logout, checkAuth }
})