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
  } catch (error) {
    if (error.response) {
      // Request was made and server responded with a status code outside the range of 2xx
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error message:', error.message);
    }
    throw error;
  }
};
