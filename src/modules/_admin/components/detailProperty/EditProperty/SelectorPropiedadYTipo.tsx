import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Divider, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { AccomodationType } from '@/models/interfaces/ListingRentResponseStep';
import { useCustomMutationByUrl, useGet } from '@/hooks/api';
import { ParamPropertyTypes } from '@/models/interfaces/stepperLinearRegistreProperty';
import { useTranslation } from 'react-i18next';
import CardSquare from '../../CardSquare';
import CardRectangle from '../../CardRectangle';
import { useSnackbar } from '@/context/SnackbarContext';

const SelectorPropiedadYTipo: React.FC<{
  listingRentId: number;
  propertySubType: ParamPropertyTypes;
  accomodationType: AccomodationType;
}> = ({ listingRentId, propertySubType, accomodationType }) => {
  // useState
  const [selectProperty, setSelectProperty] = useState<ParamPropertyTypes | undefined>(undefined);
  const [accomodation, setAccomodation] = useState<AccomodationType | undefined>(undefined);

  // api
  const { data: ParamPropertyTypesToUpdated, isLoading: isLoadingProp } = useGet<
    ParamPropertyTypes[]
  >('ParamPropertyTypesToUpdated', '/Parametrics/PropertyTypes');

  const { data: ParamAccomodationTypesToUpdated, isLoading: isLoadingAcco } = useGet<
    AccomodationType[]
  >('ParamAccomodationTypesToUpdated', '/Parametrics/AccomodationTypes');

  const { mutate: UpdatePricingAndDiscounts, isPending } = useCustomMutationByUrl('put');

  //

  const handleSubmit = async () => {
    const url = `/Host/ListingRent/${listingRentId}/UpdatePropertyAndAccomodationTypes?propertyTypeId=${selectProperty?.propertySubtypeId}&accomodationTypeId=${accomodation?.accommodationTypeId}`;
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
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.step1' });
  const { t: tcommon } = useTranslation();
  const showSnackbar = useSnackbar();

  const {
    typography,
    palette: { common, text, primary, softHighlight },
  } = useTheme();

  useEffect(() => {
    if (propertySubType && ParamPropertyTypesToUpdated?.data && !selectProperty) {
      const foundProperty = ParamPropertyTypesToUpdated.data.find(
        (prope) => prope.propertySubtypeId === propertySubType.propertySubtypeId
      );
      if (foundProperty) {
        setSelectProperty(foundProperty);
      }
    }
  }, [ParamPropertyTypesToUpdated, selectProperty]);

  useEffect(() => {
    if (accomodationType && ParamAccomodationTypesToUpdated?.data && !accomodation) {
      const foundAccomodation = ParamAccomodationTypesToUpdated.data.find(
        (accom) => accom.accommodationTypeId === accomodationType.accommodationTypeId
      );
      if (foundAccomodation) {
        setAccomodation(foundAccomodation);
      }
    }
  }, [ParamAccomodationTypesToUpdated, accomodation]);

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: -3, p: 1,  width: '100%' }}>
        <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>{tcommon('admin.editProperty.3.title', { defaultValue: 'Tipo de hospedaje' })}</Typography>
        <Divider sx={{mx: -8, my: -2.4}}/>
        {/*  */}
        <Grid container spacing={1} columns={12}>
          <Grid size={{ md: 12, xs: 12 }}>
            <Card
              sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none' }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Typography sx={{ mt: 1, fontWeight: 600, fontSize: '16px' }}>
                  {t('title')}
                </Typography>
              </Box>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  mt: isLoadingProp ? 10 : 0,
                  pr: '24px',
                  pl: 0,
                }}
              >
                <Grid container spacing={1} columns={12}>
                  {isLoadingProp ? (
                    <LoadingThreeDotsJumping />
                  ) : (
                    ParamPropertyTypesToUpdated?.data &&
                    ParamPropertyTypesToUpdated.data.map((property) => (
                      <Grid key={property.propertySubtypeId} size={{ xs: 6, sm: 4, md: 2 }}>
                        <CardSquare
                          title={property.subType}
                          
                          textColor={
                            selectProperty?.propertySubtypeId == property.propertySubtypeId
                              ? softHighlight
                              : primary.main
                          }
                          selected={selectProperty?.propertySubtypeId == property.propertySubtypeId}
                          seeIcon={true}
                          onClick={() => setSelectProperty(property)}
                          typeIcon={property.subTypeIcon}
                        />
                      </Grid>
                    ))
                  )}
                </Grid>
                {/* <Typography
                  sx={{
                    mt: 2,
                    fontFamily: typography.small1SRegular,
                    color: text.primary,
                  }}
                >
                  {t('message')}
                  <Typography
                    component="span"
                    sx={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontFamily: typography.small1SRegular,
                      color: text.secondary,
                    }}
                  >
                    {' '}
                    {t('writeUs')}
                  </Typography>
                </Typography> */}
              </CardContent>
              <Typography sx={{ mt: 4, fontWeight: 600, fontSize: '16px' }}>
                {t('title2')}
              </Typography>
              <CardContent
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                  p: 0,
                  pt: 2,
                  gap: 1.5,
                  mt: isLoadingAcco ? 10 : 0,
                }}
              >
                {isLoadingAcco ? (
                  <LoadingThreeDotsJumping />
                ) : (
                  ParamAccomodationTypesToUpdated?.data &&
                  ParamAccomodationTypesToUpdated.data.map((accommo: AccomodationType) => (
                    <CardRectangle
                      key={accommo.accommodationTypeId}
                      onClick={() => setAccomodation(accommo)}
                      title={accommo.accommodationName}
                      description={accommo.accommodationDescription}
                      bgColor={
                        accommo?.accommodationTypeId == accomodation?.accommodationTypeId
                          ? primary.main
                          : ''
                      }
                      textColorTitle={
                        accommo?.accommodationTypeId == accomodation?.accommodationTypeId
                          ? softHighlight
                          : primary.main
                      }
                      selected={accommo?.accommodationTypeId == accomodation?.accommodationTypeId}
                      typeIcon={accommo?.accommodationIcon}
                      seeIcon={true}
                      textColorDescription={
                        accommo?.accommodationTypeId == accomodation?.accommodationTypeId
                          ? common.white
                          : text.secondary
                      }
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
{/* boton guardar */}
        <Box
          sx={{
            position: 'sticky',
            bottom: { xs: -38, md: -5 },
            zIndex: 10,
            display: 'flex',
            justifyContent: 'flex-end',
            pt: 2,
            pb: 2,
            borderTop: '1px solid #e0e0e0',
            bgcolor: 'white',
            //  zIndex: 1,
          }}
        >
          <Button
            variant="primary"
            sx={{
              fontFamily: typography.paragraph1Regular,
              textTransform: 'none',
            }}
            type="button"
            onClick={handleSubmit}
          >
            {tcommon('commonNames.saveChanges', { defaultValue: 'Guardar cambios' })}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default SelectorPropiedadYTipo;
