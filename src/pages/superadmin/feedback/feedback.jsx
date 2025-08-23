import React, { useState } from "react";
import LineChart from '../../../components/common/LineChart';

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


const FeedbackCard = ({ name, description, stars, date }) => {
    return (
        <div className="bg-white rounded-[16px] shadow-md p-6 border-2 border-gray-200 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4" dir="rtl">
                {/* User Info and Rating */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        {/* User Icon */}
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        {/* User Name */}
                        <h3 className="text-lg font-semibold whitespace-nowrap">{name}</h3>
                    </div>
                    {/* Stars Rating */}
                    <StarRating stars={stars} />
                </div>
                
                {/* Date */}
                <div className="text-sm text-gray-500 whitespace-nowrap">
                    {date}
                </div>
            </div>
            <p className="text-sm text-gray-600 leading-6 text-right" dir="rtl">
                {description}
            </p>
        </div> 
    );
};

const FeedBackList = () => {
    // State to manage the active radio button selection
    const [selectedOption, setSelectedOption] = useState('tourism');

    // Dummy data to simulate a list of items
    const data = [
        { name: 'مستخدم1', description: 'اي شي نص تجريبي بحت' ,stars: 5, date:'25/5/2025'},
        { name: 'مستخدم2', description: 'اي شي نص تجريبي بحت' ,stars: 3, date:'25/5/2025'},
        { name: 'مستخدم3', description: 'اي شي نص تجريبي بحت' ,stars: 4, date:'25/5/2025'},
        { name: 'مستخدم4', description: 'اي شي نص تجريبي بحت' ,stars: 1, date:'25/5/2025'},
    ]

    return (
        <div className="mx-auto mt-6">
            {/* Section title and radio buttons container */}
            <div className="flex justify-between items-center mb-6">
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
            
            {/* List of cards */}
            <div className="grid gap-6">
                {data.map((item ,index) => (
                    <FeedbackCard key={index} name={item.name} description={item.description} stars={item.stars} date={item.date}/>
                ))}
            </div>
        </div>
    );
};


const Feedback = () => {
    const [selectedOption, setSelectedOption] = useState('tourism');
    return (
        <div>
            <div className="flex mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800" style={{ direction: 'rtl' }}>
                        التقييمات
                    </h1>
            </div>
            <LineChart label='التقييمات'  color={"#f7b800"} values={[1,2,3,6,5,11,220,30,84]}/>
            <FeedBackList/>
        </div>
    );
}

export default Feedback;
