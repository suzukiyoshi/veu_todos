import axios from 'axios'
import { store } from './../../store'

const API_URL = 'http://localhost:3000'

const securedAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

securedAxiosInstance.interceptors.request.use(config => {
  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': store.state.csrf
    }
  }
  return config
})

securedAxiosInstance.interceptors.response.use(null, error => {
  if (error.response && error.response.config && error.response.status === 401) {
    // 期限切れのアクセスCookieが原因で401が発生した場合 - 更新リクエストを行う
    return plainAxiosInstance.post('/refresh', {}, { headers: { 'X-CSRF-TOKEN': store.state.csrf } })
      .then(response => {
        plainAxiosInstance.get('/me')
          .then(meResponse => store.commit('setCurrentUser', { currentUser: meResponse.data, csrf: response.data.csrf }))
        // 正常に更新された後 - 再リクエスト
        let retryConfig = error.response.config
        retryConfig.headers['X-CSRF-TOKEN'] = response.data.csrf
        return plainAxiosInstance.request(retryConfig)
      }).catch(error => {
        store.commit('unsetCurrentUser')
        // 更新要求が失敗した場合にサインインにリダイレクトする
        location.replace('/')
        return Promise.reject(error)
      })
  } else {
    return Promise.reject(error)
  }
})

export { securedAxiosInstance, plainAxiosInstance }
