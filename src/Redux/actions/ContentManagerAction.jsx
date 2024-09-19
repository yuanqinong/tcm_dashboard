import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Replace with your actual API base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    const response = await api.get(`/download_file/${fileIds}`, {
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    console.error('Failed to download files:', error);
    throw error;
  }
};

export const deleteFiles = async (fileIds) => {
  try {
    const response = await api.delete('/delete_file/', { 
      data: fileIds  
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete files:', error);
    throw error;
  }
};