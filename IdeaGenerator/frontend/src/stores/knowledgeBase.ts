import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://mpunmkgymmjyqipgvbws.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wdW5ta2d5bW1qeXFpcGd2YndzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNTY5NjcsImV4cCI6MjA0MzgzMjk2N30.DCNT4HALpn-kjlBYbD_CnDkVwSQG2HyffqLtYu6EAuI')

export const useKnowledgeBaseStore = defineStore('knowledgeBase', () => {
  const searchResults = ref([])
  const recentInteractions = ref([])

  const searchKnowledgeBase = async (query: string) => {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .textSearch('content', query)
      .limit(10)

    if (error) throw error
    searchResults.value = data
  }

  const loadRecentInteractions = async () => {
    const { data, error } = await supabase
      .from('knowledge_base_interactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error
    recentInteractions.value = data
  }

  return { searchResults, recentInteractions, searchKnowledgeBase, loadRecentInteractions }
})