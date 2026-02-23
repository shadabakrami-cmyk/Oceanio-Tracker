import { useState } from 'react'

const API_URL = 'http://localhost:4000/api'

export default function AuthScreen({ onConnect }) {
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!userId.trim() || !password.trim() || !apiKey.trim()) {
            setError('All fields are required.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/auth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId.trim(), password: password.trim(), apiKey: apiKey.trim() }),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || data.message || data.detail || `Authentication failed (${res.status})`)
                return
            }

            const accessToken = data.token || data.access_token || data.accessToken || data.jwt
            if (!accessToken) {
                setError('No token received from API.')
                return
            }

            onConnect(accessToken, apiKey.trim())
        } catch (err) {
            setError('Network error — is the proxy server running on port 4000?')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa] px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#1a3c6e]">Oceanio Tracker</h1>
                    <p className="text-sm text-gray-500 mt-1">Connect your Oceanio API credentials to begin tracking</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                                User ID
                            </label>
                            <input
                                id="userId"
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter your User ID"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30 focus:border-[#1a3c6e] transition-colors"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30 focus:border-[#1a3c6e] transition-colors"
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                                API Key
                            </label>
                            <input
                                id="apiKey"
                                type="text"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your API Key"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30 focus:border-[#1a3c6e] transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1a3c6e] text-white py-2.5 rounded-md text-sm font-semibold hover:bg-[#15325c] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? 'Connecting...' : 'Connect'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
