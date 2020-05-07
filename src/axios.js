// axios
import axios from 'axios'

const baseURL = "https://api.acedbets.io"

//const baseURL = "http://localhost:3600"

if (localStorage.getItem('user') != null) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken;
}

const api  =axios.create({
  baseURL
  // You can add your headers here
});
api.interceptors.response.use((response) => response, (error) => {
  if(error && error.response.status && error.response.status == 403) {
    localStorage.removeItem("user");
    location.href = "/login";
    return;
  }
  // whatever you want to do with the error
  throw error;
});
export default api
