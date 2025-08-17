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

const ImageSection = ({ mainImage, secondaryImages = [], layout = "default" }) => {
    const [zoomImage, setZoomImage] = useState(null);

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Main Image */}
            <div
                className="w-full aspect-[650/300] overflow-hidden rounded-xl shadow cursor-pointer"
                onClick={() => setZoomImage(mainImage)}
            >
                <img
                    src={mainImage}
                    alt="Main"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Thumbnails */}
            {secondaryImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 w-full">
                    {secondaryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className="w-full h-[134px] overflow-hidden rounded-xl border border-gray-200 shadow cursor-pointer hover:scale-105 transition-transform"
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
            )}

            {/* Zoom Image Modal */}
            {zoomImage && <ImageModal src={zoomImage} onClose={() => setZoomImage(null)} />}
        </div>
    );
};

export default ImageSection;