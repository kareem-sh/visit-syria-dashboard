import React from "react";
import { FaStar } from "react-icons/fa";
import NoCommentsYet from "@/assets/images/No Comments Yet.png";
import UserProfileImage from "@/assets/images/User Profile.svg"

const CommentsSection = ({ comments = [], status = null ,showRatings =true}) => {
    // Check if there are no comments
    const noComments = !comments || comments.length === 0;
    const userImage = comments && comments.user
        ? (comments.user.profile_photo ?? comments.user.user_avatar ?? UserProfileImage)
        : UserProfileImage;
    return (
        <div className="card flex-1 overflow-y-auto flex flex-col gap-4 p-4">
            {status === "لم تبدأ بعد" || status === "تم الإلغاء" ? (
                <div className="flex flex-1 items-center justify-center text-gray-500 text-lg font-semibold">
                    هذه الرحلة لم تبدأ بعد
                </div>
            ) : noComments ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <img
                        src={NoCommentsYet}
                        alt="لا توجد تعليقات"
                        className="max-w-[180px] w-full mx-auto my-8"
                    />
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
                                    src={userImage}
                                    alt="avatar"
                                    className="w-11 h-11 rounded-full object-cover"
                                />
                                <div className="mt-2">
                                    <h4 className="text-body-bold-16">{comment.user_name || comment.user.name}</h4>
                                    <span className="text-body-regular-caption-12  text-grey-600">{comment.created_at}</span>
                                </div>
                            </div>
                            <p className="text-body-regular-16-auto mt-3 text-(--text-paragraph)">{comment.body || comment.comment}</p>
                        </div>
                        {showRatings && (
                        <div className="flex items-center text-yellow-500 text-sm gap-1 min-w-[60px]">
                            <FaStar />
                            <span>{comment.rating || "4.5"}/5</span>
                        </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default CommentsSection;