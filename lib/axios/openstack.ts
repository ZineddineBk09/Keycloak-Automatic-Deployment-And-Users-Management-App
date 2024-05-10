import axios from 'axios'
import https from 'https'

export default axios.create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, //! (NOTE: this will disable client verification)
  }),
  withCredentials: false, //? (NOTE: this will disable sending cookies with each request)
})
