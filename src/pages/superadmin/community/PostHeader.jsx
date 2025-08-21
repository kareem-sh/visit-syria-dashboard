// components/PostHeader.jsx
import React from 'react';
import UserProfile from "@/assets/images/User Profile.svg";
import Approve from "@/assets/icons/common/approve.svg";
import Decline from "@/assets/icons/common/decline.svg";

const PostHeader = ({ author, authorImage, status, onAccept, onReject }) => {
    const isPending = status === "في الانتظار";

    return (
        <header className="flex p-4 bg-white gap-3 items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="flex items-start px-2">
                    <img
                        src={authorImage ?? UserProfile}
                        alt={author}
                        className="w-16 h-16 rounded-full object-cover border border-gray-200"
                    />
                </div>
                <div className="text-left">
                    <span className="text-h1-bold-32 block">{author}</span>
                </div>
            </div>

            {/* Action Buttons - Only show for pending posts */}
            {isPending && (
                <div className="flex gap-2">
                    {/* Accept Button */}
                    <button
                        onClick={onAccept}
                        className="flex items-center justify-center gap-1 rounded-xl px-8 cursor-pointer py-1.5 text-white font-bold text-sm transition-opacity hover:opacity-90 bg-green"
                    >
                        <span>قبول</span>
                        <img src={Approve} alt="Approve" className="w-4 h-4" />

                    </button>

                    {/* Reject Button */}
                    <button
                        onClick={onReject}
                        className="flex items-center justify-center gap-1 rounded-xl px-8 py-1.5 cursor-pointer text-white font-bold text-sm transition-opacity hover:opacity-90 bg-red-500"
                    >
                        <span>رفض</span>
                        <img src={Decline} alt="Decline" className="w-4 h-4" />

                    </button>
                </div>
            )}
        </header>
    );
};

export default PostHeader;