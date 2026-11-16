import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { CardMedia, CircularProgress, Tabs, Tab } from '@mui/material';
import { jomWhite } from '@/assets';
import theme from '@/themes/theme';
import { useTranslation } from 'react-i18next';

interface AdminListCardProps {
  listDataRent: any[];
  handleCardClick: (id: any, status?: 'publicado' | 'pendiente' | 'no_publicado') => void;
  isLoading?: boolean;
}

const AdminListCard: React.FC<AdminListCardProps> = ({
  listDataRent,
  handleCardClick,
  isLoading,
}) => {
  const [filterTab, setFilterTab] = useState<'publicado' | 'pendiente' | 'no_publicado'>(
    'publicado'
  );
  const { customColors } = theme.palette;
  const { t } = useTranslation();
  // const safeListings:any = listDataRent.filter((item: any) => item.listingStatusId === 3);

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography mt={2}>{t('adminGallery.messages.loadingProperties')}</Typography>
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
  const filteredData = listDataRent.filter((card: any) => {
    if (filterTab == 'publicado') {
      return card.statusCode == 'PUBLISH';
    } else if (filterTab == 'pendiente') {
      return card.statusCode == 'DRAFT' || card.statusCode == 'COMPLETED';
    } else {
      return (
        card.statusCode != 'PUBLISH' && card.statusCode != 'DRAFT' && card.statusCode != 'COMPLETED'
      );
    }
  });

  if (listDataRent.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography color="info">{t('adminGallery.messages.noProperties')}</Typography>
      </Box>
    );
  }

  //const safeListings = listings?.data ?? [];

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '95%', md: '85%', lg: '80%' },
        pl: { xs: 2, sm: 4, md: '6%', lg: '8%' },
        pr: { xs: 2, sm: 2 },
      }}
    >
      {/* Tabs para filtrar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'left' },
          width: { xs: '100%', sm: '70%', md: '50%', lg: '35%' },
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
          variant="fullWidth"
          sx={{
            minHeight: { xs: 40, sm: 48 },
            '& .MuiTab-root': {
              minHeight: { xs: 40, sm: 48 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              py: { xs: 1, sm: 1.5 },
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
            {t(`adminGallery.messages.emptyTab.${filterTab}`)}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: { xs: 1.5, sm: 2 } }}>
          {filteredData.map((card: any) => {
            const location = card.property?.address?.city?.city ?? 'Sin dirección';
            const country = card.property?.address?.city?.country ?? '';
            const address1 = card.property?.address.address1 ?? '';
            // const currency = card.price?.currencyCode ?? '';
            // const rating = typeof card.valoration === 'number' ? card.valoration : 4.4;
            const status =
              card?.statusCode == 'PUBLISH'
                ? 'Publicado'
                : card?.statusCode == 'DRAFT' || card?.statusCode == 'COMPLETED'
                  ? 'Pendiente'
                  : 'No publicado';
            const bgColor =
              status === 'Publicado' ? '#76C811' : status === 'Pendiente' ? '#FFA000' : '#FF0000';

            return (
              <Card key={card.listingRentId}>
                <CardActionArea
                  onClick={() =>
                    handleCardClick(
                      card.listingRentId,
                      status === 'Publicado'
                        ? 'publicado'
                        : status === 'Pendiente'
                          ? 'pendiente'
                          : 'no_publicado'
                    )
                  }
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ height: '100%', boxShadow: 3, p: { xs: 1, sm: 2 } }}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' },
                        gridTemplateRows: { xs: 'auto', sm: 'repeat(5, 1fr)' },
                        gap: { xs: 1, sm: '8px' },
                        height: { xs: 'auto', sm: '45px' },
                        marginBottom: { xs: '5px', sm: '10px' },
                      }}
                    >
                      <Box sx={{ gridColumn: { xs: '1', sm: 'span 3 / span 3' } }}>
                        <Card
                          sx={{
                            display: 'flex',
                            height: { xs: 'auto', sm: '55px' },
                            boxShadow: 'none',
                          }}
                        >
                          <Card
                            sx={{
                              width: { xs: '60px', sm: '72.71px' },
                              borderRadius: '6.16px',
                              flexShrink: 0,
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="auto"
                              image={
                                card.photos?.find((p: { isPrincipal: any }) => p.isPrincipal)
                                  ?.photoLink || jomWhite
                              }
                              alt="Imagen propiedad"
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                backgroundColor: customColors.primary[1],
                              }}
                            />
                          </Card>
                          <Box
                            sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}
                          >
                            <CardContent
                              sx={{
                                flex: '1 0 auto',
                                padding: { xs: '4px 0 0 8px', sm: '1px 0 0 10px' },
                              }}
                            >
                              <Typography
                                component="div"
                                sx={{
                                  fontSize: { xs: '11px', sm: '12px' },
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {card?.name ?? 'Sin título'}
                              </Typography>
                              <Typography
                                component="div"
                                sx={{
                                  fontSize: { xs: '11px', sm: '12px' },
                                  fontWeight: 600,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {address1}
                              </Typography>
                            </CardContent>
                          </Box>
                        </Card>
                      </Box>
                      <Box
                        sx={{
                          gridColumnStart: { xs: 1, sm: 4 },
                          alignContent: 'center',
                          mt: { xs: 1, sm: 0 },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Box
                            sx={{ ml: 0.5, fontWeight: 300, fontSize: { xs: '11px', sm: '14px' } }}
                          >
                            {location}, {country || 'Bolivia'}
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          gridColumnStart: { xs: 1, sm: 5 },
                          alignContent: 'center',
                          mt: { xs: 1, sm: 0 },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: { xs: '8px', sm: '9.3px' },
                            fontWeight: 600,
                            width: { xs: '55px', sm: '61.95px' },
                            borderRadius: '11.29px',
                            padding: { xs: '2px 4px', sm: '3.32px 5.98px' },
                            backgroundColor: bgColor,
                            color: 'white',
                            display: 'inline-block',
                            textAlign: 'center',
                          }}
                        >
                          {status}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default AdminListCard;
