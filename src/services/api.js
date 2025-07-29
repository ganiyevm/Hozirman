// import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api',
//   timeout: 10000
// })

// export default api
// import axios from 'axios'

// // .env fayldan to'g'ridan-to'g'ri ishlamaydi, .env.production ni Vue o'qiydi
// const api = axios.create({
//   baseURL: process.env.VUE_APP_API_URL, // <<<<< Eng muhim o'zgarish!
//   timeout: 10000
// })

// export default api


// api.js - Fixed version
// api.js - Yangi API konfiguratsiyasi
import axios from 'axios'

// Development muhitida proxy ishlatish, production da to'g'ridan-to'g'ri
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'development') {
    // Development da proxy orqali so'rov yuborish
    return '/api'
  } else {
    // Production da to'g'ridan-to'g'ri API ga so'rov
    return 'https://hozirman.uz/api'
  }
}

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000, // Timeout ni oshirdik
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// So'rov interceptor
api.interceptors.request.use(
  (config) => {
    // Token bo'lsa qo'shamiz
    const token = process.env.VUE_APP_API_TOKEN
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Development muhitida qo'shimcha sarlavhalar
    if (process.env.NODE_ENV === 'development') {
      config.headers['X-Requested-With'] = 'XMLHttpRequest'
    }
    
    console.log('API so\'rov yuborilmoqda:', config.url)
    return config
  },
  (error) => {
    console.error('So\'rov xatoligi:', error)
    return Promise.reject(error)
  }
)

// Javob interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API javob olindi:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('API xatoligi:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message
    })
    
    // CORS xatoligi uchun maxsus xabar
    if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
      console.error('CORS xatoligi! Proxy sozlamalarini tekshiring.')
    }
    
    return Promise.reject(error)
  }
)

export default api