import { Box, Typography, Button, Card, useTheme, CardContent, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGet, usePut } from '@/hooks/api';
import {
  AmenitiesType,
  FeaturedAspect,
  SecurityItems,
} from '@/models/interfaces/ListingRentResponseStep';
import Grid from '@mui/material/Grid2';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTranslation } from 'react-i18next';
import CardSquareV2 from '../../CardSquareV2';

const SelectorServicios: React.FC<{
  amenitiesSelected?: AmenitiesType[];
  securityItemsSelected?: SecurityItems[];
  featuredAspectsSelected?: FeaturedAspect[];
  listingRentId: number;
}> = ({ amenitiesSelected, featuredAspectsSelected, securityItemsSelected, listingRentId }) => {
  // api
  const { data: ParamListingRentAmenityTypes, isLoading: loadingAmenitie } = useGet<
    AmenitiesType[]
  >('ParamListingRentAmenityTypes', '/Parametrics/AmenityTypes');

  const { data: ParamListingRentFeaturedAspects, isLoading: loadingFeature } = useGet<
    FeaturedAspect[]
  >('ParamListingRentFeaturedAspects', '/Parametrics/FeaturedAspects');

  const { data: ParamListingRentSecurityItems, isLoading: loadingSecurity } = useGet<
    SecurityItems[]
  >('ParamListingRentSecurityItems', '/Parametrics/SecurityItems');

  const { mutate: UpdateCharacteristics, isPending } = usePut(
    `/Host/ListingRent/${listingRentId}/UpdateCharacteristics`
  );

  // useState
  const [featuredAspects, setFeaturedAspects] = useState<FeaturedAspect[]>(
    ParamListingRentFeaturedAspects?.data ?? []
  );
  const [featuredAmenities, setFeaturedAmenities] = useState<AmenitiesType[]>(
    ParamListingRentAmenityTypes?.data ?? []
  );
  const [securityItems, setSecurityItems] = useState<SecurityItems[]>(
    ParamListingRentSecurityItems?.data ?? []
  );

  // functions
  const handleSelectCard = (
    clicked: AmenitiesType | FeaturedAspect | SecurityItems,
    type?: string,
    ids?: number[]
  ) => {
    if (type === 'FAS') {
      setFeaturedAspects((prevFeatured: FeaturedAspect[]) =>
        prevFeatured.map((featured) => {
          if (ids) {
            return {
              ...featured,
              isSelected: ids.includes(featured.featuredAspectTypeId),
            };
          } else if ('featuredAspectTypeId' in clicked) {
            return {
              ...featured,
              isSelected:
                featured.featuredAspectTypeId === clicked.featuredAspectTypeId
                  ? !featured.isSelected
                  : featured.isSelected,
            };
          }
          return featured;
        })
      );
    } else if (type === 'FA') {
      setFeaturedAmenities((prevAmenities: AmenitiesType[]) =>
        prevAmenities.map((ameniti) => {
          if (ids) {
            return {
              ...ameniti,
              isSelected: ids.includes(ameniti.amenitiesTypeId),
            };
          } else if ('amenitiesTypeId' in clicked) {
            return {
              ...ameniti,
              isSelected:
                ameniti.amenitiesTypeId === clicked.amenitiesTypeId
                  ? !ameniti.isSelected
                  : ameniti.isSelected,
            };
          }
          return ameniti;
        })
      );
    } else {
      setSecurityItems((prevSecurity: SecurityItems[]) =>
        prevSecurity.map((security) => {
          if (ids) {
            return {
              ...security,
              isSelected: ids.includes(security.securityItemTypeId),
            };
          } else if ('securityItemTypeId' in clicked) {
            return {
              ...security,
              isSelected:
                security.securityItemTypeId === clicked.securityItemTypeId
                  ? !security.isSelected
                  : security.isSelected,
            };
          }
          return security;
        })
      );
    }
  };

  const handleSubmit = async () => {
    const selectedFAS = featuredAspects
      ?.filter((featured) => featured.isSelected)
      .map((fe) => fe.featuredAspectTypeId);
    const selectedFA = featuredAmenities
      ?.filter((ameni) => ameni?.isSelected)
      .map((am) => am.amenitiesTypeId);
    const selectedSE = securityItems
      ?.filter((security) => security.isSelected)
      .map((se) => se.securityItemTypeId);

    UpdateCharacteristics(
      {
        featuredAmenities: selectedFA,
        featureAspects: selectedFAS,
        securityItems: selectedSE,
      },
      {
        onSuccess: (response) => {
          const { statusCode, resultError } = response;

          if (statusCode === '200') {
            showSnackbar('update', 'success');
          } else {
            showSnackbar(resultError?.message, 'error');
          }
        },
        onError: (error) => {
          showSnackbar(error?.message, 'error');
        },
      }
    );
  };

  // hooks
  const {    
    palette: { common, text, primary },
  } = useTheme();
  const showSnackbar = useSnackbar();  
  const { t: tstep21 } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step21' });
  const { t: tcommon } = useTranslation();

  useEffect(() => {
    if (ParamListingRentFeaturedAspects?.data) {
      setFeaturedAspects(
        ParamListingRentFeaturedAspects.data.map((rule) => ({
          ...rule,
          isSelected: false,
        }))
      );
    }

    if (ParamListingRentAmenityTypes?.data) {
      setFeaturedAmenities(
        ParamListingRentAmenityTypes.data.map((rule) => ({
          ...rule,
          isSelected: false,
        }))
      );
    }
    if (ParamListingRentSecurityItems?.data) {
      setSecurityItems(
        ParamListingRentSecurityItems.data.map((rule) => ({
          ...rule,
          isSelected: false,
        }))
      );
    }
  }, [ParamListingRentFeaturedAspects, ParamListingRentAmenityTypes, ParamListingRentSecurityItems]);

  useEffect(() => {
    if (amenitiesSelected && amenitiesSelected.length > 0 && ParamListingRentAmenityTypes?.data) {
      const ids = amenitiesSelected.map((item) => item.amenitiesTypeId);
      handleSelectCard(null as any, 'FA', ids);
    }

    if (featuredAspectsSelected && featuredAspectsSelected.length > 0 && ParamListingRentFeaturedAspects?.data) {
      const ids = featuredAspectsSelected.map((item) => item.featuredAspectTypeId);
      handleSelectCard(null as any, 'FAS', ids);
    }

    if (securityItemsSelected && securityItemsSelected.length > 0 && ParamListingRentSecurityItems?.data) {
      const ids = securityItemsSelected.map((item) => item.securityItemTypeId);
      handleSelectCard(null as any, 'SI', ids);
    }
  }, [amenitiesSelected, featuredAspectsSelected, securityItemsSelected, ParamListingRentFeaturedAspects, ParamListingRentAmenityTypes, ParamListingRentSecurityItems]);

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: -3.2, width: '100%', p: 1 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '18px', mt: 0.5, ml: 0 }}>{tcommon('admin.editProperty.5.title')}</Typography>
        <Divider sx={{ mx: -4, my: -2.7 }} />

        <Card sx={{ height: '100%', boxSizing: 'border-box', width: '95%', boxShadow: 'none', ml: 0 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 1,mt: 1, color: '#1f2937' }}>
            {tcommon('admin.editProperty.5.subtitle')}
          </Typography>
          <Typography sx={{ fontSize: '13px', mb: 3, color: '#6b7280' }}>
           {tcommon('admin.editProperty.5.description')}
          </Typography>
          <Typography sx={{ fontSize: '12px', letterSpacing: '0.05em', fontWeight: 600, color: '#1f2937', textTransform: 'uppercase' }}>
            {tstep21('featuredAmenities')}
          </Typography>
          <CardContent sx={{ p: 0 }}>
            <Grid container spacing={2} sx={{ mt: 3 }} key='featuredAmenitie-edit'>
              {loadingAmenitie ? (
                <Box sx={{ mt: 5 }}>
                  <LoadingThreeDotsJumping />
                </Box>
              ) : (
                featuredAmenities.length > 0 && featuredAmenities.map((ameni) => (
                  <Grid size={{ xs: 4 }} key={ameni?.amenitiesTypeId}>
                    <CardSquareV2
                      title={ameni?.valueString ?? ""}
                      typeIcon={ameni?.valueString?.replace(/\r?\n|\r/g, "")
                                          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                          .toLowerCase()
                                          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())}
                      textColor={ameni?.isSelected ? common.white : text.secondary}
                      onClick={() => handleSelectCard(ameni, 'FA')}
                      selected={ameni?.isSelected}

                    />
                  </Grid>
                ))
              )}
            </Grid>
          </CardContent>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ mt: 2, fontSize: '12px', letterSpacing: '0.05em', fontWeight: 600, color: '#1f2937', textTransform: 'uppercase' }}>
            {tstep21('featuredAspects')}
          </Typography>
          <CardContent sx={{ p: 0 }}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {loadingFeature ? (
                <Box sx={{ mt: 5 }}>
                  <LoadingThreeDotsJumping />
                </Box>
              ) : (
                featuredAspects.length > 0 && featuredAspects.map((fea) => (
                  <Grid size={{ xs: 4 }} key={fea?.featuredAspectTypeId}>
                    <CardSquareV2
                      title={fea?.name ?? ""}
                      typeIcon={fea?.name?.replace(/\r?\n|\r/g, "")
                                          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                          .toLowerCase()
                                          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())}
                      bgColor={fea?.isSelected ? primary.main : ''}
                      textColor={fea?.isSelected ? common.white : text.secondary}
                      onClick={() => handleSelectCard(fea, 'FAS')}
                      selected={fea?.isSelected}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </CardContent>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ mt: 2, fontSize: '12px', letterSpacing: '0.05em', fontWeight: 600, color: '#1f2937', textTransform: 'uppercase' }}>{tstep21('securityItems')}</Typography>
          <CardContent sx={{ p: 0 }}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {loadingSecurity ? (
                <Box sx={{ mt: 5 }}>
                  <LoadingThreeDotsJumping />
                </Box>
              ) : (
                securityItems.length > 0 && securityItems.map((secu: SecurityItems) => (
                  <Grid size={{ xs: 4 }} key={secu?.securityItemTypeId}>
                    <CardSquareV2
                      title={secu?.description ?? ""}
                      typeIcon={secu?.name?.replace(/\r?\n|\r/g, "")
                                          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                          .toLowerCase()
                                          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())}
                      bgColor={secu?.isSelected ? primary.main : ''}
                      textColor={secu?.isSelected ? common.white : text.secondary}
                      onClick={() => handleSelectCard(secu, 'SI')}
                      selected={secu?.isSelected}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{
            position: 'sticky',
            bottom: { xs: -28, md: -5 },
            zIndex: 10,
          display: 'flex',
          justifyContent: 'flex-end',
          py: 4,
          borderTop: '1px solid #e0e0e0',
          // mx: -3,
          bgcolor: 'white',
          // zIndex: 1,
        }}>
          <Button
            variant="primary"
            sx={{
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              color: '#fff',
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0',
                color: '#999'
              }
            }}
            onClick={handleSubmit}
          >
            {tcommon('commonNames.saveChanges')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SelectorServicios;
