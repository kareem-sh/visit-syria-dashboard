import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendNotificationBySA } from '@/services/notification/notification';

const SendNotification = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('user');
    const [description, setDescription] = useState('');
    const maxChars = 1000;

    // React Query mutation for sending notification
    const { mutate, isLoading, isError, isSuccess, error } = useMutation({
        mutationFn: ({ category, title, description }) =>
            sendNotificationBySA(category, title, description),
        onSuccess: () => {
            // Reset form after successful submission
            setTitle('');
            setCategory('user');
            setDescription('');
        },
        onError: (error) => {
            console.error('Error sending notification:', error);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        // Send notification using React Query mutation
        mutate({ category, title, description });
    };

    const handleDescriptionChange = (event) => {
        if (event.target.value.length <= maxChars) {
            setDescription(event.target.value);
        }
    };

    return (
        <div>
            <div className="flex mb-8">
                <h1 className="text-2xl font-semibold text-gray-800" style={{ direction: 'rtl' }}>
                    إرسال إشعار
                </h1>
            </div>

            {/* Success Message */}
            {isSuccess && (
                <div className="bg-green-100 border border-green-200 text-green px-4 py-3 rounded mb-4" style={{ direction: 'rtl' }}>
                    تم إرسال الإشعار بنجاح
                </div>
            )}

            {/* Error Message */}
            {isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" style={{ direction: 'rtl' }}>
                    حدث خطأ أثناء إرسال الإشعار: {error?.message || 'Unknown error'}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    {/* Title input field */}
                    <div className="relative flex flex-col">
                        <label htmlFor="title-input" className="mb-1 text-gray-700 font-medium" style={{ direction: 'rtl' }}>
                            العنوان:
                        </label>
                        <input
                            type="text"
                            id="title-input"
                            placeholder="Title*"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green transition-colors"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Category dropdown */}
                    <div className="relative flex flex-col">
                        <label htmlFor="category-select" className="mb-1 text-gray-700 font-medium" style={{ direction: 'rtl' }}>
                            الفئة:
                        </label>
                        <select
                            id="category-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-white p-3 rounded-lg border-2 border-gray-200 appearance-none focus:outline-none focus:border-green transition-colors cursor-pointer"
                            required
                            disabled={isLoading}
                        >
                            <option value="user">المستخدمين</option>
                            <option value="company">الشركات السياحية</option>
                        </select>
                        {/* Custom arrow SVG */}
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Description Textarea field */}
                <div className="relative flex flex-col mb-4">
                    <label htmlFor="description-textarea" className="mb-1 text-gray-700 font-medium" style={{ direction: 'rtl' }}>
                        المحتوى:
                    </label>
                    <textarea
                        id="description-textarea"
                        placeholder="Content*"
                        value={description}
                        onChange={handleDescriptionChange}
                        rows="8"
                        className="w-full bg-white p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-green transition-colors resize-none"
                        required
                        disabled={isLoading}
                    >
                    </textarea>
                    {/* Character counter */}
                    <div className="text-right text-sm text-gray-400 mt-2" style={{ direction: 'rtl' }}>
                        {description.length}/{maxChars}
                    </div>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-green text-white font-semibold py-3 rounded-lg hover:shadow-lg cursor-pointer transition-colors flex justify-center items-center space-x-2 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? (
                        <span>جاري الإرسال...</span>
                    ) : (
                        <>
                            <span style={{ direction: 'rtl' }}>
                                إرسال
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default SendNotification;