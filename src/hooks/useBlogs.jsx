import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchBlogs,
    fetchBlog,
    createBlog,
    updateBlog,
    deleteBlog,
} from "@/services/blogs/blogsApi.js";

export const useBlogs = () => {
    return useQuery({
        queryKey: ["Blogs"],
        queryFn: fetchBlogs,
        staleTime: 1000 * 60 * 5, // cache fresh for 5 min
    });
};

export const useBlog = (id) => {
    return useQuery({
        queryKey: ["Blog", id],
        queryFn: () => fetchBlog(id),
        enabled: !!id, // only fetch if id exists
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBlog,
        onSuccess: (newBlog) => {
            // Add new Blog into cache immediately
            queryClient.setQueryData(["Blogs"], (old = []) => [newBlog, ...old]);
        },
    });
};

export const useUpdateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBlog,
        onSuccess: (updatedBlog) => {
            // Update Blogs list
            queryClient.setQueryData(["Blogs"], (old = []) =>
                old.map((p) => (p.id === updatedBlog.id ? updatedBlog : p))
            );
            // Update single Blog cache
            queryClient.setQueryData(["Blog", updatedBlog.id], updatedBlog);
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBlog,
        onSuccess: (deletedId) => {
            // Remove from cache
            queryClient.setQueryData(["Blogs"], (old = []) =>
                old.filter((p) => p.id !== deletedId)
            );
            queryClient.removeQueries(["Blog", deletedId]);
        },
    });
};
