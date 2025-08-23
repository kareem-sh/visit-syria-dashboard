// hooks/useTrip.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTripById } from "@/services/trips/trips";

export const useTrip = (tripId) => {
    const queryClient = useQueryClient();

    const findTripInAllCaches = (id) => {
        const tripsCache = queryClient.getQueryData(['trips']);
        if (tripsCache && tripsCache.trips) {
            const trip = tripsCache.trips.find(t => t.id === parseInt(id));
            if (trip) return trip;
        }

        // Check user trips cache
        const userTripsCache = queryClient.getQueryData(['userTrips']);
        if (userTripsCache && userTripsCache.activities) {
            for (const activity of userTripsCache.activities) {
                if (activity.info.id === parseInt(id)) {
                    return activity.info;
                }
            }
        }

        return null;
    };

    return useQuery({
        queryKey: ['trip', tripId],
        queryFn: async () => {
            const cachedTrip = findTripInAllCaches(tripId);
            if (cachedTrip) return cachedTrip;

            const trip = await getTripById(tripId);

            // Add to main trips cache
            const tripsCache = queryClient.getQueryData(['trips']) || { trips: [] };
            const existingIndex = tripsCache.trips.findIndex(t => t.id === trip.id);

            if (existingIndex === -1) {
                tripsCache.trips.push(trip);
            } else {
                tripsCache.trips[existingIndex] = { ...tripsCache.trips[existingIndex], ...trip };
            }

            queryClient.setQueryData(['trips'], tripsCache);

            return trip;
        },
        enabled: !!tripId,
        staleTime: 5 * 60 * 1000,
    });
};

// Then use it in your components:
// const { data: tripData, isLoading, error } = useTrip(id);