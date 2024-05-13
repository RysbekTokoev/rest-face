import axios from "axios";
import {logout} from "./auth.service";
let refresh = false;
axios.interceptors.response.use(resp => resp, async error => {
  if (error.response.status === 401 && !refresh) {
     refresh = true;
     console.log(localStorage.getItem('refresh_token'));

     const response = await
           axios.post('http://127.0.0.1:8000/auth/jwt/refresh/', {
               refresh:localStorage.getItem('refresh_token')
           }, {
               headers: {'Content-Type': 'application/json' },
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
    const refresh = localStorage.getItem('refresh_token');

    // if url does not contain word refresh
    if (config.url && config.url.indexOf('refresh') === -1) {
        if (token)
            config.headers.Authorization =  `JWT ${token}`;
    }

    return config;
});
