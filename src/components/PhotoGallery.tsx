import React from "react";
import { Box, Grid, Typography, Card, CardMedia } from "@mui/material";

type ImageGalleryProps = {
    titulo: string;
    descripcion: string;
    imagenes: string[]; // array de URLs de imágenes
};

const ImageGallery: React.FC<ImageGalleryProps> = ({
    titulo,
    descripcion,
    imagenes,
}) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                {titulo}
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
                {descripcion}
            </Typography>

            <Grid container spacing={2}>
                {imagenes.map((img, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="180"
                                image={img}
                                alt={`imagen-${index}`}
                                sx={{ objectFit: "cover" }}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ImageGallery;
