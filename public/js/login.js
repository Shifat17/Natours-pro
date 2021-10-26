import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
      withCredentials: true,
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'loggedIn Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  console.log('logout');
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/v1/users/logout',
    });
    console.log(res);
    if (res.data.status == 'success') {
      location.reload(true);
    }
  } catch (error) {
    showAlert('error', 'error logging out!');
  }
};

console.log('hello world');
