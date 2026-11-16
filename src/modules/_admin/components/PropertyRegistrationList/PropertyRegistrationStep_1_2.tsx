import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Ability from '../Ability';
import { useStepValidation } from '@/context/FormStepContext';
import {
  CounterItem,
  Guests,
  PropertyRegistrationProps_1_2,
} from '../../interface/IPropertyRegistrationProps';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const PropertyRegistrationStep_1_2: React.FC<PropertyRegistrationProps_1_2> = ({
  onChange,
}) => {
  // store
  const {
    combinationOption,
    maxGuests: guests,
    bathrooms,
    beds,
    sofaBeds,
    bedrooms,
    sharedBathroom,
    privateBathroom,
    privateBathroomLodging,
  } = usePropertyRegistration((state) => state.data.listingData);
  
  // useState
  const [maxGuests, setMaxGuests] = useState<Guests>({
    guests: guests == 0 || guests == null ? 1 : guests,
    bathrooms: bathrooms == 0 || bathrooms == null ? 0 : bathrooms,
    bedrooms: bedrooms == 0 || bedrooms == null ? 0 : bedrooms,
    beds: beds == 0 || beds == null ? 1 : beds,
    sofaBeds: sofaBeds,
    privateBathroom: privateBathroom,
    privateBathroomLodging: privateBathroomLodging,
    sharedBathroom: sharedBathroom,
  });

  // hooks
  const { setStepValid } = useStepValidation();
  const { t } = useTranslation('translation', { keyPrefix: 'ability' });
  // const { t: t2 } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step2' });

  // const
  const services: CounterItem[] = [
    {
      key: 'guests',
      name: t('guests.name'),
      description: '',//t('guests.description'),
      count: 1,
      hidden: false,
      maxLimit: 20,
    },
    {
      key: 'bedrooms',
      name: t('bedrooms.name'),
      description: '',//t('bedrooms.description'),
      count: 1,
      hidden: false,
      maxLimit: 10,
    },
    {
      key: 'beds',
      name: t('beds.name'),
      description: '',//t('beds.description'),
      count: 1,
      hidden: false,
      maxLimit: 20,
    },        
    {
      key: 'sofaBeds',
      name: t('sofaBeds.name'),
      description: '',//t('sofaBeds.description'),
      count: 0,
      hidden: false,
      maxLimit: 20,
    },
    {
      key: 'bathrooms',
      name: t('bathrooms.name'),
      description: '',//t('bathrooms.description'),
      count: 1,
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
      hidden: false,
      maxLimit: 10,
    },
    {
      key: 'sharedBathroom',
      name: t('sharedBathroom.name'),
      description: t('sharedBathroom.description'),
      count: 0,
      hidden: false,
      maxLimit: 10,
    },
  ];

  // functions
  const handleValueChange = (key: string, newValue: number) => {
    setMaxGuests((prev) => ({ ...prev, [key]: newValue }));
  };

  useEffect(() => {
    const hasBathroom = (maxGuests.privateBathroom ?? 0) > 0 || (maxGuests.privateBathroomLodging ?? 0) > 0 || (maxGuests.sharedBathroom ?? 0) > 0;
    if (maxGuests.guests >= 1 && maxGuests.beds >= 1 && hasBathroom) {
      setStepValid(1, true);
    } else {
      setStepValid(1, false);
    } 
    
    onChange({ step1_2: maxGuests });
  }, [maxGuests, setStepValid]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1} columns={10}>
        <Grid size={{ md: 8, xs: 16 }}>
          <Card sx={{ height: '100%', mt: '16px', boxSizing: 'border-box', width: '100%', boxShadow: 'none',bgcolor:'#f8f9fc' }}>
            <Box display="flex" flexDirection="column" alignItems="flex-start" mb={4}>
              <Typography  sx={{ fontWeight: 600, fontSize: '1.5rem', color: '#222222', lineHeight: '2rem' }}>
                {t('title', {
                  defaultValue: '¿Cuántas personas pueden hospedarse?', 
                })}
              </Typography>
              <Typography sx={{ mt: 1.5, fontSize: '0.875rem', color: '#666666', lineHeight: '1.25rem' }}>
                {t('subtitle', {
                  defaultValue: 'Define la capacidad de tu espacio para que los huéspedes sepan qué esperar.',
                })}
              </Typography>
            </Box>
            <CardContent sx={{ width: '100  %', p: 0, ml: 0, bgcolor: 'transparent' }}>
              <Ability items={services} values={maxGuests} onValueChange={handleValueChange} />
            </CardContent>
            <Divider sx={{ my: 4, mt: 6 }} />
              
              <HelpOutlineIcon sx={{ fontSize: '0.875rem', verticalAlign: 'middle', mr: 0.5 }} />  
              <Typography sx={{ fontSize: '0.875rem', color: '#666666', lineHeight: '1.25rem', display: 'inline' }}>
                {t('description', {
                  defaultValue: 'Los huéspedes suelen buscar según estas necesidades básicas. Asegúrate de que sean precisas.',
                })}
              </Typography>            
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
