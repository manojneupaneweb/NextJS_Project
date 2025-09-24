'use client'

import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast, { Toaster } from 'react-hot-toast'

function LoginPage() {
  const router = useRouter()
  const [user, setUser] = React.useState({ email: '', password: '' })
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  React.useEffect(() => {
    const isDisabled = !user.email || !user.password
    setButtonDisabled(isDisabled)
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/users/login', user)
      toast.success(response.data.message || "Login successful")
      setUser({ email: '', password: '' })
      router.push('/profile')
    } catch (error: unknown) {
      console.log(error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong")
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Log In</h1>
      <Toaster/>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}
          required
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={e => setUser({ ...user, password: e.target.value })}
          required
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        <button
          type="submit"
          disabled={buttonDisabled}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {buttonDisabled ? 'Please fill all the fields' : 'Log In'}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Dont have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
    </div >
  )
}

export default LoginPage
