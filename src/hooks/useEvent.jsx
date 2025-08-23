// hooks/useEvent.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEventById } from "@/services/events/eventsApi.js";

export const useEvent = (eventId) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const allEvents = queryClient.getQueryData(['events']);
            if (Array.isArray(allEvents)) {
                const cachedEvent = allEvents.find(event => event.id === parseInt(eventId));
                if (cachedEvent && cachedEvent.description && cachedEvent.media) {
                    console.log('✅ Using cached event with full data');
                    return cachedEvent;
                }
            }
            console.log('🔄 Fetching full event details from API');
            const event = await getEventById(eventId);
            return event;
        },
        enabled: !!eventId,
        // ✅ FIX: Remove or set a very short staleTime (0 is best for this case)
        staleTime: 0, // Data is stale immediately, so invalidate will always refetch.
        cacheTime: 10 * 60 * 1000,
    });
};