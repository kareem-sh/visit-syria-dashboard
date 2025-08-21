// pages/AboutSyria.jsx
import React, { useState, useCallback, useMemo } from "react";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import Banner from "@/components/common/Banner.jsx";
import BlogIcon from "@/assets/images/BlogIcon.svg";
import BlogForm from "@/components/dialog/BlogForm.jsx";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { toast } from "react-toastify";

const AboutSyria = () => {
    const mockBlogs = [
        { id: 1, title: "دمشق: جوهرة الشرق الأوسط وتاريخ عريق", content: "دمشق هي واحدة من أقدم المدن المأهولة في العالم...", publishDate: "2023-11-15", categories: ["تاريخية"] },
        { id: 2, title: "قلعة حلب: شاهد على التاريخ والحضارة", content: "قلعة حلب من أهم المعالم الأثرية في سوريا...", publishDate: "2023-11-14", categories: ["أثرية"] },
        { id: 3, title: "مهرجان الربيع في دمشق", content: "صور من مهرجان الربيع في دمشق الجميلة...", publishDate: "2023-11-13", categories: ["ترفيهية", "ثقافية"] },
        { id: 4, title: "جبلة الساحرة", content: "تجربتي الرائعة في رحلة جبلة كانت ممتازة...", publishDate: "2023-11-12", categories: ["طبيعية", "ترفيهية"] },
        { id: 5, title: "الأسواق القديمة في دمشق", content: "فيديو جولة في الأسواق القديمة الرائعة...", publishDate: "2023-11-11", categories: ["تاريخية", "أثرية"] },
        { id: 6, title: "نصائح للسفر إلى سوريا", content: "نصائح للسفر إلى سوريا للسياح...", publishDate: "2023-11-10", categories: ["ثقافية"] },
    ];

    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب التاريخ (الأحدث)", value: "latest" },
        { label: "حسب التاريخ (الأقدم)", value: "oldest" }
    ];

    // Available categories for filtering
    const displayCategories = ["الكل","أثرية", "طبيعية", "طعام", "دينية", "تاريخية", "ثقافية", "عادات و تقاليد"];

    const [currentFilter, setCurrentFilter] = useState("الكل");
    const [selectedCategory, setSelectedCategory] = useState("الكل");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [blogs, setBlogs] = useState(mockBlogs);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    const handleOpenCreateDialog = () => {
        setEditingBlog(null);
        setIsDialogOpen(true);
    };

    const handleOpenEditDialog = (blog) => {
        setEditingBlog(blog);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingBlog(null);
    };

    const handleBlogSubmit = (blogData) => {
        if (editingBlog) {
            setBlogs(blogs.map(b => b.id === editingBlog.id ? {
                ...b,
                title: blogData.title,
                content: blogData.description,
                categories: blogData.categories
            } : b));
            toast.success("تم تعديل المقالة بنجاح");
        } else {
            const newBlog = {
                ...blogData,
                id: Math.max(...blogs.map(b => b.id)) + 1,
                publishDate: new Date().toISOString().split('T')[0],
                content: blogData.description
            };
            setBlogs([newBlog, ...blogs]);
            toast.success("تمت إضافة المقالة بنجاح");
        }
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

    const filteredData = useMemo(() => {
        let newData = [...blogs];

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
    }, [currentFilter, selectedCategory, blogs]);

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

    return (
        <div className="w-full p-0 m-0" dir="rtl">
            <Banner
                title="إضافة مقالة"
                description="يرجى إدخال بيانات الفعالية الجديدة لإدراجها ضمن الأنشطة المعتمدة من وزارة السياحة"
                icon={BlogIcon}
                onButtonClick={handleOpenCreateDialog}
            />

            <BlogForm
                open={isDialogOpen}
                onClose={handleCloseDialog}
                mode={editingBlog ? "edit" : "create"}
                initialData={editingBlog}
                onSubmit={handleBlogSubmit}
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
            />
        </div>
    );
};

export default AboutSyria;