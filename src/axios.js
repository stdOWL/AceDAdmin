// axios
import axios from 'axios'

const baseURL = "https://api.acedbets.io"

if (localStorage.getItem('user') != null) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken;
}
export default axios.create({
  baseURL
  // You can add your headers here
})