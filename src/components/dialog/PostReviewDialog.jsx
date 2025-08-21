// components/dialog/PostReviewDialog.jsx
import React from 'react';
import { X } from 'lucide-react';
import Approve from "@/assets/icons/common/approve.svg";
import Decline from "@/assets/icons/common/decline.svg";

// The main Dialog component
const PostReviewDialog = ({ request, isOpen, onClose, onAccept, onReject }) => {
    if (!isOpen) return null;

    // Format date for display in DD-MM-YYYY format (reversed)
    const formatDate = (dateString) => {
        if (!dateString) return '';

        // Parse the date string
        const date = new Date(dateString);

        // Format as DD-MM-YYYY (reversed)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${day}-${month}-${year}`;
    };

    return (
        // Overlay: Fills the entire screen with a semi-transparent background
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
            {/* Dialog Box: The main container for the dialog content - made scrollable */}
            <div
                className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl relative flex flex-col max-h-[90vh] overflow-y-auto"
                dir="rtl" // Sets the text direction to right-to-left for Arabic
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="flex justify-between items-start pb-4">
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-slate-800">المنشور</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            تاريخ تقديم الطلب: {request ? formatDate(request.date) : ''}
                        </p>
                    </div>
                    {/* Close Button */}
                    <button
                        className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex-shrink-0"
                        onClick={onClose}
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="space-y-5">
                    {/* User Information Section - Image next to name */}
                    <div className="flex items-center justify-start gap-3">
                        <img
                            src={request?.userImage || request?.image || "https://i.imgur.com/G4PCD8y.jpeg"}
                            alt={request?.name || "User image"}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/e2e8f0/475569?text=U'; }}
                        />
                        <span className="font-semibold text-slate-700">
                            {request?.name || ''}
                        </span>
                    </div>

                    {/* Main Post Image (different from user profile image) */}
                    <img
                        src={request?.images || request?.postImage || "https://i.imgur.com/G4PCD8y.jpeg"}
                        alt={request?.name || "Post image"}
                        className="rounded-xl w-full object-cover aspect-[16/9]"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x338/e2e8f0/475569?text=Image+Not+Found'; }}
                    />

                    {/* Description Text */}
                    <div>
                        <p className="text-slate-600 text-right leading-relaxed">
                            {request?.description || ""}
                        </p>
                    </div>

                    {/* Tags Section - Justified between with equal width */}
                    {request?.tags?.length > 0 && (
                        <div className="flex flex-wrap justify-start gap-8">
                            {request.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-100 text-green px-3 py-2.5 rounded-full text-body-bold-14 flex-1 text-center max-w-[130px]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons Section - With imported icons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 mt-4 border-t border-slate-200">
                    {/* Accept Button */}
                    <button
                        className="flex items-center justify-center shadow-md shadow-grey-400 gap-2 rounded-2xl cursor-pointer px-5 py-3 text-white font-bold text-base transition-opacity hover:opacity-90 bg-green"
                        onClick={onAccept}
                    >

                        قبول
                        <img src={Approve} alt="Approve" className="w-5 h-5" />
                    </button>
                    {/* Reject Button */}
                    <button
                        className="flex items-center justify-center gap-2 shadow-md shadow-grey-400  rounded-2xl cursor-pointer px-5 py-3 text-white font-bold text-base transition-opacity hover:opacity-90 bg-red-500"
                        onClick={onReject}
                    >

                        رفض
                        <img src={Decline} alt="Decline" className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostReviewDialog;