// components/common/RequestsList.jsx
import React from "react";
import { ChevronLeft } from "lucide-react"; // Import ChevronLeft for the arrow
import CompanyProfile from "@/assets/icons/company/Company Profile.svg";

export default function RequestsList({ requests, selectedRequest, onSelectRequest }) {
    return (
        <div className="bg-white rounded-lg shadow-md h-full flex pt-4 flex-col max-h-[90vh]">
            <ul className="overflow-y-auto flex-grow space-y-4 px-4 pb-4">
                {requests.map((request, idx) => {
                    const isSelected = selectedRequest?.license_number === request.license_number;
                    return (
                        <li
                            key={idx}
                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 shadow-sm ${
                                isSelected
                                    ? "bg-green text-white"
                                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => onSelectRequest(request)}
                        >
                            <div className="flex items-center">
                                <div className={`rounded-full mr-4 ml-2 ${isSelected ? 'bg-white/20' : 'bg-gray-200'}`}>
                                    <img src={request.images ?? CompanyProfile} alt={request.company_name} className={`w-16 h-16`} />
                                </div>
                                <div>
                                    <p className="font-semibold">{request.name}</p>
                                    <p className={`text-xs mt-1 ${isSelected ? 'text-green-100' : 'text-gray-500'}`}>
                                        {request.date}
                                    </p>
                                </div>
                            </div>
                            <ChevronLeft className={`w-6 h-6 transition-transform duration-200 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}