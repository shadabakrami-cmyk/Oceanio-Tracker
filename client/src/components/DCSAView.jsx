import { normalizeResponse } from '../utils/normalizeResponse'

// ─── DCSA Event Type Code → Human-Readable Label ──────────────────────────────
const EVENT_CODE_LABELS = {
    ARRI: 'Arrived',
    DEPA: 'Departed',
    LOAD: 'Loaded',
    DISC: 'Discharged',
    GTIN: 'Gate In',
    GTOT: 'Gate Out',
    STUF: 'Stuffed',
    STRP: 'Stripped',
    PICK: 'Picked Up',
    DROP: 'Dropped Off',
    INSP: 'Inspected',
    MALU: 'Malfunction',
    BOOT: 'Booked',
    CONF: 'Confirmed',
    RECE: 'Received',
    REJE: 'Rejected',
    SURR: 'Surrendered',
    SUBM: 'Submitted',
    ISSU: 'Issued',
    AVAV: 'Available',
    CANN: 'Cancelled',
    HOLD: 'On Hold',
    RELS: 'Released',
    TRSH: 'Transshipped',
}

const LEG_TYPE_LABELS = {
    PRE_SHIPMENT: 'Pre-Shipment',
    PRE_OCEAN: 'Pre-Ocean',
    OCEAN: 'Ocean',
    POST_OCEAN: 'Post-Ocean',
    POST_SHIPMENT: 'Post-Shipment',
}

const TRANSPORT_CALL_TYPE_LABELS = {
    PORT_OF_LOADING: 'Port of Loading',
    PORT_OF_DESTINATION: 'Port of Destination',
    TRANSSHIPMENT_PORT: 'Transshipment Port',
    INTERMEDIATE_PORT: 'Intermediate Port',
    DEPOT_RELEASE_LOCATION: 'Depot Release',
    DEPOT_RETURN_LOCATION: 'Depot Return',
}

// ─── SVG Symbols ──────────────────────────────────────────────────────────────

function TransportIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 shrink-0">
            <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7-4H7L2 8z" />
            <path d="M2 8h20" />
            <path d="M12 4v4" />
        </svg>
    )
}

function EquipmentIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 shrink-0">
            <rect x="1" y="4" width="22" height="14" rx="2" />
            <path d="M1 10h22" />
            <circle cx="7" cy="21" r="1" />
            <circle cx="17" cy="21" r="1" />
        </svg>
    )
}

function ShipmentIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 shrink-0">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
    )
}

function LocationPin() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}

function VesselSvg() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
            <path d="M2 20l.9-4A3 3 0 0 1 5.8 14H18.2a3 3 0 0 1 2.9 2l.9 4" />
            <path d="M4 14V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8" />
            <path d="M12 4v4" />
        </svg>
    )
}

function CalendarSvg() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
    )
}

function TruckSvg() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
            <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    )
}

function AnchorSvg() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
            <circle cx="12" cy="5" r="3" /><line x1="12" y1="22" x2="12" y2="8" />
            <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        </svg>
    )
}

const EVENT_TYPE_ICON = {
    TRANSPORT: TransportIcon,
    EQUIPMENT: EquipmentIcon,
    SHIPMENT: ShipmentIcon,
}

const EVENT_TYPE_LABEL = {
    TRANSPORT: 'Transport Event',
    EQUIPMENT: 'Equipment Event',
    SHIPMENT: 'Shipment Event',
}

const DOT_COLORS = {
    TRANSPORT: 'bg-blue-500',
    EQUIPMENT: 'bg-emerald-500',
    SHIPMENT: 'bg-purple-500',
}

const RING_COLORS = {
    TRANSPORT: 'ring-blue-200',
    EQUIPMENT: 'ring-emerald-200',
    SHIPMENT: 'ring-purple-200',
}

const SELECTED_BG = {
    TRANSPORT: 'bg-blue-50 border-blue-200',
    EQUIPMENT: 'bg-emerald-50 border-emerald-200',
    SHIPMENT: 'bg-purple-50 border-purple-200',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getEventCode(event) {
    return (
        event.transportEventTypeCode ||
        event.equipmentEventTypeCode ||
        event.shipmentEventTypeCode ||
        null
    )
}

function getEventLabel(code) {
    if (!code) return null
    return EVENT_CODE_LABELS[code] || code
}

function formatDateTime(raw) {
    if (!raw) return null
    try {
        return new Date(raw).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return raw
    }
}

function getModeIcon(mode) {
    if (!mode) return null
    if (mode === 'VESSEL') return VesselSvg
    if (mode === 'TRUCK') return TruckSvg
    return AnchorSvg
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DCSAView({ data, selectedIndex, onSelectEvent }) {
    const parsed = normalizeResponse(data)

    if (parsed.totalEvents === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No events found for this reference.
            </div>
        )
    }

    return (
        <div>
            {/* Metadata Bar */}
            {parsed.metadata?.identifier && (
                <div className="bg-white border border-gray-200 rounded-md px-4 py-3 mb-4 text-xs">
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-semibold text-gray-800">{parsed.metadata.identifier}</span>
                        {parsed.metadata.transportStatus && (
                            <span className={`px-2 py-0.5 rounded font-semibold ${parsed.metadata.transportStatus === 'COMPLETED'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                {parsed.metadata.transportStatus}
                            </span>
                        )}
                        {parsed.metadata.identifierType && (
                            <span className="text-gray-400">
                                {parsed.metadata.identifierType.replace(/_/g, ' ')}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Summary Bar */}
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-md px-4 py-2.5 mb-5 text-xs text-gray-600 flex-wrap">
                <span className="font-semibold text-gray-800">{parsed.totalEvents} events</span>
                <span className="w-px h-4 bg-gray-300" />
                {parsed.transportEvents.length > 0 && (
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                        Transport: {parsed.transportEvents.length}
                    </span>
                )}
                {parsed.equipmentEvents.length > 0 && (
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        Equipment: {parsed.equipmentEvents.length}
                    </span>
                )}
                {parsed.shipmentEvents.length > 0 && (
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                        Shipment: {parsed.shipmentEvents.length}
                    </span>
                )}
            </div>

            {/* Timeline */}
            <div className="relative">
                {parsed.allEvents.map((event, idx) => {
                    const dotColor = DOT_COLORS[event.eventType] || 'bg-gray-400'
                    const ringColor = RING_COLORS[event.eventType] || 'ring-gray-200'
                    const isLast = idx === parsed.allEvents.length - 1
                    const isSelected = selectedIndex === idx
                    const TypeIcon = EVENT_TYPE_ICON[event.eventType] || TransportIcon
                    const typeLabel = EVENT_TYPE_LABEL[event.eventType] || 'Event'
                    const code = getEventCode(event)
                    const label = getEventLabel(code)
                    const dateTime = formatDateTime(event.eventDateTime)
                    const location = event.transportCall?.location?.locationName
                    const facility = event.transportCall?.location?.facilityName
                    const locode = event.transportCall?.location?.locode
                    const vesselName = event.transportCall?.vessel?.vesselName
                    const voyage = event.transportCall?.carrierVoyageNumber
                    const mode = event.transportCall?.modeOfTransport
                    const callType = event.transportCall?.transportCallType
                    const ModeIcon = getModeIcon(mode)
                    const legLabel = LEG_TYPE_LABELS[event.legType]
                    const callTypeLabel = TRANSPORT_CALL_TYPE_LABELS[callType]

                    return (
                        <div key={idx} className="flex gap-3 relative">
                            {/* Dot + Line */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-3 h-3 rounded-full mt-2 shrink-0 ${dotColor} ${isSelected ? `ring-4 ${ringColor}` : ''
                                        }`}
                                />
                                {!isLast && <div className="w-px flex-1 bg-gray-200 min-h-[24px]" />}
                            </div>

                            {/* Event Card */}
                            <button
                                onClick={() => onSelectEvent(isSelected ? null : idx)}
                                className={`mb-2 flex-1 min-w-0 text-left rounded-lg border px-4 py-3 transition-all cursor-pointer ${isSelected
                                        ? SELECTED_BG[event.eventType] || 'bg-gray-50 border-gray-300'
                                        : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                {/* Row 1: Icon + Type + Code Badge */}
                                <div className="flex items-center gap-2 mb-1">
                                    <TypeIcon />
                                    <span className="text-xs font-medium text-gray-500">{typeLabel}</span>
                                    {code && (
                                        <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                                            {code}
                                            {label && label !== code && (
                                                <span className="font-normal text-gray-400">/ {label}</span>
                                            )}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                {event.eventDescription && (
                                    <div className="text-sm font-medium text-gray-800 mb-1">
                                        {event.eventDescription}
                                    </div>
                                )}

                                {/* Classifier + Leg */}
                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-1.5 flex-wrap">
                                    {event.eventClassifierCode && (
                                        <span>
                                            {event.eventClassifierCode === 'ACT' && 'Actual'}
                                            {event.eventClassifierCode === 'PLN' && 'Planned'}
                                            {event.eventClassifierCode === 'EST' && 'Estimated'}
                                            {event.eventClassifierCode === 'REQ' && 'Requested'}
                                            {!['ACT', 'PLN', 'EST', 'REQ'].includes(event.eventClassifierCode) && event.eventClassifierCode}
                                        </span>
                                    )}
                                    {legLabel && (
                                        <>
                                            <span className="w-px h-3 bg-gray-200" />
                                            <span>{legLabel}</span>
                                        </>
                                    )}
                                    {event.legNumber && (
                                        <>
                                            <span className="w-px h-3 bg-gray-200" />
                                            <span>Leg {event.legNumber}</span>
                                        </>
                                    )}
                                    {callTypeLabel && (
                                        <>
                                            <span className="w-px h-3 bg-gray-200" />
                                            <span>{callTypeLabel}</span>
                                        </>
                                    )}
                                </div>

                                {/* Date/Time */}
                                {dateTime && (
                                    <div className="flex items-center gap-1.5 text-sm text-gray-700 mb-1">
                                        <CalendarSvg />
                                        {dateTime}
                                    </div>
                                )}

                                {/* Location + Locode */}
                                {(location || locode) && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <LocationPin />
                                        <span>
                                            {location}
                                            {locode && <span className="text-gray-400 ml-1">({locode})</span>}
                                        </span>
                                    </div>
                                )}

                                {/* Facility */}
                                {facility && facility !== location && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5 ml-[18px]">
                                        {facility}
                                    </div>
                                )}

                                {/* Vessel + Mode */}
                                {(vesselName || voyage || mode) && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                        {ModeIcon && <ModeIcon />}
                                        <span>
                                            {mode && <span className="text-gray-400">{mode}</span>}
                                            {vesselName && <span className="text-gray-600 font-medium">{mode ? ' — ' : ''}{vesselName}</span>}
                                            {voyage && <span className="text-gray-400"> / Voyage {voyage}</span>}
                                        </span>
                                    </div>
                                )}

                                {/* Equipment info */}
                                {event.equipmentReference && (
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 pt-1 border-t border-gray-100">
                                        <span>Container: <span className="text-gray-600 font-medium">{event.equipmentReference}</span></span>
                                        {event.isoEquipmentCode && <span>ISO: {event.isoEquipmentCode}</span>}
                                        {event.emptyIndicatorCode && (
                                            <span className={`px-1.5 py-0 rounded text-[10px] font-semibold ${event.emptyIndicatorCode === 'LADEN' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {event.emptyIndicatorCode}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
