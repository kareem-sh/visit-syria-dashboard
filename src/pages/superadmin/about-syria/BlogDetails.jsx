// pages/BlogDetails.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import BlogForm from "@/components/dialog/BlogForm";
import CancelDialog from "@/components/Dialog/CancelDialog";
import { getArticleById, updateArticle, deleteArticle } from "@/services/blogs/blogsApi";

// Import icons from your assets
import pen from "@/assets/icons/event/pen.svg";
import bin from "@/assets/icons/event/bin.svg";

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Fetch blog from cache first, then API if not found
    const { data: blogResponse, isLoading, error } = useQuery({
        queryKey: ['article', id],
        queryFn: () => getArticleById(id),
        initialData: () => {
            // Check if the article exists in the articles cache
            const cachedArticles = queryClient.getQueryData(['articles']);

            if (cachedArticles?.data && Array.isArray(cachedArticles.data)) {
                const foundArticle = cachedArticles.data.find(article => article.id === parseInt(id));
                return foundArticle ? { data: foundArticle } : undefined;
            }
            return undefined;
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        enabled: !!id,
    });

    const blog = blogResponse?.data;

    // Update article mutation
    const updateArticleMutation = useMutation({
        mutationFn: ({ id, data }) => updateArticle(id, data),
        onMutate: async (variables) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries(['article', id]);
            await queryClient.cancelQueries(['articles']);

            // Snapshot the previous values
            const previousArticle = queryClient.getQueryData(['article', id]);
            const previousArticles = queryClient.getQueryData(['articles']);

            // Optimistically update the individual article cache
            if (previousArticle?.data) {
                queryClient.setQueryData(['article', id], {
                    ...previousArticle,
                    data: {
                        ...previousArticle.data,
                        title: variables.data.title,
                        body: variables.data.body,
                        tags: variables.data.tags,
                        updated_at: new Date().toISOString()
                    }
                });
            }

            // Optimistically update the articles list cache
            if (previousArticles?.data) {
                queryClient.setQueryData(['articles'], {
                    ...previousArticles,
                    data: previousArticles.data.map(article =>
                        article.id === parseInt(id)
                            ? {
                                ...article,
                                title: variables.data.title,
                                body: variables.data.body,
                                tags: variables.data.tags,
                                updated_at: new Date().toISOString()
                            }
                            : article
                    )
                });
            }

            return { previousArticle, previousArticles };
        },
        onSuccess: (response) => {
            try {
                // Handle different response structures - your API might return the data directly
                // instead of nested in a data property
                const updatedArticle = response?.data || response;

                if (updatedArticle) {
                    // Update individual article cache
                    queryClient.setQueryData(['article', id], { data: updatedArticle });

                    // Also update the articles list
                    queryClient.setQueryData(['articles'], (old) => {
                        if (old?.data && Array.isArray(old.data)) {
                            return {
                                ...old,
                                data: old.data.map(article =>
                                    article.id === parseInt(id) ? updatedArticle : article
                                )
                            };
                        }
                        return old;
                    });
                } else {
                    // If no updated data returned, invalidate to refetch
                    queryClient.invalidateQueries(['article', id]);
                    queryClient.invalidateQueries(['articles']);
                }

                toast.success("تم تعديل المقالة بنجاح");
                setIsEditDialogOpen(false);
            } catch (error) {
                console.error("Error updating cache:", error);
                // Fallback: invalidate queries to refetch fresh data
                queryClient.invalidateQueries(['article', id]);
                queryClient.invalidateQueries(['articles']);
                toast.success("تم تعديل المقالة بنجاح");
                setIsEditDialogOpen(false);
            }
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousArticle) {
                queryClient.setQueryData(['article', id], context.previousArticle);
            }
            if (context?.previousArticles) {
                queryClient.setQueryData(['articles'], context.previousArticles);
            }

            toast.error("فشل في تعديل المقالة");
            console.error("Update article error:", error);
        }
    });

    // Delete article mutation
    const deleteArticleMutation = useMutation({
        mutationFn: () => deleteArticle(id),
        onMutate: async () => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries(['articles']);

            // Snapshot the previous value
            const previousArticles = queryClient.getQueryData(['articles']);

            // Optimistically remove the article from the list
            if (previousArticles?.data) {
                queryClient.setQueryData(['articles'], {
                    ...previousArticles,
                    data: previousArticles.data.filter(article => article.id !== parseInt(id))
                });
            }

            return { previousArticles };
        },
        onSuccess: () => {
            toast.success(`تم حذف المقالة بنجاح`);
            navigate("/about-syria");
            setIsDeleteDialogOpen(false);
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousArticles) {
                queryClient.setQueryData(['articles'], context.previousArticles);
            }

            toast.error("فشل في حذف المقالة");
            console.error("Delete article error:", error);
        },
        onSettled: () => {
            // Invalidate queries to refetch fresh data
            queryClient.invalidateQueries(['articles']);
        }
    });

    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    }

    const handleDeleteConfirm = () => {
        deleteArticleMutation.mutate();
    }

    const handleEdit = () => {
        setIsEditDialogOpen(true);
    }

    const handleEditSubmit = (formData) => {
        const apiData = {
            title: formData.title,
            body: formData.description,
            tags: formData.categories
        };

        // If user uploaded a new image, include it
        if (formData.image && formData.image instanceof File) {
            apiData.image = formData.image;
        }
        // If user didn't change the image but there was an existing one
        else if (formData.existingImageUrl) {
            apiData.keepExistingImage = true;
        }

        updateArticleMutation.mutate({ id, data: apiData });
    }

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-xl text-gray-600">جاري تحميل المقالة...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-xl text-red-600">حدث خطأ في تحميل المقالة</p>
                <button
                    onClick={() => navigate("/about-syria")}
                    className="ml-4 bg-green text-white px-4 py-2 rounded-lg"
                >
                    العودة إلى المقالات
                </button>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-xl text-red-600">المقالة غير موجودة</p>
                <button
                    onClick={() => navigate("/about-syria")}
                    className="ml-4 bg-green text-white px-4 py-2 rounded-lg"
                >
                    العودة إلى المقالات
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen" dir="rtl">
            <div className="bg-white rounded-2xl shadow-sm p-6">
                {/* Blog Image */}
                <div className="w-full h-60 md:h-80 mb-6 rounded-xl overflow-hidden">
                    <img
                        src={blog.image_url || "https://images.pexels.com/photos/163016/water-wheel-mill-water-wheel-mill-wheel-163016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.pexels.com/photos/163016/water-wheel-mill-water-wheel-mill-wheel-163016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
                        }}
                    />
                </div>

                {/* Header section with Title and Action Buttons */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {blog.title}
                    </h1>
                    <div className="flex gap-3">
                        {/* Edit Button */}
                        <button
                            onClick={handleEdit}
                            disabled={updateArticleMutation.isLoading}
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-green text-body-bold-14 border-green border-2 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            تعديل المقالة
                            <img src={pen} alt="edit" className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={handleDelete}
                            disabled={deleteArticleMutation.isLoading}
                            className="flex items-center gap-2 px-5 py-2 rounded-full bg-red text-white text-body-bold-14 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            حذف المقالة
                            <img src={bin} alt="delete" className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Blog Body Content */}
                <article className="mb-8">
                    <p className="text-gray-700 leading-8 text-justify text-lg">
                        {blog.body}
                    </p>
                </article>

                {/* Categories/Tags */}
                <div className="flex flex-wrap gap-2">
                    {(blog.tags || []).map((category, index) => (
                        <span
                            key={index}
                            className="px-4 py-2 min-w-[80px] text-center bg-gray-100 text-green rounded-full text-body-regular-16 font-medium"
                        >
                            {category}
                        </span>
                    ))}
                </div>

                {/* Date and Author Info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">
                        <span className="font-medium">تاريخ النشر: </span>
                        {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-BG') : 'غير محدد'}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                        <span className="font-medium">آخر تحديث: </span>
                        {blog.updated_at ? new Date(blog.updated_at).toLocaleDateString('en-BG') : 'غير محدد'}
                    </p>
                </div>
            </div>

            {/* BlogForm Dialog for Editing */}
            <BlogForm
                open={isEditDialogOpen}
                onClose={handleCloseEditDialog}
                mode="edit"
                initialData={{
                    title: blog.title,
                    description: blog.body,
                    categories: blog.tags || [],
                    image_url: blog.image_url
                }}
                onSubmit={handleEditSubmit}
                isLoading={updateArticleMutation.isLoading}
            />

            {/* Delete Confirmation Dialog */}
            <CancelDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="حذف المقالة"
                message="هل أنت متأكد من رغبتك في حذف هذه المقالة؟ سيتم حذفها نهائياً."
                isLoading={deleteArticleMutation.isLoading}
            />
        </div>
    );
};

export default BlogDetails;