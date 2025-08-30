import { Star } from "lucide-react";
import Temp from "@/assets/icons/event/temp-icon.svg";
import Tickets from "@/assets/icons/event/tickets.svg";
import TicketPrice from "@/assets/icons/event/ticket-price.svg";
import companyImage from "@/assets/images/Company Profile.svg";
import doneIcon from "@/assets/icons/table/done small.svg";
import canceledIcon from "@/assets/icons/table/canceled small.svg";
import inprogressIcon from "@/assets/icons/table/inprogress small.svg";
import notyetIcon from "@/assets/icons/table/notyet small.svg";
import { useAuth } from "@/contexts/AuthContext.jsx";
import pen from "@/assets/icons/event/pen.svg";
import bin from "@/assets/icons/event/bin.svg";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TripDialog from "@/components/dialog/TripDialog";
import CancelDialog from "@/components/dialog/CancelDialog";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTrip, cancelTrip, createTrip, updateTrip } from "@/services/trips/trips";
import TripEditDialog from "@/components/dialog/TripEditDialog";

// ActionButton component
function ActionButton({ label, icon, variant, onClick, isLoading = false }) {
    const base = "flex items-center gap-2 px-5 py-2 rounded-full text-body-bold-14 hover:shadow-lg cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        outline: "text-green border-green border-2 hover:bg-green-50",
        danger: "bg-red text-white hover:bg-red-500",
        saved: "bg-green text-white hover:shadow-md",
    };

    return (
        <button
            className={`${base} ${variants[variant]}`}
            onClick={onClick}
            disabled={isLoading}
        >
            {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            ) : (
                <img src={icon} alt={label} className="w-4 h-4" />
            )}
            <span>{label}</span>
        </button>
    );
}

export default function TripInfoCard({
                                         title,
                                         price,
                                         capacity,
                                         discount,
                                         refNumber,
                                         rating,
                                         tags = [],
                                         description,
                                         company,
                                         companyThumbnail = companyImage,
                                         season = "الصيف",
                                         duration,
                                         date,
                                         status = "لم تبدأ بعد",
                                         className = "",
                                         tripId, // Get tripId from props
                                         images = [], // Add images prop
                                     }) {

    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id: urlTripId } = useParams(); // Get tripId from URL params
    const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Use tripId from props or fall back to URL tripId
    const currentTripId = tripId || urlTripId;

    // Function to format duration with Arabic day terms
    const formatDuration = (durationValue) => {
        if (!durationValue) return "—";

        // Extract numeric value from duration (remove any text)
        const numericValue = parseInt(durationValue.toString().replace(/[^\d]/g, ''));

        if (isNaN(numericValue)) return durationValue;

        // Use Arabic day terms based on the number
        if (numericValue === 1) {
            return `${numericValue} يوم`;
        } else if (numericValue === 2) {
            return `${numericValue} يومين`;
        } else if (numericValue >= 3 && numericValue <= 10) {
            return `${numericValue} أيام`;
        } else {
            return `${numericValue} يوماً`;
        }
    };

    // React Query Mutations
    const reactivateMutation = useMutation({
        mutationFn: (tripData) => createTrip({
            ...tripData,
            id: currentTripId, // Include the trip ID in the data
            mode: "reactivate" // Add mode to indicate this is a reactivation
        }),
        onSuccess: () => {
            setIsReactivateDialogOpen(false);
            queryClient.invalidateQueries(['trip', currentTripId]);
            queryClient.invalidateQueries(['trips']);
        },
        onError: (error) => {
            console.error("Error reactivating trip:", error);
        }
    });

    const cancelMutation = useMutation({
        mutationFn: () => cancelTrip(currentTripId),
        onSuccess: () => {
            setIsCancelDialogOpen(false);
            queryClient.invalidateQueries(['trip', currentTripId]);
            queryClient.invalidateQueries(['trips']);
        },
        onError: (error) => {
            console.error("Error canceling trip:", error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteTrip(currentTripId),
        onSuccess: () => {
            setIsDeleteDialogOpen(false);
            queryClient.invalidateQueries(['trip', currentTripId]);
            queryClient.invalidateQueries(['trips']);
            // Navigate back to trips page after successful deletion
            navigate('/trips');
        },
        onError: (error) => {
            console.error("Error deleting trip:", error);
        }
    });

    const editMutation = useMutation({
        mutationFn: (tripData) => updateTrip(currentTripId, tripData),
        onSuccess: () => {
            setIsEditDialogOpen(false);
            queryClient.invalidateQueries(['trip', currentTripId]);
            queryClient.invalidateQueries(['trips']);
        },
        onError: (error) => {
            console.error("Error updating trip:", error);
        }
    });

    // Status Badge logic reused from CommonTable
    const renderStatusBadge = (status) => {
        let icon, bg, text;

        // Normalize status to handle both "جارية حاليا" and "جارية حالياً"
        const normalizedStatus = status === "جارية حاليا" ? "جارية حالياً" : status;

        switch (normalizedStatus) {
            case "منتهية":
                icon = doneIcon;
                bg = "bg-green-100/60";
                text = "text-grey";
                break;
            case "تم الإلغاء":
            case "تم الالغاء":
                icon = canceledIcon;
                bg = "bg-red-50";
                text = "text-red-600";
                break;
            case "جارية حالياً":
                icon = inprogressIcon;
                bg = "bg-gold-500/10";
                text = "text-gold";
                break;
            case "لم تبدأ بعد":
                icon = notyetIcon;
                bg = "bg-gray-500/10";
                text = "text-gray-600";
                break;
            default:
                return status;
        }
        return (
            <div
                className={`flex items-center justify-center min-w-[100px] h-[32px] px-[8px] py-[6px] rounded-[16px] ${bg} ${text} box-border leading-none`}
            >
                <img src={icon} alt={status} className="w-5 h-5 ml-1" />
                <span className="text-body-regular-14-auto">{status}</span>
            </div>
        );
    };

    // Helper function to check if status is "جارية حالياً" (with or without the extra character)
    const isInProgressStatus = (status) => {
        return status === "جارية حالياً" || status === "جارية حاليا";
    };

    // Handle reactivate action
    const handleReactivate = (tripData) => {
        reactivateMutation.mutate(tripData);
    };

    // Handle cancel action
    const handleCancel = () => {
        cancelMutation.mutate();
    };

    // Handle delete action
    const handleDelete = () => {
        deleteMutation.mutate();
    };

    // Handle edit action - open edit dialog
    const handleEdit = () => {
        setIsEditDialogOpen(true);
    };

    // Handle edit form submission
    const handleEditSubmit = (tripData) => {
        editMutation.mutate(tripData);
    };

    return (
        <>
            <div className={`bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-6 w-full min-h-[430px] ${className}`}>
                {/* Row 1: Title + Discount & Status + Action Buttons */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-[32px] font-bold text-gray-900">{title}</h1>
                        {discount && (
                            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                                {parseFloat(discount).toFixed(0)}%
                            </span>
                        )}
                    </div>

                    {/* For Admin: Show action buttons OR status badge */}
                    {isAdmin ? (
                        <div className="flex items-center gap-2">
                            {/* Show both Edit and Cancel buttons for "لم تبدأ بعد" status */}
                            {status === "لم تبدأ بعد" && (
                                <>
                                    <ActionButton
                                        label="تعديل"
                                        icon={pen}
                                        variant="outline"
                                        onClick={handleEdit}
                                        isLoading={editMutation.isLoading}
                                    />
                                    <ActionButton
                                        label="إلغاء"
                                        icon={bin}
                                        variant="danger"
                                        onClick={() => setIsCancelDialogOpen(true)}
                                        isLoading={cancelMutation.isLoading}
                                    />
                                </>
                            )}
                            {/* Show only Delete button for "تم الإلغاء" status */}
                            {(status === "تم الإلغاء" || status === "تم الالغاء") && (
                                <ActionButton
                                    label="حذف"
                                    icon={bin}
                                    variant="danger"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    isLoading={deleteMutation.isLoading}
                                />
                            )}
                            {/* Show both Reactivate and Delete buttons for "منتهية" status */}
                            {status === "منتهية" && (
                                <>
                                    <ActionButton
                                        label="إعادة تفعيل"
                                        icon={pen}
                                        variant="outline"
                                        onClick={() => setIsReactivateDialogOpen(true)}
                                        isLoading={reactivateMutation.isLoading}
                                    />
                                    <ActionButton
                                        label="حذف"
                                        icon={bin}
                                        variant="danger"
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                        isLoading={deleteMutation.isLoading}
                                    />
                                </>
                            )}
                            {/* Show status badge for "جارية حالياً" or "جارية حاليا" status (no action buttons) */}
                            {isInProgressStatus(status) && renderStatusBadge(status)}
                        </div>
                    ) : (
                        // For non-admin users: Always show status badge on the right side
                        status && renderStatusBadge(status)
                    )}
                </div>

                {/* Row 2: Company + Rating + Season + Tickets + Price + Status (for admin) */}
                <div className="flex flex-wrap items-center justify-between gap-6">
                    {/* Company info - Hidden for admin */}
                    {!isAdmin && (
                        <div className="flex items-center gap-3">
                            <img
                                src={company?.image || companyThumbnail}
                                alt={company?.name || "Company"}
                                className="w-15 h-15 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-h1-bold-22 flex items-center gap-1 pb-1">
                                    {company?.name || "غير محدد"}
                                </p>
                                <p className="text-yellow-500 flex items-center gap-1 text-[16px] font-semibold">
                                    {parseFloat( rating || company?.rating ).toFixed(1)} <Star size={18} fill="currentColor" />
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Season, Tickets, Price - Right aligned for admin, normal for others */}
                    <div className={`flex items-center gap-6 flex-wrap ${isAdmin ? 'ml-auto' : ''}`}>
                        <span className="flex items-center gap-1 text-black text-body-bold-16">
                            <img src={Temp} alt="Season" className="w-5 h-5" /> {season || "—"}
                        </span>
                        <span className="flex items-center gap-1 text-black text-body-bold-16">
                            <img src={Tickets} alt="Tickets" className="w-5 h-5" /> {capacity}
                        </span>
                        <span className="flex items-center gap-1 text-black text-body-bold-16">
                            <img src={TicketPrice} alt="Price" className="w-5 h-5" /> {price}$
                        </span>

                        {/* Status Badge - Show for admin users in this position (except for in-progress status) */}
                        {isAdmin && !isInProgressStatus(status) && status && renderStatusBadge(status)}
                    </div>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                            <span
                                key={i}
                                className="bg-gray-100 text-green px-5 py-2 rounded-full text-body-regular-14-auto"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Description & Extra details */}
                <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
                    <div className="text-right">
                        <p className="text-body-bold-16 pb-3">الرقم التعريفي</p>
                        <p>{refNumber}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-body-bold-16 pb-3">الوصف</p>
                        <p>{description}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-body-bold-16 pb-3">التاريخ</p>
                        <p>{date}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-body-bold-16 pb-3">المدة</p>
                        <p>{formatDuration(duration)}</p>
                    </div>
                </div>
            </div>

            {/* Reactivate Dialog - Only for reactivate mode */}
            <TripDialog
                isOpen={isReactivateDialogOpen}
                onClose={() => setIsReactivateDialogOpen(false)}
                onSave={handleReactivate}
                mode="reactivate"
                initialData={{
                    name: title,
                    description,
                    season,
                    start_date: date,
                    days: duration,
                    tickets: capacity,
                    price,
                    discount: discount || 0,
                    discount_enabled: !!discount,
                    tags,
                    // Add other initial data as needed
                }}
                isLoading={reactivateMutation.isLoading}
            />

            {/* Edit Dialog */}
            <TripEditDialog
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                initialData={{
                    name: title,
                    description,
                    images: images, // Pass the images array from props
                    // Add other fields as needed
                }}
                onSubmit={handleEditSubmit}
                isLoading={editMutation.isLoading}
            />

            {/* Cancel Dialog */}
            <CancelDialog
                isOpen={isCancelDialogOpen}
                onClose={() => setIsCancelDialogOpen(false)}
                onConfirm={handleCancel}
                title="إلغاء الرحلة"
                message="هل أنت متأكد من أنك تريد إلغاء هذه الرحلة؟"
            />

            {/* Delete Dialog */}
            <CancelDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="حذف الرحلة"
                message="هل أنت متأكد من أنك تريد حذف هذه الرحلة؟ هذا الإجراء لا يمكن التراجع عنه."
            />
        </>
    );
}