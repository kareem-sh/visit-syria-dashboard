import React from "react";
import { FaStar } from "react-icons/fa";

const CommentsSection = ({ comments, status=null }) => {
    return (
        <div className="card flex-1 overflow-y-auto flex flex-col gap-4 p-4">
            {status === "لم تبدأ بعد" || status === "تم الإلغاء" ? (
                <div className="flex flex-1 items-center justify-center text-gray-500 text-lg font-semibold">
                    هذه الرحلة لم تبدأ بعد
                </div>
            ) : (
                comments.map((comment, idx) => (
                    <div
                        key={idx}
                        className="flex items-start justify-between gap-4 p-2"
                    >
                        {/* Avatar + Text on the left */}
                        <div className="flex flex-col items-start flex-1">
                            <div className="flex items-center gap-2">
                                <img
                                    src={comment.user_avatar || `https://i.pravatar.cc/150?img=${idx + 10}`}
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h4 className="font-semibold text-sm">{comment.user_name}</h4>
                                    <span className="text-xs text-gray-400">{comment.created_at}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">{comment.body}</p>
                        </div>

                        {/* Rating on the right */}
                        <div className="flex items-center text-yellow-500 text-sm gap-1 min-w-[60px]">
                            <FaStar />
                            <span>{comment.rating_value || "4.5"}/5</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default CommentsSection;
