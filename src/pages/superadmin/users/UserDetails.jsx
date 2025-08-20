// src/pages/superadmin/users/UserDetails.jsx
import React, { useState } from 'react';
import HeaderInfoCard from '@/components/common/HeaderInfoCard';
import PersonalInformation from '@/pages/superadmin/users/PersonalInformation';
import Preferences from '@/pages/superadmin/users/Preferences';
import SecondaryInformation from '@/pages/superadmin/users/SecondaryInformation.jsx';

// Import the dialog components
import BanUserDialog from '@/components/dialog/BanUserDialog';
import UnbanUserDialog from '@/components/dialog/UnbanUserDialog';

export default function UserDetails() {
    // State to manage the user's status and the dialogs
    const [user, setUser] = useState({
        id: 'USR-12345',
        name: 'أحمد محمد',
        imageUrl: null,
        rating: 4.5,
        nationality: 'سوري',
        dob: '15/05/1990',
        gender: 'ذكر',
        email: 'ahmed.mohamed@example.com',
        phone: '+963 123 456 789',
        status: 'نشط',
        joinDate: '2023-01-15',
        banDuration: '5 أيام' // Example ban duration from API
    });
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
    const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);

    // Determine if user is banned based on status
    const isBanned = user.status !== 'نشط';

    const userStats = {
        bookedTrips: 12,
        bookedEvents: 8,
        posts: 42
    };

    const userPreferences = {
        season: 'الربيع والخريف',
        tripType: 'رحلات ثقافية وتاريخية',
        duration: 'من 3 إلى 7 أيام',
        provinces: 'دمشق، حلب، اللاذقية'
    };

    const handleStatusChangeClick = () => {
        if (isBanned) {
            setIsUnbanDialogOpen(true);
        } else {
            setIsBanDialogOpen(true);
        }
    };

    // Callback function to handle banning the user
    const handleBan = (reason, duration, isPermanent) => {
        // Here you would call your API to ban the user
        console.log(`Banning user ${user.name} for ${duration} with reason: ${reason}`);

        // Determine the status based on whether it's permanent or temporary
        const newStatus = isPermanent ? 'حظر نهائي' : 'حظر مؤقت';

        // After successful API call, update local state
        setUser({
            ...user,
            status: newStatus,
            banDuration: isPermanent ? null : duration
        });

        // Close the dialog
        setIsBanDialogOpen(false);
    };

    // Callback function to handle unbanning the user
    const handleUnban = () => {
        // Here you would call your API to unban the user
        console.log(`Unbanning user ${user.name}`);
        // After successful API call, update local state
        setUser({ ...user, status: 'نشط', banDuration: null });
        // Close the dialog
        setIsUnbanDialogOpen(false);
    };

    return (
        <div className="container mx-auto space-y-6" dir="rtl">
            <HeaderInfoCard
                title={user.name}
                entityType="user"
                imageUrl={user.imageUrl}
                rating={user.rating}
                date={user.joinDate}
                status={user.status}
                onStatusChangeClick={handleStatusChangeClick}
            />

            <h2 className="text-h1-bold-24 text-gray-800 mb-6">المعلومات الشخصية</h2>
            <PersonalInformation user={user} />
            <h2 className="text-h1-bold-24 text-gray-800 mb-6">التفضيلات</h2>
            <Preferences prefs={userPreferences} />
            <h2 className="text-h1-bold-24 text-gray-800 mb-6">المعلومات الثانوية</h2>
            <SecondaryInformation stats={userStats} />

            {/* Conditionally render the Ban dialog */}
            {isBanDialogOpen && (
                <BanUserDialog
                    userName={user.name}
                    onBan={handleBan}
                    onClose={() => setIsBanDialogOpen(false)}
                />
            )}

            {/* Conditionally render the Unban dialog */}
            {isUnbanDialogOpen && (
                <UnbanUserDialog
                    userName={user.name}
                    // This prop would come from your API
                    banDuration={user.banDuration}
                    onUnban={handleUnban}
                    onClose={() => setIsUnbanDialogOpen(false)}
                />
            )}
        </div>
    );
}