interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_at?: string;
  username: string;
}

interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthError {
  detail: string;
  status: number;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'password');
    requestBody.append('username', username);
    requestBody.append('password', password);
    requestBody.append('scope', '');
    requestBody.append('client_id', 'string');
    requestBody.append('client_secret', 'string');

    const response = await fetch('http://saveai.tech/auth/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        detail: errorData.detail || 'Login failed',
        status: response.status,
      };
    }

    const data = await response.json();

    // Store session data
    const sessionData = {
      token: data.access_token,
      username: username,
      loginTime: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    localStorage.setItem('sessionData', JSON.stringify(sessionData));

    return { ...data, username };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<RegisterResponse> => {
  try {
    const requestBody = JSON.stringify({
      username,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });

    const response = await fetch('http://saveai.tech/auth/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        detail: errorData.detail || 'Registration failed',
        status: response.status,
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const checkSession = (): boolean => {
  const sessionData = localStorage.getItem('sessionData');
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  return !!sessionData && isAuthenticated === 'true';
};

export const getAuthToken = (): string | null => {
  const sessionData = localStorage.getItem('sessionData');
  if (!sessionData) return null;
  
  try {
    const parsedData = JSON.parse(sessionData);
    return parsedData.token || null;
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
};

export const refreshSession = (): void => {
  const sessionData = localStorage.getItem('sessionData');
  if (!sessionData) return;
  
  try {
    const parsedData = JSON.parse(sessionData);
    parsedData.lastActive = new Date().toISOString();
    localStorage.setItem('sessionData', JSON.stringify(parsedData));
  } catch (error) {
    console.error('Error refreshing session:', error);
  }
};
