// components/common/GoldCircularProgress.jsx
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled component with default gold color
const StyledCircularProgress = styled(CircularProgress)(({ color }) => ({
    color: color || '#f7b800', // Default gold color if no color prop is provided
}));

const GoldCircularProgress = ({ color, ...props }) => {
    return <StyledCircularProgress color={color} {...props} />;
};

export default GoldCircularProgress;