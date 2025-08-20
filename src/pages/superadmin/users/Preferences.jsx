import React from 'react';

export default function Preferences({ prefs }) {
    const prefItems = [
        { label: 'ما هي الفصول التي تفضل السياحة فيها؟', value: prefs.season },
        { label: 'ما نوع الرحلات التي تفضلها؟', value: prefs.tripType },
        { label: 'ما المدة التي تفضلها للرحلة؟', value: prefs.duration },
        { label: 'ما هي المحافظات التي تفضل زيارتها؟', value: prefs.provinces },
    ];

    // Function to format array values with commas
    const formatValue = (value) => {
        if (Array.isArray(value)) {
            return value.join('، ');
        }
        return value || 'غير محدد';
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {prefItems.map(item => (
                    <div key={item.label}>
                        <p className="text-md text-gray-900 font-semibold">{item.label}</p>
                        <p className="text-sm text-gray-500">{formatValue(item.value)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}