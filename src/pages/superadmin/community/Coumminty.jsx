// pages/Community.jsx
import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommunityRequestsList from "@/components/common/CommunityRequestsList";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import Chart from "@/components/common/Chart.jsx";
import PostReviewDialog from "@/components/dialog/PostReviewDialog";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";
import { getTopActiveUsers, getPosts, updatePostStatus } from "@/services/posts/postsApi";

export default function Community() {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [currentFilter, setCurrentFilter] = useState("الكل");
    const queryClient = useQueryClient();

    // React Query for fetching data - only two queries now
    const { data: topUsersData, isLoading: isLoadingTopUsers, error: topUsersError } = useQuery({
        queryKey: ['topActiveUsers'],
        queryFn: getTopActiveUsers,
        staleTime: 5 * 60 * 1000,
    });

    const { data: allPostsData, isLoading: isLoadingAllPosts, error: allPostsError } = useQuery({
        queryKey: ['allPosts'],
        queryFn: () => getPosts(), // This returns all posts with all statuses
        staleTime: 2 * 60 * 1000,
    });

    // Mutation for updating post status
    const updatePostStatusMutation = useMutation({
        mutationFn: ({ postId, status }) => updatePostStatus(postId, status),
        onMutate: async ({ postId, status }) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries(['allPosts']);

            // Snapshot the previous value
            const previousAllPosts = queryClient.getQueryData(['allPosts']);

            // Optimistically update the cache
            if (previousAllPosts?.data) {
                queryClient.setQueryData(['allPosts'], {
                    ...previousAllPosts,
                    data: previousAllPosts.data.map(post =>
                        post.id === postId ? { ...post, status } : post
                    )
                });
            }

            return { previousAllPosts };
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
        },
        onError: (error, variables, context) => {
            // Rollback on error
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
        },
        onSettled: () => {
            // Always refetch after error or success to ensure sync with server
            queryClient.invalidateQueries(['allPosts']);
        }
    });

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${day}-${month}-${year}`;
    };

    const handleSelectRequest = (request) => {
        setSelectedRequest(request);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedRequest(null);
    };

    const handleAcceptRequest = () => {
        setActionType('accept');
        setConfirmMessage("هل أنت متأكد من قبول هذا المنشور؟");
        setShowConfirmDialog(true);
    };

    const handleRejectRequest = () => {
        setActionType('reject');
        setConfirmMessage("هل أنت متأكد من رفض هذا المنشور؟");
        setShowConfirmDialog(true);
    };

    const handleConfirmAction = async (reason) => {
        if (!selectedRequest) return;

        try {
            if (actionType === 'accept') {
                // Update post status to Approved
                await updatePostStatusMutation.mutateAsync({
                    postId: selectedRequest.id,
                    status: 'Approved'
                });

            } else if (actionType === 'reject') {
                // Update post status to Rejected
                await updatePostStatusMutation.mutateAsync({
                    postId: selectedRequest.id,
                    status: 'Rejected',
                    reason: reason // Include reason if your API accepts it
                });
            }

        } catch (error) {
            // Error is already handled in the mutation
            console.error("Failed to update post status:", error);
        } finally {
            setShowConfirmDialog(false);
            setIsDialogOpen(false);
            setSelectedRequest(null);
            setActionType(null);
        }
    };

    // Transform API data for chart
    const chartData = useMemo(() => {
        if (!topUsersData?.data) {
            return { labels: [], values: [] };
        }

        return {
            labels: topUsersData.data.map(user => user.name),
            values: topUsersData.data.map(user => user.posts_count || user.activity_score || 0)
        };
    }, [topUsersData]);

    // Transform API data for table - all posts
    const tableData = useMemo(() => {
        if (!allPostsData?.data) return [];

        return allPostsData.data.map(post => ({
            id: post.id,
            name: post.user?.name || 'مستخدم غير معروف',
            postContent: post.description || 'لا يوجد محتوى',
            date: formatDate(post.created_at),
            status: post.status === 'Approved' ? 'مقبول' :
                post.status === 'Rejected' ? 'مرفوض' :
                    post.status === 'Pending' ? 'في الانتظار' : post.status,
            originalData: post
        }));
    }, [allPostsData]);

    // Filter pending posts from all posts data for CommunityRequestsList
    const pendingRequests = useMemo(() => {
        if (!allPostsData?.data) return [];

        return allPostsData.data
            .filter(post => post.status === 'Pending')
            .map(post => ({
                id: post.id,
                name: post.user?.name || 'مستخدم غير معروف',
                description: post.description,
                image: post.image,
                tags: post.tags,
                date: post.created_at,
                status: post.status,
                user: post.user
            }));
    }, [allPostsData]);

    // Filter options for the SortFilterButton
    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب الاسم (أ-ي)", value: "name_asc" },
        { label: "حسب الاسم (ي-أ)", value: "name_desc" },
        { label: "حسب الحالة (مقبول)", value: "مقبول" },
        { label: "حسب الحالة (مرفوض)", value: "مرفوض" },
        { label: "حسب الحالة (في الانتظار)", value: "في الانتظار" },
    ];

    // Filter and sort the table data
    const filteredData = useMemo(() => {
        let newData = [...tableData];

        switch (currentFilter) {
            case "name_asc":
                newData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name_desc":
                newData.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "مقبول":
            case "مرفوض":
            case "في الانتظار":
                newData = newData.filter((item) => item.status === currentFilter);
                break;
            default:
                break;
        }

        return newData;
    }, [tableData, currentFilter]);

    const handleFilterChange = useCallback((filterValue) => {
        setCurrentFilter(filterValue);
    }, []);

    // Columns configuration
    const tableColumns = [
        { header: "اسم المستخدم", accessor: "name" },
        {
            header: "محتوى المنشور",
            accessor: "postContent",
            render: (value) => (
                <span className="truncate max-w-[200px] block">
                    {value.length > 30 ? `${value.substring(0, 30)}...` : value}
                </span>
            )
        },
        { header: "التاريخ", accessor: "date" },
        { header: "الحالة", accessor: "status" }
    ];

    // Loading state - removed isLoadingPendingPosts
    const isLoading = isLoadingTopUsers || isLoadingAllPosts;

    if (isLoading) {
        return <PageSkeleton rows={8} />;
    }

    // Error states - removed pendingPostsError
    if (topUsersError || allPostsError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-red-600 text-lg">حدث خطأ في تحميل البيانات</h2>
                    <p className="text-gray-600">يرجى المحاولة مرة أخرى لاحقاً</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-2" dir="rtl">
            {/* Dialogs */}
            <PostReviewDialog
                request={selectedRequest}
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
            />

            <ConfirmationDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleConfirmAction}
                title={actionType === 'accept' ? "قبول المنشور" : "رفض المنشور"}
                message={confirmMessage}
                confirmText={actionType === 'accept' ? "قبول" : "رفض"}
                confirmColor={actionType === 'accept' ? "green" : "red"}
                showTextInput={actionType === 'reject'}
                textInputLabel="سبب الرفض"
                textInputPlaceholder="يرجى كتابة سبب الرفض"
                requiredTextInput={actionType === 'reject'}
                requestDate={selectedRequest ? formatDate(selectedRequest.date) : null}
            />

            {/* Chart Section */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-6 items-center text-gray-800 px-2 justify-between">
                    <h1 className="text-h1-bold-24">أنشط المستخدمين</h1>
                </div>

                <div className="p-8 bg-white rounded-lg shadow relative min-h-[24rem]">
                    <div className="flex flex-col">
                        <div className="flex gap-2 text-h2-bold-16 mb-4">
                            <h1>عدد المنشورات</h1>
                            <div className="bg-green w-8 h-5 rounded-lg"></div>
                        </div>

                        {chartData.labels.length > 0 ? (
                            <Chart
                                labels={chartData.labels}
                                values={chartData.values}
                                label="عدد المنشورات"
                                height="20rem"
                                className="h-full w-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                <p className="text-gray-500">لا توجد بيانات للعرض</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table and Requests List Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    {/* Main Panel with Table */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h1 className="text-h1-bold-24 text-gray-800">المنشورات</h1>
                            <div className="flex items-center">
                                <SortFilterButton
                                    options={filterOptions.map((opt) => opt.label)}
                                    selectedValue={currentFilter === "الكل" ? "الكل" :
                                        filterOptions.find(opt => opt.value === currentFilter)?.label || "الكل"}
                                    position="left"
                                    onChange={(label) => {
                                        const matched = filterOptions.find((f) => f.label === label);
                                        if (matched) handleFilterChange(matched.value);
                                    }}
                                />
                                <Link
                                    to="/community/posts"
                                    className="text-gray-400 hover:text-gray-500 font-normal text-sm px-3 py-2 transition-colors"
                                >
                                    مشاهدة الكل
                                </Link>
                            </div>
                        </div>

                        <div className="h-[400px]">
                            {filteredData.length > 0 ? (
                                <CommonTable
                                    columns={tableColumns}
                                    data={filteredData}
                                    basePath="community/posts"
                                    entityType='user'
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">لا توجد منشورات للعرض</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar with Community Requests List */}
                    <div className="w-full lg:w-1/3">
                        <div className="flex flex-col h-full">
                            <h2 className="text-h1-bold-24 text-gray-800 mt-2 mb-5">قائمة المنشورات المعلقة</h2>
                            <div className="h-[622px]">
                                <CommunityRequestsList
                                    requests={pendingRequests}
                                    selectedRequest={selectedRequest}
                                    onSelectRequest={handleSelectRequest}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}