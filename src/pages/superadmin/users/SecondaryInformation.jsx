// components/users/SecondaryInformation.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InfoBox from "@/components/common/InfoBox.jsx";
import greenPen from "@/assets/icons/common/Green Pen.svg";
import events from "@/assets/icons/sidebar/eventsFill.svg"
import trips from "@/assets/icons/common/trips.svg";

export default function SecondaryInformation({ stats }) {
    const navigate = useNavigate();
    const { id } = useParams(); // Get user ID from URL params if available

    const handleNavigation = (activityType) => {
            navigate(`/users/${id}/${activityType}`);
    }

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <InfoBox
                    icon={trips}
                    title="عدد الرحلات المحجوزة"
                    count={stats.bookedTrips}
                    onClick={() => handleNavigation('trips')}
                />
                <InfoBox
                    icon={events}
                    title="عدد الأحداث المحجوزة"
                    count={stats.bookedEvents}
                    onClick={() => handleNavigation('events')}
                />
                <InfoBox
                    icon={greenPen}
                    title="عدد المنشورات"
                    count={stats.posts}
                    onClick={() => handleNavigation('posts')}
                />
            </div>
        </div>
    );
}