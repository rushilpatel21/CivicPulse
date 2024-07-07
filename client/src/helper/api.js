import axios from 'axios';
import { deleteObject, listAll, ref } from 'firebase/storage';
import { storage } from '../components/firebase';

const baseURL = import.meta.env.VITE_BACKEND_SERVER_PORT_DEV;

const instance = axios.create({
  baseURL,
  timeout: 30000,
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
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const getIssues = async () => {
  try {
    const response = await instance.get('/issues');
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const getIssuesById = async (id) => {
  try {
    const response = await instance.get(`/issues/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Needed when deleting an account to clear out issues. 
export const deleteIssueById = async (id) => {
  try {
    const response = await instance.delete(`/issues/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const bugReportApi = async (data) => {
  try {
    const response = await instance.post('/bugs', data,{
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

export const isAdmin = async (id) => {
  try {
    const response = await instance.get(`/admin/role/${id}`);
    if(response.data === 'Admin'){
      return true;
    }else{
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

export const changeRoleById = async (id, role) => {
  try {
    const response = await instance.put(`/admin/role/${id}`, {role: role},{
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

export const getAllUsers = async () => {
  try {
    const response = await instance.get('/admin/users');
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

export const deleteUserInfo = async (id) => {
  try{
    const response = await instance.delete(`/admin/user/${id}`);
    const res = await deleteFilesInDirectory(`images/${id}`);
    response.res = res;
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

const deleteFilesInDirectory = async (directoryPath) => {
  try {
    const storageRef = ref(storage, directoryPath);
    const filesRef = await listAll(storageRef);

    const deleteFilePromises = filesRef.items.map((itemRef) => {
      return deleteObject(itemRef).catch((error) => {
        console.error(`Error deleting file ${itemRef.name}:`, error);
        throw error; // Rethrow error to propagate it up
      });
    });

    await Promise.all(deleteFilePromises);

    console.log(`Successfully deleted all files in directory: ${directoryPath}`);
  } catch (error) {
    console.error('Error deleting directory:', error);
    throw error;
  }
};


export const disableUserInfo = async (id) => {
  try {
    const response = await instance.post(`/admin/disable/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

export const enableUserInfo = async (id) => {
  try {
    const response = await instance.post(`/admin/enable/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
}