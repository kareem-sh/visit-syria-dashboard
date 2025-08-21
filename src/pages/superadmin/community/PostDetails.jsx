// components/PostDetails.jsx
import React, { useState } from 'react';
import PostHeader from './PostHeader';
import PostStats from './PostStats';
import CommentsSection from '@/components/common/CommentsSection';
import ConfirmationDialog from '@/components/dialog/ConfirmationDialog';

// Mock data - compatible with both post and trip comment structures
const mockPostData = {
    id: 1,
    title: "باب شريف في دمشق",
    author: "أحمد محسن",
    authorImage: "https://i.pravatar.cc/150?img=1",
    mainImage: "https://placehold.co/800x400/a7c4a0/333333?text=باب+شريف+في+دمشق",
    description: "باب شريف في دمشق مغلق الآن يمزج بين التاريخ والحياة اليومية. الأسواق القديمة والأزقة الضيقة تمنحك تجربة فريدة والناس ودودون. أنصح بزيارة الحمامات والمتاحف التقليدية للاستمتاع بالثقافة الشامية الحقيقية.",
    tags: ["تاريخية", "ثقافية", "معمارية", "تراث", "دمشق", "سوريا"],
    stats: {
        likes: 89,
        comments: 23,
    },
    status: "مقبول", // Added status for consistency
    created_at: "2023-11-15" // Added creation date
};

// Mock comments data that works with universal CommentsSection
const mockComments = [
    {
        id: 1,
        user_name: "شادي",
        created_at: "2023-11-15",
        body: "باب شريف في دمشق مغلق الآن يمزج بين التاريخ والحياة اليومية. الأسواق القديمة والأزقة الضيقة تمنحك تجربة فريدة.",
        author: "شادي", // Alternative field name
        date: "2023-11-15", // Alternative field name
        text: "باب شريف في دمشق مغلق الآن يمزج بين التاريخ والحياة اليومية. الأسواق القديمة والأزقة الضيقة تمنحك تجربة فريدة.", // Alternative field name
        user_avatar: "https://i.pravatar.cc/150?img=10",
        authorImage: "https://i.pravatar.cc/150?img=10", // Alternative field name
    },
    {
        id: 2,
        user_name: "شذى",
        created_at: "2023-11-15",
        body: "أنصح بزيارة الحمامات والمتاحف التقليدية للاستمتاع بالثقافة الشامية الحقيقية.",
        author: "شذى",
        date: "2023-11-15",
        text: "أنصح بزيارة الحمامات والمتاحف التقليدية للاستمتاع بالثقافة الشامية الحقيقية.",
        user_avatar: "https://i.pravatar.cc/150?img=11",
        authorImage: "https://i.pravatar.cc/150?img=11"
    },
    {
        id: 3,
        user_name: "علي",
        created_at: "2023-11-14",
        body: "دمشق مدينة رائعة بتراثها العريق وتاريخها الغني.",
        author: "علي",
        date: "2023-11-14",
        text: "دمشق مدينة رائعة بتراثها العريق وتاريخها الغني.",
        user_avatar: "https://i.pravatar.cc/150?img=12",
        authorImage: "https://i.pravatar.cc/150?img=12"
    },
    {
        id: 4,
        user_name: "فاطمة",
        created_at: "2023-11-14",
        body: "الأزقة الضيقة تمنحك تجربة فريدة والناس ودودون.",
        author: "فاطمة",
        date: "2023-11-14",
        text: "الأزقة الضيقة تمنحك تجربة فريدة والناس ودودون.",
        user_avatar: "https://i.pravatar.cc/150?img=13",
        authorImage: "https://i.pravatar.cc/150?img=13"
    },
    {
        id: 5,
        user_name: "خالد",
        created_at: "2023-11-13",
        body: "أنصح الجميع بزيارة هذه الأماكن التاريخية.",
        author: "خالد",
        date: "2023-11-13",
        text: "أنصح الجميع بزيارة هذه الأماكن التاريخية.",
        user_avatar: "https://i.pravatar.cc/150?img=14",
        authorImage: "https://i.pravatar.cc/150?img=14"
    },
    {
        id: 6,
        user_name: "نورا",
        created_at: "2023-11-13",
        body: "تجربة رائعة وتستحق الزيارة مرة أخرى.",
        author: "نورا",
        date: "2023-11-13",
        text: "تجربة رائعة وتستحق الزيارة مرة أخرى.",
        user_avatar: "https://i.pravatar.cc/150?img=15",
        authorImage: "https://i.pravatar.cc/150?img=15"
    },
    {
        id: 7,
        user_name: "ياسر",
        created_at: "2023-11-12",
        body: "المكان جميل والخدمة ممتازة.",
        author: "ياسر",
        date: "2023-11-12",
        text: "المكان جميل والخدمة ممتازة.",
        user_avatar: "https://i.pravatar.cc/150?img=16",
        authorImage: "https://i.pravatar.cc/150?img=16"
    }
];

const PostDetails = () => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [actionType, setActionType] = useState(null);
    const isApproved = mockPostData.status === "مقبول";

    const handleAccept = () => {
        setActionType('accept');
        setShowConfirmDialog(true);
    };

    const handleReject = () => {
        setActionType('reject');
        setShowConfirmDialog(true);
    };

    const handleConfirmAction = (reason) => {
        if (actionType === 'accept') {
            console.log("Accepting post:", mockPostData.id);
            // Add your accept logic here
        } else if (actionType === 'reject') {
            console.log("Rejecting post:", mockPostData.id, "Reason:", reason);
            // Add your reject logic here
        }
        setShowConfirmDialog(false);
        setActionType(null);
    };

    return (
        <div className="space-y-6">
            {/* Post Content Card */}
            <div className="bg-white rounded-xl">
                <PostHeader
                    author={mockPostData.author}
                    authorImage={mockPostData.authorImage}
                    status={mockPostData.status}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />

                <main className="p-6">
                    {/* Main Image */}
                    <div className="mb-6">
                        <img
                            src={mockPostData.mainImage}
                            alt={mockPostData.title}
                            className="w-full h-auto object-cover rounded-xl"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src='https://placehold.co/800x400/cccccc/333333?text=صورة+غير+متوفرة';
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div className="text-right text-gray-600 mb-6 leading-relaxed">
                        <p className="text-body-regular-20-auto">
                            {mockPostData.description}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap justify-start gap-2 mb-6">
                        {mockPostData.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1.5 min-w-[80px] text-center bg-gray-100 text-green rounded-full text-body-regular-16 font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </main>
            </div>

            {/* Stats Section - Only show if approved */}
            {isApproved && (
                <div>
                    <h1 className="text-h1-bold-24 mb-4 pr-2">إحصائيات المنشور</h1>
                    <PostStats stats={mockPostData.stats} />
                </div>
            )}

            {/* Comments Section - Only show if approved */}
            {isApproved && (
                <div>
                    <h1 className="text-h1-bold-24 mb-4 pr-2">التعليقات</h1>
                    <div className="max-h-[500px] overflow-y-auto">
                        <CommentsSection
                            comments={mockComments}
                            status={mockPostData.status}
                            showRatings={false}
                            title={`التعليقات (${mockComments.length})`}
                        />
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleConfirmAction}
                title={actionType === 'accept' ? "تأكيد القبول" : "تأكيد الرفض"}
                message={actionType === 'accept'
                    ? "هل أنت متأكد من قبول هذا المنشور؟"
                    : "هل أنت متأكد من رفض هذا المنشور؟"}
                confirmText={actionType === 'accept' ? "قبول" : "رفض"}
                confirmColor={actionType === 'accept' ? "green" : "red"}
                showTextInput={actionType === 'reject'}
                textInputLabel="سبب الرفض"
                textInputPlaceholder="يرجى كتابة سبب الرفض"
                requiredTextInput={actionType === 'reject'}
            />
        </div>
    );
};

export default PostDetails;