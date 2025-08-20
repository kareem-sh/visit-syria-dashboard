import React from 'react';

export default function PersonalInformation({ user }) {
    const infoItems = [
        { label: 'الرقم التعريفي', value: user.id },
        { label: 'الجنسية', value: user.nationality },
        { label: 'تاريخ الولادة', value: user.dob },
        { label: 'الجنس', value: user.gender },
        { label: 'البريد الإلكتروني', value: user.email },
        { label: 'رقم الهاتف', value: user.phone },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {infoItems.map(item => (
                    <div key={item.label}>
                        <p className="text-md text-gray-900 font-semibold">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.value || 'غير محدد'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}