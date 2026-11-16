import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StepperWrapperLinear from './StepperWrapperLinear';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
import PropertyCardStep from './PropertyCardStep';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AmenitiesType } from '@/models/interfaces/ListingRentResponseStep';
import { useSnackbar } from '@/context/SnackbarContext';

const StepperProperty_2_1: React.FC<StepperWrapperProps> = ({
  stepsCount,
  activeStep,
  step,
  onSubmit,
  prefillData,
}) => {
  const [amenities, setAmenities] = useState<AmenitiesType[]>([]);
  const showSnackbar = useSnackbar();
  const { handleSubmit } = useForm({ defaultValues: prefillData, mode: 'onChange' });

  const handleSelectCard = (clickedAmeniti: AmenitiesType) => {
    setAmenities((prevAmenities: any) =>
      prevAmenities.map((ameniti: AmenitiesType) => ({
        ...ameniti,
        isSelected:
          ameniti?.amenitiesTypeId === clickedAmeniti.amenitiesTypeId
            ? ameniti.isSelected
              ? false
              : true
            : ameniti.isSelected,
      }))
    );
  };

  const internalSubmit = () => {
    const selected = amenities
      ?.filter((ameniti) => ameniti.isSelected)
      .map((am) => am.amenitiesTypeId);

    if (selected.length > 0) {
      onSubmit && onSubmit(selected);
    } else {
      showSnackbar('Por favor seleccione por lo menos un servicio', 'info');
    }
  };

  useEffect(() => {
    setAmenities(prefillData?.parametrics?.amenitiesTypes);
  }, []);
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
              <Typography sx={{ mt: 10, ml: 5, mr: 20, fontWeight: 600, fontSize: '20px' }}>
                Que servicios ofreces
              </Typography>

              <CardContent>
                <Grid container spacing={2} sx={{ ml: 3, mr: 10, mt: 2 }}>
                  {amenities?.length > 0 &&
                    amenities.map((ameniti: AmenitiesType) => (
                      <Grid key={ameniti.amenitiesTypeId} size={4}>
                        <Box
                          onClick={() => handleSelectCard(ameniti)}
                          sx={{
                            width: '100%',
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
                            backgroundColor: ameniti.isSelected ? '#000000' : '',
                            '&:hover': {
                              borderColor: 'primary.main',
                            },
                            transition: 'background-color 0.3s ease',
                            boxShadow: 3,
                          }}
                        >
                          <img
                            src={ameniti.isSelected ? undefined : ameniti.iconLink}
                            style={{
                              width: '20px',
                              height: '20px',
                              marginTop: '5px',
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: ameniti.isSelected ? '#F6F6F6' : '#000000',
                              textTransform: 'lowercase',
                              fontSize: '12px',
                              textAlign: 'center',
                              mt: 1,
                            }}
                          >
                            {ameniti.typeCode}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                </Grid>
              </CardContent>
            </Card>
            <Grid sx={{ ml: 3, width: '80%' }}>
              <StepperWrapperLinear stepsCount={stepsCount} activeStep={activeStep} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default StepperProperty_2_1;
