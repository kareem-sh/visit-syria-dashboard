// hooks/useTrip.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTripById } from "@/services/trips/trips";

export const useTrip = (tripId) => {
    const queryClient = useQueryClient();

    const findTripInAllCaches = (id) => {
        if (!id) return null;

        const numericId = parseInt(id);
        if (isNaN(numericId)) return null;

        // Check individual trip cache first (separate from trips list)
        const individualTripCache = queryClient.getQueryData(['trip', numericId]);
        if (individualTripCache) return individualTripCache;

        // Check main trips cache (read-only, won't modify it)
        const tripsCache = queryClient.getQueryData(['trips']);
        if (tripsCache?.trips?.length) {
            const trip = tripsCache.trips.find(t => t.id === numericId);
            if (trip) return trip;
        }

        // Check user trips cache (read-only)
        const userTripsCache = queryClient.getQueryData(['userTrips']);
        if (userTripsCache?.activities?.length) {
            for (const activity of userTripsCache.activities) {
                if (activity.info?.id === numericId) {
                    return activity.info;
                }
            }
        }

        return null;
    };

    return useQuery({
        queryKey: ['trip', tripId],
        queryFn: async () => {
            if (!tripId) throw new Error('No trip ID provided');

            // First try to find in any cache
            const cachedTrip = findTripInAllCaches(tripId);
            if (cachedTrip) {
                console.log('Using cached trip data for ID:', tripId);
                return cachedTrip;
            }

            // If not in cache, fetch from API
            console.log('Fetching trip data from API for ID:', tripId);
            const trip = await getTripById(tripId);

            // Store ONLY in the individual trip cache, not in the trips list cache
            // This prevents the trips list refresh from affecting individual trip data
            queryClient.setQueryData(['trip', tripId], trip);

            return trip;
        },
        enabled: !!tripId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2, // Retry failed requests twice
    });
};