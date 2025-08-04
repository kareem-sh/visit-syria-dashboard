// pages/DetailsPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ImageSection from "@/components/common/ImageSection";
import CommentsSection from "@/components/common/CommentsSection";
import InfoCard from "@/components/common/InfoCard";
import TripDetails from "@/components/common/TripDetails";
import LocationSection from "@/components/common/LocationSection";
import tripsData from "@/data/trips"; // Update the path if needed

const TripDetailsPage = () => {
    const { id } = useParams();
    const trip = tripsData.find((trip) => trip.id === id);

    if (!trip) {
        return (
            <div className="text-center p-10 text-red-500">
                الرحلة غير موجودة أو تم حذفها.
            </div>
        );
    }

    const type = "trip"; // or dynamically set this if needed

    return (
        <div className="details-page">
            {/* Example: Use placeholders for now if trip doesn't have these */}
            <ImageSection
                mainImage={trip.mainImage || "/placeholder-main.jpg"}
                secondaryImage={trip.secondaryImage || "/placeholder-secondary.jpg"}
                layout="default"
            />

            <InfoCard
                info={{
                    title: trip.tripName,
                    date: trip.date,
                    company: trip.company,
                    status: trip.status,
                }}
                fullWidth={false}
            />

            <TripDetails tripData={trip} />

            <CommentsSection
                comments={trip.comments || []}
                variant="default"
            />
        </div>
    );
};

export default TripDetailsPage;
