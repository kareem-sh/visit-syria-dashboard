import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Banner from '@/components/common/banner';
import SupportFAQ from '@/assets/icons/common/support_faq_w.svg';
import SupportQ from '@/assets/icons/common/support_q_w.svg';
import SupportFAQg from '@/assets/icons/common/support_faq.svg';
import SupportQg from '@/assets/icons/common/support_q.svg';
import GreenPen from "@/assets/icons/common/Green Pen.svg";
import Bin from "@/assets/icons/event/bin.svg";
import SupportForm from '@/components/dialog/supportDialog.jsx';
import DeleteDialog from '@/components/dialog/DeleteDialog.jsx';
import { getCommonQuestions, getPrivacyAndPolicy, createSetting, updateSetting, deleteSetting } from '@/services/support/supportApi';

const FAQOrTermsCard = ({ title, description, icon, onEdit, onDelete, category, id }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="bg-white rounded-[16px] shadow-md p-6 border-2 border-gray-200 relative">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <img
                        src={icon}
                        alt="icon"
                        className="w-[25px] h-[25px] flex-shrink-0 object-contain"
                    />
                    <h3 className="text-xl font-semibold">{title}</h3>
                </div>
                <div className="relative">
                    <div
                        className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-100"
                        onClick={toggleDropdown}
                    >
                        {/* 3 dots icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6 text-gray-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                        </svg>
                    </div>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-200">
                            <div
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    onEdit?.({ id, title, description, category });
                                }}
                            >
                                <img src={GreenPen} alt="Edit" className="w-4 h-4" />
                                <span className="text-gray-700">تعديل</span>
                            </div>
                            <div
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    setIsDeleteDialogOpen(true);
                                }}
                            >
                                <img src={Bin} alt="Delete" className="w-4 h-4" style={{ filter: 'invert(25%) sepia(98%) saturate(7485%) hue-rotate(358deg) brightness(94%) contrast(118%)' }} />
                                <span className="text-red-500">حذف</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-600 leading-6">{description}</p>

            {/* Delete Dialog */}
            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={() => {
                    onDelete?.(id);
                    setIsDeleteDialogOpen(false);
                }}
                title="حذف المحتوى"
                message="هل أنت متأكد أنك تريد حذف هذا العنصر؟"
            />
        </div>
    );
};

const FAQOrTermsList = ({ type, onEdit, onDelete, data, isLoading }) => {
    const [selectedOption, setSelectedOption] = useState('tourism');

    if (isLoading) {
        return (
            <div className="mx-auto mt-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="flex gap-6">
                        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                </div>
                <div className="grid gap-6">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white rounded-[16px] p-6 border-2 border-gray-200">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/5 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const sectionTitle = type === 'privacy_policy' ? 'شروط الاستخدام و سياسة الخصوصية' : 'الأسئلة الشائعة';
    const selectedIcon = type === 'privacy_policy' ? SupportFAQg : SupportQg;

    // Filter data based on selected radio button
    const filteredData = data?.data?.filter(item => {
        if (selectedOption === 'tourism') {
            return item.category === 'admin' || item.category === 'appandadmin';
        } else {
            return item.category === 'app' || item.category === 'appandadmin';
        }
    });

    return (
        <div className="mx-auto mt-6">
            {/* Section title and radio buttons container */}
            <div className="flex justify-between items-center mb-6">
                {/* Section title */}
                <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>

                {/* Radio buttons container */}
                <div className="flex items-center gap-6">
                    {/* Tourism companies radio button */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="platform"
                            value="tourism"
                            checked={selectedOption === 'tourism'}
                            onChange={() => setSelectedOption('tourism')}
                            className="hidden"
                        />
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === 'tourism' ? 'border-green-500' : 'border-gray-300'}`}>
                            {selectedOption === 'tourism' && <span className="w-3 h-3 rounded-full bg-green-500"></span>}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">لوحة تحكم شركات السياحة</span>
                    </label>

                    {/* Users radio button */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="platform"
                            value="user"
                            checked={selectedOption === 'user'}
                            onChange={() => setSelectedOption('user')}
                            className="hidden"
                        />
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === 'user' ? 'border-green-500' : 'border-gray-300'}`}>
                            {selectedOption === 'user' && <span className="w-3 h-3 rounded-full bg-green-500"></span>}
                        </span>
                        <span className="text-sm font-semibold text-gray-600">تطبيق المستخدمين</span>
                    </label>
                </div>
            </div>

            {/* List of cards */}
            <div className="grid gap-6">
                {filteredData && filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <FAQOrTermsCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            description={item.description}
                            icon={selectedIcon}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            category={item.category}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        لا توجد عناصر لعرضها
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * The main page component for Support Details.
 */
const SupportDetails = () => {
    const { type } = useParams();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("create");
    const [editData, setEditData] = useState(null);
    const queryClient = useQueryClient();

    // Fetch data based on type
    const { data, isLoading, error } = useQuery({
        queryKey: [type === 'privacy_policy' ? 'privacyPolicy' : 'commonQuestions'],
        queryFn: type === 'privacy_policy' ? getPrivacyAndPolicy : getCommonQuestions,
        staleTime: 10 * 60 * 1000, // 10 minutes cache
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: createSetting,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries([type === 'privacy_policy' ? 'privacyPolicy' : 'commonQuestions']);
        },
        onError: (error) => {
            console.error("Create error:", error);
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }) => updateSetting(id, data),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries([type === 'privacy_policy' ? 'privacyPolicy' : 'commonQuestions']);
        },
        onError: (error) => {
            console.error("Update error:", error);
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deleteSetting,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries([type === 'privacy_policy' ? 'privacyPolicy' : 'commonQuestions']);
        },
        onError: (error) => {
            console.error("Delete error:", error);
        }
    });

    const openDialog = () => {
        setDialogMode("create");
        setEditData(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (data) => {
        setDialogMode("edit");
        setEditData(data);
        setIsDialogOpen(true);
    };

    const handleDelete = (id) => {
        if (id) {
            deleteMutation.mutate(id);
        }
    };

    const closeDialog = () => setIsDialogOpen(false);

    const handleSubmit = (formData) => {
        console.log("Form data:", formData);

        // Prepare API data
        const apiData = {
            category: formData.category,
            type: type === 'privacy_policy' ? 'privacy_policy' : 'common_question',
            title: formData.title,
            description: formData.description
        };

        console.log("API data:", apiData);

        if (dialogMode === "create") {
            createMutation.mutate(apiData);
        } else {
            // For edit, include the ID
            updateMutation.mutate({
                id: editData.id,
                ...apiData
            });
        }
        closeDialog();
    };

    const b_title = type === "privacy_policy" ? "إضافة شرط استخدام" : "إضافة سؤال";
    const b_description =
        type === "privacy_policy"
            ? "يرجى إدخال نص الشرط الذي يوضح للمستخدمين و لشركات السياحة الامور السموحة و الممنوعة."
            : "ضف سؤالاً شائعًا مع الإجابة الخاصة به لتوفير معلومات مفيدة وسريعة للمستخدمين و شركات السياحة حول الخدمات أو الإجراءات.";
    const dialog_type = type === "privacy_policy" ? "policy" : "question";

    if (error) {
        return <div className="p-6 text-red-500">Error loading data: {error.message}</div>;
    }

    return (
        <div>
            <Banner
                title={b_title}
                description={b_description}
                icon={type === "privacy_policy" ? SupportFAQ : SupportQ}
                onButtonClick={openDialog}
            />

            <SupportForm
                open={isDialogOpen}
                onClose={closeDialog}
                mode={dialogMode}
                onSubmit={handleSubmit}
                type={dialog_type}
                initialData={editData}
                isLoading={createMutation.isLoading || updateMutation.isLoading}
            />

            <FAQOrTermsList
                type={type}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                data={data}
                isLoading={isLoading}
            />
        </div>
    );
};

export default SupportDetails;