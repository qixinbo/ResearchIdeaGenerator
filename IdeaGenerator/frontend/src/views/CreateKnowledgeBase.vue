<script setup lang="ts">
import { ref } from 'vue'
import { useKnowledgeBaseStore } from '../stores/knowledgeBase'

const knowledgeBaseStore = useKnowledgeBaseStore()

const name = ref('')
const description = ref('')
const showSuccessMessage = ref(false)

const createKnowledgeBase = () => {
  if (name.value) {
    const newKB = knowledgeBaseStore.createKnowledgeBase(name.value, description.value)
    console.log('New Knowledge Base created:', newKB)
    name.value = ''
    description.value = ''
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
    <h3 class="text-2xl font-semibold mb-4 text-gray-700">Create Knowledge Base</h3>
    <form @submit.prevent="createKnowledgeBase" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input v-model="name" type="text" id="name" required
               class="mt-1 block w-full p-2 border border-gray-300 rounded">
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea v-model="description" id="description" rows="3"
                  class="mt-1 block w-full p-2 border border-gray-300 rounded"></textarea>
      </div>
      <button type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
        Create Knowledge Base
      </button>
    </form>
    <p v-if="showSuccessMessage" class="mt-4 text-center text-green-600 font-semibold">
      Knowledge Base created successfully!
    </p>
  </div>
</template>
