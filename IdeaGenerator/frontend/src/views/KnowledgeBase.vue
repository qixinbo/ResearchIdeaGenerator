<script setup lang="ts">
import { ref } from 'vue'
import { useKnowledgeBaseStore } from '../stores/knowledgeBase'

const knowledgeBaseStore = useKnowledgeBaseStore()
const searchQuery = ref('')

const searchKnowledgeBase = () => {
  knowledgeBaseStore.searchKnowledgeBase(searchQuery.value)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Knowledge Base</h2>
    <div class="mb-4">
      <input v-model="searchQuery" @keyup.enter="searchKnowledgeBase" type="text" placeholder="Search knowledge base..." class="input w-full">
    </div>
    <div v-if="knowledgeBaseStore.searchResults.length > 0">
      <h3 class="text-xl font-semibold mb-2">Search Results</h3>
      <ul class="space-y-4">
        <li v-for="result in knowledgeBaseStore.searchResults" :key="result.id" class="bg-white shadow-md rounded-lg p-4">
          <h4 class="text-lg font-semibold mb-2">{{ result.title }}</h4>
          <p>{{ result.excerpt }}</p>
          <a :href="result.url" target="_blank" class="text-blue-600 hover:underline">Read more</a>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No results found. Try a different search query.</p>
    </div>
  </div>
</template>