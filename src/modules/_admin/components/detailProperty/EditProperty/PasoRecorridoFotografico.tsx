import {
  Box,
  Typography,
  Button,
  Card,
  Stack,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { CloudUpload } from '@mui/icons-material';
import React, { useCallback, useState, useEffect } from 'react';
import { ListingPhoto } from '@/models/interfaces/ListingRentResponseStep';
import { useSnackbar } from '@/context/SnackbarContext';
import PropertyRegistrationStep_2_2_Galery from '../../PropertyRegistrationList/PropertyRegistrationStep_2_2_Galery';
import { usePost } from '@/hooks/api';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { FileRelations } from '@/modules/_admin/interface/IPropertyRegistrationProps';
import assertEnv from '@/config/env';
import { RestClient } from '@/services/RestClient';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

export interface PropsPhotosListingRent {
  link: string;
  photoId: number;
}

const PasoRecorridoFotografico: React.FC<{
  listingRentId: number;
  listingPhotos: ListingPhoto[];
  onDeletePhoto?: (id: number) => void;
}> = ({ listingRentId, listingPhotos = [], onDeletePhoto }) => {
  // useState
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<PropsPhotosListingRent[]>(
    listingPhotos.sort((a, b) => a.position - b.position).map((item) => ({
      isPrincipal: item.isPrincipal,
      link: item.photoLink,
      photoId: item.listingPhotoId,
    })) ?? []
  );

  // hooks
  const { t } = useTranslation();
  const showSnackbar = useSnackbar();
  const queryClient = useQueryClient();

  // Sincronizar el estado local cuando las props cambien (ej. por react-query invalidate)
  useEffect(() => {
    setUploadedFiles(
      listingPhotos.sort((a, b) => a.position - b.position).map((item) => ({
        isPrincipal: item.isPrincipal,
        link: item.photoLink,
        photoId: item.listingPhotoId,
      })) ?? []
    );
  }, [listingPhotos]);

  // api
  const { mutate: RelationUploadPhotos, isPending } = usePost<any>(
    `/Host/ListingRent/${listingRentId}/Photos`
  );

  // functions
  const funcRelationPhoto = async (arrayRelation: FileRelations[]) => {
    RelationUploadPhotos(arrayRelation, {
      onSuccess: (response) => {
        if (response && Array.isArray(response)) {
          const filesListing = response
            ?.filter((item: any) => item.statusCode === '200')
            .sort((a, b) => a.position - b.position).map((item: any) => ({
              isPrincipal: false,
              link: `${assertEnv.VITE_BASE_URL_PHOTOS_LISTING}${item.data}`,
              photoId: item.resultError.code,
            }));
          if (filesListing && Array.isArray(filesListing)) {
            setUploadedFiles(filesListing);
            queryClient.invalidateQueries({ queryKey: ['detailPropertyToUpdate'] });
            // setUploadedFiles((prevFiles) => {
            //   // Filtra para evitar duplicados por photoId
            //   const existingIds = new Set(prevFiles.map((f) => f.photoId));
            //   const newFiles = filesListing.filter((f) => !existingIds.has(f.photoId));
            //   return [...prevFiles, ...newFiles];
            // });
          }
        }
      },
      onError: (error) => {
        showSnackbar(error?.message || t('photoTour.errors.imageRelation'), 'error');
      },
    });
  };

  // Callback para cuando se suben archivos inicialmente o desde el modal de 2_3
  const handleFilesUploaded = useCallback(async (files: File[]) => {
    setIsUploading(true);
    try {
      const arrayRelation: FileRelations[] = [];
      const dataToSend = new FormData();
      files.forEach((file) => {
        dataToSend.append('ImageFiles', file);
      });
      const response = await RestClient.post(
        `/Host/ListingRent/UploadPhotoImage?listingRentId=${listingRentId}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      response.data?.length > 0 &&
        response.data.forEach((element: any, index: number) => {
          if (element.statusCode !== '200') {
            showSnackbar(`Error al subir una imagen: ${element?.resultError?.message}`, 'error');
            return;
          } else {           
            arrayRelation.push({
              spaceTypeId: 0,
              description: '',
              isMain: uploadedFiles.length > 0 ? false : index == 0 ? true : false,
              fileName: element.data,
            });
          }
        });
      arrayRelation.length > 0 && funcRelationPhoto(arrayRelation);
    } catch (error: any) {
      showSnackbar(error?.message || t('photoTour.errors.imageUpload'), 'error');
    } finally {
      setIsUploading(false);
    }
  }, [listingRentId, uploadedFiles, funcRelationPhoto]);

  const handleReorderImages = useCallback((newOrder: PropsPhotosListingRent[]) => {
    setUploadedFiles(newOrder);
  }, []);

  return (
    <Box sx={{ pt: 1, mt: -2.5, pr: '20px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography sx={{fontSize: '16px', fontWeight: '600'}} >
          {t('photoTour.title')}
        </Typography>

      </Stack>
      <Divider sx={{ mb: 2, mx: -6 }} />
      <Typography  color="text.secondary" mb={2} sx={{ fontSize: '13px' }}>
        {t('photoTour.description')}
      </Typography>

      <Button 
        variant="outlined"
        onClick={() => setIsModalOpen(true)}
        startIcon={<CloudUpload sx={{ fontSize: '20px !important' }} />}
        sx={{
          mb: 2,
          py: 1.5,
          px: 2.5,
          borderColor: '#e0e0e0',
          backgroundColor: '#fff',
          color: '#000',
          textTransform: 'none',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 1,
          '&:hover': {
            backgroundColor: '#f5f5f5',
            borderColor: '#d0d0d0',
          },
          boxShadow: 'none',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#000', lineHeight: 1.4 }}>
            {t('photoTour.addPhotos')}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#888', lineHeight: 1.4 }}>
            {t('photoTour.uploadMinimum', { 
              current: uploadedFiles.length, 
              minimum: 5 
            })}
          </Typography>
        </Box>
      </Button>

      {/* <Typography variant="body2" fontWeight="bold" mb={1} sx={{ fontSize: 14 }}>
        {t('photoTour.cover')}

      </Typography> */}
      <Grid container spacing={1} columns={12} >
        <Grid size={{ md: 12, xs: 12 }}>
          <Card sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none' }}>

            {<LoadingThreeDotsJumping open={isUploading || isPending} modal={true} />}

            {
              <PropertyRegistrationStep_2_2_Galery
                seeTitle={false}
                uploadedImages={uploadedFiles}
                onAddMoreFiles={handleFilesUploaded}
                onReorderImages={handleReorderImages}
                listingRentId={listingRentId}
                onDeleteImage={(id) => {
                  setUploadedFiles((prev) => prev.filter((img) => img.photoId !== id));
                  onDeletePhoto?.(id);
                }}
                openModalToUpload={isModalOpen}
                setOpenModalToUpload={setIsModalOpen}
                contronNumImages={5}
              />
            }
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PasoRecorridoFotografico;
