import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// auth functions

export async function checkUser(email: string) {
  try {
    const res = await api.post('/auth/check', { email });
    if (res.status === 200) return true;
  } catch (err: any) {
    if (err.response.status === 404) return false;
  }
}

export async function registerUser(email: string, password: string) {
  try {
    const res = await api.post('/auth/register', { email, password });
    if (res.status === 201) return true;
  } catch (err: any) {
    return false;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await api.post('/auth/login', { email, password });
    const { token, exp } = res.data;
    localStorage.setItem('session', JSON.stringify({ token, exp }));
    return true;
  } catch (err: any) {
    const code = err.response.status;
    if (code === 404) return 'User not found'; /// @dev this case should never happen
    if (code === 401) return 'Invalid password';
    return 'Internal server error';
  }
}

// chat functions

export async function fetchTokenUsage(email: string) {
  try {
    const jwt = JSON.parse(localStorage.getItem('session') as string).token;
    const res = await api.post(
      '/chat/token-usage', 
      { email }, 
      { headers: { Authorization: `Token ${jwt}` } }
    );
    return res.data; // { pct: number, limit: number, actual: number }
  } catch (err: any) {
    if (err.response.status === 403) return 'Invalid Token';
    return 'Internal server error';
  }
}

export async function startChat(email: string, model: string) {
  try {
    const jwt = JSON.parse(localStorage.getItem('session') as string).token;
    const res = await api.post(
      '/chat/start', 
      { email, model }, 
      { headers: { Authorization: `Token ${jwt}` } }
    );
    const _id = res.data._id;
    return _id;
  } catch (err: any) {
    if (err.response.status === 403) return err.response.data.message; /// @dev 'Invalid Token' | 'User throttled'
    if (err.response.status === 404) return 'User not found'; /// @dev this case should never happen
    return 'Internal server error';
  }
}