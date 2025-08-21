// pages/BlogDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BlogForm from "@/components/dialog/BlogForm";
import CancelDialog from "@/components/Dialog/CancelDialog"; // Import CancelDialog

// Import icons from your assets
import pen from "@/assets/icons/event/pen.svg";
import bin from "@/assets/icons/event/bin.svg";

const BlogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete dialog

    // Mock data
    const mockBlogs = [
        {
            id: 1,
            title: "نواعير حماة",
            content: "تتميز مدينة حماة السورية بنواعيرها الخشبية الضخمة التي تنتشر على ضفاف نهر العاصي، والتي كانت تستخدم قديماً لرفع المياه من النهر وري البساتين والأراضي الزراعية المحيطة. تعتبر هذه النواعير رمزاً للمدينة وشاهداً على براعة الهندسة المائية في العصور القديمة. يعود تاريخ بناء بعض هذه النواعير إلى العصور الوسطى، ولا تزال قائمة حتى اليوم كمعلم سياحي وتراثي فريد من نوعه يجذب الزوار من مختلف أنحاء العالم للاستمتاع بمنظرها المهيب وصوتها المميز الذي يروي حكايات التاريخ.",
            publishDate: "2023-11-15",
            categories: ["أثرية", "طبيعية", "ترفيهية", "دينية", "تاريخية", "ثقافية"],
            author: "فريق التحرير",
            imageUrl: "https://images.pexels.com/photos/163016/water-wheel-mill-water-wheel-mill-wheel-163016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
            id: 2,
            title: "قلعة حلب: شاهد على التاريخ والحضارة",
            content: "قلعة حلب من أهم المعالم الأثرية في سوريا وتعتبر واحدة من أقدم وأكبر القلاع في العالم.",
            publishDate: "2023-11-14",
            categories: ["أثرية", "تاريخية"],
            author: "فاطمة الحلبية",
            imageUrl: "https://images.pexels.com/photos/10587388/pexels-photo-10587388.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const foundBlog = mockBlogs.find(blog => blog.id === parseInt(id));
            if (foundBlog) {
                setBlog(foundBlog);
            } else {
                toast.error("المقالة غير موجودة");
                navigate("/about-syria");
            }
            setLoading(false);
        }, 500);
    }, [id, navigate]);

    const handleDelete = () => {
        // Open the delete confirmation dialog
        setIsDeleteDialogOpen(true);
    }

    const handleDeleteConfirm = () => {
        // Handle the actual deletion
        toast.success(`تم حذف المقالة: "${blog.title}"`);
        navigate("/about-syria");
        setIsDeleteDialogOpen(false);
    }

    const handleEdit = () => {
        setIsEditDialogOpen(true);
    }

    const handleEditSubmit = (formData) => {
        // Update the blog data
        setBlog(prevBlog => ({
            ...prevBlog,
            title: formData.title,
            content: formData.description,
            categories: formData.categories
        }));

        setIsEditDialogOpen(false);
        toast.success("تم تعديل المقالة بنجاح");
    }

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-xl text-gray-600">جاري تحميل المقالة...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-xl text-red-600">المقالة غير موجودة</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" dir="rtl">
            <div className="bg-white rounded-2xl shadow-sm p-6">
                {/* Blog Image */}
                <div className="w-full h-60 md:h-80 mb-6 rounded-xl overflow-hidden">
                    <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover"
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
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-green text-body-bold-14 border-green border-2 hover:shadow-lg cursor-pointer"
                        >
                            تعديل المقالة
                            <img src={pen} alt="edit" className="w-4 h-4" />
                        </button>

                        {/* Delete Button - opens confirmation dialog */}
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-5 py-2 rounded-full bg-red text-white text-body-bold-14 hover:shadow-lg cursor-pointer"
                        >
                            حذف المقالة
                            <img src={bin} alt="delete" className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Blog Body Content */}
                <article className="mb-8">
                    <p className="text-gray-700 leading-8 text-justify text-lg">
                        {blog.content}
                    </p>
                </article>

                {/* Categories/Tags */}
                <div className="flex flex-wrap gap-2">
                    {blog.categories.map((category, index) => (
                        <span
                            key={index}
                            className="px-4 py-2 min-w-[80px] text-center bg-gray-100 text-green rounded-full text-body-regular-16 font-medium"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            </div>

            {/* BlogForm Dialog for Editing */}
            <BlogForm
                open={isEditDialogOpen}
                onClose={handleCloseEditDialog}
                mode="edit"
                initialData={{
                    title: blog.title,
                    description: blog.content, // This should now populate the textarea
                    categories: blog.categories,
                    image: blog.imageUrl
                }}
                onSubmit={handleEditSubmit}
            />

            {/* Delete Confirmation Dialog */}
            <CancelDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="حذف المقالة"
                message="هل أنت متأكد من رغبتك في حذف هذه المقالة؟ سيتم حذفها نهائياً."
            />
        </div>
    );
};

export default BlogDetails;