<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'
import { useKnowledgeBaseStore } from '../stores/knowledgeBase'

const authStore = useAuthStore()
const chatStore = useChatStore()
const knowledgeBaseStore = useKnowledgeBaseStore()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 py-8 px-4 relative overflow-hidden">
    <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
    <div class="max-w-6xl mx-auto relative z-10">
      <h2 class="text-3xl font-bold mb-6 text-white">Dashboard</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-xl rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-4 text-white">Recent Chats</h3>
          <ul class="space-y-2 text-gray-200">
            <li v-for="chat in chatStore.recentChats" :key="chat.id">
              {{ chat.title }} - {{ chat.date }}
            </li>
          </ul>
        </div>
        <div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-xl rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-4 text-white">Knowledge Base Interactions</h3>
          <ul class="space-y-2 text-gray-200">
            <li v-for="interaction in knowledgeBaseStore.recentInteractions" :key="interaction.id">
              {{ interaction.title }} - {{ interaction.date }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>