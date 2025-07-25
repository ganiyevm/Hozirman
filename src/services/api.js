// import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api',
//   timeout: 10000
// })

// export default api
import axios from 'axios'

// .env fayldan to'g'ridan-to'g'ri ishlamaydi, .env.production ni Vue o'qiydi
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // <<<<< Eng muhim o'zgarish!
  timeout: 10000
})

export default api
