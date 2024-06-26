import axios from 'axios';

const baseURL = 'http://localhost:8000/api';

const instance = axios.create({
  baseURL,
  timeout: 10000,
});

export const Gemini = async (formData) => {
  try {
    const response = await instance.post('/gemini', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }catch(error) {
    if(error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    }else if (error.request) {
      console.error('Error request:', error.request);
    }else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};