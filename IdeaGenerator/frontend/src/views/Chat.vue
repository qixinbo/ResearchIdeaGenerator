<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '../stores/chat'

const chatStore = useChatStore()
const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatStore.sendMessage(newMessage.value)
    newMessage.value = ''
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Chat</h2>
    <div class="bg-white shadow-md rounded-lg p-4 mb-4 h-96 overflow-y-auto">
      <div v-for="message in chatStore.messages" :key="message.id" class="mb-4">
        <div :class="['p-2 rounded-lg', message.isUser ? 'bg-blue-100 text-right' : 'bg-gray-100']">
          <p class="font-semibold">{{ message.isUser ? 'You' : 'AI' }}</p>
          <p>{{ message.content }}</p>
        </div>
      </div>
    </div>
    <div class="flex">
      <input v-model="newMessage" @keyup.enter="sendMessage" type="text" placeholder="Type your message..." class="input flex-grow mr-2">
      <button @click="sendMessage" class="btn btn-primary">Send</button>
    </div>
  </div>
</template>