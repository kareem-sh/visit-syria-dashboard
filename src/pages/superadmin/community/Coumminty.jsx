// pages/Community.jsx
import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import CommunityRequestsList from "@/components/common/CommunityRequestsList";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import Chart from "@/components/common/Chart.jsx";
import PostReviewDialog from "@/components/dialog/PostReviewDialog";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog";
import { sampleRequests } from "@/data/companies.js";

export default function Community() {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [currentFilter, setCurrentFilter] = useState("الكل");

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${day}-${month}-${year}`;
    };

    const handleSelectRequest = (request) => {
        setSelectedRequest(request);
        setIsDialogOpen(true);
        console.log("Selected request:", request);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedRequest(null);
    };

    const handleAcceptRequest = () => {
        setActionType('accept');
        setConfirmMessage("هل أنت متأكد من قبول هذا الطلب؟");
        setShowConfirmDialog(true);
    };

    const handleRejectRequest = () => {
        setActionType('reject');
        setConfirmMessage("هل أنت متأكد من رفض هذا الطلب؟");
        setShowConfirmDialog(true);
    };

    const handleConfirmAction = (reason) => {
        if (actionType === 'accept') {
            console.log("Accepting request:", selectedRequest);
            // Add your accept logic here
        } else if (actionType === 'reject') {
            console.log("Rejecting request:", selectedRequest, "Reason:", reason);
            // Add your reject logic here
        }

        setShowConfirmDialog(false);
        setIsDialogOpen(false);
        setSelectedRequest(null);
        setActionType(null);
    };


    // Mock data for community members - limited to 6 items
    const mockCommunityMembers = [
        {
            id: 1,
            name: "أحمد محمد",
            postsCount: 42,
            eventsCount: 12,
            tripsCount: 7,
            status: "نشط",
            postContent: "تجربتي الرائعة في رحلة جبلة كانت ممتازة",
            date: "2023-10-15"
        },
        {
            id: 2,
            name: "فاطمة علي",
            postsCount: 38,
            eventsCount: 15,
            tripsCount: 5,
            status: "مقبول",
            postContent: "صور من مهرجان الربيع في دمشق الجميلة",
            date: "2023-10-14"
        },
        {
            id: 3,
            name: "محمد حسن",
            postsCount: 35,
            eventsCount: 9,
            tripsCount: 8,
            status: "مقبول",
            postContent: "فيديو جولة في الأسواق القديمة الرائعة",
            date: "2023-10-13"
        },
        {
            id: 4,
            name: "سارة خالد",
            postsCount: 28,
            eventsCount: 10,
            tripsCount: 4,
            status: "مرفوض",
            postContent: "نصائح للسفر إلى سوريا للسياح",
            date: "2023-10-12"
        },
        {
            id: 5,
            name: "علي إبراهيم",
            postsCount: 25,
            eventsCount: 7,
            tripsCount: 6,
            status: "في الانتظار",
            postContent: "معرض الصور من حلب العريقة",
            date: "2023-10-11"
        },
        {
            id: 6,
            name: "لينا عبدالله",
            postsCount: 22,
            eventsCount: 8,
            tripsCount: 3,
            status: "مرفوض",
            postContent: "تجربة تناول الطعام في مطاعم دمشق",
            date: "2023-10-10"
        }
    ];

    // Chart data - using posts data by default
    const chartData = {
        labels: mockCommunityMembers.map(item => item.name),
        values: mockCommunityMembers.map(item => item.postsCount)
    };

    // Filter options for the SortFilterButton
    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب الاسم (أ-ي)", value: "name_asc" },
        { label: "حسب الاسم (ي-أ)", value: "name_desc" },
        { label: "حسب الحالة (مقبول)", value: "مقبول" },
        { label: "حسب الحالة (مرفوض)", value: "مرفوض" },
        { label: "حسب الحالة (في الانتظار)", value: "في الانتظار" },
    ];

    // Filter and sort the table data based on the current filter
    const filteredData = useMemo(() => {
        let newData = [...mockCommunityMembers];

        switch (currentFilter) {
            case "name_asc":
                newData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name_desc":
                newData.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "مقبول":
            case "مرفوض":
            case "في الانتظار":
                newData = newData.filter((item) => item.status === currentFilter);
                break;
            default:
                // "الكل" - no filtering needed
                break;
        }

        return newData;
    }, [mockCommunityMembers, currentFilter]);

    const handleFilterChange = useCallback((filterValue) => {
        setCurrentFilter(filterValue);
    }, []);

    // Columns configuration for the CommonTable
    const tableColumns = [
        { header: "اسم المستخدم", accessor: "name" },
        {
            header: "محتوى المنشور",
            accessor: "postContent",
            render: (value) => (
                <span className="truncate max-w-[200px] block">
                    {value.length > 30 ? `${value.substring(0, 30)}...` : value}
                </span>
            )
        },
        { header: "التاريخ", accessor: "date" },
        { header: "الحالة", accessor: "status" }
    ];

    return (
        <div className="flex flex-col gap-8 p-2" dir="rtl">
            {/* Post Review Dialog */}
            <PostReviewDialog
                request={selectedRequest}
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
            />

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleConfirmAction}
                title={actionType === 'accept' ? "قبول المنشور" : "رفض المنشور"}
                message={confirmMessage}
                confirmText={actionType === 'accept' ? "قبول" : "رفض"}
                confirmColor={actionType === 'accept' ? "green" : "red"}
                showTextInput={actionType === 'reject'} // Show text input only for rejections
                textInputLabel="سبب الرفض"
                textInputPlaceholder="يرجى كتابة سبب الرفض"
                requiredTextInput={actionType === 'reject'} // Require reason only for rejections
                requestDate={selectedRequest ? formatDate(selectedRequest.date) : null}
            />

            {/* Chart Section */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-6 items-center text-gray-800 px-2 justify-between">
                    <div>
                        <h1 className="text-h1-bold-24">أنشط المستخدمين</h1>
                    </div>
                </div>

                <div className="p-8 bg-white rounded-lg shadow relative min-h-[24rem]">
                    <div className="flex flex-col">
                        <div className="flex gap-2 text-h2-bold-16 mb-4">
                            <h1>عدد المنشورات</h1>
                            <div className="bg-green w-8 h-5 rounded-lg"></div>
                        </div>

                        <Chart
                            labels={chartData.labels}
                            values={chartData.values}
                            label="عدد المنشورات"
                            height="20rem"
                            className="h-full w-full"
                            style={{ height: "100%" }}
                        />
                    </div>
                </div>
            </div>

            {/* Table and Requests List Section */}
            <div className="flex flex-col gap-6">
                {/* Content Row */}
                <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                    {/* Main Panel with Table (Left Side) */}
                    <div className="flex-1">
                        {/* Table Title and Controls - Title at start, buttons at end */}
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h1 className="text-h1-bold-24 text-gray-800">المنشورات</h1>
                            <div className="flex items-center">
                                <SortFilterButton
                                    options={filterOptions.map((opt) => opt.label)}
                                    selectedValue={currentFilter === "الكل" ? "الكل" :
                                        filterOptions.find(opt => opt.value === currentFilter)?.label || "الكل"}
                                    position="left"
                                    onChange={(label) => {
                                        const matched = filterOptions.find((f) => f.label === label);
                                        if (matched) handleFilterChange(matched.value);
                                    }}
                                />
                                <Link
                                    to="/community/posts"
                                    className="text-gray-400 hover:text-gray-500 font-normal text-sm px-3 py-2 transition-colors"
                                >
                                    مشاهدة الكل
                                </Link>
                            </div>
                        </div>

                        {/* Table with limited height */}
                        <div className="h-[400px]"> {/* Reduced height */}
                            <CommonTable
                                columns={tableColumns}
                                data={filteredData}
                                basePath="community/posts"
                                entityType='user'
                            />
                        </div>
                    </div>

                    {/* Sidebar with Community Requests List (Right Side) */}
                    <div className="w-full lg:w-1/3">
                        <div className="flex flex-col h-full">
                            {/* Community Requests Title */}
                            <h2 className="text-h1-bold-24 text-gray-800 mt-2 mb-5">قائمة المنشورات المعلقة</h2>

                            {/* Requests List with fixed height */}
                            <div className="h-[622px]">
                                <CommunityRequestsList
                                    requests={sampleRequests.slice(0, 8)}
                                    selectedRequest={selectedRequest}
                                    onSelectRequest={handleSelectRequest}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}