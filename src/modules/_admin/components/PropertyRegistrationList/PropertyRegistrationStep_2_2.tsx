import { Box, Card, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { GoQuestion } from 'react-icons/go';
import UploadGalleryProperty from '../UploadGalleryProperty';
import React, { useEffect, useState, useCallback } from 'react';
import {
  FileRelations,
  photosListingRent,
  PropertyRegistrationProps_2_2,
} from '../../interface/IPropertyRegistrationProps';
import { useStepValidation } from '@/context/FormStepContext';
import PropertyRegistrationStep_2_2_Galery from './PropertyRegistrationStep_2_2_Galery';
import { RestClient } from '@/services/RestClient';
import { usePost } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import assertEnv from '@/config/env';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { useTranslation } from 'react-i18next';

export const PropertyRegistrationStep_2_2: React.FC<PropertyRegistrationProps_2_2> = ({
  listingRentId,
}) => {
  // store
  const updateListingData = usePropertyRegistration((state) => state.updateListingData);
  const { listingPhotos } = usePropertyRegistration((state) => state.data.listingData);
  
  // useState
  const { setStepValid } = useStepValidation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<photosListingRent[]>(
    listingPhotos.sort((a, b) => a.position - b.position).map((item) => ({
      link: item.photoLink,
      photoId: item.listingPhotoId,
    })) ?? []
  );

  // hooks
  const showSnackbar = useSnackbar();
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step22'});
  const { typography } = useTheme();

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
            .map((item: any) => ({
              link: `${assertEnv.VITE_BASE_URL_PHOTOS_LISTING}${item.data}`,
              photoId: item.resultError.code,
            }));
          if (filesListing && Array.isArray(filesListing)) {
            setUploadedFiles(filesListing);
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
        showSnackbar(error?.message || 'Error relacion de imagenes', 'error');
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
      showSnackbar(error?.message || 'Error al subir la imagen', 'error');
    } finally {
      setIsUploading(false);
    }
  }, [listingRentId, uploadedFiles, funcRelationPhoto]);

  const handleReorderImages = useCallback((newOrder: photosListingRent[]) => {
    setUploadedFiles(newOrder);
  }, []);

  useEffect(() => {
    const areFilesValid = uploadedFiles.length >= 5;
    setStepValid(4, areFilesValid);
  }, [uploadedFiles, setStepValid]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4} columns={6}>
        <Grid size={{ md: 6, xs: 16 }}>
          <Card sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none', mt: '16px', bgcolor:'#f8f9fc' }}>
            {uploadedFiles.length === 0 && (
              <Typography sx={{ mt: 1, mr: 20, fontFamily: typography.h5Medium }}>
                {t('title')} * <GoQuestion size={15} style={{ marginLeft: 5 }} />
              </Typography>
            )}

            {<LoadingThreeDotsJumping open={isUploading || isPending} modal={true} />}

            {uploadedFiles.length === 0 ? (
              <UploadGalleryProperty
                title={t('label')}
                subtitle={t('subtitle')}
                textButton={t('textButton')}
                onFilesChange={handleFilesUploaded}
              />
            ) : (
              <PropertyRegistrationStep_2_2_Galery
                uploadedImages={uploadedFiles}
                onAddMoreFiles={handleFilesUploaded}
                onReorderImages={handleReorderImages}
                listingRentId={listingRentId}
                onDeleteImage={(id) => {
                  updateListingData({ listingPhotos: listingPhotos.filter(img => img.listingPhotoId != id)})
                  setUploadedFiles((prev) => prev.filter((img) => img.photoId !== id));
                }}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
