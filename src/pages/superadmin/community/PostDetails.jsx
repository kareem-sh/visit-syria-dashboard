// components/PostDetails.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import PostHeader from './PostHeader';
import PostStats from './PostStats';
import CommentsSection from '@/components/common/CommentsSection';
import ConfirmationDialog from '@/components/dialog/ConfirmationDialog';
import { getPostById, updatePostStatus } from '@/services/posts/postsApi.js';

const PostDetails = () => {
    const { id } = useParams();
    const postId = parseInt(id);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [actionType, setActionType] = useState(null);
    const queryClient = useQueryClient();

    // Check cache first, then fetch from API if not found
    const { data: postData, isLoading, error } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPostById(postId),
        initialData: () => {
            // Check if the post exists in the allPosts cache
            const cachedPosts = queryClient.getQueryData(['allPosts']);

            // Handle different possible cache structures
            if (cachedPosts) {
                // Case 1: cachedPosts is an array
                if (Array.isArray(cachedPosts)) {
                    return cachedPosts.find(post => post.id === postId);
                }
                // Case 2: cachedPosts has a data property that's an array (API response structure)
                else if (cachedPosts.data && Array.isArray(cachedPosts.data)) {
                    return cachedPosts.data.find(post => post.id === postId);
                }
                // Case 3: cachedPosts is an object with posts array
                else if (cachedPosts.posts && Array.isArray(cachedPosts.posts)) {
                    return cachedPosts.posts.find(post => post.id === postId);
                }
            }
            return undefined;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        enabled: !!postId,
    });

    // Mutation for updating post status
    const updatePostStatusMutation = useMutation({
        mutationFn: ({ postId, status, reason }) => updatePostStatus(postId, status, reason),
        onMutate: async ({ postId, status }) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries(['post', postId]);
            await queryClient.cancelQueries(['allPosts']);

            // Snapshot the previous values
            const previousPost = queryClient.getQueryData(['post', postId]);
            const previousAllPosts = queryClient.getQueryData(['allPosts']);

            // Optimistically update the individual post cache
            if (previousPost) {
                queryClient.setQueryData(['post', postId], {
                    ...previousPost,
                    status: status
                });
            }

            // Optimistically update the allPosts cache
            if (previousAllPosts?.data) {
                queryClient.setQueryData(['allPosts'], {
                    ...previousAllPosts,
                    data: previousAllPosts.data.map(post =>
                        post.id === postId ? { ...post, status } : post
                    )
                });
            }

            return { previousPost, previousAllPosts };
        },
        onSuccess: (data, variables) => {
            // Show success toast
            const message = variables.status === 'Approved'
                ? 'تم قبول المنشور بنجاح'
                : 'تم رفض المنشور بنجاح';
            toast.success(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Invalidate queries to refetch fresh data
            queryClient.invalidateQueries(['post', postId]);
            queryClient.invalidateQueries(['allPosts']);
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousPost) {
                queryClient.setQueryData(['post', postId], context.previousPost);
            }
            if (context?.previousAllPosts) {
                queryClient.setQueryData(['allPosts'], context.previousAllPosts);
            }

            // Show error toast
            toast.error('فشل في تحديث حالة المنشور', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.error("Failed to update post status:", error);
        }
    });

    const handleAccept = () => {
        setActionType('accept');
        setShowConfirmDialog(true);
    };

    const handleReject = () => {
        setActionType('reject');
        setShowConfirmDialog(true);
    };

    const handleConfirmAction = async (reason) => {
        if (!postId) return;

        try {
            if (actionType === 'accept') {
                // Update post status to Approved
                await updatePostStatusMutation.mutateAsync({
                    postId: postId,
                    status: 'Approved'
                });

            } else if (actionType === 'reject') {
                // Update post status to Rejected
                await updatePostStatusMutation.mutateAsync({
                    postId: postId,
                    status: 'Rejected',
                    reason: reason
                });
            }

        } catch (error) {
            // Error is already handled in the mutation
            console.error("Failed to update post status:", error);
        } finally {
            setShowConfirmDialog(false);
            setActionType(null);
        }
    };

    // Debug: Check what's in the cache
    React.useEffect(() => {
        const cachedPosts = queryClient.getQueryData(['allPosts']);
        console.log('Cache structure for allPosts:', cachedPosts);
    }, [queryClient]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-red text-body-regular-20-auto">
                    حدث خطأ في تحميل المنشور. يرجى المحاولة مرة أخرى.
                </p>
                <p className="text-gray-600 text-sm mt-2">{error.message}</p>
            </div>
        );
    }

    // No post found
    if (!postData) {
        return (
            <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600 text-body-regular-20-auto">
                    المنشور غير موجود.
                </p>
            </div>
        );
    }

    // Map API data structure to component expected structure
    const mappedPostData = {
        id: postData.id,
        author: postData.user?.name || 'مستخدم غير معروف',
        authorImage: postData.user?.profile_photo || 'https://i.pravatar.cc/150?img=1',
        title: postData.description?.substring(0, 30) + '...' || 'بدون عنوان',
        mainImage: postData.image || 'https://placehold.co/800x400/cccccc/333333?text=صورة+غير+متوفرة',
        description: postData.description || 'لا يوجد وصف',
        tags: postData.tags || [],
        status: postData.status === 'Approved' ? 'مقبول' :
            postData.status === 'Rejected' ? 'مرفوض' :
                postData.status === 'Pending' ? 'في الانتظار' : postData.status,
        stats: {
            likes: postData.likes_count || 0,
            comments: postData.comments_count || 0,
        },
        created_at: postData.created_at
    };

    const isApproved = mappedPostData.status === "مقبول";

    return (
        <div className="space-y-6">
            {/* Post Content Card */}
            <div className="bg-white rounded-xl">
                <PostHeader
                    author={mappedPostData.author}
                    authorImage={mappedPostData.authorImage}
                    status={mappedPostData.status}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    isLoading={updatePostStatusMutation.isLoading}
                />

                <main className="p-6">
                    {/* Main Image */}
                    <div className="mb-6">
                        <img
                            src={mappedPostData.mainImage}
                            alt={mappedPostData.title}
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
                            {mappedPostData.description}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap justify-start gap-2 mb-6">
                        {mappedPostData.tags.map(tag => (
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
                    <PostStats stats={mappedPostData.stats} />
                </div>
            )}

            {/* Comments Section - Only show if approved */}
            {isApproved && postData.comments && postData.comments.length > 0 && (
                <div>
                    <h1 className="text-h1-bold-24 mb-4 pr-2">التعليقات</h1>
                    <div className="max-h-[500px] overflow-y-auto">
                        <CommentsSection
                            comments={postData.comments}
                            status={mappedPostData.status}
                            showRatings={false}
                            title={`التعليقات (${postData.comments.length})`}
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
                isLoading={updatePostStatusMutation.isLoading}
            />
        </div>
    );
};

export default PostDetails;