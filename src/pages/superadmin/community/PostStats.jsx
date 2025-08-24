// components/PostStats.jsx
import React from 'react';

export default function PostStats({ stats }) {
    // Handle different possible stat structures
    const likes = stats?.likes || stats?.likes_count || 0;
    const comments = stats?.comments || stats?.comments_count || 0;

    const infoItems = [
        { label: 'عدد التعليقات', value: comments },
        { label: 'عدد الإعجابات', value: likes },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {infoItems.map(item => (
                    <div key={item.label}>
                        <p className="text-md pb-1 text-gray-900 font-semibold">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}