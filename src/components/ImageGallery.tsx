// import { CardMedia } from '@mui/material';
// import Grid from '@mui/material/Grid2';

// const images = [
//   'https://plus.unsplash.com/premium_photo-1661962841993-99a07c27c9f4?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://plus.unsplash.com/premium_photo-1661913412680-c274b6fea096?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://plus.unsplash.com/premium_photo-1673014201217-14442b17ab56?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8',
//   'https://plus.unsplash.com/premium_photo-1673014202599-47dbbc5d4861?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://plus.unsplash.com/premium_photo-1673015652742-01bbca45af23?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
// ];

// const ImageGallery = () => {
//   return (
//     <Grid container spacing={1}>
//       {/* Imagen principal (grande) */}
//       <Grid size={{xs:12 , md: 6}}> 
//         <CardMedia
//           component="img"
//           image={images[0]}
//           sx={{ width: '100%', height: '100%', borderRadius: 2, objectFit: 'cover' }}
//         />
//       </Grid>

//       {/* 4 imágenes pequeñas (2x2) */}
//       <Grid size={{xs:12 , md: 6}}>
//         <Grid container spacing={1}>
//           {images.slice(1).map((img, i) => (
//             <Grid size={{xs:6}} key={i}>
//               <CardMedia
//                 component="img"
//                 image={img}
//                 sx={{ width: '100%', height: 200, borderRadius: 2, objectFit: 'cover' }}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </Grid>
//     </Grid>
//   );
// };


// export default ImageGallery;


import { Box, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

interface ImageGalleryProps {
  images: string[]; // Array of image URLs
  mainImageIndex?: number; // Index of the main image (default: 0)
  smallImageHeight?: number; // Height of small images in pixels (default: 200)
}

const ImageGallery = ({
  images = [],
  mainImageIndex = 0,
  smallImageHeight = 200,
}: ImageGalleryProps) => {
  // Ensure mainImageIndex is within bounds
  const validMainImageIndex = mainImageIndex >= 0 && mainImageIndex < images.length ? mainImageIndex : 0;
  const mainImage = images[validMainImageIndex] || '';
  const smallImages = images.slice(validMainImageIndex + 1, validMainImageIndex + 5) || []; // Up to 4 small images

  if (!images.length) {
    return <Typography>No images available.</Typography>; // Fallback for no images
  }

  return (
    <Grid container spacing={1}>
      {/* Imagen principal (grande) */}
      <Grid size={{ xs: 12, md: 6 }}>
        <CardMedia
          component="img"
          image={mainImage}
          sx={{
            width: '100%',
            height: '100%',
            minHeight: 400, // Minimum height for better visibility
            borderRadius: 2,
            objectFit: 'cover',
          }}
        />
      </Grid>

      {/* 4 imágenes pequeñas (2x2) */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={1} sx={{ height: '100%' }}>
          {smallImages.map((img, i) => (
            <Grid size={{ xs: 6, sm: 6 }} key={i}>
              <CardMedia
                component="img"
                image={img}
                sx={{
                  width: '100%',
                  height: smallImageHeight,
                  borderRadius: 2,
                  objectFit: 'cover',
                }}
              />
            </Grid>
          ))}
          {/* Fill remaining slots with empty grids if less than 4 images */}
          {smallImages.length < 4 &&
            Array.from({ length: 4 - smallImages.length }).map((_, i) => (
              <Grid size={{ xs: 6, sm: 6 }} key={`empty-${i}`}>
                <Box sx={{ width: '100%', height: smallImageHeight, bgcolor: 'grey.200', borderRadius: 2 }} />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ImageGallery;