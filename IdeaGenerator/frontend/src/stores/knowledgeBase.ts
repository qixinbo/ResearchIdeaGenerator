import { defineStore } from 'pinia'
import { ref } from 'vue'
import supabase from '../utils/supabaseClient'
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
      try {
        const uploadedFiles = [];

        for (const file of files) {
          // 生成一个唯一的文件名
          const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
          
          // 上传文件到Supabase存储
          console.log('Uploading file:', fileName, 'to bucket:', 'knowledge-base-files');
          const { data, error: uploadError } = await supabase.storage
            .from('knowledge-base-files') // 确保这个bucket已经在Supabase中创建
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // 获取文件的签名URL
          const { data: { signedUrl }, error: urlError } = await supabase.storage
            .from('knowledge-base-files')
            .createSignedUrl(fileName, 60 * 60) // URL有效期为1小时

          if (urlError) throw urlError;

          // 将文件信息插入到knowledge_base表中
          const { data: insertData, error: insertError } = await supabase
            .from('knowledge_base')
            .insert({
              file_name: file.name,
              file_url: fileName, // 存储文件名而不是URL
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
            url: signedUrl,
            size: file.size,
            type: file.type
          });
        }

        console.log('Knowledge base created and stored in Supabase successfully', uploadedFiles);
        return uploadedFiles;
      } catch (error) {
        console.error('Error creating knowledge base', error);
        throw error;
      }
    },
  },
})