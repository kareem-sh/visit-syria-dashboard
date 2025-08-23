import React, { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Download, ZoomIn, ZoomOut } from "lucide-react";

const DocumentViewer = ({ documents, initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") nextDocument();
            if (e.key === "ArrowLeft") prevDocument();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, onClose]);

    const nextDocument = () => {
        setCurrentIndex((prev) => (prev + 1) % documents.length);
        setZoomLevel(1);
    };

    const prevDocument = () => {
        setCurrentIndex((prev) => (prev - 1 + documents.length) % documents.length);
        setZoomLevel(1);
    };

    const zoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    };

    const zoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    };

    const downloadDocument = () => {
        const currentDoc = documents[currentIndex];
        if (typeof currentDoc === 'string' || currentDoc.url) {
            // Handle URL strings (from API)
            const url = typeof currentDoc === 'string' ? currentDoc : currentDoc.url;
            const link = document.createElement("a");
            link.href = url;
            link.download = url.split('/').pop() || "document";
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (currentDoc instanceof File) {
            // Handle File objects (from upload)
            const url = URL.createObjectURL(currentDoc);
            const link = document.createElement("a");
            link.href = url;
            link.download = currentDoc.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    if (!documents || documents.length === 0) return null;

    const currentDoc = documents[currentIndex];

    // Determine if the document is an image
    const isImage = () => {
        // If it's a URL string, check the extension
        if (typeof currentDoc === 'string') {
            return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(currentDoc);
        }

        // If it's a file object with type
        if (currentDoc.type) {
            return currentDoc.type.startsWith("image/");
        }

        // If it's a file object with name
        if (currentDoc.name) {
            return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(currentDoc.name);
        }

        // If it's a file object with url
        if (currentDoc.url) {
            return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(currentDoc.url);
        }

        return false;
    };

    const getDocumentUrl = () => {
        if (typeof currentDoc === 'string') return currentDoc;
        if (currentDoc.url) return currentDoc.url;
        if (currentDoc instanceof File) return URL.createObjectURL(currentDoc);
        return null;
    };

    const documentUrl = getDocumentUrl();
    const isImageFile = isImage();

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
                    {isImageFile && (
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
                    {isImageFile && documentUrl ? (
                        <img
                            src={documentUrl}
                            alt={typeof currentDoc === 'string' ? "Document" : currentDoc.name || "Document"}
                            className="max-w-full max-h-full object-contain"
                            style={{ transform: `scale(${zoomLevel})` }}
                        />
                    ) : (
                        <div className="bg-white p-8 rounded-lg text-center max-w-md">
                            <p className="text-gray-700 mb-4">هذا النوع من الملفات لا يمكن معاينته</p>
                            <p className="text-sm text-gray-500 mb-4">
                                {typeof currentDoc === 'string'
                                    ? currentDoc.split('/').pop()
                                    : currentDoc.name || "ملف غير معروف"}
                            </p>
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