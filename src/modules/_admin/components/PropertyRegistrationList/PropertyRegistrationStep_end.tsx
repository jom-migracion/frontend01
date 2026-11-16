import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import AssertModal from '@/components/AssertModal';
import DetailProperty from '@/pages/DetailProperty';
import CustomCard from '@/components/CustomCard';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { MdOutlineEditNote , MdOutlineVerifiedUser, MdOutlineVisibility } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { IoCalendarOutline } from 'react-icons/io5';

export const PropertyRegistrationStep_end:React.FC<{listingRentId?: string}> = ({listingRentId}) => {
  // store
  const { listingPhotos: images, priceNightly, address } = usePropertyRegistration((state) => state.data.listingData);
  const customImages = images.sort((a, b) => a.position - b.position).map((item) => ({
        isPrincipal: item.isPrincipal,
        link: item.photoLink,
        photoId: item.listingPhotoId,
      }));
  // useState
  const [openModalAssert, setOpenModalAssert] = useState(false);
  const [procedure, setProcedure] = useState<number | null>(null);

  // hooks
  const { typography, breakpoints } = useTheme();
  const { t } = useTranslation('translation', { keyPrefix: 'admin.registerProperty.stePublish' });

  // match será true si la pantalla es menor a 600px (sm)
  const isMobile = useMediaQuery(breakpoints.down('sm'));

  return (
    <>
    <Box p={0} pl={{ xs: 0, sm: 2 }} pr={{ xs: 0, sm: 0 }}>
      {/* Título */}
      <Typography sx={{ fontFamily: typography.paragraph1SRegular, color: '#6b7280', mb: 2, mt:isMobile ? '-40px' : '0', fontSize: '0.75rem' }}>
        Revisión &nbsp; &gt; &nbsp; Publicación
      </Typography>
      <Typography sx={{ fontSize: '1.5rem', mb: 1, fontWeight: 600, mt: '25px' }}>
        {t('title')}
      </Typography>
      <Typography sx={{ color: '#6b7280', mb: 4, fontSize: '0.875rem' }}>
        {t('subtitle')}
      </Typography>

      <Grid container spacing={3} columns={16}>
        {/* Lado Izquierdo */}
        <Grid size={{xs: 16, md: 5}}  sx={{ height: 'auto', maxWidth: { xs: '100%', md: '320px' } }}>
          <Box position="relative">
            <CustomCard
              key={listingRentId}
              images={ customImages.length > 0 ? customImages.map(item => item.link):[]}
              location={`${address?.city?.city?? ''}`}
              country={`${address?.city?.country??''}`}
              price={`${priceNightly??0}`}
              labelNew={{see: true, label:t('labeNew')}}
              refDetail={listingRentId ? (listingRentId) : '0'}
              goDetailOnclick={false}
            />

            <Box mt={4}>
              <Button
                variant='outlined'
                fullWidth
                startIcon={<MdOutlineVisibility size={20} />}
                sx={{ 
                  borderRadius: 4, 
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: 'black',
                  borderColor: '#e5e7eb',
                  textTransform: 'none',
                  py: 1.5,
                }}
                onClick={() => setOpenModalAssert(true)}
              >
                {t('buttonPreview')}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Lado Derecho */}
        <Grid size={{xs: 16, md: 8}} sx={{ ml: { xs: 0, md: 5 } }}>
          <Card
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 5,
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: '16px', mb: 3 }}>
              {t('title2')}
            </Typography>

            <Stack spacing={2.5}>
              {/* Item 1 - Configuración del calendario */}
              <Box
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  p: 1.5,
                  borderRadius: 2,
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  },
                  backgroundColor: procedure == 1 ? 'rgba(0, 0, 0, 0.04)': 'transparent'
                }}
                onClick={() => setProcedure(1)}
              >
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Box 
                    sx={{ 
                      backgroundColor: '#EDE7F6', 
                      borderRadius: 2, 
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '56px',
                      minHeight: '56px'
                    }}
                  >
                    <IoCalendarOutline size={28} color="#673AB7" />
                  </Box>
                  <Box flex={1}>
                    <Typography sx={{ fontWeight: 600, mb: 0.5, fontSize: '16px' }}>
                       {t('card1Title')}
                    </Typography>
                    <Typography sx={{  color: '#6b7280', lineHeight: 1.6, fontSize: '14px' }}>
                      {t('card1Description')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Item 2 - Ediciones posteriores */}
              <Box
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  p: 1.5,
                  borderRadius: 2,
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  },
                  backgroundColor: procedure == 2 ? 'rgba(0, 0, 0, 0.04)': 'transparent'
                }}
                onClick={() => setProcedure(2)}
              >
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Box 
                    sx={{ 
                      backgroundColor: '#E3F2FD', 
                      borderRadius: 2, 
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '56px',
                      minHeight: '56px'
                    }}
                  >
                    <MdOutlineEditNote size={28} color="#2196F3" />
                  </Box>
                  <Box flex={1}>
                    <Typography sx={{ fontWeight: 600, mb: 0.5, fontSize: '16px' }}>
                      {t('card2Title')}
                    </Typography>
                    <Typography sx={{ color: '#6b7280', lineHeight: 1.6, fontSize: '14px' }}>
                      {t('card2Description')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Item 3 - Verificación de identidad */}
              <Box
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  p: 1.5,
                  borderRadius: 2,
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  },
                  backgroundColor: procedure == 3 ? 'rgba(0, 0, 0, 0.04)': 'transparent'
                }}
                onClick={() => setProcedure(3)}
              >
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Box 
                    sx={{ 
                      backgroundColor: '#E8F5E9', 
                      borderRadius: 2, 
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '56px',
                      minHeight: '56px'
                    }}
                  >
                    <MdOutlineVerifiedUser size={28} color="#4CAF50" />
                  </Box>
                  <Box flex={1}>
                    <Typography sx={{ fontWeight: 600, mb: 0.5, fontSize: '16px' }}>
                      {t('card3Title')}
                    </Typography>
                    <Typography sx={{ color: '#6b7280', lineHeight: 1.6, fontSize: '14px' }}>
                      {t('card3Description')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Card>

          {/* Texto final en cursiva */}
          <Card 
            variant="outlined"
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 5,
            }}
>
          <Box >
            <Typography 
              sx={{ 
                fontStyle: 'italic',
                lineHeight: 1.6,
                fontSize: '13px'
              }}
            >
              {t('footerText')}
            </Typography>
          </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
      <AssertModal
        content={
          <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <DetailProperty propListingRentId={listingRentId} previewListing={false} />
          </Box>
        }
        showCloseLeft
        maxWidthA='lg'
        open={openModalAssert}
        onClose={() => setOpenModalAssert(false)}
      />
      </>
  );
};
