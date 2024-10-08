import { defineStore } from 'pinia'
import supabase from '../utils/supabaseClient'
import { ref } from 'vue'

// Rename the type alias to KnowledgeBaseItem
type KnowledgeBaseItem = {
  id: string;
  name: string;  // Add this line
  description: string;
  created_at: string;
};

// Use KnowledgeBaseItem[] for arrays of knowledge base items
export const _searchResults = ref<KnowledgeBaseItem[]>([]);

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export const useKnowledgeBaseStore = defineStore('knowledgeBase', () => {
  const searchResults = ref<KnowledgeBaseItem[]>([])
  const uploadProgress = ref(0)
  const knowledgeBases = ref<KnowledgeBaseItem[]>([
    {
      id: '1',
      name: 'Marketing Strategies',
      description: 'A collection of documents about various marketing strategies',
      created_at: '2023-05-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Product Development',
      description: 'Resources for product development and management',
      created_at: '2023-05-02T11:00:00Z'
    },
    {
      id: '3',
      name: 'Customer Support',
      description: 'Guidelines and best practices for customer support',
      created_at: '2023-05-03T09:30:00Z'
    }
  ])

  function createKnowledgeBase(name: string, description: string) {
    const newKnowledgeBase: KnowledgeBaseItem = {
      id: (knowledgeBases.value.length + 1).toString(),
      name,
      description,
      created_at: new Date().toISOString()
    }
    knowledgeBases.value.push(newKnowledgeBase)
    return newKnowledgeBase
  }

  function searchKnowledgeBase(query: string) {
    const lowercaseQuery = query.toLowerCase();
    searchResults.value = knowledgeBases.value.filter(kb => 
      kb.name.toLowerCase().includes(lowercaseQuery) || 
      kb.description.toLowerCase().includes(lowercaseQuery)
    ).map(kb => ({
      id: kb.id,
      title: kb.name,
      excerpt: kb.description,
      url: `#/knowledge-base/${kb.id}` // 这里可以根据实际路由结构调整
    }))
  }

  async function uploadFiles(files: File[]) {
    try {
      uploadProgress.value = 0
      const uploadedFiles = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        
        // 上传文件到Supabase存储
        const { error: uploadError } = await supabase.storage
          .from('knowledge-base-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('knowledge-base-files')
          .getPublicUrl(fileName);

        if (!urlData || !urlData.publicUrl) throw new Error('Failed to get public URL');

        const publicUrl = urlData.publicUrl;

        const { error: insertError } = await supabase
          .from('knowledge_base')
          .insert({
            file_name: file.name,
            file_url: publicUrl,
            file_type: file.type,
            file_size: file.size,
            metadata: {
              originalName: file.name,
              lastModified: file.lastModified
            }
          });

        if (insertError) throw insertError;

        uploadedFiles.push({
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type
        });

        // 更新进度
        uploadProgress.value = Math.round(((i + 1) / totalFiles) * 100);
        console.log('Current progress:', uploadProgress.value); // 添加日志
      }

      console.log('Files uploaded and stored in Supabase successfully', uploadedFiles);
      return uploadedFiles;
    } catch (error) {
      console.error('Error uploading files', error);
      throw error;
    }
  }

  return {
    searchResults,
    uploadProgress,
    knowledgeBases,
    createKnowledgeBase,
    searchKnowledgeBase,
    uploadFiles
  }
})