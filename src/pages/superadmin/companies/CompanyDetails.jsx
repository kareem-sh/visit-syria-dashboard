// src/pages/CompanyDetails.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from "react-router-dom";
import HeaderInfoCard from '@/components/common/HeaderInfoCard.jsx';
import CompanyInfoCard from '@/components/common/CompanyInfoCard.jsx';
import CommonTable from '@/components/common/CommonTable.jsx';
import SortFilterButton from '@/components/common/SortFilterButton.jsx';
import CompanyStatusDialog from '@/components/dialog/CompanyStatusDialog.jsx';

// Mock data to illustrate how to use the component
const mockCompanyData = {
    id: 234087920,
    name_of_company: 'تيك أوف',
    name_of_owner: 'أحمد محسن',
    image: null,
    rating: 4.8,
    trip_count: 55,
    founding_date: '2004-09-02',
    status: 'تم الانذار',
    email: 'takeoff@gmail.com',
    license_number: 'TM-3490209',
    country_code: '+963',
    phone: '993 333 333',
    place: 'دمشق - شارع بغداد',
    latitude: '33.5138',
    longitude: '36.2765',
    description: 'تعد تيك أوف واحدة من أبرز شركات السياحة والسفر في سوريا، حيث تقدم باقات سياحية متكاملة تلبي تطلعات الزوار المحليين والأجانب على حد سواء.',
    documents: [
        { name: 'license.pdf', type: 'document' }, { name: 'photo1.jpg', type: 'image', url: 'https://via.placeholder.com/150' },
        { name: 'photo2.jpg', type: 'image', url: 'https://via.placeholder.com/150' }, { name: 'photo3.jpg', type: 'image', url: 'https://via.placeholder.com/150' },
        { name: 'contract.docx', type: 'document' }, { name: 'brochure.pdf', type: 'document' },
        { name: 'photo4.jpg', type: 'image', url: 'https://via.placeholder.com/150' }, { name: 'photo5.jpg', type: 'image', url: 'https://via.placeholder.com/150' },
    ],
};

const mockTripsData = [
    {
        id: "5765",
        tripName: "رحلة في جبلة",
        date: "25/06/2025",
        duration: "3 أيام",
        tickets_count: 55,
        ticket_price: "100$",
        status: "لم تبدأ بعد",
    },
    {
        id: "5766",
        tripName: "رحلة غروب الشمس",
        date: "26/06/2025",
        duration: "1 يوم",
        tickets_count: 40,
        ticket_price: "80$",
        status: "جارية حالياً",
    },
    {
        id: "3405834",
        tripName: "رحلة سوريا السياحية",
        date: "31/08/2025",
        duration: "3 أيام",
        tickets_count: 55,
        ticket_price: "100$",
        status: "منتهية",
    },
    {
        id: "54983",
        tripName: "جولة في الشرق",
        date: "20/10/2025",
        duration: "3 أيام",
        tickets_count: 55,
        ticket_price: "100$",
        status: "جارية حالياً",
    },
    {
        id: "349834",
        tripName: "رحلة إلى آثار تدمر",
        date: "04/09/2025",
        duration: "3 أيام",
        tickets_count: 55,
        ticket_price: "100$",
        status: "تم الإلغاء",
    },
];

/**
 * Main page/component to display all details for a company.
 * It composes the Header and Info components.
 */
export default function CompanyDetails() {
    // Get the id from the URL parameters
    const { id } = useParams();

    const companyData = mockCompanyData;
    const [currentFilter, setCurrentFilter] = useState("الكل");

    // State to manage the visibility of the status change dialog
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

    // Function to open the dialog
    const handleStatusChangeClick = useCallback(() => {
        setIsStatusDialogOpen(true);
    }, []);

    // Function to handle the confirmation from the dialog
    const handleStatusConfirm = useCallback((newStatus, reason) => {
        console.log(`Updating company status to: ${newStatus} with reason: ${reason}`);
        // Here you would make your API call to update the company status
        // For example:
        // api.updateCompanyStatus(id, { newStatus, reason });

        // After successful API call, you would close the dialog
        setIsStatusDialogOpen(false);
    }, []);

    const tableColumns = [
        { header: "الرقم التعريفي", accessor: "id" },
        { header: "اسم الرحلة", accessor: "tripName" },
        { header: "التاريخ", accessor: "date" },
        { header: "المدة", accessor: "duration" },
        { header: "عدد التذاكر", accessor: "tickets_count" },
        { header: "سعر التذكرة", accessor: "ticket_price" },
        { header: "الحالة", accessor: "status" },
    ];

    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب التاريخ (الأقدم)", value: "oldest" },
        { label: "حسب التاريخ (الأحدث)", value: "latest" },
        { label: "حسب الحالة (منتهية)", value: "منتهية" },
        { label: "حسب الحالة (تم الإلغاء)", value: "تم الإلغاء" },
        { label: "حسب الحالة (جارية حالياً)", value: "جارية حالياً" },
        { label: "حسب الحالة (لم تبدأ بعد)", value: "لم تبدأ بعد" },
    ];

    const handleFilterChange = useCallback((filterValue) => {
        setCurrentFilter(filterValue);
    }, []);

    const filteredTripsData = useMemo(() => {
        let newData = [...mockTripsData];

        switch (currentFilter) {
            case "latest":
                newData.sort((a, b) => {
                    const dateA = new Date(a.date.split("/").reverse().join("-"));
                    const dateB = new Date(b.date.split("/").reverse().join("-"));
                    return dateB - dateA;
                });
                break;
            case "oldest":
                newData.sort((a, b) => {
                    const dateA = new Date(a.date.split("/").reverse().join("-"));
                    const dateB = new Date(b.date.split("/").reverse().join("-"));
                    return dateA - dateB;
                });
                break;
            case "منتهية":
            case "تم الإلغاء":
            case "جارية حالياً":
            case "لم تبدأ بعد":
                newData = newData.filter((item) => item.status === currentFilter);
                break;
            default:
                newData = mockTripsData;
        }

        return newData;
    }, [currentFilter]);


    return (
        <div className="min-h-screen">
            <div className="mx-auto flex flex-col gap-6">
                <HeaderInfoCard
                    entityType="company"
                    title={companyData.name_of_company}
                    imageUrl={companyData.image}
                    rating={companyData.rating}
                    stats={[{ value: companyData.trip_count, label: 'عدد الرحلات' }]}
                    date={companyData.founding_date}
                    status={companyData.status}
                    onStatusChangeClick={handleStatusChangeClick}
                />
                <CompanyInfoCard data={companyData} />

                {/* New Section for the Trips Table */}
                <div className="mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
                        <h1 className="text-h1-bold-24 text-gray-800">الرحلات</h1>
                        <SortFilterButton
                            options={filterOptions.map(opt => opt.label)}
                            selectedValue={filterOptions.find(opt => opt.value === currentFilter)?.label || "الكل"}
                            position="left"
                            onChange={(label) => {
                                const matched = filterOptions.find(f => f.label === label);
                                if (matched) handleFilterChange(matched.value);
                            }}
                        />
                    </div>
                    <CommonTable
                        columns={tableColumns}
                        data={filteredTripsData}
                        basePath={`companies/${id}/trips`}
                    />
                </div>
            </div>

            {/* The new dedicated dialog, correctly placed and managed */}
            <CompanyStatusDialog
                isOpen={isStatusDialogOpen}
                onClose={() => setIsStatusDialogOpen(false)}
                currentStatus={companyData.status}
                onConfirm={handleStatusConfirm}
            />
        </div>
    );
}
