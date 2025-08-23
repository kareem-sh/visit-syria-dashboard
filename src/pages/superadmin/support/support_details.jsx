import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Banner from '@/components/common/banner'; // The existing banner component
import SupportFAQ from '@/assets/icons/common/support_faq_w.svg';
import SupportQ from '@/assets/icons/common/support_q_w.svg';
import SupportFAQg from '@/assets/icons/common/support_faq.svg';
import SupportQg from '@/assets/icons/common/support_q.svg';
import SupportForm from '@/components/dialog/supportDialog.jsx';
import DeleteDialog from '@/components/dialog/DeleteDialog.jsx';

const FAQOrTermsCard = ({ title, description, icon, onEdit, onDelete }) => {
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
        <div
          className="w-8 h-8 flex items-center justify-center cursor-pointer relative"
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

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-white rounded-md shadow-lg py-2 z-10">
              <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-green-500"
                onClick={() => {
                  setIsDropdownOpen(false);
                  onEdit?.({ title, description });
                }}
              >
                ✏️ <span>تعديل</span>
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsDeleteDialogOpen(true); // 👈 يفتح الديالوج
                }}
              >
                🗑 <span>حذف</span>
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
          onDelete?.(); // ينفّذ الحذف
          setIsDeleteDialogOpen(false);
        }}
        title="حذف المحتوى"
        message="هل أنت متأكد أنك تريد حذف هذا العنصر؟"
      />
    </div>
  );
};

const FAQOrTermsList = ({ type, onEdit }) => {
    // State to manage the active radio button selection
    const [selectedOption, setSelectedOption] = useState('tourism');

    // Dummy data to simulate a list of items
    const faqData = [
        { title: 'سؤال شائع 1', description: 'ضف سؤالاً شائعًا مع الإجابة الخاصة به لتوفير معلومات مفيدة وسريعة للمستخدمين و شركات السياحة حول الخدمات أو الإجراءات. ضف سؤالاً شائعًا مع الإجابة الخاصة به لتوفير معلومات مفيدة وسريعة للمستخدمين و شركات السياحة حول الخدمات أو الإجراءات.' },
        { title: 'سؤال شائع 2', description: 'ضف سؤالاً شائعًا مع الإجابة الخاصة به لتوفير معلومات مفيدة وسريعة للمستخدمين و شركات السياحة حول الخدمات أو الإجراءات. ضف سؤالاً شائعًا مع الإجابة الخاصة به لتوفير معلومات مفيدة وسريعة للمستخدمين و شركات السياحة حول الخدمات أو الإجراءات.' },
        { title: 'سؤال شائع 3', description: 'ضف سؤالاً شائعًا مع الإجابة الخاصة به لتوفير معلومات مفيدة وسريعة للمستخدمين و شركات السياحة حول الخدمات أو الإجراءات. ضف سؤالاً شائعًا مع الإجابة الخاصة به لتوفير معلومات مفيدة وسريعة للمستخدمين و شركات السياحة حول الخدمات أو الإجراءات.' },
    ];
    
    const termsData = [
        { title: 'شرط استخدام 1', description: 'يرجى إدخال نص الشرط الذي يوضح للمستخدمين و لشركات السياحة الامور السموحة و الممنوعة. يرجى إدخال نص الشرط الذي يوضح للمستخدمين و لشركات السياحة الامور السموحة و الممنوعة.' },
        { title: 'شرط استخدام 2', description: 'يرجى إدخال نص الشرط الذي يوضح للمستخدمين و لشركات السياحة الامور السموحة و الممنوعة. يرجى إدخال نص الشرط الذي يوضح للمستخدمين و لشركات السياحة الامور السموحة و الممنوعة.' },
        { title: 'شرط استخدام 3', description: 'يرجى إدخال نص الشرط الذي يوضح للمستخدمين و لشركات السياحة الامور السموحة و الممنوعة. يرجى إدخال نص الشرط الذي يوضح للمستخدمين و لشركات السياحة الامور السموحة و الممنوعة.' },
    ];
    
    // Choose which data to display based on the 'type' prop
    const dataToDisplay = type === 'faq' ? termsData : faqData;
    const sectionTitle = type === 'faq' ? 'شروط الاستخدام و سياسة الخصوصية' : 'الأسئلة الشائعة';
    const selectedIcon = type === 'faq' ? SupportFAQg : SupportQg;

    return (
        <div className="mx-auto mt-6">
            {/* Section title and radio buttons container */}
            <div className="flex justify-between items-center mb-6">
                {/* Section title */}
                <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
                
                {/* Radio buttons container */}
                <div className="flex items-center gap-6">
                    {/* Tourism companies radio button */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setSelectedOption('tourism')}
                    >
                        <span className={`w-3 h-3 rounded-full ${selectedOption === 'tourism' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className="text-sm font-semibold text-gray-600">لوحة تحكم شركات السياحة</span>
                    </div>
                    {/* Users radio button */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setSelectedOption('user')}
                    >
                        <span className={`w-3 h-3 rounded-full ${selectedOption === 'user' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className="text-sm font-semibold text-gray-600">تطبيق المستخدمين</span>
                    </div>
                </div>
            </div>
            
            {/* List of cards */}
            <div className="grid gap-6">
                {dataToDisplay.map((item ,index) => (
                    <FAQOrTermsCard key={index} title={item.title} description={item.description} icon={selectedIcon}  onEdit={onEdit}/>
                ))}
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

    const closeDialog = () => setIsDialogOpen(false);

    const handleSubmit = (data) => {
        if (dialogMode === "create") {
            console.log("Created:", data);
        } else {
            console.log("Edited:", data);
        }
        closeDialog();
    };

    const b_title = type === "faq" ? "إضافة شرط استخدام" : "إضافة سؤال";
    const b_description =
        type === "faq"
            ? "يرجى إدخال نص الشرط الذي يوضح للمستخدمين و لشركات السياحة الامور السموحة و الممنوعة."
            : "ضف سؤالاً شائعًا مع الإجابة الخاصة به لتوفير معلومات مفيدة وسريعة للمستخدمين و شركات السياحة حول الخدمات أو الإجراءات.";
    const dialog_type = type === "faq" ? "policy" : "question";

    return (
        <div>
            <Banner
                title={b_title}
                description={b_description}
                icon={type === "faq" ? SupportFAQ : SupportQ}
                onButtonClick={openDialog}
            />

            <SupportForm
                open={isDialogOpen}
                onClose={closeDialog}
                mode={dialogMode}
                onSubmit={handleSubmit}
                type={dialog_type}
                initialData={editData} // نمرر البيانات هون
            />

            <FAQOrTermsList
                type={type}
                onEdit={openEditDialog} // نمررها للـList
            />
        </div>
    );
};

export default SupportDetails;
