import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://mpunmkgymmjyqipgvbws.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wdW5ta2d5bW1qeXFpcGd2YndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNTY5NjcsImV4cCI6MjA0MzgzMjk2N30.DCNT4HALpn-kjlBYbD_CnDkVwSQG2HyffqLtYu6EAuI')

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