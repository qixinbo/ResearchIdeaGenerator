import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../utils/supabaseClient'
import axios from 'axios'

export const useKnowledgeBaseStore = defineStore('knowledgeBase', {
  state: () => ({
    searchResults: [],
  }),
  actions: {
    async searchKnowledgeBase(query: string) {
      // Existing search functionality
    },
    async createKnowledgeBase(files: File[]) {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`file${index}`, file)
      })

      try {
        const response = await axios.post('/api/knowledge-base/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        // Handle successful upload
        console.log('Knowledge base created successfully', response.data)
      } catch (error) {
        // Handle error
        console.error('Error creating knowledge base', error)
      }
    },
  },
})