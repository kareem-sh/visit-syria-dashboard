import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import ImageSection from "@/components/common/ImageSection";
import CommentsSection from "@/components/common/CommentsSection";
import PlaceInfoCard from "@/components/common/PlaceInfoCard.jsx";
import { getPlaceDetails, deletePlace, updatePlace } from "@/services/places/placesApi";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import CancelDialog from "@/components/dialog/CancelDialog";
import PlaceForm from "@/components/dialog/PlaceForm";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const PlaceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const imageRef = useRef(null);
    const [imageHeight, setImageHeight] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Fetch place details
    const { data: item, isLoading, isError, refetch } = useQuery({
        queryKey: ['placeDetails', id],
        queryFn: () => getPlaceDetails(id),
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: () => deletePlace(id),
        onSuccess: () => {
            toast.success("تم حذف المكان بنجاح");
            navigate('/places');
        },
        onError: (error) => {
            console.error("Error deleting place:", error);
            toast.error("حدث خطأ أثناء حذف المكان");
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: (formData) => updatePlace(id, formData),
        onSuccess: () => {
            toast.success("تم تحديث المكان بنجاح");
            refetch();
        },
        onError: (error) => {
            console.error("Error updating place:", error);
            toast.error("حدث خطأ أثناء تحديث المكان");
        }
    });

    const handleDeleteConfirm = () => {
        deleteMutation.mutate();
        setShowDeleteDialog(false);
    };

    const handleEditSuccess = (formData) => {
        updateMutation.mutate(formData);
        setShowEditForm(false);
    };

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

    if (isLoading) {
        return <PageSkeleton rows={6} />;
    }

    if (isError) {
        return (
            <div className="text-center p-10 text-red-500">
                حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى لاحقًا.
            </div>
        );
    }

    if (!item) {
        return (
            <div className="text-center p-10 text-red-500">
                العنصر غير موجود أو تم حذفه.
            </div>
        );
    }

    const mainImage = item.images?.[0];
    const secondaryImages = item.images?.slice(1) || [];

    // Only show edit/delete buttons for superadmin
    const isSuperAdmin = user?.role === 'superadmin';

    return (
        <div className="w-full flex justify-center">
            <div className="details-page w-full px-4 space-y-6">
                {/* Top Layout: Image + Comments */}
                <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
                    <div ref={imageRef} className="flex-1">
                        <ImageSection
                            mainImage={mainImage}
                            secondaryImages={secondaryImages}
                            layout="default"
                        />
                    </div>

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

                {/* Info Card with built-in edit/delete buttons */}
                <div className="w-full">
                    <PlaceInfoCard
                        data={item}
                        onEdit={isSuperAdmin ? () => setShowEditForm(true) : null}
                        onDelete={isSuperAdmin ? () => setShowDeleteDialog(true) : null}
                    />
                </div>

                {/* Delete Confirmation Dialog */}
                <CancelDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={handleDeleteConfirm}
                    title="حذف المكان"
                    message="هل أنت متأكد من حذف هذا المكان؟ لا يمكن التراجع عن هذا الإجراء."
                    isLoading={deleteMutation.isLoading}
                />

                {/* Edit Form Dialog */}
                {showEditForm && (
                    <PlaceForm
                        onClose={() => setShowEditForm(false)}
                        onSuccess={handleEditSuccess}
                        submitFn={updatePlace}
                        initialData={item}
                        isEdit={true}
                        isLoading={updateMutation.isLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default PlaceDetailsPage;