import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

const supabase = createClient('https://mpunmkgymmjyqipgvbws.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wdW5ta2d5bW1qeXFpcGd2YndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNTY5NjcsImV4cCI6MjA0MzgzMjk2N30.DCNT4HALpn-kjlBYbD_CnDkVwSQG2HyffqLtYu6EAuI')

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