<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import supabase from '../utils/supabaseClient'

// 设置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFFile {
  id: string;
  name: string;
  url: string;
}

const pdfFiles = ref<PDFFile[]>([])
const selectedFileId = ref<string | null>(null)
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)
const pdfDocument = ref<PDFDocumentProxy | null>(null)
const currentPage = ref(1)
const scale = ref(1.5)

const selectedFile = computed(() => 
  pdfFiles.value.find(file => file.id === selectedFileId.value)
)

const selectFile = async (fileId: string) => {
  selectedFileId.value = fileId
  const file = pdfFiles.value.find(f => f.id === fileId)
  if (file) {
    console.log('Selected file URL:', file.url)
    await loadPDF(file.url)
  }
}

const loadPDF = async (url: string) => {
  console.log('Starting to load PDF from URL:', url);
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    pdfDocument.value = await loadingTask.promise;
    console.log(`PDF loaded successfully. Total pages: ${pdfDocument.value.numPages}`);
    currentPage.value = 1;
    renderPage();
  } catch (error) {
    console.error('Error loading PDF:', error);
    if (error instanceof Error) {
      errorMessage.value = `Error loading PDF: ${error.message}`;
    } else {
      errorMessage.value = 'An unknown error occurred while loading the PDF';
    }
  }
}

const renderPage = async () => {
  if (!pdfDocument.value) return;

  try {
    const page = await pdfDocument.value.getPage(currentPage.value);
    const viewport = page.getViewport({ scale: scale.value });

    const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to get canvas context');
    }
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    await page.render(renderContext).promise;
  } catch (error) {
    console.error('Error rendering PDF page:', error);
    errorMessage.value = 'Error rendering PDF page';
  }
}

const nextPage = () => {
  if (pdfDocument.value && currentPage.value < pdfDocument.value.numPages) {
    currentPage.value++;
    renderPage();
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    renderPage();
  }
}

onMounted(async () => {
  try {
    console.log('Supabase URL:', supabase.supabaseUrl);
    const { data, error } = await supabase.storage
      .from('knowledge-base-files')
      .list()

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    console.log('Raw file list:', data)

    if (!data || data.length === 0) {
      errorMessage.value = 'No files found in the storage bucket.'
      return
    }

    const pdfData = data.filter(item => item.name.toLowerCase().endsWith('.pdf'))
    
    console.log('Filtered PDF files:', pdfData)

    pdfFiles.value = await Promise.all(pdfData.map(async item => {
      const { data: urlData } = supabase.storage
        .from('knowledge-base-files')
        .getPublicUrl(item.name)

      console.log('Generated public URL:', urlData.publicUrl)
      return {
        id: item.id,
        name: item.name,
        url: urlData.publicUrl
      }
    }))

    console.log('Processed PDF files:', pdfFiles.value)

    if (pdfFiles.value.length === 0) {
      errorMessage.value = 'No PDF files found in the storage bucket.'
    }

  } catch (error) {
    console.error('Error fetching PDF files:', error)
    errorMessage.value = `Error fetching files: ${error.message}`
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

      <div v-else-if="errorMessage" class="text-center text-red-600">
        <p>{{ errorMessage }}</p>
      </div>

      <div v-else-if="pdfFiles.length === 0" class="text-center text-indigo-600">
        <p>No PDF files found in the storage bucket.</p>
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
          <div v-if="selectedFile" class="w-full rounded-lg overflow-hidden shadow-inner">
            <canvas id="pdf-canvas" class="mx-auto"></canvas>
            <div class="mt-4 flex justify-center space-x-4">
              <button @click="prevPage" class="px-4 py-2 bg-blue-500 text-white rounded" :disabled="currentPage === 1">Previous</button>
              <span>Page {{ currentPage }} of {{ pdfDocument?.numPages || 0 }}</span>
              <button @click="nextPage" class="px-4 py-2 bg-blue-500 text-white rounded" :disabled="!pdfDocument || currentPage === pdfDocument.numPages">Next</button>
            </div>
          </div>
          <div v-else class="flex items-center justify-center h-[600px] text-center text-indigo-600 bg-indigo-50 rounded-lg">
            <p class="text-xl">Select a file to view its content</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以添加一些额外的样式，如果需要的话 */
</style>