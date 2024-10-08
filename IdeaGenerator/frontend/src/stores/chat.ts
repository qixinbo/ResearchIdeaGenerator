import { defineStore } from 'pinia'
import { ref } from 'vue'
import supabase from '../utils/supabaseClient'

// 在文件顶部添加这个接口定义
interface Message {
  id: number;
  content: string;
  isUser: boolean;
}

interface Chat {
  // Define the properties of your chat object here
  id: string;
  message: string;
  // ... other properties
}

export const useChatStore = defineStore('chat', () => {
  // 确保 messages 的类型正确定义
  const messages = ref<Message[]>([])

  const recentChats = ref<Chat[]>([])

  const sendMessage = async (content: string) => {
    // 现在这段代码应该不会报错
    const userMessage: Message = { id: Date.now(), content, isUser: true }
    messages.value.push(userMessage)

    // Simulate AI response (replace with actual API call)
    const aiResponse = { id: Date.now() + 1, content: 'This is a simulated AI response.', isUser: false }
    messages.value.push(aiResponse)

    // Save message to Supabase
    await supabase.from('messages').insert({ content, is_user: true })
  }

  const loadRecentChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      console.log('Fetched chats:', data)
      // 处理数据...
    } catch (error) {
      console.error('Error fetching chats:', error)
      // 处理错误...
    }
  }

  return { messages, recentChats, sendMessage, loadRecentChats }
})