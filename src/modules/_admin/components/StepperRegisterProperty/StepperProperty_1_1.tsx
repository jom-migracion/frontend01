import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StepperWrapperLinear from './StepperWrapperLinear';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
import PropertyCardStep from './PropertyCardStep';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGet } from '@/hooks/api';
import { ParamPropertyTypes } from '@/models/interfaces/stepperLinearRegistreProperty';
import { useSnackbar } from '@/context/SnackbarContext';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import theme from '@/themes/theme';

const StepperProperty_1_1: React.FC<StepperWrapperProps> = ({
  stepsCount,
  activeStep,
  step,
  onSubmit,
  prefillData,
}) => {
  const [selectProperty, setSelectProperty] = useState<ParamPropertyTypes>();
  const showSnackbar = useSnackbar();
  const { handleSubmit } = useForm({ defaultValues: prefillData, mode: 'onChange' });

  const { data: ParamPropertyTypes, isLoading } = useGet<ParamPropertyTypes[]>(
    'ParamPropertyTypes',
    '/Parametrics/PropertyTypes'
  );

  const internalSubmit = () => {
    if (!selectProperty) {
      showSnackbar('Por favor selecciona una opción', 'info');
    } else {
      onSubmit && onSubmit(selectProperty);
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
              <Typography sx={{ mt: 11, ml: 4, mr: 20, fontWeight: 600, fontSize: '20px' }}>
                ¿Cual de estas opciones describe mejor tu espacio?
              </Typography>

              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                  ml: isLoading ? 22: 2,
                  mr: 5,
                  mt: isLoading ? 10 : 0,
                }}
              >
                <Grid container spacing={2}>
                   {isLoading ? (
                    <LoadingThreeDotsJumping  />
                  ) : (
                    ParamPropertyTypes?.data &&
                    ParamPropertyTypes.data.map((property) => (
                      <Grid key={property.propertySubtypeId} size={4}>
                        <Box
                          onClick={() => setSelectProperty(property)}
                          sx={{
                            width: '90%',
                            height: 80,
                            borderWidth: 1,
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: '10px',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            borderStyle: 'solid',
                            cursor: 'pointer',
                            borderColor: '#B6B6B6',
                            backgroundColor:
                              selectProperty?.propertySubtypeId == property.propertySubtypeId
                                ? '#000000'
                                : '',
                            '&:hover': {
                              borderColor: 'primary.main',
                            },
                            transition: 'background-color 0.3s ease',
                            boxShadow: 3,
                          }}
                        >
                          <img
                            src={
                              selectProperty?.propertySubtypeId == property.propertySubtypeId
                                ? undefined
                                : undefined
                            }
                            style={{
                              width: '20px',
                              height: '20px',
                              marginTop: '5px',
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color:
                                selectProperty?.propertySubtypeId == property.propertySubtypeId
                                  ? theme.palette.common.white
                                  : theme.palette.text.secondary,
                              textTransform: 'capitalize',
                              fontSize: '12px',
                              textAlign: 'center',
                              mt: 1,
                            }}
                          >
                            {property.subType}
                          </Typography>
                        </Box>
                      </Grid>
                    ))
                  )}
                </Grid>
              </CardContent>
            </Card>
            <Grid sx={{ ml: 3, width: '70%' }}>
              <StepperWrapperLinear stepsCount={stepsCount} activeStep={activeStep} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default StepperProperty_1_1;
