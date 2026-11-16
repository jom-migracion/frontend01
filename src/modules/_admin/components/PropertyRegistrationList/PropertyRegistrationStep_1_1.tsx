import { Box, Button, Card, CardContent, TextField, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';

import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import React, { useEffect, useState } from 'react';
import { ParamPropertyTypes } from '@/models/interfaces/stepperLinearRegistreProperty';
import { useGet } from '@/hooks/api';
import { AccomodationType } from '@/models/interfaces/ListingRentResponseStep';
import CardRectangle from '../CardRectangle';
import CardSquare from '../CardSquare';
import { PropertyRegistrationProps_1_1 } from '../../interface/IPropertyRegistrationProps';
import { useStepValidation } from '@/context/FormStepContext';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { useTranslation } from 'react-i18next';

import AssertModal from '@/components/AssertModal';
import CloseIcon from '@mui/icons-material/Close';

const PropertyInput: React.FC<{ onSubmit: (property: string) => void }> = ({ onSubmit }) => {
  const MAX_CHARACTERS = 981;
  const [propertyType, setPropertyType] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.substring(0, MAX_CHARACTERS);
    setPropertyType(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(propertyType);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: '600px',
        mx: 'auto',
        p: 3,
        backgroundColor: 'white',
      }}
    >
      <Typography variant="paragraph1Medium" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
        ¿Qué inmueble tienes?
      </Typography>      
      <Typography variant="paragraph1Regular" color="text.secondary" sx={{ mb: 4 }}>
        Compártenos que inmueble es el que tienes para considerarlo.
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Ej.: Casa ecológica"
        value={propertyType}
        onChange={handleChange}
        slotProps={{ htmlInput: { maxLength: MAX_CHARACTERS } }}
        sx={{
          mb: 1,
          mt:4
        }}
      />
      <Typography
        variant="small1Regular"
        display="block"
        align="left"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {MAX_CHARACTERS - propertyType.length} caracteres disponibles
      </Typography>

      <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }} />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: 'black',
          color: 'white',
          py: 1.5,
          mt: 2,
          '&:hover': {
            backgroundColor: '#333',
          },
        }}
        disabled={!propertyType.trim()}
      >
        Enviar
      </Button>
    </Box>
  );
};

export const PropertyRegistrationStep_1_1: React.FC<PropertyRegistrationProps_1_1> = ({
  onChange,
}) => {
  // useState
  const [selectProperty, setSelectProperty] = useState<ParamPropertyTypes | undefined>(undefined);
  const [accomodation, setAccomodation] = useState<AccomodationType | undefined>(undefined);
  
  const [openModal, setOpenModal] = useState<boolean>(false);

  // store
  const { accomodationTypeId, propertySubTypeId } = usePropertyRegistration(
    (state) => state.data.listingData
  );


  // api
  const { data: ParamPropertyTypesData, isLoading: isLoadingProp } = useGet<ParamPropertyTypes[]>(
    'ParamPropertyTypes',
    '/Parametrics/PropertyTypes'
  );

  const { data: AccomodationTypesData, isLoading: isLoadingAcco } = useGet<AccomodationType[]>(
    'ParamAccomodationTypes',
    '/Parametrics/AccomodationTypes'
  );

  // hooks
  const { setStepValid } = useStepValidation();
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step1' });
  const {
    typography,
  } = useTheme();


  const handleSubmission = (property: string) => {
    console.log("Inmueble enviado:", property);
  };

  useEffect(() => {
    if (propertySubTypeId && ParamPropertyTypesData?.data && !selectProperty) {
      const foundProperty = ParamPropertyTypesData.data.find(
        (prope) => prope.propertySubtypeId === propertySubTypeId
      );
      if (foundProperty) {
        setSelectProperty(foundProperty);
      }
    }
  }, [ParamPropertyTypesData, selectProperty]);

  useEffect(() => {
    if (accomodationTypeId && AccomodationTypesData?.data && !accomodation) {
      const foundAccomodation = AccomodationTypesData.data.find(
        (accom) => accom.accommodationTypeId === accomodationTypeId
      );
      if (foundAccomodation) {
        setAccomodation(foundAccomodation);
      }
    }
  }, [AccomodationTypesData, accomodation]);

  // Efecto principal para validar el paso y notificar al padre
  useEffect(() => {
    const isValid = !!selectProperty && !!accomodation;
    setStepValid(0, isValid);

    onChange({
      step1_1: {
        propertyType: selectProperty,
        accomodationType: accomodation,
      },
    });
  }, [selectProperty, accomodation, setStepValid, onChange]);


  return (
    <React.Fragment>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} columns={10}>
          <Grid size={{ md: 8, xs: 16 }}>
            <Card sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none', bgcolor:'#f8f9fc', mt: '16px' }}>
              <Box display="flex" flexDirection="column" alignItems="flex-start" mb={4}>
                <Typography  sx={{ fontWeight: 600, fontSize: '1.5rem', color: '#222222', lineHeight: '2rem' }}>
                  {t('title3', { 
                    defaultValue: '¿Qué tipo de espacio vas a publicar?',
                  })}
                </Typography>
                <Typography sx={{ mt: 1.5, fontSize: '0.875rem', color: '#666666', lineHeight: '1.25rem' }}>
                  {t('subtitle', {
                    defaultValue: 'Selecciona la categoría que mejor describa tu propiedad. Esto ayudará a que los huéspedesSelecciona la categoría que mejor describa tu propiedad. Esto ayudará a que los huéspedes adecuados encuentren tu anuncio con mayor facilidad.',
                  })}
                </Typography>
              </Box>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                  mt: isLoadingProp ? 10 : 0,
                  p: 0,
                }}
              >
                <Grid container spacing={{ xs: 1.5, md: 2 }} columns={{ xs: 6, sm: 6, md: 12 }}>
                  {isLoadingProp ? (
                    <LoadingThreeDotsJumping />
                  ) : (
                    ParamPropertyTypesData?.data &&
                    ParamPropertyTypesData.data.map((property) => (
                      <Grid key={property.propertySubtypeId} size={{ xs: 6, sm: 3, md: 4 }}>
                        <CardSquare
                          title={property.subType}
                          selected={selectProperty?.propertySubtypeId == property.propertySubtypeId}
                          typeIcon={property.subTypeIcon}
                          seeIcon={true}
                          onClick={() => setSelectProperty(property)}
                          iconBgColor='#f5f5f7'
                          description={property.subTypeCode == 'COUNTRY' || property.subTypeCode == 'MODERN' ? 'Propiedad independiente con acceso privado.' : property.subTypeCode == 'FAMILY' ? 'Unidad residencial en un edificio multifamiliar.' : property.subTypeCode == 'WOOD' ? 'Refugio rústico ideal para la naturaleza.' : property.subTypeCode == 'MANS' ? 'Residencia de lujo con amplios terrenos.' : property.subTypeCode == 'LOFT' ? 'Estilo industrial con techos altos.' : 'Espacio de concepto abierto integrado.'}
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
              </CardContent>
              <Typography sx={{ mt: 4, fontFamily: typography.h5Medium }}>
                {t('title2')} *
              </Typography>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  flexDirection: { xs: 'column', md: 'row' },
                  p: 0,
                  pt: 2,
                  gap: 2,
                  mt: isLoadingAcco ? 10 : 0,
                }}
              >
                {isLoadingAcco ? (
                  <LoadingThreeDotsJumping />
                ) : (
                  AccomodationTypesData?.data &&
                  AccomodationTypesData.data.map((accommo: AccomodationType) => (
                    <CardRectangle
                      key={accommo.accommodationTypeId}
                      onClick={() => setAccomodation(accommo)}
                      title={accommo.accommodationName}
                      description={accommo.accommodationDescription}
                      selected={accommo?.accommodationTypeId == accomodation?.accommodationTypeId}
                      typeIcon={accommo?.accommodationIcon}
                      seeIcon={true}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <AssertModal
        title={''}
        content={<PropertyInput onSubmit={handleSubmission} />}
        open={openModal}
        showCloseLeft={false}
        onClose={() => setOpenModal(false)}
        rightIcon={<CloseIcon />}
        showRightIcon={true}
      />
    </React.Fragment>
  );
};
