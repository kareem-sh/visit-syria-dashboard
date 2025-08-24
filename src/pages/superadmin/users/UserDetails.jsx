// UserDetails.jsx
import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import HeaderInfoCard from '@/components/common/HeaderInfoCard';
import PersonalInformation from '@/pages/superadmin/users/PersonalInformation';
import Preferences from '@/pages/superadmin/users/Preferences';
import SecondaryInformation from '@/pages/superadmin/users/SecondaryInformation.jsx';
import BanUserDialog from '@/components/dialog/BanUserDialog';
import UnbanUserDialog from '@/components/dialog/UnbanUserDialog';
import { getUserById, changeUserStatus } from '@/services/users/usersApi';
import { PageSkeleton } from '@/components/common/PageSkeleton.jsx';
import { userKeys } from './Users'; // Import the shared keys

// ✅ Use react-toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserDetails() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
    const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);

    // Try to get user from cache first
    const cachedUsers = queryClient.getQueryData(userKeys.lists());
    const cachedUser = cachedUsers?.find(user => user.id.toString() === id);

    // Fetch user data only if not in cache
    const { data: user, isLoading, isError, error, refetch: refetchUser } = useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => getUserById(id),
        enabled: !!id && !cachedUser, // Only fetch if not in cache
        initialData: cachedUser, // Use cached data as initial data
    });

    // Use useMemo to ensure transformedUser updates when user data changes
    const transformedUser = useMemo(() => {
        if (!user) return null;

        return {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            imageUrl: user.photo,
            nationality: user.country,
            dob: user.date_of_birth,
            gender: user.gender === 'female' ? 'أنثى' : 'ذكر',
            email: user.email,
            phone: ` ${user.phone} ${user.country_code.slice(1)}+`,
            status: user.account_status || 'نشط',
        };
    }, [user]); // Re-run when user changes

    const isBanned = useMemo(() => {
        return transformedUser?.status && transformedUser.status !== 'نشط';
    }, [transformedUser?.status]);

    // Function to fetch user data (for the dialog)
    const fetchUserData = async (userId) => {
        try {
            const userData = await getUserById(userId);
            return userData;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    };

    // Function to force refresh user data
    const forceRefreshUserData = async () => {
        try {
            // Invalidate and refetch both queries
            await queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
            await queryClient.invalidateQueries({ queryKey: userKeys.lists() });

            // Force immediate refetch
            await refetchUser();

            // Also refetch the users list if needed
            const usersQuery = queryClient.getQueryState(userKeys.lists());
            if (usersQuery) {
                await queryClient.refetchQueries({ queryKey: userKeys.lists() });
            }
        } catch (error) {
            console.error("Error refreshing user data:", error);
        }
    };

    // Change user status mutation
    const changeStatusMutation = useMutation({
        mutationFn: (statusData) => changeUserStatus(statusData),
        onSuccess: async (_, variables) => {
            // Force immediate refresh of data
            await forceRefreshUserData();

            setIsBanDialogOpen(false);
            setIsUnbanDialogOpen(false);

            if (variables.status === 'unblock') {
                toast.success('تم رفع الحظر عن المستخدم بنجاح ✅');
            } else if (variables.status === 'block') {
                toast.success('تم حظر المستخدم بنجاح 🚫');
            }
        },
        onError: (error) => {
            console.error('Error changing user status:', error);
            toast.error('حدث خطأ أثناء تغيير حالة المستخدم ❌');

            // Even on error, try to refresh to ensure UI is in sync with server
            forceRefreshUserData();
        }
    });

    const userStats = user ? {
        bookedTrips: user.reserved_trips,
        bookedEvents: user.reserved_events,
        posts: user.number_of_post
    } : null;

    const userPreferences = user?.preference ? {
        season: user.preference.preferred_season?.join('، ') || 'غير محدد',
        tripType: user.preference.preferred_activities?.join('، ') || 'غير محدد',
        duration: user.preference.duration
            ? `${user.preference.duration.min_days} - ${user.preference.duration.max_days} أيام`
            : 'غير محدد',
        provinces: user.preference.cities?.join('، ') || 'غير محدد'
    } : null;

    const handleStatusChangeClick = () => {
        if (isBanned) {
            setIsUnbanDialogOpen(true);
        } else {
            setIsBanDialogOpen(true);
        }
    };

    const handleBan = (reason, duration, isPermanent) => {
        const statusData = {
            user_id: id,
            status: 'block',
            duration: isPermanent ? 'always' : duration,
            reason: reason
        };
        changeStatusMutation.mutate(statusData);
    };

    const handleUnban = () => {
        const statusData = {
            user_id: id,
            status: 'unblock'
        };
        changeStatusMutation.mutate(statusData);
    };

    if (isLoading) {
        return <PageSkeleton rows={6} />;
    }

    if (isError) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-red-500 text-center">
                    Error loading user: {error.message}
                </div>
            </div>
        );
    }

    if (!user || !transformedUser) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center">
                    User not found
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6" dir="rtl">
            <HeaderInfoCard
                title={transformedUser.name}
                entityType="user"
                imageUrl={transformedUser.imageUrl}
                rating={transformedUser.rating}
                date={transformedUser.joinDate}
                status={transformedUser.status}
                onStatusChangeClick={handleStatusChangeClick}
                isActionLoading={changeStatusMutation.isPending}
            />

            <h2 className="text-h1-bold-24 text-gray-800 mb-6">المعلومات الشخصية</h2>
            <PersonalInformation user={transformedUser} />

            <h2 className="text-h1-bold-24 text-gray-800 mb-6">التفضيلات</h2>
            <Preferences prefs={userPreferences || ""} />

            <h2 className="text-h1-bold-24 text-gray-800 mb-6">المعلومات الثانوية</h2>
            <SecondaryInformation stats={userStats} />

            {/* Ban Dialog */}
            {isBanDialogOpen && (
                <BanUserDialog
                    userName={transformedUser.name}
                    onBan={handleBan}
                    onClose={() => setIsBanDialogOpen(false)}
                    isLoading={changeStatusMutation.isPending}
                />
            )}

            {/* Unban Dialog */}
            {isUnbanDialogOpen && (
                <UnbanUserDialog
                    userName={transformedUser.name}
                    userId={id}
                    onUnban={handleUnban}
                    onClose={() => setIsUnbanDialogOpen(false)}
                    isLoading={changeStatusMutation.isPending}
                    onBanExpired={forceRefreshUserData}
                    fetchUserData={fetchUserData}
                />
            )}

            {/* ✅ Toast container */}
            <ToastContainer position="top-left" autoClose={3000} />
        </div>
    );
}