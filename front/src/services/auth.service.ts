import axios from "axios";

const API_URL = "http://localhost:8000/auth/jwt/";

export const login = (username: File | string | null, password: File | string | null) => {
  return axios
    .post(API_URL + "create", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        console.log(JSON.stringify(response.data));
        localStorage.setItem("user", JSON.stringify(response.data));

        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        axios.defaults.headers.common['Authorization'] =`JWT ${response.data['access']}`;
      }
      return response.data;
    });
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  axios.defaults.headers.common['Authorization'] = null;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};
