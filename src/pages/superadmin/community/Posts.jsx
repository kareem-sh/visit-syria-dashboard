// pages/Posts.jsx
import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";
import { getPosts } from "@/services/posts/postsApi";

export default function Posts() {
    const [currentFilter, setCurrentFilter] = useState("الكل");
    const [selectedCategory, setSelectedCategory] = useState("الكل");

    // Fetch posts from cache first, then API if needed
    const { data: postsData, isLoading, error } = useQuery({
        queryKey: ['allPosts'],
        queryFn: () => getPosts(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    // Available categories - display names (what user sees)
    const displayCategories = ["الكل", "تاريخية", "أثرية", "ترفيهية", "طبيعية", "دينية", "ثقافية"];

    // API category mapping (what comes from API -> what to display)
    const categoryMapping = {
        "اثرية": "أثرية",
        // Add other mappings if needed in the future
    };

    // Get posts from cache or use empty array if loading/error
    const posts = postsData?.data || [];

    // Filter options for the SortFilterButton
    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب الاسم (أ-ي)", value: "author_asc" },
        { label: "حسب الاسم (ي-أ)", value: "author_desc" },
        { label: "حسب التاريخ (الأحدث)", value: "date_desc" },
        { label: "حسب التاريخ (الأقدم)", value: "date_asc" },
        { label: "حسب الحالة (مقبول)", value: "مقبول" },
        { label: "حسب الحالة (مرفوض)", value: "مرفوض" },
        { label: "حسب الحالة (في الانتظار)", value: "في الانتظار" },
    ];

    // Helper function to map API category to display category
    const mapCategory = (apiCategory) => {
        return categoryMapping[apiCategory] || apiCategory;
    };

    // Transform API data for table
    const tableData = useMemo(() => {
        return posts.map(post => ({
            id: post.id,
            title: post.title || 'بدون عنوان',
            author: post.user?.name || 'مستخدم غير معروف',
            authorImage: post.user?.profile_photo || `https://i.pravatar.cc/150?img=${post.id}`,
            status: post.status === 'Approved' ? 'مقبول' :
                post.status === 'Rejected' ? 'مرفوض' :
                    post.status === 'Pending' ? 'في الانتظار' : post.status,
            date: post.created_at ? new Date(post.created_at).toLocaleDateString('en-BG') : 'غير محدد',
            postContent: post.description || 'لا يوجد محتوى',
            categories: post.tags || []
        }));
    }, [posts]);

    // Filter and sort the table data based on the current filter and selected category
    const filteredData = useMemo(() => {
        let newData = [...tableData];

        // Apply category filter
        if (selectedCategory !== "الكل") {
            // For filtering, we need to check both the display name and possible API names
            const apiCategoryForFilter = selectedCategory === "أثرية" ? "اثرية" : selectedCategory;

            newData = newData.filter(post =>
                post.categories.includes(apiCategoryForFilter) ||
                post.categories.includes(selectedCategory)
            );
        }

        // Apply other filters
        switch (currentFilter) {
            case "author_asc":
                newData.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case "author_desc":
                newData.sort((a, b) => b.author.localeCompare(a.author));
                break;
            case "date_desc":
                newData.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "date_asc":
                newData.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "مقبول":
            case "مرفوض":
            case "في الانتظار":
                newData = newData.filter((item) => item.status === currentFilter);
                break;
            default:
                // "الكل" - no filtering needed
                break;
        }

        return newData;
    }, [tableData, currentFilter, selectedCategory]);

    const handleFilterChange = useCallback((filterValue) => {
        setCurrentFilter(filterValue);
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Loading state
    if (isLoading) {
        return <PageSkeleton rows={8} />;
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-red-600 text-lg">حدث خطأ في تحميل البيانات</h2>
                    <p className="text-gray-600">يرجى المحاولة مرة أخرى لاحقاً</p>
                </div>
            </div>
        );
    }

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusColors = {
            "مقبول": "bg-green-100 text-green-800",
            "مرفوض": "bg-red-100 text-red-800",
            "في الانتظار": "bg-yellow-100 text-yellow-800"
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
                {status}
            </span>
        );
    };

    // Category tag component with fixed width
    const CategoryTag = ({ category, isSelected = false, onClick }) => {
        return (
            <button
                onClick={() => onClick(category)}
                className={`px-3 py-1.5 rounded-full text-body-bold-14 transition-colors cursor-pointer min-w-[90px] text-center ${
                    isSelected
                        ? "bg-green text-white"
                        : "border border-green text-green hover:bg-green hover:text-white"
                }`}
            >
                {category}
            </button>
        );
    };

    // Columns configuration for the CommonTable
    const tableColumns = [
        {
            header: "اسم المستخدم",
            accessor: "author",
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <img
                        src={row.authorImage}
                        alt={value}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://i.pravatar.cc/150?img=11';
                        }}
                    />
                    <span className="font-medium text-gray-900">{value}</span>
                </div>
            )
        },
        {
            header: "محتوى المنشور",
            accessor: "postContent",
            render: (value) => (
                <span className="text-gray-600">
                    {value.length > 30 ? `${value.substring(0, 30)}...` : value}
                </span>
            )
        },
        {
            header: "التاريخ",
            accessor: "date"
        },
        {
            header: "الحالة",
            accessor: "status",
            render: (value) => <StatusBadge status={value} />
        }
    ];

    return (
        <div className="flex flex-col gap-4" dir="rtl">
            {/* Page Header */}
            <div className="flex items-center justify-between px-2">
                <h1 className="text-h1-bold-24 text-gray-800">المنشورات</h1>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between px-2">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {displayCategories.map((category) => (
                        <CategoryTag
                            key={category}
                            category={category}
                            isSelected={selectedCategory === category}
                            onClick={handleCategoryChange}
                        />
                    ))}
                </div>

                {/* Sort Filter Button */}
                <div className="flex-shrink-0">
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
                </div>
            </div>

            {/* Table */}
            <div>
                <CommonTable
                    columns={tableColumns}
                    data={filteredData}
                    basePath="community/posts"
                    entityType='post'
                />
            </div>
        </div>
    );
}