import { defineStore } from 'pinia'
import supabase from '../utils/supabaseClient'
import { ref } from 'vue'

export const useKnowledgeBaseStore = defineStore('knowledgeBase', () => {
  const searchResults = ref([])
  const uploadProgress = ref(0)

  async function searchKnowledgeBase(query: string) {
    // Existing search functionality
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
        const { data, error: uploadError } = await supabase.storage
          .from('knowledge-base-files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('knowledge-base-files')
          .getPublicUrl(fileName);

        if (!urlData || !urlData.publicUrl) throw new Error('Failed to get public URL');

        const publicUrl = urlData.publicUrl;

        const { data: insertData, error: insertError } = await supabase
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
    searchKnowledgeBase,
    uploadFiles
  }
})