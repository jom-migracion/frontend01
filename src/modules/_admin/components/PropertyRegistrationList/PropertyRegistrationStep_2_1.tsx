import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  AmenitiesType,
  FeaturedAspect,
  SecurityItems,
} from '@/models/interfaces/ListingRentResponseStep';
import React, { useEffect, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { PropertyRegistrationProps_2_1 } from '../../interface/IPropertyRegistrationProps';
import { useStepValidation } from '@/context/FormStepContext';
import AssertModal from '@/components/AssertModal';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import CardSquareV2 from '../CardSquareV2';

export const PropertyRegistrationStep_2_1: React.FC<PropertyRegistrationProps_2_1> = ({
  onChange
}) => {
  // store
  const { amenities, featuredAspects: featuredAspectSelected, securityItems: securityItemSelected } = usePropertyRegistration((state) => state.data.listingData);
  const parametricsStore = usePropertyRegistration((state) => state.data.parametrics);

  //  useState
  const [featuredAspects, setFeaturedAspects] = useState<FeaturedAspect[]>(parametricsStore.featuredAspects);
  const [featuredAmenities, setFeaturedAmenities] = useState<AmenitiesType[]>(parametricsStore.amenitiesTypes);
  const [securityItems, setSecurityItems] = useState<SecurityItems[]>(parametricsStore.securityItems);

  const [openModalAssert, setOpenModalAssert] = useState(false);
  
  // hooks
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step21'});
  const { setStepValid } = useStepValidation();
  const { palette: { text }} = useTheme();

  const handleSelectCard = (clicked: AmenitiesType | FeaturedAspect | SecurityItems, type?: string, ids?: number[]) => {
    if (type === 'FAS') {
      setFeaturedAspects((prevFeatured: FeaturedAspect[]) =>
        prevFeatured.map((featured) => {
          if (ids) {
            return {
              ...featured,
              isSelected: ids.includes(featured.featuredAspectTypeId)
            };
          } else if ('featuredAspectTypeId' in clicked) {
            return {
              ...featured,
              isSelected: featured.featuredAspectTypeId === clicked.featuredAspectTypeId
                ? !featured.isSelected
                : featured.isSelected
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
              isSelected: ids.includes(ameniti.amenitiesTypeId)
            };
          } else if ('amenitiesTypeId' in clicked) {
            return {
              ...ameniti,
              isSelected: ameniti.amenitiesTypeId === clicked.amenitiesTypeId
                ? !ameniti.isSelected
                : ameniti.isSelected
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
              isSelected: ids.includes(security.securityItemTypeId) 
            };
          } else if ('securityItemTypeId' in clicked) {
            return {
              ...security,
              isSelected: security.securityItemTypeId === clicked.securityItemTypeId
                ? !security.isSelected
                : security.isSelected
            };
          }
          return security;
        })
      );
    }
  };

  useEffect(() => {
    if (amenities && amenities.length > 0) {
      const ids = amenities.map(item => item.amenitiesTypeId);
      handleSelectCard(null as any, 'FA', ids);
    }

    if (featuredAspectSelected && featuredAspectSelected.length > 0) {
      const ids = featuredAspectSelected.map(item => item.featuredAspectTypeId);
      handleSelectCard(null as any, 'FAS', ids);
    }

    if (securityItemSelected && securityItemSelected.length > 0) {
        const ids = securityItemSelected.map(item => item.securityItemTypeId);
        handleSelectCard(null as any, 'SI', ids);
    }

  }, [amenities, featuredAspectSelected, securityItemSelected]);

  useEffect(() => {
    const selectedFAS = featuredAspects
      ?.filter((featured) => featured.isSelected)
      .map((fe) => fe.featuredAspectTypeId);
    const selectedFA = featuredAmenities
      ?.filter((ameni) => ameni.isSelected)
      .map((am) => am.amenitiesTypeId);
    const selectedSE = securityItems
      ?.filter((security) => security.isSelected)
      .map((se) => se.securityItemTypeId);

    const isValid = selectedFAS.length > 0 || selectedFA.length > 0 || selectedSE.length > 0;
    setStepValid(3, isValid); // Notifica al componente padre si es válido o no
    onChange({
      step2_1: { featuredAmenities: selectedFA, featuredAspects: selectedFAS, securityItems: selectedSE },
    });
  }, [featuredAspects, featuredAmenities, securityItems, setStepValid, onChange]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} columns={8}>
          <Grid size={{ md: 8, xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card
              sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none', mt: '16px', bgcolor:'#f8f9fc'}}
            >
              <Box display="flex" alignItems="center">
                <Typography sx={{  fontSize: '1.5rem', fontWeight: 600, color: '#222222' }}>
                  {/* {t('title')} */}
                  ¿Qué servicios ofrece tu espacio?
                  {/* <GoQuestion size={15} style={{ marginLeft: 5 }} /> */}
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: '0.875rem', color: text.primary, mt:0.5 }}
              >
                {/* {t('message')}                 */}
                Selecciona los servicios que tus huéspedes podrán disfrutar durante su estancia. Podrás añadir más detalles después.
                {/* <span
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => setOpenModalAssert(true)}
                >
                  {' '}{t('infoModal')}                  
                </span> */}
              </Typography>              
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#222222', mt: 2 }}>
                {t('featuredAmenities')}
              </Typography>
              <CardContent sx={{ p: 0 }}>
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  {featuredAmenities.map((ameni) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={ameni.amenitiesTypeId}>
                      <CardSquareV2
                        title={ameni.valueString}
                        typeIcon={ameni.valueString.replace(/\r?\n|\r/g, "")
                                          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                          .toLowerCase()
                                          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())}
                        selected={ameni?.isSelected}
                        onClick={() => handleSelectCard(ameni, 'FA')}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
              <Divider sx={{ mb: 0, mt: 3, mx: { xs: 0, md: -10 } }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#222222', mt: 2 }}>
                {t('featuredAspects')}
              </Typography>
              <CardContent sx={{ p: 0 }}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {featuredAspects.map((fea) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={fea.featuredAspectTypeId}>
                      <CardSquareV2
                        title={fea.name}
                      typeIcon={fea?.name?.replace(/\r?\n|\r/g, "")
                                          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                          .toLowerCase()
                                          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())}
                        selected={fea?.isSelected}
                        onClick={() => handleSelectCard(fea, 'FAS')}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
              <Divider sx={{ mb: 0, mt: 3, mx: { xs: 0, md: -10 } }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#222222', mt: 2 }}>{t('securityItems')}</Typography>
              <CardContent sx={{ p: 0 }}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {securityItems.map((secu: SecurityItems) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={secu.securityItemTypeId}>
                      <CardSquareV2
                        title={secu.description}
                      typeIcon={secu?.name?.replace(/\r?\n|\r/g, "")
                                          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                                          .toLowerCase()
                                          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())}
                        selected={secu?.isSelected}
                        onClick={() => handleSelectCard(secu, 'SI')} 
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <AssertModal
        title={t('titleModal')}
        content={t('titleContentModal')}
        showCloseLeft={false}
        showRightIcon={true}
        rightIcon={<CloseIcon />}
        open={openModalAssert}
        onClose={() => setOpenModalAssert(false)}
      />
    </>
  );
};