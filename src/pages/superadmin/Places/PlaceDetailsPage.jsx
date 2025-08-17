import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageSection from "@/components/common/ImageSection";
import CommentsSection from "@/components/common/CommentsSection";
import PlaceInfoCard from "@/components/common/PlaceInfoCard.jsx";
import * as places from "@/data/places.js"; // safe: may export demoData and/or getDataByType

const PlaceDetailsPage = () => {
    const { id } = useParams();

    // Build an items array robustly:
    const allItems = Array.isArray(places.demoData)
        ? places.demoData
        : (typeof places.getDataByType === "function"
            ? // try common types if demoData isn't exported
            ["restaurant", "hotel", "tourist"].flatMap((t) => places.getDataByType(t) || [])
            : []);

    const item = allItems.find((el) => String(el.id) === String(id));

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
                            layout="default"
                        />
                    </div>

                    {/* Comments Section */}
                    <div
                        className="flex-1 flex flex-col"
                        style={{ height: imageHeight, overflowY: "auto" }}
                    >
                        <h3 className="text-h1-bold-22 mb-2">التقييمات و التعليقات</h3>
                        <CommentsSection
                            comments={item.recent_comments || []}
                        />
                    </div>
                </div>

                {/* Info Card (full width + map inside) */}
                <div className="w-full">
                    <PlaceInfoCard data={item} />
                </div>
            </div>
        </div>
    );
};

export default PlaceDetailsPage;
