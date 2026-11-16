import { Box, Card, CardContent, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StepperWrapperLinear from './StepperWrapperLinear';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
import PropertyCardStep from './PropertyCardStep';
import CustomButton from '@/components/CustomButton';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { FeaturedAspect } from '@/models/interfaces/ListingRentResponseStep';
import { useSnackbar } from '@/context/SnackbarContext';

const StepperProperty_2_3: React.FC<StepperWrapperProps> = ({
  stepsCount,
  activeStep,
  step,
  onSubmit,
  prefillData,
}) => {
  const showSnackbar = useSnackbar();
  const [featuredAspects, setFeaturedAspects] = useState<FeaturedAspect[]>([]);
  const { handleSubmit, register, getValues } = useForm({
    defaultValues: prefillData,
    mode: 'onChange',
  });

  const handleSelectCard = (clickedfeatured: FeaturedAspect) => {
    setFeaturedAspects((prevFeatured: any) =>
      prevFeatured.map((featured: FeaturedAspect) => ({
        ...featured,
        isSelected:
          featured?.featuredAspectTypeId === clickedfeatured.featuredAspectTypeId
            ? featured.isSelected
              ? false
              : true
            : featured.isSelected,
      }))
    );
  };

  const internalSubmit = () => {
    const selected = featuredAspects
      ?.filter((featured) => featured.isSelected)
      .map((fe) => fe.featuredAspectTypeId);

    const title = getValues('title');
    const description = getValues('description');

    if (title.length == 0) {
      showSnackbar('Ingrese el titulo', 'info');
    } else if (selected.length == 0) {
      showSnackbar('Por favor elige hasta 2 aspectos destacables', 'info');
    } else if (description.length == 0) {
      showSnackbar('Ingrese su descripcion', 'info');
    } else {
      onSubmit && onSubmit({ title, selected, description });
    }
  };

  useEffect(() => {
    setFeaturedAspects(prefillData?.parametrics?.featuredAspects);
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
              <Typography sx={{ ml: 4, mr: 20, fontWeight: 600, fontSize: '20px' }}>
                Brinda atributos de tu inmueble
              </Typography>
              <Typography
                sx={{ ml: 4, mr: 5, fontWeight: 300, fontSize: '15px', color: '#000000' }}
              >
                Necesitas contar con cinco fotos para emprezar.
              </Typography>
              <CardContent>
                <TextField
                  id="outlined-helperText"
                  label="Titulo"
                  placeholder="Monoambiente"
                  fullWidth
                  focused
                  color="secondary"
                  {...register('title')}
                  sx={{ mb: 1, mt: 1, width: '90%' }}
                />
                {/*  */}
                <Card sx={{ border: '1px solid #B6B6B6;', width: '90%' }}>
                  <Typography sx={{ color: '#B6B6B6', mt: 1, ml: 2, fontSize: '12px' }}>
                    Elige hasta 2 aspectos destacables
                  </Typography>
                  <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {featuredAspects.length > 0 &&
                      featuredAspects.map((featured) => (
                        <Box key={featured.featuredAspectTypeId}>
                          <CustomButton
                            label={featured.name}
                            onClick={() => handleSelectCard(featured)}
                            type="button"
                            color="secondary"
                            variant="outlined"
                            fullWidth
                            sx={{
                              fontSize: '12px',
                              fontWeight: 300,
                              backgroundColor: featured.isSelected ? '#000000' : '',
                              '&:hover': {
                                borderColor: 'primary.main',
                              },
                              color: featured.isSelected ? 'white' : 'primary.main',
                            }}
                          />
                        </Box>
                      ))}
                  </CardContent>
                </Card>
                {/*  */}
                <TextField
                  id="standard-multiline-flexible"
                  label="Descripción"
                  multiline
                  fullWidth
                  focused
                  color="secondary"
                  sx={{ mt: 2, width: '90%' }}
                  maxRows={5}
                  {...register('description')}
                  placeholder="Ingrese una descripción de su propiedad"
                />
              </CardContent>
            </Card>
            <Grid sx={{ ml: 1, width: '80%' }}>
              <StepperWrapperLinear stepsCount={stepsCount} activeStep={activeStep} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default StepperProperty_2_3;
