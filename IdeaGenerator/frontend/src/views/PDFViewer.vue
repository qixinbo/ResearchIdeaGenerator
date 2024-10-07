<script setup lang="ts">
import { ref, computed } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

// 模拟文件列表，实际应用中这可能来自API或存储
const pdfFiles = ref([
  { id: 1, name: 'Document 1.pdf', url: '/path/to/document1.pdf' },
  { id: 2, name: 'Document 2.pdf', url: '/path/to/document2.pdf' },
  { id: 3, name: 'Document 3.pdf', url: '/path/to/document3.pdf' },
])

const selectedFileId = ref(null)

const selectedFile = computed(() => 
  pdfFiles.value.find(file => file.id === selectedFileId.value)
)

const selectFile = (fileId) => {
  selectedFileId.value = fileId
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl font-extrabold mb-8 text-center text-indigo-900">PDF Viewer</h2>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- File list -->
        <div class="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-indigo-200">
          <h3 class="text-2xl font-semibold mb-4 text-indigo-800">File List</h3>
          <ul class="space-y-2">
            <li v-for="file in pdfFiles" :key="file.id" 
                @click="selectFile(file.id)"
                class="cursor-pointer p-3 rounded-lg"
                :class="file.id === selectedFileId ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-100'">
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                {{ file.name }}
              </span>
            </li>
          </ul>
        </div>

        <!-- PDF Viewer -->
        <div class="lg:col-span-2 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-indigo-200">
          <h3 class="text-2xl font-semibold mb-4 text-indigo-800">PDF Viewer</h3>
          <div v-if="selectedFile" class="w-full h-[600px] rounded-lg overflow-hidden shadow-inner">
            <VuePdfEmbed :source="selectedFile.url" />
          </div>
          <div v-else class="flex items-center justify-center h-[600px] text-center text-indigo-600 bg-indigo-50 rounded-lg">
            <p class="text-xl">Select a file to view</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以添加一些额外的样式，如果需要的话 */
</style>
