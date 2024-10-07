import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../utils/supabaseClient'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const recentChats = ref([])

  const sendMessage = async (content: string) => {
    const userMessage = { id: Date.now(), content, isUser: true }
    messages.value.push(userMessage)

    // Simulate AI response (replace with actual API call)
    const aiResponse = { id: Date.now() + 1, content: 'This is a simulated AI response.', isUser: false }
    messages.value.push(aiResponse)

    // Save message to Supabase
    await supabase.from('messages').insert({ content, is_user: true })
  }

  const loadRecentChats = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error
    recentChats.value = data
  }

  return { messages, recentChats, sendMessage, loadRecentChats }
})