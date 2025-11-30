import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const userService = {
  // Sync Firebase user to database
  syncFirebaseUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/sync-firebase-user`, userData);
      return response.data;
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error;
    }
  },

  // Get user by Firebase UID
  getUserByFirebaseUid: async (firebaseUid) => {
    try {
      const response = await axios.get(`${API_URL}/debug/user/${firebaseUid}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Create test user (for testing)
  createTestUser: async () => {
    try {
      const response = await axios.post(`${API_URL}/create-test-user`);
      return response.data;
    } catch (error) {
      console.error('Error creating test user:', error);
      throw error;
    }
  }
};

export default userService;