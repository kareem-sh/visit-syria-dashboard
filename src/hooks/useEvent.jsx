// hooks/useEvent.js
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEventById } from "@/services/events/eventsApi";

export const useEvent = (eventId) => {
    const queryClient = useQueryClient();

    const findEventInAllCaches = (id) => {
        // Check both events and userEvents caches
        const eventsCache = queryClient.getQueryData(['events']);
        const userEventsCache = queryClient.getQueryData(['userEvents']);

        // Search in events cache
        if (eventsCache) {
            const event = eventsCache.find(e => e.id === parseInt(id));
            if (event) {
                console.log('✅ Found event in events cache');
                return event;
            }
        }

        // Search in user events cache
        if (userEventsCache && userEventsCache.events) {
            const event = userEventsCache.events.find(e => e.id === parseInt(id));
            if (event) {
                console.log('✅ Found event in userEvents cache');
                return event;
            }
        }

        console.log('❌ Event not found in any cache');
        return null;
    };

    return useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const cachedEvent = findEventInAllCaches(eventId);
            if (cachedEvent) {
                console.log('✅ Using cached event data:', cachedEvent);
                return cachedEvent;
            }

            console.log('🔄 Fetching event details from API for id:', eventId);
            const event = await getEventById(eventId);
            console.log('📥 API response for event:', event);

            // Add to appropriate cache based on which one exists
            const eventsCache = queryClient.getQueryData(['events']);
            const userEventsCache = queryClient.getQueryData(['userEvents']);

            if (eventsCache) {
                const existingIndex = eventsCache.findIndex(e => e.id === event.id);
                if (existingIndex === -1) {
                    console.log('📥 Adding event to events cache');
                    eventsCache.push(event);
                    queryClient.setQueryData(['events'], eventsCache);
                } else {
                    console.log('🔄 Updating existing event in events cache');
                    eventsCache[existingIndex] = { ...eventsCache[existingIndex], ...event };
                    queryClient.setQueryData(['events'], eventsCache);
                }
            }

            return event;
        },
        enabled: !!eventId,
        staleTime: 5 * 60 * 1000,
    });
};