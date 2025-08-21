// components/common/RequestsList.jsx
import React from "react";
import { ChevronLeft } from "lucide-react";
import CompanyProfile from "@/assets/icons/company/Company Profile.svg";
import Request from "@/assets/images/Request.png";

export default function RequestsList({ requests, selectedRequest, onSelectRequest }) {
    const isEmpty = !requests || requests.length === 0;

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex pt-4 flex-col max-h-[90vh]">
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
                <ul className="overflow-y-auto flex-grow space-y-4 pb-4">
                    {requests.map((request, idx) => {
                        const isSelected = selectedRequest?.license_number === request.license_number;
                        return (
                            <li
                                key={idx}
                                className={`flex items-center justify-between px-4 py-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                    isSelected
                                        ? "bg-green text-white"
                                        : " hover:bg-gray-100 text-gray-700"
                                }`}
                                onClick={() => onSelectRequest(request)}
                            >
                                <div className="flex items-center">
                                    <div className={`rounded-full mr-4 ml-2 ${isSelected ? 'bg-white/20' : 'bg-gray-200'}`}>
                                        <img
                                            src={request.image ?? CompanyProfile}
                                            alt={request.company_name}
                                            className={`w-16 h-16 rounded-full`}
                                        />
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
            )}
        </div>
    );
}