// components/common/CommunityRequestsList.jsx
import React from "react";
import { ChevronLeft } from "lucide-react";
import PostImage from "@/assets/icons/community/Post Image.svg";
import Request from "@/assets/images/Request.png"; // Make sure to import the image

export default function CommunityRequestsList({ requests, selectedRequest, onSelectRequest }) {
    // Function to format date to YYYY-MM-DD
    const formatDate = (dateString) => {
        if (!dateString) return '';

        // Parse the date string (assuming it's in a valid format)
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) return dateString;

        // Format as YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const isEmpty = !requests || requests.length === 0;

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex flex-col overflow-hidden">
            {isEmpty ? (
                // Empty state
                <div className="flex flex-col items-center justify-center h-full p-6 gap-6">
                    <img
                        src={Request}
                        alt="لا يوجد طلبات"
                        className="max-w-[170px] w-full mx-auto mb-4"
                    />
                    <p className="text-gray-500 text-body-regular-20-auto text-center">
                        لا يوجد طلبات معلقة
                    </p>
                </div>
            ) : (
                // Requests list
                <ul className="overflow-y-auto flex-grow space-y-4 py-4" style={{ maxHeight: '100%' }}>
                    {requests.map((request, idx) => {
                        const isSelected = selectedRequest?.license_number === request.license_number;
                        return (
                            <li
                                key={idx}
                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                    isSelected
                                        ? "bg-green text-white"
                                        : "hover:bg-gray-100 text-gray-700"
                                }`}
                                onClick={() => onSelectRequest(request)}
                            >
                                <div className="flex items-center">
                                    <div className={`rounded-full mr-4 ml-2 ${isSelected ? 'bg-white/20' : ''}`}>
                                        <img
                                            src={request.image ?? PostImage}
                                            alt={request.company_name}
                                            className="w-16 h-16 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = PostImage;
                                            }}
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold truncate">{request.name}</p>
                                        <p className={`text-xs mt-1 ${isSelected ? 'text-green-100' : 'text-gray-500'}`}>
                                            {formatDate(request.date)}
                                        </p>
                                    </div>
                                </div>
                                <ChevronLeft className={`w-6 h-6 transition-transform duration-200 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}