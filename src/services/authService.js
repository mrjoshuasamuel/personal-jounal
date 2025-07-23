// Authentication Service
class AuthService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
    this.storageKey = 'daily_journal_user';
    this.tokenKey = 'daily_journal_token';
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.storageKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Set user data in localStorage
  setCurrentUser(userData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  // Clear user data and token
  clearAuthData() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.tokenKey);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Simulate API request with delay
  async simulateApiCall(data, delay = 1000) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), delay);
    });
  }

  // Login function (simulated for now)
  async login(credentials) {
    const { email, password } = credentials;

    // Basic validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    try {
      // Simulate API call
      const userData = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=4f46e5&color=fff`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          autoSave: true
        }
      };

      // Simulate API response delay
      await this.simulateApiCall(userData, 800);

      // In production, this would be a JWT token from the server
      const mockToken = `mock_jwt_token_${userData.id}_${Date.now()}`;

      // Store user data and token
      this.setCurrentUser(userData);
      this.setAuthToken(mockToken);

      return userData;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Register function (simulated for now)
  async register(userData) {
    const { email, password, confirmPassword, name } = userData;

    // Validation
    if (!email || !password || !confirmPassword) {
      throw new Error('All fields are required');
    }

    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    try {
      // Check if user already exists (simulated)
      const existingUser = this.getCurrentUser();
      if (existingUser && existingUser.email === email) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        email: email,
        name: name || email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split('@')[0])}&background=4f46e5&color=fff`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          autoSave: true
        }
      };

      // Simulate API response delay
      await this.simulateApiCall(newUser, 1000);

      // Generate mock token
      const mockToken = `mock_jwt_token_${newUser.id}_${Date.now()}`;

      // Store user data and token
      this.setCurrentUser(newUser);
      this.setAuthToken(mockToken);

      return newUser;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  // Logout function
  async logout() {
    try {
      // In production, make API call to invalidate token
      // await this.apiCall('/auth/logout', { method: 'POST' });

      // Clear local storage
      this.clearAuthData();

      // Simulate API delay
      await this.simulateApiCall(null, 300);

      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local data
      this.clearAuthData();
      throw new Error(error.message || 'Logout failed');
    }
  }

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.id !== userId) {
        throw new Error('User not found');
      }

      // Validate updates
      if (updates.email && !updates.email.includes('@')) {
        throw new Error('Invalid email format');
      }

      // Merge updates with current user data
      const updatedUser = {
        ...currentUser,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Update avatar if name changed
      if (updates.name && updates.name !== currentUser.name) {
        updatedUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(updates.name)}&background=4f46e5&color=fff`;
      }

      // Simulate API call
      await this.simulateApiCall(updatedUser, 600);

      // Update stored user data
      this.setCurrentUser(updatedUser);

      return updatedUser;
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.id !== userId) {
        throw new Error('User not found');
      }

      // Validate passwords
      if (!currentPassword || !newPassword) {
        throw new Error('Current password and new password are required');
      }

      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      // Simulate API call
      await this.simulateApiCall(null, 800);

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Password change failed');
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Valid email address is required');
      }

      // Simulate API call
      await this.simulateApiCall(null, 1000);

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  // Verify auth token (future enhancement)
  async verifyToken() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('No token found');
      }

      // In production, verify token with server
      // const response = await this.apiCall('/auth/verify', {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // For now, just check if user exists in localStorage
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }

      return { valid: true, user };
    } catch (error) {
      this.clearAuthData();
      throw new Error('Token verification failed');
    }
  }

  // Make authenticated API call (future enhancement)
  async apiCall(endpoint, options = {}) {
    const token = this.getAuthToken();
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.clearAuthData();
          throw new Error('Authentication expired. Please log in again.');
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Refresh auth token (future enhancement)
  async refreshToken() {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('No token to refresh');
      }

      // In production, call refresh endpoint
      // const response = await this.apiCall('/auth/refresh', {
      //   method: 'POST'
      // });

      // For now, just return current token
      return token;
    } catch (error) {
      this.clearAuthData();
      throw new Error('Token refresh failed');
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;