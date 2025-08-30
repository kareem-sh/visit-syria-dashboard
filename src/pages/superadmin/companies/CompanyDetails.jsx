import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import HeaderInfoCard from '@/components/common/HeaderInfoCard.jsx';
import CompanyInfoCard from '@/components/common/CompanyInfoCard.jsx';
import CommonTable from '@/components/common/CommonTable.jsx';
import SortFilterButton from '@/components/common/SortFilterButton.jsx';
import CompanyStatusDialog from '@/components/dialog/CompanyStatusDialog.jsx';
import { getCompanyById, changeCompanyStatus } from '@/services/companies/companiesApi';
import { getTripsByCompanyId } from '@/services/trips/trips';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext.jsx'; // Import useAuth hook

/**
 * Main page/component to display all details for a company.
 * It composes the Header and Info components.
 */
export default function CompanyDetails() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [currentFilter, setCurrentFilter] = useState("الكل");
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const { user: authUser, isAdmin } = useAuth(); // Get auth user and admin status

    // Determine which ID to use for fetching company data
    // If user is admin and no ID in params, use auth user's ID
    const companyId = id || (isAdmin && authUser?.company.id ? authUser.company.id : null);

    // Query for fetching company data - will use cache if available
    const {
        data: companyResponse,
        isLoading: isLoadingCompany,
        isError: isErrorCompany,
        error: companyError,
    } = useQuery({
        queryKey: ['company', companyId],
        queryFn: () => getCompanyById(companyId),
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
        enabled: !!companyId, // Only fetch if we have a company ID
    });

    // Extract company data from the response
    const companyData = useMemo(() => {
        if (!companyResponse) return null;
        return companyResponse.company || companyResponse;
    }, [companyResponse]);

    // Query for fetching trips data - will only fetch if user is not admin
    const {
        data: tripsResponse = [],
        isLoading: isLoadingTrips,
        isError: isErrorTrips,
        error: tripsError
    } = useQuery({
        queryKey: ['companyTrips', companyId, currentFilter],
        queryFn: () => getTripsByCompanyId(companyId, currentFilter !== "الكل" ? currentFilter : undefined),
        enabled: !!companyId && !!companyData && !isAdmin, // Only fetch trips if we have a company ID, company data, and user is NOT admin
        staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
        cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Extract trips data from the response
    const tripsData = useMemo(() => {
        if (!tripsResponse) return [];

        if (Array.isArray(tripsResponse)) {
            return tripsResponse;
        } else if (tripsResponse.trips && Array.isArray(tripsResponse.trips)) {
            return tripsResponse.trips;
        } else if (tripsResponse.data && Array.isArray(tripsResponse.data)) {
            return tripsResponse.data;
        } else {
            console.warn('Unexpected trips response structure:', tripsResponse);
            return [];
        }
    }, [tripsResponse]);

    // Mutation for updating company status with optimistic updates
    const updateStatusMutation = useMutation({
        mutationFn: ({ status, reason }) => changeCompanyStatus(companyId, status, reason),
        onMutate: async ({ status, reason }) => {
            // Cancel any outgoing refetches to avoid overwriting our optimistic update
            await queryClient.cancelQueries(['company', companyId]);

            // Snapshot the previous value
            const previousCompany = queryClient.getQueryData(['company', companyId]);

            // Optimistically update to the new value
            queryClient.setQueryData(['company', companyId], (old) => {
                if (!old) return old;

                // Update the company status optimistically
                const updatedCompany = {
                    ...old,
                    company: {
                        ...old.company,
                        status: status
                    }
                };

                return updatedCompany;
            });

            // Return a context object with the snapshotted value
            return { previousCompany };
        },
        onSuccess: (responseData) => {
            console.log('Status change successful:', responseData);

            // Invalidate and refetch all related queries to ensure we have fresh data
            queryClient.invalidateQueries(['allCompanies']);

            toast.success("تم تحديث حالة الشركة بنجاح");
            setIsStatusDialogOpen(false);
        },
        onError: (error, variables, context) => {
            console.error('Status change failed:', error);

            // Roll back to the previous value on error
            if (context?.previousCompany) {
                queryClient.setQueryData(['company', companyId], context.previousCompany);
            }

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message;
            toast.error("فشل في تحديث حالة الشركة: " + errorMessage);
        },
        onSettled: () => {
            // Always refetch company data after error or success to ensure we're in sync
            queryClient.invalidateQueries(['company', companyId]);
        }
    });

    // Function to open the dialog
    const handleStatusChangeClick = useCallback(() => {
        console.log('Opening status dialog for company:', companyId);
        setIsStatusDialogOpen(true);
    }, [companyId]);

    // Function to handle the confirmation from the dialog
    const handleStatusConfirm = useCallback((newStatus, reason) => {
        console.log('Dialog confirmed:', newStatus, reason);
        updateStatusMutation.mutate({ status: newStatus, reason });
    }, [updateStatusMutation]);

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

    // Format trips data for the table
    const formattedTripsData = useMemo(() => {
        if (!tripsData || !Array.isArray(tripsData)) return [];

        return tripsData.map(trip => ({
            id: trip.id,
            tripName: trip.name || trip.tripName || trip.title || "N/A",
            date: trip.date || trip.start_date || trip.created_at || "N/A",
            duration: trip.days || trip.trip_duration || "N/A",
            tickets_count: trip.tickets_count || trip.ticketsCount || trip.available_tickets || 0,
            ticket_price: trip.ticket_price || trip.ticketPrice || trip.price || "N/A",
            status: trip.status || trip.trip_status || "N/A",
            originalData: trip
        }));
    }, [tripsData]);

    // Show loading skeleton if data is being fetched
    if (isLoadingCompany) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={300} />
            </Box>
        );
    }

    // Show error message if company data failed to load
    if (isErrorCompany) {
        return (
            <div className="p-4 text-red-600 font-semibold">
                فشل تحميل بيانات الشركة: {companyError.message}
            </div>
        );
    }

    // Check if companyData is available
    if (!companyData) {
        return (
            <div className="p-4 text-red-600 font-semibold">
                لا توجد بيانات للشركة
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto flex flex-col gap-6">
                <HeaderInfoCard
                    entityType="company"
                    title={companyData.name_of_company}
                    imageUrl={companyData.image}
                    rating={companyData.rating}
                    stats={companyData.number_of_trips}
                    date={companyData.founding_date}
                    status={companyData.status}
                    onStatusChangeClick={handleStatusChangeClick}
                    // Hide status change button if user is viewing their own profile
                    showStatusButton={!id && isAdmin}
                />
                <CompanyInfoCard data={companyData} />

                {/* Trips Table Section - Only show if user is not admin */}
                {!isAdmin && (
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

                        {isLoadingTrips ? (
                            <Box sx={{ width: '100%' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        variant="rectangular"
                                        width="100%"
                                        height={50}
                                        sx={{ mb: 1, borderRadius: 1 }}
                                    />
                                ))}
                            </Box>
                        ) : isErrorTrips ? (
                            <div className="p-4 text-red-600 font-semibold">
                                فشل تحميل بيانات الرحلات: {tripsError.message}
                            </div>
                        ) : formattedTripsData.length === 0 ? (
                            <div className="p-4 text-gray-600 text-center">
                                لا توجد رحلات لهذه الشركة
                            </div>
                        ) : (
                            <CommonTable
                                columns={tableColumns}
                                data={formattedTripsData}
                                basePath={`companies/${companyId}/trips`}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* The new dedicated dialog, correctly placed and managed */}
            <CompanyStatusDialog
                isOpen={isStatusDialogOpen}
                onClose={() => {
                    console.log('Closing status dialog');
                    setIsStatusDialogOpen(false);
                }}
                currentStatus={companyData.status}
                onConfirm={handleStatusConfirm}
                isLoading={updateStatusMutation.isPending}
            />
        </div>
    );
}