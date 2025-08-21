// pages/Posts.jsx
import React, { useState, useCallback, useMemo } from "react";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";

export default function Posts() {
    const [currentFilter, setCurrentFilter] = useState("الكل");
    const [selectedCategory, setSelectedCategory] = useState("الكل");

    // Available categories - display names (what user sees)
    const displayCategories = ["الكل", "تاريخية", "أثرية", "ترفيهية", "طبيعية", "دينية", "ثقافية"];

    // API category mapping (what comes from API -> what to display)
    const categoryMapping = {
        "اثرية": "أثرية",
        // Add other mappings if needed in the future
    };

    // Mock data for posts with user images and categories (simulating API data)
    const mockPosts = [
        {
            id: 1,
            title: "رحلة إلى جبلة الساحرة",
            author: "أحمد محمد",
            authorImage: "https://i.pravatar.cc/150?img=1",
            status: "مقبول",
            date: "2023-10-15",
            postContent: "تجربتي الرائعة في رحلة جبلة كانت ممتازة ورائعة جداً، استمتعت بالمناظر الخلابة والطبيعة الساحرة التي تقدمها هذه المدينة الجميلة.",
            categories: ["طبيعية", "ترفيهية"]
        },
        {
            id: 2,
            title: "مهرجان الربيع في دمشق",
            author: "فاطمة علي",
            authorImage: "https://i.pravatar.cc/150?img=2",
            status: "مقبول",
            date: "2023-10-14",
            postContent: "صور من مهرجان الربيع في دمشق الجميلة، حيث الأزهار تتفتح والأجواء الربيعية تعم المكان بسعادة وبهجة.",
            categories: ["ترفيهية", "ثقافية"]
        },
        {
            id: 3,
            title: "جولة في الأسواق القديمة",
            author: "محمد حسن",
            authorImage: "https://i.pravatar.cc/150?img=3",
            status: "مرفوض",
            date: "2023-10-13",
            postContent: "فيديو جولة في الأسواق القديمة الرائعة في دمشق، حيث التاريخ والحضارة يتجسدان في كل زاوية من زوايا هذه الأسواق العريقة.",
            categories: ["تاريخية", "اثرية"] // API sends "اثرية"
        },
        {
            id: 4,
            title: "نصائح للسفر إلى سوريا",
            author: "سارة خالد",
            authorImage: "https://i.pravatar.cc/150?img=4",
            status: "في الانتظار",
            date: "2023-10-12",
            postContent: "نصائح للسفر إلى سوريا للسياح، بما في ذلك أفضل الأوقات للزيارة والأماكن التي يجب زيارتها والمأكولات التي يجب تجربتها.",
            categories: ["ثقافية"]
        },
        {
            id: 5,
            title: "معرض الصور من حلب",
            author: "علي إبراهيم",
            authorImage: "https://i.pravatar.cc/150?img=5",
            status: "مقبول",
            date: "2023-10-11",
            postContent: "معرض الصور من حلب العريقة، حيث تظهر جمالية المدينة القديمة والتراث الثقافي الغني الذي تتمتع به هذه المدينة التاريخية.",
            categories: ["تاريخية", "اثرية", "ثقافية"] // API sends "اثرية"
        },
        {
            id: 6,
            title: "مطاعم دمشق الشهية",
            author: "لينا عبدالله",
            authorImage: "https://i.pravatar.cc/150?img=6",
            status: "مقبول",
            date: "2023-10-10",
            postContent: "تجربة تناول الطعام في مطاعم دمشق، حيث المأكولات الشهية والنكهات الرائعة التي تقدمها المطاعم الدمشقية التقليدية والحديثة.",
            categories: ["ثقافية", "ترفيهية"]
        },
        {
            id: 7,
            title: "القلاع التاريخية في سوريا",
            author: "ياسر نور",
            authorImage: "https://i.pravatar.cc/150?img=7",
            status: "مرفوض",
            date: "2023-10-09",
            postContent: "جولة في القلاع التاريخية في سوريا، حيث تروي هذه القلاع قصصاً عن الحضارات القديمة والمعارك التاريخية التي شهدتها هذه الأرض.",
            categories: ["تاريخية", "اثرية"] // API sends "اثرية"
        },
        {
            id: 8,
            title: "منتزهات وحدائق دمشق",
            author: "نورا كمال",
            authorImage: "https://i.pravatar.cc/150?img=8",
            status: "في الانتظار",
            date: "2023-10-08",
            postContent: "استكشاف منتزهات وحدائق دمشق، حيث المساحات الخضراء والهواء النقي والأجواء الهادئة التي توفرها هذه الأماكن للزوار.",
            categories: ["طبيعية", "ترفيهية"]
        },
        {
            id: 9,
            title: "الحرف اليدوية التقليدية",
            author: "خالد أسعد",
            authorImage: "https://i.pravatar.cc/150?img=9",
            status: "مقبول",
            date: "2023-10-07",
            postContent: "تعرف على الحرف اليدوية التقليدية في سوريا، حيث الحرفيون المهرة يحافظون على تراثهم ويقدمون تحفاً فنية رائعة تعبر عن الثقافة السورية.",
            categories: ["ثقافية", "تاريخية"]
        },
        {
            id: 10,
            title: "المتاحف السورية الرائعة",
            author: "ريم أحمد",
            authorImage: "https://i.pravatar.cc/150?img=10",
            status: "مقبول",
            date: "2023-10-06",
            postContent: "زيارة إلى المتاحف السورية الرائعة، حيث يمكن للزوار التعرف على التاريخ الغني والتراث الثقافي الثمين الذي تزخر به سوريا عبر العصور.",
            categories: ["تاريخية", "اثرية", "ثقافية"] // API sends "اثرية"
        }
    ];

    // Filter options for the SortFilterButton
    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب الاسم (أ-ي)", value: "author_asc" },
        { label: "حسب الاسم (ي-أ)", value: "author_desc" },
        { label: "حسب التاريخ (الأحدث)", value: "date_desc" },
        { label: "حسب التاريخ (الأقدم)", value: "date_asc" },
        { label: "حسب الحالة (مقبول)", value: "مقبول" },
        { label: "حسب الحالة (مرفوض)", value: "مرفوض" },
        { label: "حسب الحالة (في الانتظار)", value: "في الانتظار" },
    ];

    // Helper function to map API category to display category
    const mapCategory = (apiCategory) => {
        return categoryMapping[apiCategory] || apiCategory;
    };

    // Filter and sort the table data based on the current filter and selected category
    const filteredData = useMemo(() => {
        let newData = [...mockPosts];

        // Apply category filter
        if (selectedCategory !== "الكل") {
            // For filtering, we need to check both the display name and possible API names
            const apiCategoryForFilter = selectedCategory === "أثرية" ? "اثرية" : selectedCategory;

            newData = newData.filter(post =>
                post.categories.includes(apiCategoryForFilter) ||
                post.categories.includes(selectedCategory)
            );
        }

        // Apply other filters
        switch (currentFilter) {
            case "author_asc":
                newData.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case "author_desc":
                newData.sort((a, b) => b.author.localeCompare(a.author));
                break;
            case "date_desc":
                newData.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "date_asc":
                newData.sort((a, b) => new Date(a.date) - new Date(b.date));
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
    }, [mockPosts, currentFilter, selectedCategory]);

    const handleFilterChange = useCallback((filterValue) => {
        setCurrentFilter(filterValue);
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusColors = {
            "مقبول": "bg-green-100 text-green-800",
            "مرفوض": "bg-red-100 text-red-800",
            "في الانتظار": "bg-yellow-100 text-yellow-800"
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
                {status}
            </span>
        );
    };

    // Category tag component with fixed width
    const CategoryTag = ({ category, isSelected = false, onClick }) => {
        return (
            <button
                onClick={() => onClick(category)}
                className={`px-3 py-1.5 rounded-full text-body-bold-14 transition-colors cursor-pointer min-w-[90px] text-center ${
                    isSelected
                        ? "bg-green text-white"
                        : "border border-green text-green hover:bg-green hover:text-white"
                }`}
            >
                {category}
            </button>
        );
    };

    // Columns configuration for the CommonTable
    const tableColumns = [
        {
            header: "اسم المستخدم",
            accessor: "author",
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <img
                        src={row.authorImage}
                        alt={value}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://i.pravatar.cc/150?img=11';
                        }}
                    />
                    <span className="font-medium text-gray-900">{value}</span>
                </div>
            )
        },
        {
            header: "محتوى المنشور",
            accessor: "postContent",
            render: (value) => (
                <span className="text-gray-600">
                    {value.length > 30 ? `${value.substring(0, 30)}...` : value}
                </span>
            )
        },
        {
            header: "التاريخ",
            accessor: "date"
        },
        {
            header: "الحالة",
            accessor: "status",
            render: (value) => <StatusBadge status={value} />
        }
    ];

    return (
        <div className="flex flex-col gap-4" dir="rtl">
            {/* Page Header */}
            <div className="flex items-center justify-between px-2">
                <h1 className="text-h1-bold-24 text-gray-800">المنشورات</h1>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between px-2">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {displayCategories.map((category) => (
                        <CategoryTag
                            key={category}
                            category={category}
                            isSelected={selectedCategory === category}
                            onClick={handleCategoryChange}
                        />
                    ))}
                </div>

                {/* Sort Filter Button */}
                <div className="flex-shrink-0">
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
                </div>
            </div>

            {/* Table */}
            <div>
                <CommonTable
                    columns={tableColumns}
                    data={filteredData}
                    basePath="community/posts"
                    entityType='post'
                    showPagination={true}
                    itemsPerPage={10}
                />
            </div>
        </div>
    );
}