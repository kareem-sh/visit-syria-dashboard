import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Banner from "@/components/common/Banner.jsx";
import Chart from "@/components/common/Chart.jsx";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";
import GoldSpinner from "@/components/common/GoldCircularProgress.jsx";
import places from "@/assets/images/places.svg";
import PlaceCardDamascus from "@/assets/images/places/Place Card-13.png";
import PlaceCardRifDimashq from "@/assets/images/places/Place Card.svg";
import PlaceCardHama from "@/assets/images/places/Place Card-1.svg";
import PlaceCardHoms from "@/assets/images/places/Place Card-2.svg";
import PlaceCardLatakia from "@/assets/images/places/Place Card-3.svg";
import PlaceCardAleppo from "@/assets/images/places/Place Card-4.svg";
import PlaceCardDaraa from "@/assets/images/places/Place Card-7.svg";
import PlaceCardSweida from "@/assets/images/places/Place Card-5.svg";
import PlaceCardTartus from "@/assets/images/places/Place Card-6.svg";
import PlaceCardDeirEzZor from "@/assets/images/places/Place Card-9.svg";
import PlaceCardIdlib from "@/assets/images/places/Place Card-10.svg";
import PlaceCardHasaka from "@/assets/images/places/Place Card-11.svg";
import PlaceCardQuneitra from "@/assets/images/places/Place Card-8.svg";
import PlaceCardRaqqa from "@/assets/images/places/Place Card-12.svg";
import PlaceForm from "@/components/dialog/PlaceForm.jsx";
import ActionSuccessDialog from "@/components/dialog/ActionSuccessDialog";
import { createPlace, getTopTouristPlaces, getTopRestaurants, getTopHotels } from "@/services/places/placesApi.js";
import { useAuth } from "@/hooks/useAuth.jsx"; // <-- Added import

export default function Places() {
    const { user } = useAuth(); // <-- Get current user
    const queryClient = useQueryClient();
    const [selectedStat, setSelectedStat] = useState("places");
    const [isPlaceDialogOpen, setIsPlaceDialogOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [successStatus, setSuccessStatus] = useState("success");
    const [initialLoad, setInitialLoad] = useState(true);

    const {
        data: touristData,
        isLoading: isLoadingTourist,
        isFetching: isFetchingTourist
    } = useQuery({
        queryKey: ['topTouristPlaces'],
        queryFn: getTopTouristPlaces,
        enabled: selectedStat === 'places',
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000,
        onSettled: () => { if (initialLoad) setInitialLoad(false); }
    });

    const {
        data: restaurantsData,
        isLoading: isLoadingRestaurants,
        isFetching: isFetchingRestaurants
    } = useQuery({
        queryKey: ['topRestaurants'],
        queryFn: getTopRestaurants,
        enabled: selectedStat === 'restaurants',
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    });

    const {
        data: hotelsData,
        isLoading: isLoadingHotels,
        isFetching: isFetchingHotels
    } = useQuery({
        queryKey: ['topHotels'],
        queryFn: getTopHotels,
        enabled: selectedStat === 'hotels',
        staleTime: Infinity,
        cacheTime: 5 * 60 * 1000
    });

    const handleStatChange = (value) => setSelectedStat(value);

    const getChartData = () => {
        if (selectedStat === 'places' && touristData) {
            return { labels: touristData.map(item => item.name), values: touristData.map(item => item.rating) };
        }
        if (selectedStat === 'restaurants' && restaurantsData) {
            return { labels: restaurantsData.map(item => item.name), values: restaurantsData.map(item => item.rating) };
        }
        if (selectedStat === 'hotels' && hotelsData) {
            return { labels: hotelsData.map(item => item.name), values: hotelsData.map(item => item.rating) };
        }
        return { labels: [], values: [] };
    };

    const chartData = getChartData();

    const governorates = [
        { name: "دمشق", image: PlaceCardDamascus },
        { name: "ريف دمشق", image: PlaceCardRifDimashq },
        { name: "حماة", image: PlaceCardHama },
        { name: "حمص", image: PlaceCardHoms },
        { name: "اللاذقية", image: PlaceCardLatakia },
        { name: "حلب", image: PlaceCardAleppo },
        { name: "درعا", image: PlaceCardDaraa },
        { name: "السويداء", image: PlaceCardSweida },
        { name: "طرطوس", image: PlaceCardTartus },
        { name: "دير الزور", image: PlaceCardDeirEzZor },
        { name: "ادلب", image: PlaceCardIdlib },
        { name: "الحسكة", image: PlaceCardHasaka },
        { name: "القنيطرة", image: PlaceCardQuneitra },
        { name: "الرقة", image: PlaceCardRaqqa },
    ];

    const handlePlaceSuccess = ({ message, status, newPlace } = {}) => {
        if (newPlace?.city && newPlace?.type) {
            queryClient.setQueryData(['placeCounts', newPlace.city], (oldData) => {
                if (!oldData) return oldData;
                const typeKey = newPlace.type === 'restaurant' ? 'restaurants' :
                    newPlace.type === 'hotel' ? 'hotels' : 'touristPlaces';
                return { ...oldData, [typeKey]: oldData[typeKey] + 1 };
            });
        }

        setSuccessMessage(message || "تمت العملية بنجاح ✅");
        setSuccessStatus(status || "success");
        setSuccessOpen(true);
        setIsPlaceDialogOpen(false);

        queryClient.invalidateQueries(['placeCounts']);
        queryClient.invalidateQueries(['topTouristPlaces']);
        queryClient.invalidateQueries(['topRestaurants']);
        queryClient.invalidateQueries(['topHotels']);
    };

    if (initialLoad && isLoadingTourist) {
        return <PageSkeleton rows={6} />;
    }

    const showLoadingSpinner =
        (selectedStat === 'places' && isFetchingTourist && !touristData) ||
        (selectedStat === 'restaurants' && isFetchingRestaurants && !restaurantsData) ||
        (selectedStat === 'hotels' && isFetchingHotels && !hotelsData);

    return (
        <div className="flex flex-col gap-8">
            {/* Banner only shows if not superadmin */}
            {user?.role === "super_admin" && (
                <Banner
                    title="إضافة مكان"
                    description="يمكنك إضافة بيانات الموقع السياحي المراد إضافته إلى قائمة الأماكن المعتمدة لدى وزارة السياحة"
                    icon={places}
                    buttonText="إضافة"
                    onButtonClick={() => setIsPlaceDialogOpen(true)}
                />
            )}

            {isPlaceDialogOpen && (
                <PlaceForm
                    onClose={() => setIsPlaceDialogOpen(false)}
                    onSuccess={(payload) => handlePlaceSuccess(payload)}
                    isEdit={false}
                    submitFn={createPlace}
                />
            )}

            <ActionSuccessDialog
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage}
                status={successStatus}
            />

            <div className="flex flex-col gap-4">
                <div className="flex gap-6 items-center text-gray-800 px-2 justify-between">
                    <div>
                        <h1 className="text-h1-bold-24">أفضل الأماكن</h1>
                    </div>

                    <div className="flex gap-5">
                        {["places", "restaurants", "hotels"].map(stat => (
                            <label key={stat} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value={stat}
                                    checked={selectedStat === stat}
                                    onChange={(e) => handleStatChange(e.target.value)}
                                    className="accent-green cursor-pointer"
                                />
                                <span className="text-body-regular-16-auto">
                                    {stat === "places" ? "الأماكن السياحية" :
                                        stat === "restaurants" ? "المطاعم" : "الفنادق"}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-white rounded-lg shadow relative min-h-[24rem]">
                    {showLoadingSpinner ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <GoldSpinner size={60} />
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="flex gap-2 text-h2-bold-16">
                                <h1>التقييمات</h1>
                                <div className="bg-[#f7b800] w-8 h-5 rounded-lg"></div>
                            </div>

                            <Chart
                                labels={chartData.labels}
                                values={chartData.values}
                                label="التقييمات"
                                color={"#f7b800"}
                                height="26rem"
                                className="h-full w-full"
                                style={{ height: "100%" }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {governorates.map((gov, idx) => (
                    <Link
                        key={idx}
                        to={`/places/cities/${encodeURIComponent(gov.name)}`}
                        className="relative rounded-lg overflow-hidden shadow hover:scale-105 transition-transform cursor-pointer"
                    >
                        <img
                            src={gov.image}
                            alt={`صورة لمحافظة ${gov.name}`}
                            className="w-full h-40 object-cover"
                            loading="lazy"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
