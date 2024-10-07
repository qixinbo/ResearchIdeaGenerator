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
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">PDF Viewer</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- File list -->
      <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 class="text-2xl font-semibold mb-4 text-gray-700">File List</h3>
        <ul class="space-y-2">
          <li v-for="file in pdfFiles" :key="file.id" 
              @click="selectFile(file.id)"
              class="cursor-pointer p-2 rounded hover:bg-gray-100 transition duration-200"
              :class="{ 'bg-blue-100': file.id === selectedFileId }">
            {{ file.name }}
          </li>
        </ul>
      </div>

      <!-- PDF Viewer -->
      <div class="md:col-span-2 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 class="text-2xl font-semibold mb-4 text-gray-700">PDF Viewer</h3>
        <div v-if="selectedFile" class="w-full h-[600px]">
          <VuePdfEmbed :source="selectedFile.url" />
        </div>
        <div v-else class="text-center text-gray-600">
          Select a file to view
        </div>
      </div>
    </div>
  </div>
</template>
