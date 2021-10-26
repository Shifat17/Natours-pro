import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  console.log(data);
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updatePassword'
        : 'http://localhost:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
      withCredentials: true,
    });

    if (res.data.status == 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
