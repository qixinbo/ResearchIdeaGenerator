import { defineStore } from 'pinia'
import supabase from '../utils/supabaseClient'

export const useKnowledgeBaseStore = defineStore('knowledgeBase', {
  state: () => ({
    searchResults: [],
  }),
  actions: {
    async searchKnowledgeBase(query: string) {
      // Existing search functionality
    },
    async uploadFiles(files: File[], progressCallback: (progress: number) => void) {
      try {
        const uploadedFiles = [];
        const totalFiles = files.length;

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // 生成一个唯一的文件名
          const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
          
          // 上传文件到Supabase存储
          console.log('Uploading file:', fileName, 'to bucket:', 'knowledge-base-files');
          const { data, error: uploadError } = await supabase.storage
            .from('knowledge-base-files')
            .upload(fileName, file);

          if (uploadError) throw uploadError;
          console.log('File uploaded successfully:', data);
          
          // 获取文件的公共URL
          const { data: urlData } = supabase.storage
            .from('knowledge-base-files')
            .getPublicUrl(fileName);

          if (!urlData || !urlData.publicUrl) throw new Error('Failed to get public URL');

          const publicUrl = urlData.publicUrl;

          // 将文件信息插入到knowledge_base表中
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
          progressCallback(((i + 1) / totalFiles) * 100);
        }

        console.log('Files uploaded and stored in Supabase successfully', uploadedFiles);
        return uploadedFiles;
      } catch (error) {
        console.error('Error uploading files', error);
        throw error;
      }
    },
  },
})