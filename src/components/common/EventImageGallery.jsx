// EventImageGallery.jsx (unchanged - it's correct)
import React, { useState } from "react";
import { createPortal } from "react-dom";

const ImageModal = ({ src, onClose }) => {
    return createPortal(
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-[9999]"
        >
            <img
                src={src}
                alt="Zoomed"
                className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg object-contain"
                onClick={(e) => e.stopPropagation()}
            />
        </div>,
        document.body
    );
};

const EventImageGallery = ({ mainImage, secondaryImages = [] }) => {
    const [zoomImage, setZoomImage] = useState(null);

    return (
        <div className="flex w-full h-full gap-3">
            {/* Thumbnails */}
            <div className="flex flex-col justify-between gap-3">
                {secondaryImages.slice(0, 3).map((img, idx) => (
                    <div
                        key={idx}
                        className="overflow-hidden rounded-xl border border-gray-200 shadow cursor-pointer hover:scale-105 transition-transform"
                        style={{ minWidth: "150px", height: "92px" }}
                        onClick={() => setZoomImage(img)}
                    >
                        <img
                            src={img}
                            alt={`thumb-${idx}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Main Image */}
            <div
                className="h-full flex-1 overflow-hidden rounded-xl shadow cursor-pointer"
                onClick={() => setZoomImage(mainImage)}
            >
                <img
                    src={mainImage}
                    alt="Main"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Zoom Modal */}
            {zoomImage && (
                <ImageModal src={zoomImage} onClose={() => setZoomImage(null)} />
            )}
        </div>
    );
};

export default EventImageGallery;