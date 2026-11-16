import React from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import Grid from '@mui/material/Grid';
type Imagen = {
    url: string;
    titulo: string;
    descripcion: string;
  };
type ImageGalleryProps = {
    titulo: string;
    descripcion: string;
    imagenes: Imagen[]; // array de URLs de im�genes
};

const ImageGallery: React.FC<ImageGalleryProps> = ({
    titulo ,
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

            <Grid container spacing={3}>
                {imagenes.map((img, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                    sx={{
                        boxShadow: 2,
                        border: "none",
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                    >
                    <CardMedia
                        component="img"
                        image={img.url}
                        alt={img.titulo}
                        sx={{
                        height: 180,
                        objectFit: "cover",
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        }}
                    />
                   
                    </Card>
                    <Card 
                    sx={{
                        boxShadow: "none",
                        border: "none",
                        borderRadius: "none",
                        overflow: "hidden",
                    }}
                    >
                        <CardContent sx={{ px: 1, pt: 2, pb: 3 }}>
                            <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            gutterBottom
                            align="left"
                            >
                            {img.titulo}
                            </Typography>
                            <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            align="left"
                            >
                            {img.descripcion}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ImageGallery;
