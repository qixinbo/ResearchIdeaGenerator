import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../utils/supabaseClient'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
    isAuthenticated.value = true
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    isAuthenticated.value = false
  }

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      user.value = data.session.user
      isAuthenticated.value = true
    }
  }

  return { user, isAuthenticated, login, logout, checkAuth }
})