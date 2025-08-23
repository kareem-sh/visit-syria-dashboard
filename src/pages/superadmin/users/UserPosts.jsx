// components/users/UserPosts.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import SortFilterButton from "@/components/common/SortFilterButton";
import { ChevronLeft } from "lucide-react";
import GreenPenIcon from "@/assets/icons/common/Green Pen.svg";
import doneIcon from "@/assets/icons/table/done small.svg";
import canceledIcon from "@/assets/icons/table/canceled small.svg";
import inprogressIcon from "@/assets/icons/table/inprogress small.svg";
import notyetIcon from "@/assets/icons/table/notyet small.svg";
import Banned from "@/assets/icons/table/Banned.svg";
import Warning from "@/assets/icons/table/Warning.svg";

const UserPosts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentFilter, setCurrentFilter] = useState("الكل");
    const navigate = useNavigate();

    // Mock data for posts with correct status values
    const getMockData = () => {
        return [
            {
                id: "POST-001",
                title: "تجربتي الرائعة في رحلة جبلة",
                date: "15/03/2025",
                status: "مقبول",
            },
            {
                id: "POST-002",
                title: "صور من مهرجان الربيع في دمشق",
                date: "20/04/2025",
                status: "مرفوض",
            },
            {
                id: "POST-003",
                title: "فيديو جولة في الأسواق القديمة",
                date: "10/02/2025",
                status: "في الانتظار",
            },
            {
                id: "POST-004",
                title: "نصائح للسفر إلى سوريا",
                date: "05/05/2025",
                status: "مقبول",
            },
            {
                id: "POST-005",
                title: "معرض الصور من حلب",
                date: "12/06/2025",
                status: "في الانتظار",
            }
        ];
    };

    // Filter options
    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب التاريخ (الأقدم)", value: "oldest" },
        { label: "حسب التاريخ (الأحدث)", value: "latest" },
        { label: "حسب الحالة (مقبول)", value: "مقبول" },
        { label: "حسب الحالة (مرفوض)", value: "مرفوض" },
        { label: "حسب الحالة (في الانتظار)", value: "في الانتظار" },
    ];

    // Status badge rendering (matching CommonTable style)
    const renderStatusBadge = (status) => {
        let icon, bg, text;
        switch (status) {
            case "مقبول":
                icon = doneIcon;
                bg = "bg-green-100/60";
                text = "text-green";
                break;
            case "مرفوض":
                icon = canceledIcon;
                bg = "bg-red-50";
                text = "text-red-600";
                break;
            case "في الانتظار":
                icon = inprogressIcon;
                bg = "bg-gold-500/10";
                text = "text-gold";
                break;
            default:
                return status;
        }
        return (
            <div
                className={`relative flex items-center justify-center min-w-[100px] h-[32px] px-[8px] py-[6px] rounded-[16px] ${bg} ${text} box-border leading-none`}
            >
                <img src={icon} alt={status} className="w-5 h-5 ml-1" />
                <span className="text-body-regular-14-auto">{status}</span>
            </div>
        );
    };

    // Load mock data with simulated API delay
    useEffect(() => {
        const loadMockData = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500));
                const mockData = getMockData();
                setData(mockData);
            } catch (err) {
                setError("فشل في تحميل البيانات");
                console.error("Failed to load mock data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadMockData();
    }, []);

    // Filter and sort the data
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];

        let newData = [...data];

        switch (currentFilter) {
            case "oldest":
                newData.sort((a, b) => {
                    const dateA = new Date(a.date.split("/").reverse().join("-"));
                    const dateB = new Date(b.date.split("/").reverse().join("-"));
                    return dateA - dateB;
                });
                break;
            case "latest":
                newData.sort((a, b) => {
                    const dateA = new Date(a.date.split("/").reverse().join("-"));
                    const dateB = new Date(b.date.split("/").reverse().join("-"));
                    return dateB - dateA;
                });
                break;
            case "مقبول":
            case "مرفوض":
            case "في الانتظار":
                newData = newData.filter((item) => item.status === currentFilter);
                break;
            default:
                break;
        }

        return newData;
    }, [data, currentFilter]);

    const handleDetailsClick = (postId, e) => {
        e.stopPropagation();
        navigate(`/community/posts/${postId}`);
    };

    if (loading) return <PageSkeleton rows={6} />;

    if (error) {
        return (
            <div className="p-8 bg-white rounded-lg shadow">
                <div className="text-center text-red-600">
                    <p>حدث خطأ في تحميل البيانات: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-visible relative w-full space-y-4">
            {/* Title and Filter Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-4">
                <h2 className="text-h1-bold-24 text-gray-700">المنشورات</h2>
                <SortFilterButton
                    options={filterOptions.map((opt) => opt.label)}
                    selectedValue={currentFilter === "الكل" ? "الكل" :
                        filterOptions.find(opt => opt.value === currentFilter)?.label || "الكل"}
                    position="left"
                    onChange={(label) => {
                        const matched = filterOptions.find((f) => f.label === label);
                        if (matched) setCurrentFilter(matched.value);
                    }}
                />
            </div>

            {/* Table Container */}
            <div className="flex flex-col w-full space-y-4">
                {filteredData.length === 0 ? (
                    <div className="p-8 bg-white rounded-lg shadow text-center">
                        <p className="text-gray-500">لا توجد منشورات لعرضها</p>
                    </div>
                ) : (
                    filteredData.map((post, index) => (
                        <div
                            key={post.id}
                            className="grid grid-cols-4 bg-white px-6 rounded-2xl shadow-sm text-sm text-gray-700 h-[75px] items-center"
                        >
                            {/* Post with Icon */}
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={GreenPenIcon}
                                        alt="منشور"
                                        className="w-7 h-7 mb-1"
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-800 truncate">
                                    {post.title}
                                </span>
                            </div>

                            {/* Date */}
                            <div className="text-center text-sm text-gray-600">
                                {post.date}
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-center">
                                {renderStatusBadge(post.status)}
                            </div>

                            {/* Details Button with Green Arrow */}
                            <div className="text-center">
                                <button
                                    onClick={(e) => handleDetailsClick(post.id, e)}
                                    className="inline-flex items-center hover:cursor-pointer px-3 py-2 text-sm text-green hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                >
                                    <span className="font-semibold">التفاصيل</span>
                                    <ChevronLeft size={14}  />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserPosts;