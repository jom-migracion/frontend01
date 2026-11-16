import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StepperWrapperLinear from './StepperWrapperLinear';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
import PropertyCardStep from './PropertyCardStep';
import { useForm } from 'react-hook-form';
import { AccomodationType } from '@/models/interfaces/ListingRentResponseStep';
import { useState } from 'react';
import { useSnackbar } from '@/context/SnackbarContext';
import theme from '@/themes/theme';

const StepperProperty_1_2: React.FC<StepperWrapperProps> = ({
  stepsCount,
  activeStep,
  step,
  onSubmit,
  prefillData,
}) => {
  const [accomodation, setAccomodation] = useState<AccomodationType>();
  const showSnackbar = useSnackbar();
  const { handleSubmit } = useForm({ defaultValues: prefillData, mode: 'onChange' });

  const internalSubmit = () => {
    if (!accomodation) {
      showSnackbar('Por favor selecciona una opción', 'info');
    } else {
      onSubmit && onSubmit(accomodation);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form key={step} onSubmit={onSubmit ? handleSubmit(internalSubmit) : undefined}>
        <Grid container spacing={1} columns={16} sx={{ mt: 10 }}>
          <Grid size={{ md: 8, xs: 16 }}>
            <PropertyCardStep step={step} activeStep={activeStep} />
          </Grid>
          <Grid size={{ md: 8, xs: 16 }}>
            <Card
              sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none' }}
            >
              <Typography sx={{ mt: 6, ml: 4, mr: 20, fontWeight: 600, fontSize: '20px' }}>
                ¿De qué tipo de alojamiento dispondrán los huéspedes?
              </Typography>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                  ml: 2,
                  mr: 5,
                }}
              >
                {prefillData?.parametrics?.accomodationTypes &&
                  prefillData.parametrics.accomodationTypes.map(
                    (accommo: AccomodationType, index: number) => (
                      <Box
                        key={accommo.accommodationTypeId}
                        onClick={() => setAccomodation(accommo)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb:
                            index !== prefillData?.parametrics?.accomodationTypes.length - 1
                              ? 2.5
                              : undefined,
                          borderWidth: 1,
                          borderRadius: '5px',
                          borderStyle: 'solid',
                          borderColor: '#B6B6B6',
                          maxWidth: '100%',
                          width: '100%',
                          cursor: 'pointer',
                          height: 'auto',
                          pl: 4,
                          backgroundColor:
                            accommo?.accommodationTypeId == accomodation?.accommodationTypeId
                              ? '#000000'
                              : '',
                          '&:hover': {
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <img
                          src={
                            accommo?.accommodationTypeId == accomodation?.accommodationTypeId
                              ? undefined
                              : undefined
                          }
                          width={40}
                        />
                        <Box
                          sx={{
                            rowGap: 1,
                            columnGap: 4,
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              ml: 2,
                              color:
                                accommo?.accommodationTypeId == accomodation?.accommodationTypeId
                                  ? theme.palette.common.white
                                  : '#000000',
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 500,
                              }}
                            >
                              {accommo?.accommodationName}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 300, textWrap: 'wrap' }}
                            >
                              {accommo?.accommodationDescription}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )
                  )}
              </CardContent>
            </Card>
            <Grid sx={{ ml: 3, width: '82%' }}>
              <StepperWrapperLinear stepsCount={stepsCount} activeStep={activeStep} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default StepperProperty_1_2;
