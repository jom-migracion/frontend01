import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';

import { useNavigate } from "react-router";

const PerfectTrip: React.FC = () => {
  const navigate = useNavigate(); 
  const goHome = () => {
    navigate("/");
  }
  return (
    <Box sx={{ p: 0 }}>
      <Grid container spacing={4} alignItems="center">
        {/* Columna izquierda */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column" gap={4}>
            {/* Card 1 */}
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 3,
                boxShadow: "1px 5px 5px 5px rgba(207, 205, 205, 0.3)",
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: '40%', height: 180, objectFit: "cover", p: 3, borderRadius: 6 }}
                image="https://images.unsplash.com/photo-1670589953882-b94c9cb380f5?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Alojamiento"
              />
              <CardContent sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: "70%",
                    height: 16,
                    bgcolor: "grey.300",
                    borderRadius: 1,
                    mb: 1,
                  }}
                />
                <Box
                  sx={{
                    width: "30%",
                    height: 16,
                    bgcolor: "grey.200",
                    borderRadius: 1,
                  }}
                />
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 3,
                boxShadow: "1px 5px 5px 5px rgba(207, 205, 205, 0.3)",
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: '40%', height: 180, objectFit: "cover", p: 3, borderRadius: 6 }}
                image="https://images.unsplash.com/photo-1670589953882-b94c9cb380f5?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Alojamiento"
              />
              <CardContent sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: "70%",
                    height: 16,
                    bgcolor: "grey.300",
                    borderRadius: 1,
                    mb: 1,
                  }}
                />
                <Box
                  sx={{
                    width: "30%",
                    height: 16,
                    bgcolor: "grey.200",
                    borderRadius: 1,
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Columna derecha */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Organiza el viaje perfecto
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Descubre alojamientos. Cuando<br/> hagas una reservación saldrá aquí.
          </Typography>
          <Button
          onClick={()=> goHome()}
            variant="contained"
            sx={{
              bgcolor: "black",
              color: "white",
              textTransform: "none",
              px: 3,
              "&:hover": { bgcolor: "grey.900" },
            }}
          >
            Comencemos
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerfectTrip;
