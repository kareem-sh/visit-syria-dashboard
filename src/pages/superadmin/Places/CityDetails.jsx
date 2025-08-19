import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { cities } from "@/data/cities.js";
import InfoBox from "@/components/common/InfoBox.jsx";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";
import hotels from "@/assets/icons/place/hotels.svg";
import restaurants from "@/assets/icons/place/restaurants.svg";
import tourists from "@/assets/icons/place/tourists.svg";
import { getPlaceCountsByCity } from "@/services/places/placesApi.js";

export default function CityDetails() {
    const { cityname } = useParams();
    const city = cityname ? decodeURIComponent(cityname) : "المدينة";
    const navigate = useNavigate();

    // loaded from the data file
    const cityData = cities[city];

    // fallback if city didn't exist in file
    const bannerImage = cityData?.image;
    const description = cityData?.description || `${city} مدينة جميلة تستحق الزيارة.`;

    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ['placeCounts', city],
        queryFn: () => getPlaceCountsByCity(city),
        staleTime: 5 * 60 * 1000,
    });

    const openTab = (tab) => {
        navigate(`/places/cities/${encodeURIComponent(city)}/${tab}`);
    };

    if (isLoading && !stats) {
        return <PageSkeleton rows={6} />;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="relative w-full h-60 md:h-100 rounded-lg overflow-hidden">
                <img
                    src={bannerImage}
                    alt={city}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 25%" }}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black/50" />
                <div className="absolute bottom-6 right-6 text-white">
                    <h1 className="text-h1-black-40 leading-tight">{city}</h1>
                </div>
            </div>

            <div>
                <h1 className="text-h1-bold-24 pb-4 pr-4 leading-tight">الوصف</h1>
                <div className="bg-white rounded-2xl p-6 shadow">
                    <p className="text-body-regular-14-auto text-(--text-title)">
                        {description}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <InfoBox
                        icon={restaurants}
                        title="المطاعم"
                        count={(stats?.restaurants ?? 0)}
                        onClick={() => openTab("restaurants")}
                    />
                    <InfoBox
                        icon={hotels}
                        title="الفنادق"
                        count={(stats?.hotels ?? 0)}
                        onClick={() => openTab("hotels")}
                    />
                    <InfoBox
                        icon={tourists}
                        title="الأماكن السياحية"
                        count={(stats?.touristPlaces ?? 0)}
                        onClick={() => openTab("tourists")}
                    />
                </div>
            </div>
        </div>
    );
}