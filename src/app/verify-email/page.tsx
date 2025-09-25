'use client'

import axios from 'axios'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, MailCheck } from 'lucide-react'

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [processing, setProcessing] = React.useState(false)
    const [verified, setVerified] = React.useState(false)
    const [responseMessage, setResponseMessage] = React.useState('')

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        try {
            setProcessing(true)
            const response = await axios.post('/api/users/verify-email', { token })
            toast.success(response.data.message || "Email verified successfully")
            setVerified(true)
            setResponseMessage(response.data.message || "Email verified successfully")

        } catch (error: any) {
            console.log(error?.response?.data?.message)
            setResponseMessage(error?.response?.data?.message || "An error occurred")
            setVerified(false)
        } finally {
            setProcessing(false)
        }
    }

    useEffect(() => {
        handleSubmit();
    }, [token])

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (verified) {
            timeout = setTimeout(() => router.push('/login'), 3000)
        }
        return () => clearTimeout(timeout)
    }, [verified])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <Toaster position="top-center" />
            
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white/20 p-3 rounded-full">
                            <MailCheck className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Email Verification</h1>
                    <p className="text-blue-100 mt-2">Verifying your email address</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Status Indicator */}
                    <div className="flex justify-center mb-6">
                        {processing ? (
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                        ) : verified ? (
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        ) : responseMessage ? (
                            <XCircle className="w-16 h-16 text-red-500" />
                        ) : (
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                        )}
                    </div>

                    {/* Message */}
                    <div className="text-center mb-6">
                        {processing ? (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800">Verifying Email</h2>
                                <p className="text-gray-600 mt-2">Please wait while we verify your email address...</p>
                            </>
                        ) : verified ? (
                            <>
                                <h2 className="text-xl font-semibold text-green-600">Verification Successful!</h2>
                                <p className="text-gray-600 mt-2">{responseMessage}</p>
                                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-sm text-green-700">
                                        Redirecting to login in 3 seconds...
                                    </p>
                                </div>
                            </>
                        ) : responseMessage ? (
                            <>
                                <h2 className="text-xl font-semibold text-red-600">Verification Failed</h2>
                                <p className="text-gray-600 mt-2">{responseMessage}</p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold text-gray-800">Starting Verification</h2>
                                <p className="text-gray-600 mt-2">Preparing to verify your email...</p>
                            </>
                        )}
                    </div>

                    {/* Token Display (for debugging) */}
                    {token && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-xs text-gray-500 font-mono break-all">
                                Token: {token}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        {!processing && !verified && responseMessage && (
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                            >
                                Try Again
                            </button>
                        )}
                        
                        <Link 
                            href="/login"
                            className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-3 px-4 rounded-lg border border-blue-600 hover:border-blue-700 transition duration-200"
                        >
                            Back to Login
                        </Link>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Need help?{' '}
                            <Link href="/support" className="text-blue-600 hover:text-blue-700 underline">
                                Contact support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            {processing && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 shadow-2xl flex items-center gap-3">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        <span className="text-gray-700">Verifying your email...</span>
                    </div>
                </div>
            )}
        </div>
    )
}