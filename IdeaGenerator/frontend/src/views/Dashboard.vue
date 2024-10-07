<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useChatStore } from '../stores/chat'
import { useKnowledgeBaseStore } from '../stores/knowledgeBase'

const authStore = useAuthStore()
const chatStore = useChatStore()
const knowledgeBaseStore = useKnowledgeBaseStore()
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white shadow-md rounded-lg p-4">
        <h3 class="text-xl font-semibold mb-2">Recent Chats</h3>
        <ul class="space-y-2">
          <li v-for="chat in chatStore.recentChats" :key="chat.id">
            {{ chat.title }} - {{ chat.date }}
          </li>
        </ul>
      </div>
      <div class="bg-white shadow-md rounded-lg p-4">
        <h3 class="text-xl font-semibold mb-2">Knowledge Base Interactions</h3>
        <ul class="space-y-2">
          <li v-for="interaction in knowledgeBaseStore.recentInteractions" :key="interaction.id">
            {{ interaction.title }} - {{ interaction.date }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>