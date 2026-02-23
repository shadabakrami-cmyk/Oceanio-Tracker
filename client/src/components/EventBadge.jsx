const COLOR_MAP = {
    TRANSPORT: 'bg-blue-100 text-blue-700',
    EQUIPMENT: 'bg-emerald-100 text-emerald-700',
    SHIPMENT: 'bg-purple-100 text-purple-700',
}

export default function EventBadge({ code, eventType }) {
    const colorClass = COLOR_MAP[eventType] || 'bg-gray-100 text-gray-600'

    return (
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${colorClass}`}>
            {code}
        </span>
    )
}
