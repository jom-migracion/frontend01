import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAuthContext } from '@/modules/_auth/context';
import AirbnbCard from '@/components/AirbnbCard';
import AirbnbCardSkeleton from '@/components/AirbnbCardSkeleton';
import { jomWhite } from '@/assets';
import { useTranslation } from 'react-i18next';
import useTheme from '@mui/material/styles/useTheme';
import { Helmet } from 'react-helmet-async';
interface AdminGaleryCardProps {
  listDataRent: any[];
  onCardSelect: (id: number, statusCode?: string) => void;
  isLoading?: boolean;
}

const AdminGaleryCard: React.FC<AdminGaleryCardProps> = ({
  listDataRent,
  onCardSelect,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filterTab, setFilterTab] = useState<'publicado' | 'pendiente' | 'no_publicado'>(
    'publicado'
  );

  // Validar autenticación fuera del render
  const { isHostAuthenticated } = useAuthContext();
   const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Redirigir si no está autenticado
  React.useEffect(() => {
    if (!isHostAuthenticated) {
      navigate('/login');
    }
  }, [isHostAuthenticated, navigate]);

  // Loading
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
            xl: 'repeat(5, minmax(0, 1fr))',
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
          width: '100%',
          maxWidth: { xs: '100%', sm: 1100, md: 1400 },
          mx: 'auto',
          px: { xs: 1, sm: 2, md: 4 },
          py: { xs: 1, sm: 2, md: 3 },
          boxSizing: 'border-box',
          gridAutoRows: '1fr',
          '& > *': {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          },
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <AirbnbCardSkeleton key={i} />
        ))}
      </Box>
    );
  }

  // Contadores por estado
  const publishedCount = listDataRent.filter((card: any) => card.statusCode === 'PUBLISH').length;
  const pendingCount = listDataRent.filter((card: any) => card.statusCode === 'DRAFT' || card.statusCode === 'COMPLETED').length;
  const unpublishedCount = listDataRent.filter(
    (card: any) => card.statusCode !== 'PUBLISH' && card.statusCode !== 'DRAFT' && card.statusCode !== 'COMPLETED'
  ).length;

  // Filtrar datos según el tab seleccionado
  const filteredData = listDataRent.filter((listing: any) => {
    if (filterTab === 'publicado') {
      return listing.statusCode == 'PUBLISH';
    } else if (filterTab === 'pendiente') {
      return listing.statusCode == 'DRAFT' || listing.statusCode == 'COMPLETED';
    } else {
      return (
        listing.statusCode != 'PUBLISH' &&
        listing.statusCode != 'DRAFT' &&
        listing.statusCode != 'COMPLETED'
      );
    }
  });

  // Error
  if (listDataRent.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography color="error">{t('adminGallery.messages.noProperties')}</Typography>
      </Box>
    );
  }

  // Renderizar cards con valores por defecto si falta información
  return (
    <Box sx={{ width: '100%', px: { xs: 2, sm: 2, md: 4 } }}>
      <Helmet>
        <title>Anuncios</title>
        <meta name="anuncios" content="Página administración de los anuncios" />
      </Helmet>        
      {/* Tabs para filtrar */}
      <Box
        sx={{
          mb: 3,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={filterTab}
          onChange={(_, newValue) => setFilterTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: { xs: 40, sm: 48 },
            '& .MuiTab-root': {
              minHeight: { xs: 40, sm: 48 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              py: { xs: 1, sm: 1.5 },
              px: { xs: 2, sm: 3 },
            },
          }}
        >
          <Tab
            label={t('adminGallery.tabs.published') + ` ${publishedCount > 0 ? `(${publishedCount})` : ''}`}
            value="publicado"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            label={t('adminGallery.tabs.pending') + ` ${pendingCount > 0 ? `(${pendingCount})` : ''}`}
            value="pendiente"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            label={t('adminGallery.tabs.unpublished') + ` ${unpublishedCount > 0 ? `(${unpublishedCount})` : ''}`}
            value="no_publicado"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>
      </Box>

      {filteredData.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 5, px: 2 }}>
          <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {/* No hay propiedades {filterTab === 'publicado' ? 'publicadas' : filterTab === 'pendiente' ? 'pendientes' : 'no publicadas'}. */}
            {/* Traducción dinámica usando el estado filterTab */}
            {t(`adminGallery.messages.emptyTab.${filterTab}`)}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(5, 1fr)',
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
            py: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {filteredData.map((listing: any) => {
            const orderImages = listing?.photos?.sort((a:any, b:any) => a.position - b.position).map((item:any) => ({
                isPrincipal: item?.isPrincipal,
                link: item?.photoLinkVersions?.length > 0 ? (!isMobile ? item?.photoLinkVersions?.[0] : item?.photoLinkVersions?.[3]) : item?.photoLink,
                photoId: item?.listingPhotoId,
              }));
            const images =
              orderImages && orderImages.length > 0
                ? orderImages.map((photo: any) => photo.link)
                : [jomWhite];

            // Lógica para determinar la clave de traducción del estado
            // let statusKey = 'no publicado';
            // if (listing?.statusCode == 'PUBLISH') {
            //   statusKey = 'publicado';
            // } else if (listing?.statusCode == 'DRAFT' || listing?.statusCode == 'COMPLETED') {
            //   statusKey = 'pendiente';
            // }

            return (
              <AirbnbCard
                key={listing?.listingRentId}
                //images={Images[idx % Images.length]}
                images={images}
                status={
                  listing?.statusCode == 'PUBLISH'
                    ? 'publicado'
                    : listing?.statusCode == 'DRAFT' || listing?.statusCode == 'COMPLETED'
                      ? 'pendiente'
                      : 'no publicado'
                }
                //status={t(`adminGallery.status.${statusKey}`) as any}
                onShowDetail={() => onCardSelect(listing?.listingRentId, listing?.statusCode)}
                bathrooms={listing?.bathrooms ?? 0}
                bedrooms={listing?.bedrooms ?? 0}
                beds={listing?.beds ?? 0}
                listingRentId={listing?.listingRentId}
                location={
                  listing?.property?.cityName ?? listing?.property?.address?.city?.city ?? t('adminGallery.card.noLocation')
                }
                country={
                  listing?.property?.countryName ?? listing?.property?.address?.city?.country ?? ''
                }
                title={listing?.name ?? t('adminGallery.card.noTitle')}
                price={
                  listing?.price?.priceNightly?? 0
                }
                rating={Math.floor((listing?.valoration ?? 0) * 10) / 10}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default AdminGaleryCard;
