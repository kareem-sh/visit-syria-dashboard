import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Download, ZoomIn, ZoomOut } from "lucide-react";

const DocumentViewer = ({ documents, initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") nextDocument();
            if (e.key === "ArrowLeft") prevDocument();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, onClose]);

    useEffect(() => {
        // Reset image error when document changes
        setImageError(false);
        setZoomLevel(1);
    }, [currentIndex]);

    const nextDocument = () => {
        setCurrentIndex((prev) => (prev + 1) % documents.length);
    };

    const prevDocument = () => {
        setCurrentIndex((prev) => (prev - 1 + documents.length) % documents.length);
    };

    const zoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    };

    const zoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    };

    const downloadDocument = () => {
        const currentDoc = documents[currentIndex];

        // Handle different document types
        if (typeof currentDoc === 'string') {
            // URL string from API
            const link = document.createElement("a");
            link.href = currentDoc;
            link.download = currentDoc.split('/').pop() || "document";
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (currentDoc.url) {
            // Object with URL property (could be from API or upload)
            const link = document.createElement("a");
            link.href = currentDoc.url;
            link.download = currentDoc.name || currentDoc.url.split('/').pop() || "document";
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (currentDoc instanceof File || currentDoc.file) {
            // File object from upload
            const file = currentDoc instanceof File ? currentDoc : currentDoc.file;
            const url = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    if (!documents || documents.length === 0) return null;

    const currentDoc = documents[currentIndex];

    // Determine if the document is an image and get its URL
    const getDocumentInfo = () => {
        let url = null;
        let isImage = false;
        let name = "document";

        // Handle different document types
        if (typeof currentDoc === 'string') {
            // URL string from API
            url = currentDoc;
            name = url.split('/').pop();
            isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
        } else if (currentDoc.url) {
            // Object with URL property
            url = currentDoc.url;
            name = currentDoc.name || url.split('/').pop();
            isImage = currentDoc.type === 'image' || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
        } else if (currentDoc instanceof File) {
            // File object from upload
            url = URL.createObjectURL(currentDoc);
            name = currentDoc.name;
            isImage = currentDoc.type.startsWith('image/');
        } else if (currentDoc.file) {
            // Object with file property (from upload)
            url = URL.createObjectURL(currentDoc.file);
            name = currentDoc.name || currentDoc.file.name;
            isImage = currentDoc.type === 'image' || currentDoc.file.type.startsWith('image/');
        }

        return { url, isImage, name };
    };

    const { url, isImage, name } = getDocumentInfo();

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10000]">
            <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 cursor-pointer z-10"
                onClick={onClose}
                type="button"
            >
                <X size={32} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
                {documents.length > 1 && (
                    <>
                        <button
                            className="absolute left-4 text-white hover:text-gray-300 cursor-pointer z-10 bg-black/50 rounded-full p-2"
                            onClick={prevDocument}
                            type="button"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            className="absolute right-4 text-white hover:text-gray-300 cursor-pointer z-10 bg-black/50 rounded-full p-2"
                            onClick={nextDocument}
                            type="button"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </>
                )}

                <div className="absolute top-4 left-4 flex gap-2 z-10">
                    {isImage && (
                        <>
                            <button
                                className="text-white hover:text-gray-300 cursor-pointer bg-black/50 rounded-full p-2"
                                onClick={zoomIn}
                                type="button"
                                disabled={zoomLevel >= 3}
                            >
                                <ZoomIn size={24} />
                            </button>
                            <button
                                className="text-white hover:text-gray-300 cursor-pointer bg-black/50 rounded-full p-2"
                                onClick={zoomOut}
                                type="button"
                                disabled={zoomLevel <= 0.5}
                            >
                                <ZoomOut size={24} />
                            </button>
                        </>
                    )}
                    <button
                        className="text-white hover:text-gray-300 cursor-pointer bg-black/50 rounded-full p-2"
                        onClick={downloadDocument}
                        type="button"
                    >
                        <Download size={24} />
                    </button>
                </div>

                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
                    {currentIndex + 1} / {documents.length}
                </div>

                <div className="max-w-4xl max-h-full w-full h-full flex items-center justify-center p-4">
                    {isImage && url && !imageError ? (
                        <img
                            src={url}
                            alt={name}
                            className="max-w-full max-h-full object-contain"
                            style={{ transform: `scale(${zoomLevel})` }}
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="bg-white p-8 rounded-lg text-center max-w-md">
                            <p className="text-gray-700 mb-4">
                                {imageError ? "تعذر تحميل الصورة" : "هذا النوع من الملفات لا يمكن معاينته"}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">{name}</p>
                            <button
                                onClick={downloadDocument}
                                className="bg-green text-white px-4 py-2 rounded-lg hover:bg-green-dark"
                            >
                                تحميل الملف
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentViewer;