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
import {
    getCommonQuestions,
    getPrivacyAndPolicy,
    createSetting,
    updateSetting,
    deleteSetting
} from '@/services/support/supportApi';
import { useAuth } from '@/contexts/AuthContext';
import { PageSkeleton } from '@/components/common/PageSkeleton.jsx'; // Import PageSkeleton

/**
 * Card component for FAQ or Terms
 */
const FAQOrTermsCard = ({ title, description, icon, onEdit, onDelete, category, id, isSuperAdmin }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <div className="bg-white rounded-[16px] shadow-md p-6 border-2 border-gray-200 relative">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <img src={icon} alt="icon" className="w-[25px] h-[25px] flex-shrink-0 object-contain" />
                    <h3 className="text-xl font-semibold">{title}</h3>
                </div>

                {/* Dropdown only for super admin */}
                {isSuperAdmin && (
                    <div className="relative">
                        <div
                            className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-100"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={2} stroke="currentColor"
                                 className="w-6 h-6 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </div>

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
                                    <img src={Bin} alt="Delete" className="w-4 h-4"
                                         style={{ filter: 'invert(25%) sepia(98%) saturate(7485%) hue-rotate(358deg) brightness(94%) contrast(118%)' }} />
                                    <span className="text-red-500">حذف</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-600 leading-6">{description}</p>

            {/* Delete Dialog */}
            {isSuperAdmin && (
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
            )}
        </div>
    );
};

/**
 * List of FAQ / Terms
 */
const FAQOrTermsList = ({ type, onEdit, onDelete, data, isLoading, isSuperAdmin }) => {
    const [selectedOption, setSelectedOption] = useState('tourism');

    if (isLoading) {
        return <PageSkeleton rows={6} />; // Use PageSkeleton instead of simple loading text
    }

    const sectionTitle = type === 'privacy_policy' ? 'شروط الاستخدام و سياسة الخصوصية' : 'الأسئلة الشائعة';
    const selectedIcon = type === 'privacy_policy' ? SupportFAQg : SupportQg;

    // Filter client vs tourism categories
    const filteredData = data?.data?.filter(item => {
        if (isSuperAdmin) {
            if (selectedOption === 'tourism') {
                return item.category === 'admin' || item.category === 'appandadmin';
            } else {
                return item.category === 'app' || item.category === 'appandadmin';
            }
        } else {
            // non-superadmin → always show only admin
            return item.category === 'admin' || item.category === 'appandadmin';
        }
    });

    return (
        <div className={`mx-auto ${isSuperAdmin ? "mt-6" : "mt-1"}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>

                {/* Show radio toggle only if superadmin */}
                {isSuperAdmin && (
                    <div className="flex items-center gap-6">
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
                {selectedOption === 'tourism' && <span className="w-3 h-3 rounded-full bg-green"></span>}
              </span>
                            <span className="text-sm font-semibold text-gray-600">لوحة تحكم شركات السياحة</span>
                        </label>

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
                {selectedOption === 'user' && <span className="w-3 h-3 rounded-full bg-green"></span>}
              </span>
                            <span className="text-sm font-semibold text-gray-600">تطبيق المستخدمين</span>
                        </label>
                    </div>
                )}
            </div>

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
                            isSuperAdmin={isSuperAdmin}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">لا توجد عناصر لعرضها</div>
                )}
            </div>
        </div>
    );
};

/**
 * Main SupportDetails page
 */
const SupportDetails = () => {
    const { type } = useParams();
    const { isSuperAdmin } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("create");
    const [editData, setEditData] = useState(null);
    const queryClient = useQueryClient();

    // React Query fetcher
    const { data, isLoading, error } = useQuery({
        queryKey: [type === 'privacy_policy' ? 'privacyPolicy' : 'commonQuestions'],
        queryFn: ({ queryKey }) => {
            const key = queryKey[0];
            if (key === "privacyPolicy") {
                return isSuperAdmin ? getPrivacyAndPolicy() : getPrivacyAndPolicy("admin");
            } else {
                return isSuperAdmin ? getCommonQuestions() : getCommonQuestions("admin");
            }
        },
        staleTime: 10 * 60 * 1000,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createSetting,
        onSuccess: () => queryClient.invalidateQueries([type === 'privacy_policy' ? 'privacyPolicy' : 'commonQuestions']),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }) => updateSetting(id, data),
        onSuccess: () => queryClient.invalidateQueries([type === 'privacy_policy' ? 'privacyPolicy' : 'commonQuestions']),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSetting,
        onSuccess: () => queryClient.invalidateQueries([type === 'privacy_policy' ? 'privacyPolicy' : 'commonQuestions']),
    });

    // Dialog handlers
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
    const handleDelete = (id) => deleteMutation.mutate(id);
    const closeDialog = () => setIsDialogOpen(false);

    const handleSubmit = (formData) => {
        const apiData = {
            category: formData.category,
            type: type === 'privacy_policy' ? 'privacy_policy' : 'common_question',
            title: formData.title,
            description: formData.description
        };

        if (dialogMode === "create") {
            createMutation.mutate(apiData);
        } else {
            updateMutation.mutate({ id: editData.id, ...apiData });
        }
        closeDialog();
    };

    const b_title = type === "privacy_policy" ? "إضافة شرط استخدام" : "إضافة سؤال";
    const b_description =
        type === "privacy_policy"
            ? "يرجى إدخال نص الشرط الذي يوضح للمستخدمين و لشركات السياحة الامور السموحة و الممنوعة."
            : "ضف سؤالاً شائعًا مع الإجابة الخاصة به لتوفير معلومات مفيدة وسريعة للمستخدمين و شركات السياحة حول الخدمات أو الإجراءات.";
    const dialog_type = type === "privacy_policy" ? "policy" : "question";

    // Show page skeleton while loading
    if (isLoading) {
        return <PageSkeleton rows={8} />;
    }

    if (error) {
        return <div className="p-6 text-red-500">Error loading data: {error.message}</div>;
    }

    return (
        <div>
            {/* Show banner only if super admin */}
            {isSuperAdmin && (
                <Banner
                    title={b_title}
                    description={b_description}
                    icon={type === "privacy_policy" ? SupportFAQ : SupportQ}
                    onButtonClick={openDialog}
                />
            )}

            {isSuperAdmin && (
                <SupportForm
                    open={isDialogOpen}
                    onClose={closeDialog}
                    mode={dialogMode}
                    onSubmit={handleSubmit}
                    type={dialog_type}
                    initialData={editData}
                    isLoading={createMutation.isLoading || updateMutation.isLoading}
                />
            )}

            <FAQOrTermsList
                type={type}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                data={data}
                isLoading={isLoading}
                isSuperAdmin={isSuperAdmin}
            />
        </div>
    );
};

export default SupportDetails;