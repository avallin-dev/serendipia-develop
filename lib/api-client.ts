import axios, { AxiosError } from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
})

apiClient.interceptors.response.use(
  function (response) {
    return response
  },
  function (e) {
    const error = e as AxiosError
    const res = error.response
    return Promise.reject(res)
  }
)

export default apiClient
