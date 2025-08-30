import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import SearchIllustration from "@/assets/icons/common/what_search.svg";
import NoResult from "@/assets/icons/common/no_results.svg";
import { Search, History, X, Building, User, Calendar, Utensils, Hotel, Mountain, FileText, BookOpen } from "lucide-react";
import { searchData } from "@/services/search/search.js";

const SearchScreen = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState("");
    const [searchText, setSearchText] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false); // Add this state

    const { isUser, user: authUser, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Map tab names to API types and icons
    const tabConfig = {
        "الأحداث": { type: "event", icon: Calendar, getTitle: (item) => item.title, getRoute: (item) => `/events/${item.id}` },
        "الشركات السياحية": {
            type: "company",
            icon: Building,
            getTitle: (item) => item.name_of_company || item.name_of_owner,
            getRoute: (item) => `/companies/${item.id}`
        },
        "المستخدمين": {
            type: "user",
            icon: User,
            getTitle: (item) => item.first_name || item.last_name || item.email,
            getRoute: (item) => `/users/${item.id}`
        },
        "المطاعم": {
            type: "restaurant",
            icon: Utensils,
            getTitle: (item) => item.name,
            getRoute: (item) => `/places/cities/${item.city}/${item.type}/${item.id}`
        },
        "الفنادق": {
            type: "hotel",
            icon: Hotel,
            getTitle: (item) => item.name,
            getRoute: (item) => `/places/cities/${item.city}/${item.type}/${item.id}`
        },
        "المواقع السياحية": {
            type: "tourist",
            icon: Mountain,
            getTitle: (item) => item.name,
            getRoute: (item) => `/places/cities/${item.city}/${item.type}/${item.id}`
        },
        "المنشورات": {
            type: "post",
            icon: FileText,
            getTitle: (item) => item.title,
            getRoute: (item) => `/community/posts/${item.id}`
        },
        "المقالات": {
            type: "article",
            icon: BookOpen,
            getTitle: (item) => item.title,
            getRoute: (item) => `/about-syria/blogs/${item.id}`
        },
    };

    // Filter tabs based on user type and status
    const getAvailableTabs = () => {
        const allTabs = Object.keys(tabConfig);

        if (isAdmin && authUser?.company?.status === "فعالة") {
            return ["المطاعم", "الفنادق", "المواقع السياحية"];
        }

        return allTabs;
    };

    const tabs = getAvailableTabs();

    // Load search history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save search history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }, [searchHistory]);

    const handleSearch = async (searchQuery = searchText) => {
        if (searchQuery.trim() === "" || !activeTab) {
            setError(activeTab ? "يرجى إدخال نص للبحث" : "يرجى اختيار فئة للبحث");
            return;
        }

        setIsLoading(true);
        setError("");
        setHasSearched(true); // Set hasSearched to true when search is performed
        try {
            const { type } = tabConfig[activeTab];
            const results = await searchData(type, searchQuery);
            setSearchResults(results);

            // Add to search history
            const newSearchItem = {
                query: searchQuery,
                tab: activeTab,
                type: type,
                timestamp: Date.now()
            };
            setSearchHistory(prev => {
                // Remove duplicates and keep only last 10 items
                const filtered = prev.filter(item =>
                    item.query !== searchQuery || item.tab !== activeTab
                );
                return [newSearchItem, ...filtered].slice(0, 10);
            });
        } catch (error) {
            console.error('Search error:', error);
            setError("حدث خطأ أثناء البحث");
            setSearchResults([]);
        }
        setIsLoading(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch();
    };

    const clearSearchHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('searchHistory');
    };

    const removeSearchHistoryItem = (index) => {
        setSearchHistory(prev => prev.filter((_, i) => i !== index));
    };

    const searchFromHistory = (historyItem) => {
        setSearchText(historyItem.query);
        setActiveTab(historyItem.tab);
        handleSearch(historyItem.query);
    };

    const handleTabSelect = (tab) => {
        setActiveTab(tab);
        setError("");
        setHasSearched(false); // Reset hasSearched when changing tabs
    };

    const handleResultClick = (item) => {
        if (!activeTab) return;

        const { getRoute } = tabConfig[activeTab];
        const route = getRoute(item);

        if (route) {
            navigate(route);
            onClose(); // Close search screen after navigation
        }
    };

    const renderResultItem = (item, index) => {
        if (!activeTab) return null;

        const { getTitle, icon: Icon } = tabConfig[activeTab];
        const title = getTitle(item);
        const description = item.description || item.name_of_owner || item.location;

        return (
            <div
                key={index}
                onClick={() => handleResultClick(item)}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
                <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                        <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">{title}</h4>
                        {description && (
                            <p className="text-sm text-gray-600 mt-1 truncate">{description}</p>
                        )}
                        {item.rating && (
                            <div className="flex items-center mt-2">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm text-gray-500 ml-1">{item.rating}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen" dir="rtl">
            <div className="mx-auto">
                {/* Header with close button */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-h1-bold-24 text-gray-800">البحث</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <h3 className="text-h2-bold-16 text-gray-800 mb-3">اختر فئة البحث:</h3>
                    <div className="flex flex-wrap gap-3">
                        {tabs.map((tab) => {
                            const { icon: Icon } = tabConfig[tab];
                            return (
                                <button
                                    key={tab}
                                    onClick={() => handleTabSelect(tab)}
                                    className={`whitespace-nowrap px-5 py-2 text-body-bold-16 rounded-full transition-colors duration-200 flex items-center gap-2 ${
                                        activeTab === tab
                                            ? "bg-green text-white"
                                            : " text-green border border-green hover:shadow-md"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                    {!activeTab && error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </div>

                {/* Search input */}
                <form onSubmit={handleSearchSubmit} className="relative mb-8">
                    <input
                        type="text"
                        placeholder={activeTab ? `ابحث في ${activeTab}...` : "اختر فئة البحث أولاً"}
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setHasSearched(false); // Reset hasSearched when typing
                        }}
                        disabled={!activeTab}
                        className="w-full bg-white border border-gray-200 rounded-full px-6 py-4 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green pr-14 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!activeTab || isLoading}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Search className="w-6 h-6 text-gray-400" />
                    </button>
                </form>

                {/* Error message */}
                {error && activeTab && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Search History */}
                {searchHistory.length > 0 && searchText === "" && !activeTab && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <History className="w-5 h-5" />
                                سجل البحث
                            </h3>
                            <button
                                onClick={clearSearchHistory}
                                className="text-sm text-red-500 hover:text-red-700"
                            >
                                مسح الكل
                            </button>
                        </div>
                        <div className="space-y-2">
                            {searchHistory.map((item, index) => {
                                const { icon: Icon } = tabConfig[item.tab];
                                return (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                        <button
                                            onClick={() => searchFromHistory(item)}
                                            className="text-right text-gray-700 hover:text-green flex-1 flex items-center gap-2"
                                        >
                                            <Icon className="w-4 h-4" />
                                            <div>
                                                <div className="font-medium">{item.query}</div>
                                                <div className="text-sm text-gray-500">{item.tab}</div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => removeSearchHistoryItem(index)}
                                            className="p-1 hover:bg-gray-200 rounded"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Search Results */}
                <div className="mt-8">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
                        </div>
                    ) : hasSearched && searchResults.length === 0 ? ( // Changed this condition
                        <div className="flex flex-col items-center justify-center text-center pt-16">
                            <img
                                src={NoResult}
                                alt="لا توجد نتائج"
                                className="w-64 h-64 mb-6"
                            />
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-600 mb-4">
                                نتائج البحث في {activeTab} ({searchResults.length})
                            </h3>
                            <div className="space-y-3">
                                {searchResults.map((item, index) => renderResultItem(item, index))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center pt-16">
                            <img
                                src={SearchIllustration}
                                alt="عن ماذا تبحث؟"
                                className="w-64 h-64 mb-6"
                            />
                            <p className="text-gray-500">اختر فئة البحث وابدأ بالبحث عن المحتوى الذي تريد العثور عليه</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchScreen;