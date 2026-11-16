import CustomButton from '@/components/CustomButton';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { vector } from '@/assets';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

const StepperProperty_0:React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 5 }} columns={16} sx={{ mt: 1, alignItems: 'center' }}> 
        <Grid size={{ md: 8, xs: 16 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'flex-start', 
              height: '100%', 
              padding: { xs: 3, sm: 5, md: '5vh 8%' } 
            }}
          >
            <Typography
              sx={{ 
                fontSize: { xs: '28px', sm: '38px', md: 'clamp(38px, 5vw, 48px)' }, 
                fontWeight: 700, 
                lineHeight: '1.1', 
                alignSelf: 'center',
                mb: 2
              }}
            >
              {t("admin.registerProperty.step0.title")}
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '16px', sm: '20px', md: 'clamp(20px, 2.5vw, 26px)' },
                fontWeight: 400,
                lineHeight: '1.2',
                alignSelf: 'center',
                mb: 4,
              }}
            >
              {t("admin.registerProperty.step0.subtitle")}
            </Typography>
            <Box sx={{ alignSelf: 'center', textAlign: 'center', mb: 1 }}> 
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '12px', sm: '14px', md: 'clamp(14px, 1.8vw, 16px)' },
                  fontWeight: 600,
                  lineHeight: '1.2',
                }}
              >
                {t("admin.registerProperty.step0.subtitle1")}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary', 
                  fontSize: { xs: '40px', sm: '55px', md: 'clamp(55px, 8vw, 70px)' },
                  fontWeight: 700,
                  lineHeight: '1',
                  mt: 0.5, 
                }}
              >
                {t("admin.registerProperty.step0.subtitle2")}
              </Typography>
            </Box>
     
            <CustomButton
              label={t("admin.registerProperty.step0.submitButton")}
              type="submit"
              color="primary" 
              hoverColor={theme.palette.customColors.secondary[4]}
              sx={{
                width: 'auto', 
                minWidth: { xs: '160px', sm: '200px' },
                borderRadius: '50px', 
                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                fontWeight: 600,
                mt: 3, 
                alignSelf: 'center', 
                px: { xs: 3, md: 4 }, 
                py: 1, 
                textTransform: 'none',
                '& .MuiButton-endIcon': { ml: 1 }
              }}
              endIcon={<img src={vector} alt="arrow" />}
            />
          </Box>
        </Grid>
        <Grid size={{ md: 8, xs: 16 }} > 
          <Card sx={{ height: '100%', width: '100%', boxSizing: 'border-box', boxShadow: 'none', position: 'relative', overflow: 'hidden', borderRadius: '15px' }}> 
            <CardContent sx={{ p: 0, height: '100%', position: 'relative' }}>
              <CardMedia 
                component="img" 
                alt="Map Banner"                
                image="/images/fake/banner.svg" 
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  maxHeight: '70vh', 
                  objectFit: 'cover', 
                  display: 'block' 
                }} 
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: '25%', 
                  left: '35%', 
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.85)', 
                  color: 'white', 
                  padding: '4px 10px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                {t("admin.registerProperty.step0.iconMapImage")}
              </Box>
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: '40%', 
                  left: '70%', 
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.85)', 
                  color: 'white', 
                  padding: '4px 10px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap'
                }}
              >
                {t("admin.registerProperty.step0.iconMapImage1")}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default StepperProperty_0;

