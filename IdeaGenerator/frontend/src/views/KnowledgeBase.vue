<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useKnowledgeBaseStore } from '../stores/knowledgeBase'
import CreateKnowledgeBase from './CreateKnowledgeBase.vue'

const knowledgeBaseStore = useKnowledgeBaseStore()
const searchQuery = ref('')
const files = ref<File[]>([])
const showSuccessMessage = ref(false)
const isUploading = ref(false)
const currentProgress = ref(0)

const searchKnowledgeBase = () => {
  knowledgeBaseStore.searchKnowledgeBase(searchQuery.value)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    files.value = Array.from(target.files)
  }
}

const uploadFiles = async () => {
  if (files.value.length > 0) {
    isUploading.value = true
    currentProgress.value = 0
    try {
      await knowledgeBaseStore.uploadFiles(files.value)
      files.value = []
      showSuccessMessage.value = true
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      isUploading.value = false
    }
  }
}

const formattedProgress = computed(() => {
  return `${currentProgress.value}%`
})

// 添加 watch 来监听 store 中的 uploadProgress 变化
watch(() => knowledgeBaseStore.uploadProgress, (newProgress) => {
  currentProgress.value = newProgress
  console.log('Progress updated:', newProgress) // 添加日志
})

// 添加一个计算属性来获取知识库列表
const knowledgeBases = computed(() => knowledgeBaseStore.knowledgeBases)
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">Knowledge Base</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Create Knowledge Base section -->
      <CreateKnowledgeBase />

      <!-- File upload section -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 class="text-2xl font-semibold mb-4 text-gray-700">Upload Files</h3>
        <div class="space-y-4">
          <input type="file" @change="handleFileUpload" multiple class="w-full p-2 border border-gray-300 rounded">
          <button @click="uploadFiles" :disabled="isUploading" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isUploading ? 'Uploading...' : 'Upload Files' }}
          </button>
          <div v-if="isUploading" class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: formattedProgress }"></div>
          </div>
          <p v-if="isUploading" class="text-center text-gray-600">{{ formattedProgress }}</p>
          <p v-if="showSuccessMessage" class="text-center text-green-600 font-semibold">Upload successful!</p>
        </div>
      </div>

      <!-- Search functionality -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 class="text-2xl font-semibold mb-4 text-gray-700">Search Knowledge Base</h3>
        <div class="space-y-4">
          <input v-model="searchQuery" @keyup.enter="searchKnowledgeBase" type="text" placeholder="Search knowledge base..." class="w-full p-2 border border-gray-300 rounded">
          <button @click="searchKnowledgeBase" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
            Search
          </button>
        </div>
      </div>
    </div>

    <!-- Knowledge Base List -->
    <div class="mt-12">
      <h3 class="text-2xl font-semibold mb-6 text-gray-700">Knowledge Bases</h3>
      <ul class="space-y-6">
        <li v-for="kb in knowledgeBases" :key="kb.id" class="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out">
          <h4 class="text-xl font-semibold mb-3 text-gray-800">{{ kb.name }}</h4>
          <p class="text-gray-600 mb-3">{{ kb.description }}</p>
          <p class="text-sm text-gray-500">Created at: {{ new Date(kb.created_at).toLocaleString() }}</p>
        </li>
      </ul>
    </div>

    <!-- Search results -->
    <div v-if="knowledgeBaseStore.searchResults.length > 0" class="mt-12">
      <h3 class="text-2xl font-semibold mb-6 text-gray-700">Search Results</h3>
      <ul class="space-y-6">
        <li v-for="result in knowledgeBaseStore.searchResults" :key="result.id" class="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out">
          <h4 class="text-xl font-semibold mb-3 text-gray-800">{{ result.title }}</h4>
          <p class="text-gray-600 mb-3">{{ result.excerpt }}</p>
          <a :href="result.url" target="_blank" class="text-blue-600 hover:text-blue-800 font-medium hover:underline">Read more →</a>
        </li>
      </ul>
    </div>
    <div v-else class="mt-12 text-center text-gray-600">
      <p>No results found. Try a different search query.</p>
    </div>
  </div>
</template>