<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import supabase from '../utils/supabaseClient'

// 设置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFFile {
  name: string;
  url: string;
}

const pdfFiles = ref<PDFFile[]>([])
const selectedFile = ref<PDFFile | null>(null)
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

const loadPDF = async (url: string) => {
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const container = document.getElementById('pdf-container');
    if (!container) throw new Error('PDF container not found');
    container.innerHTML = ''; // Clear previous content

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      await page.render(renderContext).promise;

      container.appendChild(canvas);
    }
  } catch (error) {
    console.error('Error loading PDF:', error);
    errorMessage.value = 'Error loading PDF';
  }
}

onMounted(async () => {
  try {
    const { data, error } = await supabase.storage
      .from('knowledge-base-files')
      .list()

    if (error) throw error;

    pdfFiles.value = data
      .filter(item => item.name.toLowerCase().endsWith('.pdf'))
      .map(item => ({
        name: item.name,
        url: supabase.storage.from('knowledge-base-files').getPublicUrl(item.name).data.publicUrl
      }));

    if (pdfFiles.value.length === 0) {
      errorMessage.value = 'No PDF files found in the storage bucket.';
    }
  } catch (error) {
    console.error('Error fetching PDF files:', error);
    errorMessage.value = 'Error fetching PDF files';
  } finally {
    isLoading.value = false;
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-200 to-purple-200 py-12 px-4">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        PDF Viewer
      </h2>

      <div v-if="isLoading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        <p class="mt-4 text-blue-600 text-xl">Loading PDF files...</p>
      </div>

      <div v-else-if="errorMessage" class="text-center text-red-600 text-xl">
        <p>{{ errorMessage }}</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- File list -->
        <div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white border-opacity-30 transition-all duration-300 hover:shadow-2xl hover:bg-opacity-30">
          <h3 class="text-2xl font-semibold mb-6 text-blue-700">File List</h3>
          <ul class="space-y-3">
            <li v-for="file in pdfFiles" :key="file.name" 
                @click="selectedFile = file; loadPDF(file.url)"
                class="cursor-pointer p-4 rounded-xl transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-50 hover:shadow-md">
              <div class="flex items-center space-x-3">
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <span class="text-gray-800 text-lg">{{ file.name }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- PDF Viewer -->
        <div class="lg:col-span-2 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white border-opacity-30 transition-all duration-300 hover:shadow-2xl hover:bg-opacity-30">
          <h3 class="text-2xl font-semibold mb-6 text-blue-700">PDF Viewer</h3>
          <div v-if="selectedFile" class="w-full">
            <div class="mb-6 flex justify-center space-x-4">
              <button @click="zoomOut" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg">
                Zoom Out
              </button>
              <button @click="resetZoom" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg">
                Reset Zoom
              </button>
              <button @click="zoomIn" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg">
                Zoom In
              </button>
            </div>
            <div class="overflow-auto bg-white rounded-xl shadow-inner">
              <div id="pdf-container" class="mx-auto"></div>
            </div>
          </div>
          <div v-else class="flex items-center justify-center h-96 text-gray-500 bg-white bg-opacity-50 rounded-xl">
            <p class="text-center text-xl">Select a file to view its content</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

#pdf-container {
  max-height: 800px;
  overflow-y: auto;
}

#pdf-container::-webkit-scrollbar {
  width: 8px;
}

#pdf-container::-webkit-scrollbar-track {
  background: #e2e8f0;
}

#pdf-container::-webkit-scrollbar-thumb {
  background-color: #a0aec0;
  border-radius: 20px;
  border: 2px solid #e2e8f0;
}

.backdrop-blur-lg {
  backdrop-filter: blur(20px);
}
</style>