const API_URL = process.env.REACT_APP_API_BASE_URL + '/auth';

class AuthService {
  async signin(usernameOrEmail, password) {
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
      } else {
        throw new Error(data.message || 'Sign in failed');
      }
    } catch (error) {
      throw error;
    }
  }

  async signup(username, email, password) {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  signout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getAuthHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      return { Authorization: 'Bearer ' + user.token };
    }
    return {};
  }
}

const authService = new AuthService();
export default authService;