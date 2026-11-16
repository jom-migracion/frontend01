import { Box, Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import StepperWrapperLinear from './StepperWrapperLinear';
import StepperWrapperProps from '@/models/interfaces/StepperWrapperProps';
import PropertyCardStep from './PropertyCardStep';
import { imgIcon } from '@/assets';
import CustomButton from '@/components/CustomButton';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTheme } from '@mui/material/styles';

const StepperProperty_2_2: React.FC<StepperWrapperProps> = ({
  stepsCount,
  activeStep,
  step,
  onSubmit,
  prefillData,
}) => {
  const showSnackbar = useSnackbar();
  const [files, setFiles] = useState<File[]>([]);
  const { handleSubmit } = useForm({ defaultValues: prefillData, mode: 'onChange' });
   const theme = useTheme();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = Array.from(e.target.files ?? []);
    const allowedTypes: string[] = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize: number = 10 * 1024 * 1024;

    for (let file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        showSnackbar(`El archivo "${file.name}" tiene un formato no permitido.`, 'warning')
        setFiles([]);
        return;
      }
      if (file.size > maxSize) {
        showSnackbar(`El archivo "${file.name}" excede los 10 MB.`, 'warning')
        setFiles([]);
        return;
      }
    }
    setFiles(selectedFiles);
  };

  const internalSubmit = (data: any) => {
    onSubmit && onSubmit(data);
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
              <Typography sx={{ mt: 1, ml: 4, mr: 20, fontWeight: 600, fontSize: '20px' }}>
                Agrega fotos
              </Typography>
              <Typography
                sx={{ ml: 4, mr: 5, fontWeight: 300, fontSize: '15px', color: '#000000' }}
              >
                Necesitas contar con cinco fotos para emprezar.
              </Typography>
              <CardContent sx={{ width: '580px' }}>
                <Box
                  sx={{
                    width: '100%',
                    minHeight: 300,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '5px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: '2px dashed #B6B6B6',
                    padding: 2,
                    ml: 2,
                  }}
                >
                  {files.length === 0 ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))',
                        gap: 1,
                        width: '80%',
                        ml: 30,
                        mb: 5,
                      }}
                    >
                      <img src={imgIcon} alt="imgUpload" width={50} />
                      <img src={imgIcon} alt="imgUpload" width={50} />
                      <img src={imgIcon} alt="imgUpload" width={50} />
                    </Box>
                  ) : (
                    <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
                      {files.map((file, i) => (
                        <Paper
                          key={i}
                          variant="outlined"
                          sx={{
                            p: 1,
                            fontSize: '0.875rem',
                            backgroundColor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          {file.type.startsWith('image/') ? (
                            <Box
                              component="img"
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              sx={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <Typography variant="body2">{file.name}</Typography>
                          )}
                        </Paper>
                      ))}
                    </Stack>
                  )}

                  <CustomButton
                    label="Agrega fotos"
                    type="button"
                    color="primary"
                     hoverColor={theme.palette.customColors.secondary[4]} 
                    onClick={() => {
                      const fileInput = document.getElementById('property-photo-input');
                      if (fileInput) (fileInput as HTMLInputElement).click();
                    }}
                    borderRadius={15}
                    fullWidth
                    sx={{
                      width: '120px',
                      borderRadius: '15px',
                      fontSize: '13px',
                      fontWeight: 600,
                      mt: 2,
                    }}
                  />
                  <input
                    id="property-photo-input"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </Box>
              </CardContent>
            </Card>
            <Grid sx={{ ml: 2, width: '80%' }}>
              <StepperWrapperLinear stepsCount={stepsCount} activeStep={activeStep} />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default StepperProperty_2_2;
