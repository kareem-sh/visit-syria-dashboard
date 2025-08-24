import React, { useState } from "react";
import NoResults from "@/assets/icons/common/no_results.svg";
import WhatSearch from "@/assets/icons/common/what_search.svg";
import { Search, Clock } from "lucide-react"; // أيقونات جاهزة

const SearchScreen = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState("الأحداث");
    const [searchText, setSearchText] = useState("");

    const tabs = [
        "الأحداث",
        "الشركات السياحية",
        "الفنادق",
        "المطاعم",
        "المتاحف",
        "الفعاليات",
    ];

    // ✅ نتائج وهمية
    const dummyResults = [
        { id: 1, title: "مهرجان" },
        { id: 2, title: "قلعة" },
        { id: 3, title: "جبل" },
        { id: 4, title: "Alt+Shift" },
    ];

    const filteredResults = dummyResults.filter((item) =>
        item.title.includes(searchText)
    );

    return (
        <div className="fixed inset-0 bg-white z-[10000] flex flex-col" dir="rtl">
        {/* ✅ شريط علوي */}
        <div className="flex items-center justify-between p-4 border-b">
            <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-600 hover:text-red-500"
            >
            ✕
            </button>
            <h2 className="text-lg font-bold text-gray-800">البحث</h2>
        </div>

        {/* ✅ مربع البحث */}
        <div className="p-4 border-b">
            <input
            type="text"
            placeholder="ابحث هنا..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
        </div>

        {/* ✅ Tabs */}
        <div className="flex overflow-x-auto gap-3 px-4 py-3 border-b scrollbar-hide">
            {tabs.map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
                {tab}
            </button>
            ))}
        </div>

        {/* ✅ محتوى النتائج */}
        <div className="flex-1 p-4 overflow-y-auto">
            {searchText === "" ? (
            <div className="flex flex-col items-center justify-center text-center mt-20">
                <img src={WhatSearch} alt="ابدأ البحث" className="w-100 h-100 mb-4" />
            </div>
            ) : filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-20">
                <img src={NoResults} alt="لا توجد نتائج" className="w-100 h-100 mb-4" />
            </div>
            ) : (
            <ul className="space-y-3">
                {filteredResults.map((item) => (
                <li
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-100 transition"
                >
                    <span className="text-gray-700 font-medium">{item.title}</span>
                    <Clock className="text-teal-500 w-5 h-5" />
                </li>
                ))}
            </ul>
            )}
        </div>
        </div>
    );
};

export default SearchScreen;
