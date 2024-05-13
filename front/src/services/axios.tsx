import axios from "axios";
import {logout} from "./auth.service";
let refresh = false;
axios.interceptors.response.use(resp => resp, async error => {
  if (error.response.status === 401 && !refresh) {
     refresh = true;
     console.log(localStorage.getItem('refresh_token'));

     localStorage.removeItem('access_token');
     const response = await
           axios.post('http://127.0.0.1:8000/auth/jwt/refresh/', {
               refresh:localStorage.getItem('refresh_token')
           }, {
               headers: {'Content-Type': 'application/json' },
               withCredentials: true
           });
    if (response.status === 200) {
       axios.defaults.headers.common['Authorization'] = `${response.data['access']}`;
       localStorage.setItem('access_token', response.data.access);
       return axios(error.config);
    }
  }
refresh = false;
return error;
});

axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('access_token');
    if (token)
        config.headers.Authorization =  `JWT ${token}`;
    else logout();
    return config;
});
