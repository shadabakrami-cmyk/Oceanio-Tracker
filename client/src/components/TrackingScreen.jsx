import { useState, useRef, useEffect, useMemo } from 'react'
import DCSAView from './DCSAView'
import { normalizeResponse } from '../utils/normalizeResponse'

const API_URL = 'http://localhost:4000/api'

const TABS = [
    { key: 'bl', label: 'Bill of Lading', placeholder: 'Enter Bill of Lading number' },
    { key: 'booking', label: 'Booking Number', placeholder: 'Enter Booking reference' },
    { key: 'container', label: 'Container Number', placeholder: 'Enter Container number' },
]

export default function TrackingScreen({ auth, onDisconnect }) {
    const [activeTab, setActiveTab] = useState('bl')
    const [reference, setReference] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [result, setResult] = useState(null)
    const [selectedEventIndex, setSelectedEventIndex] = useState(null)

    const rawJsonRef = useRef(null)

    const currentTab = TABS.find((t) => t.key === activeTab)

    // Pre-compute the raw events for JSON highlighting
    const rawEvents = useMemo(() => {
        if (!result) return []
        return normalizeResponse(result).allEvents
    }, [result])

    // Scroll the raw JSON panel to the highlighted event
    useEffect(() => {
        if (selectedEventIndex === null || !rawJsonRef.current) return
        const marker = rawJsonRef.current.querySelector(`[data-event-idx="${selectedEventIndex}"]`)
        if (marker) {
            marker.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [selectedEventIndex])

    const handleTrack = async (e) => {
        e.preventDefault()
        setError('')
        setResult(null)
        setSelectedEventIndex(null)

        const trimmed = reference.trim()
        if (!trimmed) {
            setError('Please enter a reference number.')
            return
        }

        setLoading(true)
        try {
            const params = new URLSearchParams({
                type: activeTab,
                reference: trimmed,
                token: auth.token,
                apiKey: auth.apiKey,
            })

            const res = await fetch(`${API_URL}/track?${params}`)
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || data.message || `Tracking failed (${res.status})`)
                return
            }

            setResult(data)
        } catch (err) {
            setError('Network error — is the proxy server running on port 4000?')
        } finally {
            setLoading(false)
        }
    }

    // Find the event_id of the selected normalized event in the original JSON
    function findEventIdForIndex(idx) {
        if (idx === null || !rawEvents[idx]) return null
        // _raw is camelCase — get eventId
        const raw = rawEvents[idx]._raw
        return raw?.eventId || null
    }

    // Build raw JSON with per-event highlighting
    function renderRawJson() {
        if (!result) return null

        const fullJson = JSON.stringify(result, null, 2)

        if (selectedEventIndex === null || rawEvents.length === 0) {
            return (
                <pre className="bg-[#f5f7fa] border border-gray-200 rounded-md p-4 text-xs font-mono text-gray-700 whitespace-pre-wrap break-words">
                    {fullJson}
                </pre>
            )
        }

        const eventId = findEventIdForIndex(selectedEventIndex)
        if (!eventId) {
            return (
                <pre className="bg-[#f5f7fa] border border-gray-200 rounded-md p-4 text-xs font-mono text-gray-700 whitespace-pre-wrap break-words">
                    {fullJson}
                </pre>
            )
        }

        // Find the event block in the original JSON by searching for its event_id
        // The event_id appears as: "event_id": "xxxx"
        const idMarker = `"event_id": "${eventId}"`
        const idPos = fullJson.indexOf(idMarker)
        if (idPos === -1) {
            return (
                <pre className="bg-[#f5f7fa] border border-gray-200 rounded-md p-4 text-xs font-mono text-gray-700 whitespace-pre-wrap break-words">
                    {fullJson}
                </pre>
            )
        }

        // Walk backwards from idPos to find the opening { of this event object
        let braceStart = idPos
        while (braceStart > 0 && fullJson[braceStart] !== '{') braceStart--

        // Walk forward to find the matching closing } by counting braces
        let depth = 0
        let braceEnd = braceStart
        for (let i = braceStart; i < fullJson.length; i++) {
            if (fullJson[i] === '{') depth++
            if (fullJson[i] === '}') depth--
            if (depth === 0) {
                braceEnd = i + 1
                break
            }
        }

        const before = fullJson.slice(0, braceStart)
        const match = fullJson.slice(braceStart, braceEnd)
        const after = fullJson.slice(braceEnd)

        return (
            <pre className="bg-[#f5f7fa] border border-gray-200 rounded-md p-4 text-xs font-mono text-gray-700 whitespace-pre-wrap break-words">
                {before}
                <span
                    ref={(el) => {
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }}
                    className="bg-amber-100 border-l-2 border-amber-400 -ml-px pl-px"
                >
                    {match}
                </span>
                {after}
            </pre>
        )
    }

    return (
        <div className="h-screen bg-[#f5f7fa] flex flex-col overflow-hidden">
            {/* Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
                <span className="text-lg font-bold text-[#1a3c6e] tracking-tight">Oceanio Tracker</span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        Connected
                    </div>
                    <button
                        onClick={onDisconnect}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        Disconnect
                    </button>
                </div>
            </nav>

            {/* Search Section */}
            <div className="bg-white border-b border-gray-200 shrink-0">
                <div className="max-w-4xl mx-auto px-6 pt-5 pb-6">
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-200 mb-5">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key)
                                    setError('')
                                    setResult(null)
                                    setSelectedEventIndex(null)
                                }}
                                className={`pb-2.5 text-sm font-medium transition-colors relative cursor-pointer ${activeTab === tab.key
                                    ? 'text-[#1a3c6e]'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.key && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a3c6e] rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Input + Button */}
                    <form onSubmit={handleTrack}>
                        <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder={currentTab?.placeholder}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/30 focus:border-[#1a3c6e] transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-3 bg-[#1a3c6e] text-white py-2.5 rounded-md text-sm font-semibold hover:bg-[#15325c] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {loading ? 'Tracking...' : 'Track Shipment'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section — two scrollable panels */}
            {result && (
                <div className="flex-1 flex max-w-7xl mx-auto w-full min-h-0 overflow-hidden">
                    {/* Left: DCSA View — scrollable box */}
                    <div className="flex-1 flex flex-col border-r border-gray-200 min-h-0">
                        <div className="px-6 pt-4 pb-2 shrink-0">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Shipment Events (DCSA)
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 pb-6">
                            <DCSAView
                                data={result}
                                selectedIndex={selectedEventIndex}
                                onSelectEvent={setSelectedEventIndex}
                            />
                        </div>
                    </div>

                    {/* Right: Raw JSON — scrollable box */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="px-6 pt-4 pb-2 shrink-0 flex items-center justify-between">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Raw API Response
                            </h2>
                            {selectedEventIndex !== null && (
                                <button
                                    onClick={() => setSelectedEventIndex(null)}
                                    className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    Clear selection
                                </button>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 pb-6" ref={rawJsonRef}>
                            {renderRawJson()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
