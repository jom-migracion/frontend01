import { useEffect, useState } from 'react';
import { Box, IconButton, Typography, styled,  Button, LinearProgress } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';
// import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import Grid from '@mui/material/Grid2';
import AssertModal from '@/components/AssertModal';
import UploadGalleryProperty from '../UploadGalleryProperty';
import {
  photosListingRent,
  PropertyRegistrationProps_2_2_Galery,
} from '../../interface/IPropertyRegistrationProps';
import { RestClient } from '@/services/RestClient';
import { useSnackbar } from '@/context/SnackbarContext';
import { useCustomMutationByUrl } from '@/hooks/api';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

// Estilos personalizados
const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  width: '100%',
  height: '120px',
  backgroundColor: theme.palette.background.paper,
}));

const ImageItem = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing',
  },
});

const DeleteButton = styled(IconButton)(({  }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  width: 32,
  height: 32,
  zIndex: 1,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
}));

const Label = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  left: 8,
  right: 48,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '8px',
  padding: '4px 12px',
  fontSize: '0.55rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  zIndex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  [theme.breakpoints.down('sm')]: {
    right: 44,
    padding: '3px 10px',
    fontSize: '0.35rem',
  },
}));

const AddPhotoBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  border: `2px dashed ${theme.palette.divider}`,
  width: '100%',
  height: '120px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

// const TipBox = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'flex-start',
//   gap: theme.spacing(2),
//   padding: theme.spacing(2.5),
//   // backgroundColor: theme.palette.grey[50],
//   borderRadius: '12px',
//   border: `1px solid ${theme.palette.divider}`,
//   marginTop: theme.spacing(3),
// }));

const PropertyRegistrationStep_2_2_Galery: React.FC<PropertyRegistrationProps_2_2_Galery> = ({
  seeTitle = true,
  uploadedImages,
  onAddMoreFiles,
  onReorderImages,
  listingRentId,
  onDeleteImage,
  openModalToUpload,
  setOpenModalToUpload,
  contronNumImages,
}) => {
  // useState
  const [images, setImages] = useState<photosListingRent[]>(uploadedImages);
  const [openModalAssert, setOpenModalAssert] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const openModal = openModalToUpload ? openModalToUpload : openModalAssert;
  const setOpenModal = openModalToUpload ? setOpenModalToUpload : setOpenModalAssert;

  // api
  const { mutate: UpdatePhotoPosition } = useCustomMutationByUrl('put');

  // hooks
  const showSnackbar = useSnackbar();
  const queryClient = useQueryClient();
  
  // Tu hook original
  const { t } = useTranslation('translation', { keyPrefix: 'cardProperty' });
  // El nuevo hook para los textos faltantes
  const { t: tGallery } = useTranslation('translation', { keyPrefix: 'PropertyRegistrationStep_2_2_Galery' });

  useEffect(() => {
    // Actualizamos el estado si las imágenes de las props cambian
    setImages(uploadedImages);
  }, [uploadedImages]);

  // functions
  const handleDelete = async (photoId: number) => {
    // Validar que haya más de 5 imágenes antes de permitir eliminación
    // if (images.length <= 5) {
    //   showSnackbar('Debe mantener al menos 5 imágenes en la galería', 'warning');
    //   return;
    // }

    if (contronNumImages != undefined && contronNumImages != null && images.length <= contronNumImages) {
      showSnackbar(
        tGallery('minPhotosWarning', { defaultValue: `Debes mantener al menos 5 fotos` }),
        'warning'
      );
      return;
    }

    try {
      const response = await RestClient.delete(
        `/Host/ListingRent/${listingRentId}/Photos/${photoId}`
      );

      if (response?.data?.statusCode === '200') {
        onDeleteImage && onDeleteImage(photoId);
        showSnackbar(tGallery('deleteSuccess', { defaultValue: 'Imagen eliminada correctamente' }), 'success');
        // Immediately remove the deleted photo from the cache so any remount
        // of PasoRecorridoFotografico reads the correct data before the refetch completes.
        queryClient.setQueriesData<any>(
          { queryKey: ['detailPropertyToUpdate'] },
          (oldData: any) => {
            if (!oldData?.data?.photos) return oldData;
            return {
              ...oldData,
              data: {
                ...oldData.data,
                photos: oldData.data.photos.filter(
                  (p: any) => p.listingPhotoId !== photoId
                ),
              },
            };
          }
        );
        queryClient.invalidateQueries({ queryKey: ['detailPropertyToUpdate'] });
      } else {
        showSnackbar(response?.data?.resultError?.message, 'error');
      }
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      showSnackbar(tGallery('deleteError', { defaultValue: 'Error al eliminar la imagen' }), 'error');
    }
  };

  const handleAddImage = () => {
    setOpenModal && setOpenModal(true);
  };

  const handleNewModalFiles = (newFiles: File[]) => {
    onAddMoreFiles && onAddMoreFiles(newFiles);
    setOpenModal && setOpenModal(false);
  };

  // Funciones para el drag and drop
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>, index: number) => {
    // Guardamos el índice de la imagen arrastrada
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    // Crear una copia del arreglo para reordenar
    const newImages = [...images];
    
    // Extraer el elemento arrastrado y colocarlo en la posición de destino
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    

    // Llamar a la función del padre para actualizar el estado
    onReorderImages && onReorderImages(newImages);
    
      const url = `/Host/ListingRent/${listingRentId}/UpdatePhotoPosition?listingPhotoId=${draggedItem.photoId}&newPostition=${dropIndex + 1}`;      
      UpdatePhotoPosition({url},
        {
        onSuccess: (response) => {
          const { statusCode, resultError } = response;

          if (statusCode !== '200') {
            showSnackbar(resultError?.message, 'error');
          } else {
            queryClient.invalidateQueries({ queryKey: ['detailPropertyToUpdate'] });
          }
        },
        onError: (error) => {
          showSnackbar(error?.response?.data?.resultError?.message ?? error.message, 'error');
        },
      });
    
    setDraggedIndex(null);
  };
  
  const minPhotos = 5;
  const currentPhotos = images.length;
  const progressPercentage = Math.min((currentPhotos / minPhotos) * 100, 100);
  
  return (
    <>
      <Box sx={{ width: '100%' }}>
        {seeTitle && (
          <>
            {/* Header con título, subtítulo y botón/progreso */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mb={3}
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
              }}
            >
              {/* Lado izquierdo: Título y subtítulo */}
              <Box sx={{ flex: 1, pr: { xs: 0, sm: 3 } }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    lineHeight: '2rem',  
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  {/* {t2('title')} */}
                  {tGallery('title')}
                </Typography>
                <Typography 
                  color="text.secondary" 
                  sx={{ fontSize: '0.875rem', lineHeight: '1.5rem' }}
                >
                  {tGallery('description')}
                </Typography>
              </Box>

              {/* Lado derecho: Botón y barra de progreso */}
              <Box sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 240 } }}>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadOutlinedIcon />}
                  onClick={handleAddImage}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 2,
                    mb: 2,
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  {/* Subir fotos */}
                </Button>

                {/* Contador de fotos con barra de progreso */}
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        letterSpacing: 0.5,
                      }}
                    >
                      {minPhotos} {tGallery('minPhotosLabel')}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                      }}
                    >
                      {currentPhotos}/{minPhotos}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progressPercentage} 
                    sx={{ 
                      height: 4, 
                      borderRadius: 2,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                        backgroundColor: currentPhotos >= minPhotos ? 'primary.main' : 'rgb(91 85 200)',
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </>
        )}
        
        {/* Grid de imágenes */}
        <Grid container spacing={2}>
          {images.map((img, index) => (
            <Grid key={img.photoId} size={{ xs: 12, sm: 6, md: 4 }}>
              <ImageContainer
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <ImageItem
                  src={img.link}
                  alt={index === 0 ? tGallery('cover') : `${tGallery('imageAlt')} ${index + 1}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                />
                {index === 0 && (
                  <Label>{t('titlePort')}</Label>
                )}
                <DeleteButton 
                  size="small" 
                  onClick={() => handleDelete(img.photoId)}
                  // disabled={images.length <= 5}
                  // sx={{ opacity: images.length <= 5 ? 0.35 : 1 }}
                >
                  <CloseIcon fontSize="small" />
                </DeleteButton>
              </ImageContainer>
            </Grid>
          ))}
          
          {/* Card para agregar más fotos */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <AddPhotoBox onClick={handleAddImage}>
              <AddCircleOutlineIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'text.secondary',
                  mb: 1,
                }} 
              />
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {tGallery('addPhoto')}
              </Typography>
            </AddPhotoBox>
          </Grid>
        </Grid>

        {/* Consejo profesional */}
        {/* <TipBox>
          <LightbulbOutlinedIcon 
            sx={{ 
              color: 'primary.main',
              fontSize: 24,
              flexShrink: 0,
              mt: 0.5,
            }} 
          />
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600,
                mb: 0.5,
                color: 'text.primary',
              }}
            >
              Consejo profesional
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              Las propiedades con más de 10 fotos, incluyendo tomas del baño y el vecindario, tienen un 25% más de probabilidad de ser reservadas durante el primer mes.
            </Typography>
          </Box>
        </TipBox> */}
      </Box>
      <AssertModal
        title={t('step22.title')}
        content={
          <UploadGalleryProperty
            title={t('step22.label')}
            subtitle={t('step22.subtitle')}
            onFilesChange={handleNewModalFiles}
          />
        }
        showCloseLeft
        showFooterButtons
        showRightIcon
        open={openModal}
        onClose={() => setOpenModal && setOpenModal(false)}
      />
    </>
  );
};

export default PropertyRegistrationStep_2_2_Galery;