// pages/AboutSyria.jsx
import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import Banner from "@/components/common/Banner.jsx";
import BlogIcon from "@/assets/images/BlogIcon.svg";
import BlogForm from "@/components/dialog/BlogForm.jsx";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";
import { toast } from "react-toastify";
import { getArticles, createArticle } from "@/services/blogs/blogsApi";

const AboutSyria = () => {
    const queryClient = useQueryClient();

    // Available categories for filtering
    const displayCategories = ["الكل", "أثرية", "طبيعية", "طعام", "دينية", "تاريخية", "ثقافية", "عادات وتقاليد"];

    const [currentFilter, setCurrentFilter] = useState("الكل");
    const [selectedCategory, setSelectedCategory] = useState("الكل");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    // Fetch articles using React Query
    const { data: articlesResponse, isLoading, error, refetch } = useQuery({
        queryKey: ['articles'],
        queryFn: () => getArticles(),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    // Extract articles data from response
    const articles = articlesResponse?.data || [];

    // Create article mutation
    const createArticleMutation = useMutation({
        mutationFn: createArticle,
        onSuccess: () => {
            queryClient.invalidateQueries(['articles']);
            toast.success("تمت إضافة المقالة بنجاح");
        },
        onError: (error) => {
            console.error("Create article error:", error);
            if (error.response?.status === 401) {
                toast.error("انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("فشل في إضافة المقالة");
            }
        }
    });

    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب التاريخ (الأحدث)", value: "latest" },
        { label: "حسب التاريخ (الأقدم)", value: "oldest" }
    ];

    const handleOpenCreateDialog = () => {
        setEditingBlog(null);
        setIsDialogOpen(true);
    };

    const handleOpenEditDialog = (blog) => {
        // For edit functionality, you would need to implement updateArticle
        toast.info("تعديل المقالة غير متاح حالياً");
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingBlog(null);
    };

    const handleBlogSubmit = (blogData) => {
        // Prepare data for API
        const apiData = {
            title: blogData.title,
            body: blogData.description,
            image: blogData.image,
            tags: blogData.categories
        };

        // Call create mutation
        createArticleMutation.mutate(apiData);
        handleCloseDialog();
    };

    const handleFilterChange = useCallback((filterValue) => {
        setCurrentFilter(filterValue);
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Category tag component
    const CategoryTag = ({ category, isSelected = false, onClick }) => {
        return (
            <button
                onClick={() => onClick(category)}
                className={`px-3 py-1.5 rounded-full text-body-bold-14 transition-colors cursor-pointer min-w-[100px] text-center ${
                    isSelected
                        ? "bg-green text-white"
                        : "border border-green text-green hover:bg-green hover:text-white"
                }`}
            >
                {category}
            </button>
        );
    };

    // Transform API data for table display
    const tableData = useMemo(() => {
        return articles.map(article => ({
            id: article.id,
            title: article.title || 'بدون عنوان',
            content: article.body || 'لا يوجد محتوى',
            publishDate: article.created_at ? new Date(article.created_at).toLocaleDateString('en-BG') : 'غير محدد',
            categories: article.tags || []
        }));
    }, [articles]);

    const filteredData = useMemo(() => {
        let newData = [...tableData];

        // Apply category filter
        if (selectedCategory !== "الكل") {
            newData = newData.filter(blog =>
                blog.categories && blog.categories.includes(selectedCategory)
            );
        }

        // Apply date filters
        switch (currentFilter) {
            case "latest":
                newData.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
                break;
            case "oldest":
                newData.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
                break;
            default:
                // "الكل" - no sorting needed
                break;
        }

        return newData;
    }, [currentFilter, selectedCategory, tableData]);

    const columns = [
        { header: "الرقم التعريفي", accessor: "id" },
        { header: "العنوان", accessor: "title" },
        {
            header: "المحتوى",
            accessor: "content",
            render: (value) => (value.length > 50 ? `${value.substring(0, 50)}...` : value)
        },
        { header: "التاريخ", accessor: "publishDate" },
    ];

    if (isLoading) return <PageSkeleton rows={8} />;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 p-4">
                <h2 className="text-red-600 text-lg mb-2">حدث خطأ في تحميل البيانات</h2>
                <p className="text-gray-600 mb-4">يرجى المحاولة مرة أخرى لاحقاً</p>
                <button
                    onClick={() => refetch()}
                    className="bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className="w-full p-0 m-0" dir="rtl">
            <Banner
                title="إضافة مقالة"
                description="يرجى إدخال بيانات المقالة الجديدة"
                icon={BlogIcon}
                onButtonClick={handleOpenCreateDialog}
            />

            <BlogForm
                open={isDialogOpen}
                onClose={handleCloseDialog}
                mode={editingBlog ? "edit" : "create"}
                initialData={editingBlog}
                onSubmit={handleBlogSubmit}
                isLoading={createArticleMutation.isLoading}
            />

            <div className="flex flex-col gap-4 px-2 mt-8">
                <div className="mb-4">
                    <h1 className="text-h1-bold-24 text-gray-800">المقالات</h1>
                </div>

                {/* Category Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-3 mb-4">
                        {displayCategories.map((category) => (
                            <CategoryTag
                                key={category}
                                category={category}
                                isSelected={selectedCategory === category}
                                onClick={handleCategoryChange}
                            />
                        ))}
                    </div>
                    <div>
                        <SortFilterButton
                            options={filterOptions.map((opt) => opt.label)}
                            selectedValue={filterOptions.find(opt => opt.value === currentFilter)?.label || "الكل"}
                            position="left"
                            onChange={(label) => {
                                const matched = filterOptions.find((f) => f.label === label);
                                if (matched) handleFilterChange(matched.value);
                            }}
                        />
                    </div>
                </div>
            </div>

            <CommonTable
                columns={columns}
                data={filteredData}
                basePath="about-syria/blogs"
                entityType="blog"
                showPagination={true}
                itemsPerPage={10}
                onEdit={handleOpenEditDialog}
            />
        </div>
    );
};

export default AboutSyria;