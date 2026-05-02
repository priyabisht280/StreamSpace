const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Protected API call
export const fetchUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}` // ✅ Send token
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};