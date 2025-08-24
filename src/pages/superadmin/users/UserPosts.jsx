// components/users/UserPosts.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import SortFilterButton from "@/components/common/SortFilterButton";
import { ChevronLeft } from "lucide-react";
import GreenPenIcon from "@/assets/icons/common/Green Pen.svg";
import doneIcon from "@/assets/icons/table/done small.svg";
import canceledIcon from "@/assets/icons/table/canceled small.svg";
import inprogressIcon from "@/assets/icons/table/inprogress small.svg";
import { getUserPosts } from "@/services/users/usersApi";

const UserPosts = () => {
    const [currentFilter, setCurrentFilter] = useState("الكل");
    const navigate = useNavigate();
    const { id: userId } = useParams();

    // Fetch user posts using React Query
    const { data: postsResponse, isLoading, error } = useQuery({
        queryKey: ['userPosts', userId],
        queryFn: () => getUserPosts(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    // Extract posts data from response (similar to Posts.jsx)
    const postsData = postsResponse?.activities || [];

    // Filter options
    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب التاريخ (الأقدم)", value: "oldest" },
        { label: "حسب التاريخ (الأحدث)", value: "latest" },
        { label: "حسب الحالة (مقبول)", value: "Approved" },
        { label: "حسب الحالة (مرفوض)", value: "Rejected" },
        { label: "حسب الحالة (في الانتظار)", value: "Pending" },
    ];

    // Status badge rendering
    const renderStatusBadge = (status) => {
        let icon, bg, text, displayStatus;

        switch (status) {
            case "Approved":
                icon = doneIcon;
                bg = "bg-green-100/60";
                text = "text-green";
                displayStatus = "مقبول";
                break;
            case "Rejected":
                icon = canceledIcon;
                bg = "bg-red-50";
                text = "text-red-600";
                displayStatus = "مرفوض";
                break;
            case "Pending":
                icon = inprogressIcon;
                bg = "bg-gold-500/10";
                text = "text-gold";
                displayStatus = "في الانتظار";
                break;
            default:
                icon = inprogressIcon;
                bg = "bg-gray-100";
                text = "text-gray-600";
                displayStatus = status;
        }

        return (
            <div
                className={`relative flex items-center justify-center min-w-[100px] h-[32px] px-[8px] py-[6px] rounded-[16px] ${bg} ${text} box-border leading-none`}
            >
                <img src={icon} alt={displayStatus} className="w-5 h-5 ml-1" />
                <span className="text-body-regular-14-auto">{displayStatus}</span>
            </div>
        );
    };

    // Format date to DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return "غير محدد";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "غير محدد";

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    // Transform and prepare data for display
    const transformedData = useMemo(() => {
        if (!postsData || !Array.isArray(postsData)) return [];

        return postsData.map(post => ({
            id: post.id,
            title: post.description ?
                (post.description.length > 30
                    ? post.description.substring(0, 30) + '...'
                    : post.description)
                : "بدون عنوان",
            date: formatDate(post.created_at),
            status: post.status || "Pending",
            originalData: post
        }));
    }, [postsData]);

    // Filter and sort the data
    const filteredData = useMemo(() => {
        if (!transformedData || transformedData.length === 0) return [];

        let newData = [...transformedData];

        switch (currentFilter) {
            case "oldest":
                newData.sort((a, b) => {
                    const dateA = new Date(a.originalData.created_at);
                    const dateB = new Date(b.originalData.created_at);
                    return dateA - dateB;
                });
                break;
            case "latest":
                newData.sort((a, b) => {
                    const dateA = new Date(a.originalData.created_at);
                    const dateB = new Date(b.originalData.created_at);
                    return dateB - dateA;
                });
                break;
            case "Approved":
            case "Rejected":
            case "Pending":
                newData = newData.filter((item) => item.status === currentFilter);
                break;
            default:
                // "الكل" - no filtering needed
                break;
        }

        return newData;
    }, [transformedData, currentFilter]);

    const handleDetailsClick = (postId, e) => {
        e.stopPropagation();
        navigate(`/community/posts/${postId}`);
    };

    if (isLoading) return <PageSkeleton rows={6} />;

    if (error) {
        return (
            <div className="p-8 bg-white rounded-lg shadow">
                <div className="text-center text-red-600">
                    <p>حدث خطأ في تحميل البيانات: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-visible relative w-full space-y-4">
            {/* Title and Filter Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-4">
                <h2 className="text-h1-bold-24 text-gray-700">المنشورات</h2>
                <SortFilterButton
                    options={filterOptions.map((opt) => opt.label)}
                    selectedValue={currentFilter === "الكل" ? "الكل" :
                        filterOptions.find(opt => opt.value === currentFilter)?.label || "الكل"}
                    position="left"
                    onChange={(label) => {
                        const matched = filterOptions.find((f) => f.label === label);
                        if (matched) setCurrentFilter(matched.value);
                    }}
                />
            </div>

            {/* Table Container */}
            <div className="flex flex-col w-full space-y-4">
                {filteredData.length === 0 ? (
                    <div className="p-8 bg-white rounded-lg shadow text-center">
                        <p className="text-gray-500">لا توجد منشورات لعرضها</p>
                    </div>
                ) : (
                    filteredData.map((post) => (
                        <div
                            key={post.id}
                            className="grid grid-cols-4 bg-white px-6 rounded-2xl shadow-sm text-sm text-gray-700 h-[75px] items-center"
                        >
                            {/* Post with Icon */}
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={GreenPenIcon}
                                        alt="منشور"
                                        className="w-7 h-7 mb-1"
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-800 truncate">
                                    {post.title}
                                </span>
                            </div>

                            {/* Date */}
                            <div className="text-center text-sm text-gray-600">
                                {post.date}
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-center">
                                {renderStatusBadge(post.status)}
                            </div>

                            {/* Details Button with Green Arrow */}
                            <div className="text-center">
                                <button
                                    onClick={(e) => handleDetailsClick(post.id, e)}
                                    className="inline-flex items-center hover:cursor-pointer px-3 py-2 text-sm text-green hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                >
                                    <span className="font-semibold">التفاصيل</span>
                                    <ChevronLeft size={14}  />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserPosts;