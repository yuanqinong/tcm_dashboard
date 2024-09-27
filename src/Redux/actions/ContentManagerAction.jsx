import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Replace with your actual API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export const getUploadedFiles = async () => {
  try {
    const response = await api.get('/files');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch files:', error);
    throw error;
  }
};

export const downloadFiles = async (fileIds) => {
  try {
    const response = await api.post(`/download_files`, fileIds, {
      responseType: 'blob'
    });
    console.log("header",response.headers);
    const contentDisposition = response.headers.get('content-disposition');
    const blob = response.data;
    return { blob, contentDisposition };
  } catch (error) {
    console.error('Failed to download files:', error);
    throw error;
  }
};

export const deleteFiles = async (fileIds) => {
  try {
    const response = await api.delete('/delete_file', { 
      data: fileIds  
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete files:', error);
    throw error;
  }
};

export const syncKnowledgeBase = async () => {
  try {
    const response = await api.post('/sync_knowledge_base');
    return response;
  } catch (error) {
    console.error('Failed to sync database:', error);
    throw error;
  }
};

export const deleteSelectedEmbedding = async (fileIds) => {
  try {
    const response = await api.delete('/delete_embeddings', { 
      data: fileIds  
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete embeddings:', error);
    throw error;
  }
}
