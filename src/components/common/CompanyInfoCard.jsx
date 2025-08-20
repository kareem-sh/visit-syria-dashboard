// src/components/company/CompanyInfo.jsx
import React, { useState } from 'react';
import Map from '@/components/common/Map.jsx';
import DocumentViewer from '@/components/common/DocumentViewer';
import { Paperclip, Eye } from 'lucide-react';

/**
 * The main content section displaying detailed company information.
 * @param {object} props
 * @param {object} props.data - The detailed data for the company.
 */
export default function CompanyInfoCard({ data }) {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedDocIndex, setSelectedDocIndex] = useState(0);

    if (!data) return null;

    const {
        id,
        name_of_owner,
        email,
        place,
        latitude,
        longitude,
        license_number,
        country_code,
        phone,
        description,
        documents = [],
    } = data;

    const position = latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : null;

    const handleOpenViewer = (index) => {
        setSelectedDocIndex(index);
        setViewerOpen(true);
    };

    // The rest of the component is identical to the previous 'CompanyDetails' component
    return (
        <>
            <div className="bg-white p-6 rounded-2xl shadow-sm w-full" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {/* === Right Column (in RTL) === */}
                    <div className="flex flex-col gap-y-4">
                        <InfoItem label="الرقم التعريفي" value={id ?? "N/A"} />
                        <InfoItem label="اسم صاحب الشركة" value={name_of_owner} />
                        <InfoItem label="البريد الإلكتروني" value={email} />

                        {position && (
                            <div className="mt-2">
                                <h2 className="text-body-bold-16 text-(--text-title) pb-1">الموقع</h2>
                                <p className="text-(--text-paragraph) pb-3">{place}</p>
                                <div className="rounded-xl overflow-hidden ">
                                    <Map position={position} width="100%" height={220} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* === Left Column (in RTL) === */}
                    <div className="flex flex-col gap-y-4">
                        <InfoItem label="رقم الترخيص" value={license_number} />
                        <InfoItem label="رقم الهاتف" value={`${phone} ${country_code.slice(1)}+`} />
                        <InfoItem label="الوصف" value={description} />

                        {documents.length > 0 && (
                            <div className="mt-2">
                                <h2 className="text-body-bold-16 text-(--text-title) pb-2">الوثائق</h2>
                                <div className="grid grid-cols-5 gap-3 w-[75%]">
                                    {documents.map((doc, index) => (
                                        <DocumentItem key={index} doc={doc} onClick={() => handleOpenViewer(index)} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Document Viewer Modal */}
            {viewerOpen && (
                <DocumentViewer
                    documents={documents}
                    initialIndex={selectedDocIndex}
                    onClose={() => setViewerOpen(false)}
                />
            )}
        </>
    );
}


/* === Helper Components (InfoItem, DocumentItem) === */
function InfoItem({ label, value }) {
    if (!value) return null;
    return (
        <div>
            <p className="text-body-bold-16 text-(--text-title) pb-1">{label}</p>
            <p className="text-(--text-paragraph) break-words">{value}</p>
        </div>
    );
}

function DocumentItem({ doc, onClick }) {
    const isImage = doc.type === 'image' && doc.url;
    return (
        <div onClick={onClick} className="relative w-20 aspect-square border border-grey-300 rounded-xl overflow-hidden group cursor-pointer">
            {isImage ? (<img src={doc.url} alt={doc.name} className="w-full h-full object-cover"/>)
                : ( <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-2"><Paperclip size={24} className="text-gray-400 mb-1" /><span className="text-xs text-gray-600 text-center truncate w-full">{doc.name}</span></div>)}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Eye size={24} className="text-white" /></div>
        </div>
    );
}