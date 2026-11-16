import React from "react";
import { Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface PriceTagProps {
  price: number | string;
  currency: string;
  isFavorite?: boolean;
}

const PriceTag: React.FC<PriceTagProps> = ({ price, currency, isFavorite = false }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={1}
      sx={{
        bgcolor: "white",
        borderRadius: "999px", 
        px: 1.5,
        py: 0.5,
        boxShadow: 1,
        width: "fit-content"
      }}
    >
      <Typography variant="body2" >
        {price} {currency}
      </Typography>

      {isFavorite && (
        <FavoriteIcon fontSize="small" sx={{ color: "black" }} />
      )}
    </Box>
  );
};

export default PriceTag;
