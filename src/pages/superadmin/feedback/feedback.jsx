import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LineChart from '../../../components/common/LineChart';
import { getMonthlyRating, getSupportsByCategory } from "@/services/feedback/feedbackApi.js";
import UserProfileImage from "@/assets/images/User Profile.svg";

// Helper component to render stars
const StarRating = ({ stars }) => {
    const totalStars = 5;
    const filledStars = Math.min(Math.max(0, stars), totalStars);

    return (
        <div className="flex" dir="ltr">
            {[...Array(totalStars)].map((_, index) => (
                <svg
                    key={index}
                    className={`h-5 w-5 ${
                        index < filledStars ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

const FeedbackCard = ({ feedback }) => {
    const { user, rating, comment, created_at } = feedback;

    // Format date to DD/MM/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <div className="bg-white rounded-[16px] shadow-md p-6 border-2 border-gray-200 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4" dir="rtl">
                {/* User Info and Rating */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        {/* User Icon - Use profile photo if available */}
                            <img
                                src={user.profile_photo || UserProfileImage}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        {/* User Name */}
                        <h3 className="text-lg font-semibold whitespace-nowrap">{user.name}</h3>
                    </div>
                    {/* Stars Rating */}
                    <StarRating stars={rating} />
                </div>

                {/* Date */}
                <div className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(created_at)}
                </div>
            </div>
            <p className="text-sm text-gray-600 leading-6 text-right" dir="rtl">
                {comment}
            </p>
        </div>
    );
};

const FeedBackList = ({ selectedOption }) => {
    // Use React Query to fetch data based on category
    const { data: feedbackData, isLoading, error } = useQuery({
        queryKey: ['feedback', selectedOption],
        queryFn: () => getSupportsByCategory(selectedOption === 'tourism' ? 'admin' : 'app'),
        enabled: !!selectedOption, // Only run query when selectedOption is truthy
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                خطأ في تحميل البيانات: {error.message}
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            {feedbackData?.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
            {(!feedbackData || feedbackData.length === 0) && (
                <div className="text-center text-gray-500 py-8">
                    لا توجد تقييمات متاحة
                </div>
            )}
        </div>
    );
};

const Feedback = () => {
    const [selectedOption, setSelectedOption] = useState('tourism');

    // Fetch monthly ratings data with React Query
    const { data: monthlyRatingData, isLoading: monthlyLoading } = useQuery({
        queryKey: ['monthlyRatings'],
        queryFn: getMonthlyRating,
    });

    return (
        <div>
            <div className="flex mb-8">
                <h1 className="text-2xl font-semibold text-gray-800" style={{ direction: 'rtl' }}>
                    التقييمات
                </h1>
            </div>

            {/* Monthly Ratings Chart */}
            {monthlyLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <LineChart
                    label='التقييمات'
                    color={"#f7b800"}
                    values={monthlyRatingData.data || []}
                    tooltip_text="التقييمات"
                />
            )}

            {/* Section title and radio buttons container */}
            <div className="flex justify-between items-center mb-6 mt-8">
                {/* Section title */}
                <h2 className="text-2xl font-bold text-gray-800">الشكاوي والاقتراحات</h2>

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

            {/* Feedback List */}
            <FeedBackList selectedOption={selectedOption} />
        </div>
    );
}

export default Feedback;