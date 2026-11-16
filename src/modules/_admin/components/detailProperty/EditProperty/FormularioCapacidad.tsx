import { Box, Typography, Card, useTheme, CardContent, Button, Divider } from '@mui/material';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { useTranslation } from 'react-i18next';
import Ability from '../../Ability';
import { CounterItem, Guests } from '@/modules/_admin/interface/IPropertyRegistrationProps';
import { useSnackbar } from '@/context/SnackbarContext';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useCustomMutationByUrl } from '@/hooks/api';

interface IPropsCapacidad {
  listingRentId: number;
  subTypeCode: string;
  accomodationCode: string;
  capacity: Guests;
}
const FormularioCapacidad: React.FC<IPropsCapacidad> = ({
  listingRentId,
  subTypeCode,
  accomodationCode,
  capacity,
}) => {
  // useState
  const [combinationOption, setCombinationOption] = useState<number>(0);
  const [maxGuests, setMaxGuests] = useState<Guests>({
    guests: capacity.guests,
    bathrooms: capacity.bathrooms,
    bedrooms: capacity.bedrooms,
    beds: capacity.beds,
    sofaBeds: capacity.sofaBeds,
    privateBathroom: capacity.privateBathroom ?? 0,
    privateBathroomLodging: capacity.privateBathroomLodging ?? 0,
    sharedBathroom: capacity.sharedBathroom ?? 0,
  });

  // hooks
  const { t } = useTranslation('translation', { keyPrefix: 'ability' });
  // const { t: t2 } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step2' });
  const { t: tcommon } = useTranslation('translation');
  const { typography } = useTheme();
  const showSnackbar = useSnackbar();

  // const
  const services: CounterItem[] = [
    {
      key: 'guests',
      name: t('guests.name'),
      description: t('guests.description'),
      count: 1,
      hidden: false,
      maxLimit: 20,
    },
    {
      key: 'bedrooms',
      name: t('bedrooms.name'),
      description: t('bedrooms.description'),
      count: 0,
      hidden: false,
      maxLimit: 10,
    },    
    {
      key: 'beds',
      name: t('beds.name'),
      description: t('beds.description'),
      count: 0,
      hidden: false,
      maxLimit: 20,
    },
    {
      key: 'sofaBeds',
      name: t('sofaBeds.name'),
      description: t('sofaBeds.description'),
      count: 0,
      hidden: false,
      maxLimit: 20,
    },    
    {
      key: 'bathrooms',
      name: t('bathrooms.name'),
      description: t('bathrooms.description'),
      count: 0,
      hidden: true,
      maxLimit: 10,
    },
    {
      key: 'privateBathroom',
      name: t('privateBathroom.name'),
      description: t('privateBathroom.description'),
      count: 0,
      hidden: false,
      maxLimit: 10,
    },
    {
      key: 'privateBathroomLodging',
      name: t('privateBathroomLodging.name'),
      description: t('privateBathroomLodging.description'),
      count: 0,
      hidden:  false,
      maxLimit: 10,
    },
    {
      key: 'sharedBathroom',
      name: t('sharedBathroom.name'),
      description: t('sharedBathroom.description'),
      count: 0,
      hidden:  false,
      maxLimit: 10,
    },
  ];

  const { mutate: UpdatePricingAndDiscounts, isPending } = useCustomMutationByUrl('put');
  // functions
  const handleValueChange = (key: string, newValue: number) => {
    setMaxGuests((prev) => ({ ...prev, [key]: newValue }));
  };

  // Función para verificar si los valores no cumplen con los requisitos mínimos
  const areAllValuesZero = () => {
    const hasBathroom =
      maxGuests.privateBathroom > 0 ||
      maxGuests.privateBathroomLodging > 0 ||
      maxGuests.sharedBathroom > 0;
    return !(maxGuests.guests >= 1 && maxGuests.beds >= 1 && hasBathroom);
  };

  // Función para obtener el mensaje de error apropiado
  const getValidationMessage = () => {
    return tcommon('admin.editProperty.6.message');
  };

  const handleGuardar = async () => {
    const url = `/Host/ListingRent/${listingRentId}/UpdateCapacity?beds=${maxGuests.beds}&bedrooms=${maxGuests.bedrooms}&bathrooms=${maxGuests.bathrooms}&maxGuests=${maxGuests.guests}&privateBathroom=${maxGuests.privateBathroom}&privateBathroomLodging=${maxGuests.privateBathroomLodging}&sharedBathroom=${maxGuests.sharedBathroom}&sofaBeds=${maxGuests.sofaBeds}`;

    UpdatePricingAndDiscounts(
      { url },
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
          showSnackbar(error?.response?.data?.resultError?.message ?? error.message, 'error');
        },
      }
    );
  };

  // hooks
  useEffect(() => {
    if (subTypeCode && accomodationCode) {
      if (subTypeCode == 'FAMILY' && accomodationCode == 'ENTIRE') {
        setCombinationOption(1);
      } else if (subTypeCode == 'FAMILY' && accomodationCode == 'PRIVATE') {
        setCombinationOption(2);
      } else if (subTypeCode == 'FAMILY' && accomodationCode == 'SHARED') {
        setCombinationOption(3);
      } else {
        setCombinationOption(0);
      }
    }
  }, [subTypeCode, accomodationCode, setCombinationOption]);

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}

      <Box
        sx={{
          p: 1,
          mt: -4,
          width: '100%',
        }}
      >
        <Grid container spacing={1} columns={10}>
        <Typography sx={{ fontWeight: 600, fontSize: '18px', mt: 1.3, ml:0 }}>{tcommon('admin.editProperty.5.title')}</Typography>
        
          <Grid size={{ md: 12, xs: 10 }} sx={{ ml: 0 }}>
            <Divider sx={{ mx: -8, my: 0.3 }} />          
            <Card
              sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none' }}
            >
              <Box display="flex" alignItems="center">
                <Typography sx={{ mt: 1.5, fontWeight: 600, fontSize: '16px' }}>
                 {tcommon('admin.editProperty.5.subtitle')}
                </Typography>
              </Box>
                <Typography  sx={{mt:2, fontWeight: 600, fontSize: '13px', color: '#6b7280' }}>
                {tcommon('admin.editProperty.5.description')}
                </Typography>              
              <CardContent sx={{ width: '100%', p: 0, mt: 2 }}>
                <Ability items={services} values={maxGuests} onValueChange={handleValueChange} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{
            position: 'sticky',
            bottom: { xs: -28, md: -5 },
            zIndex: 10,
          display: 'flex',
          justifyContent: 'flex-end',
     
          py: 4,
          borderTop: '1px solid #e0e0e0',
          mt:1,
          bgcolor: 'white',
          // zIndex: 1,
        }}>
          <Button
            variant="primary"
            disabled={areAllValuesZero() || isPending}
            sx={{
              fontFamily: typography.paragraph1Regular,
              textTransform: 'none',
              opacity: areAllValuesZero() ? 0.6 : 1,
              '&.Mui-disabled': {
                backgroundColor: areAllValuesZero() ? 'error.light' : 'action.disabledBackground',
                color: areAllValuesZero() ? 'error.contrastText' : 'text.disabled',
              },
            }}
            onClick={handleGuardar}
          >
            {isPending
              ? tcommon('commonNames.saving')
              : areAllValuesZero()
                ? getValidationMessage()
                : tcommon('commonNames.saveChanges')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default FormularioCapacidad;
