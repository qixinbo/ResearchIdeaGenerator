<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import supabase from '../utils/supabaseClient'

interface PDFFile {
  id: string;
  name: string;
  url: string | null;
}

const pdfFiles = ref<PDFFile[]>([])
const selectedFileId = ref<string | null>(null)
const isLoading = ref(true)

const selectedFile = computed(() => 
  pdfFiles.value.find(file => file.id === selectedFileId.value)
)

const selectFile = async (fileId: string) => {
  selectedFileId.value = fileId
  const file = pdfFiles.value.find(f => f.id === fileId)
  if (file && !file.url) {
    try {
      const { data, error } = await supabase.storage
        .from('knowledge-base-files')
        .createSignedUrl(file.name, 3600) // URL有效期为1小时

      if (error) throw error
      file.url = data.signedUrl
    } catch (error) {
      console.error('Error getting signed URL:', error)
    }
  }
}

onMounted(async () => {
  try {
    // 获取存储桶中的文件列表
    const { data, error } = await supabase.storage
      .from('knowledge-base-files')
      .list()

    if (error) throw error

    // 过滤出PDF文件并创建pdfFiles数组
    pdfFiles.value = data
      .filter(item => item.name.toLowerCase().endsWith('.pdf'))
      .map(item => ({
        id: item.id,
        name: item.name,
        url: null // 初始时URL为null，选择文件时再获取签名URL
      }))

  } catch (error) {
    console.error('Error fetching PDF files:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl font-extrabold mb-8 text-center text-indigo-900">PDF Viewer</h2>

      <div v-if="isLoading" class="text-center">
        <p class="text-xl text-indigo-600">Loading PDF files...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
