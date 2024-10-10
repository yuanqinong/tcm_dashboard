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
    const response = await api.post('/api/dashboard/upload_files', formData, {
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

export const uploadLinks = async (links) => {
  try {
    const response = await api.post('/api/dashboard/upload_links', links);
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export const getUploadedFiles = async () => {
  try {
    const response = await api.get('/api/dashboard/files');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch files:', error);
    throw error;
  }
};

export const getUploadedLinks = async () => {
  try {
    const response = await api.get('/api/dashboard/links');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch links:', error);
    throw error;
  }
};

export const downloadFiles = async (fileIds) => {
  try {
    const response = await api.post(`/api/dashboard/download_files`, fileIds, {
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
    const response = await api.delete('/api/dashboard/delete_file', { 
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
    const response = await api.post('/api/dashboard/sync_knowledge_base');
    return response;
  } catch (error) {
    console.error('Failed to sync database:', error);
    throw error;
  }
};

export const deleteSelectedEmbedding = async (fileIds) => {
  try {
    const response = await api.delete('/api/dashboard/delete_embeddings', { 
      data: fileIds  
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete embeddings:', error);
    throw error;
  }
};

export const getUnprocessedFilesCount = async () => {
  try {
    const response = await api.get('/api/dashboard/unprocessed_files');
    return response.data;
  } catch (error) {
    console.error('Failed to get unprocessed files count:', error);
    throw error;
  }
};

export const deleteLinks = async (linkIds) => {
  try {
    const response = await api.delete('/api/dashboard/delete_links', { 
      data: linkIds  
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete links:', error);
    throw error;
  }
};

export const getUrlWithId = async (ids) => {
  try {
    const response = await api.post('/api/dashboard/url_with_id/', { ids });
    return response.data;
  } catch (error) {
    console.error('Failed to get url with id:', error);
    throw error;
  }
};
