import axios from 'axios'
import { getSession } from 'next-auth/react'

const session = getSession()

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false, // to change in prod
})
