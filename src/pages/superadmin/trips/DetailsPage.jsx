import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageSection from "@/components/common/ImageSection";
import InfoCard from "@/components/common/InfoCard";
import TripDetails from "@/components/common/TripDetails";
import LocationSection from "@/components/common/LocationSection";
import CommentsSection from "@/components/common/CommentsSection";
import { getDataByType } from "@/data/index.js";

const DetailsPage = ({ type = "trip" }) => {
    const { id } = useParams();
    const data = getDataByType(type);
    const item = data.find((item) => item.id === id);

    const imageRef = useRef(null);
    const [imageHeight, setImageHeight] = useState(0);

    useEffect(() => {
        const measure = () => {
            if (imageRef.current) {
                setImageHeight(imageRef.current.clientHeight);
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [item.images]);

    if (!item) {
        return (
            <div className="text-center p-10 text-red-500">
                العنصر غير موجود أو تم حذفه.
            </div>
        );
    }

    const mainImage = item.images?.[0];
    const secondaryImages = item.images?.slice(1) || [];

    return (
        <div className="w-full flex justify-center">
            <div className="details-page w-full px-4 space-y-6">
                {/* Top Layout: Image + Comments */}
                <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
                    {/* Image Section */}
                    <div ref={imageRef} className="flex-1">
                        <ImageSection
                            mainImage={mainImage}
                            secondaryImages={secondaryImages}
                            layout={type === "event" ? "event" : "default"}
                        />
                    </div>

                    {/* Comments Section */}
                    <div
                        className="flex-1 flex flex-col"
                        style={{ height: imageHeight, overflowY: "auto" }}
                    >
                        <h3 className="text-h1-bold-22 mb-2">التقييمات و التعليقات</h3>
                        <CommentsSection comments={item.comments || []} />
                    </div>
                </div>

                {/* Info Section */}
                <InfoCard
                    info={{
                        title: item.tripName || item.name,
                        date: item.date,
                        company: item.company,
                        description: item.description,
                    }}
                    fullWidth={type === "hotel" || type === "restaurant"}
                />

                {/* Trip specific details */}
                {type === "trip" && <TripDetails tripData={item} />}

                {/* Location section */}
                {item.location && <LocationSection location={item.location} fullWidth />}
            </div>
        </div>
    );
};

export default DetailsPage;
