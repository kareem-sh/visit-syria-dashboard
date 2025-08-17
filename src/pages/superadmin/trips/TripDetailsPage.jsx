import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageSection from "@/components/common/ImageSection";
import CommentsSection from "@/components/common/CommentsSection";
import TripInfoCard from "@/components/common/TripInfoCard.jsx";
import DayDetails from "@/components/common/DayDetails";
import { getDataByType } from "@/data/index.js";

const TripDetailsPage = ({ type = "event" }) => {
    const { id } = useParams();
    const data = getDataByType(type) || [];
    const item = data.find((el) => String(el.id) === String(id));

    const imageRef = useRef(null);
    const [imageHeight, setImageHeight] = useState(0);

    useEffect(() => {
        if (!item || !item.images) return;
        const measure = () => {
            if (imageRef.current) {
                setImageHeight(imageRef.current.clientHeight);
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [item?.images]);

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
                        <CommentsSection comments={item.comments || []} status={item.status} />
                    </div>
                </div>

                {/* Product Info Card */}
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                    {/* Product Info Card */}
                    <div className="lg:w-[60%] w-full">
                        <TripInfoCard
                            title={item.tripName}
                            price={item.price}
                            capacity={item.capacity}
                            discount={item.discount}
                            refNumber={item.refNumber}
                            rating={item.rating}
                            tags={item.tags}
                            description={item.description}
                            company={item.company}
                            season={item.season}
                            duration={item.duration}
                            date={item.date}
                            status={item.status}
                        />
                    </div>

                    {/* Day Details */}
                    {item.days && item.days.length > 0 && (
                        <div className="flex-1 w-full">
                            <h3 className="text-h1-bold-22 mb-2">جدول الرحلات</h3>
                            <DayDetails days={item.days} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TripDetailsPage;
