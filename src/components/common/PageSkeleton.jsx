// src/components/common/Skeletons.jsx
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export const PageSkeleton = ({ rows = 6 }) => (
    <Box sx={{ width: "100%", p: 4 }}>
        <BannerSkeleton />
        <ContentSkeleton rows={rows} />
    </Box>
);

export const BannerSkeleton = () => (
    <Skeleton variant="rectangular" width="100%" height={150} sx={{ mb: 4 }} />
);

export const ContentSkeleton = ({ rows = 6 }) => (
    <>
        <Skeleton variant="rectangular" width={200} height={40} sx={{ mb: 3 }} />
        {[...Array(rows)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={50} sx={{ mb: 1.5 }} />
        ))}
    </>
);