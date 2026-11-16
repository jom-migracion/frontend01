//import theme from '@/themes/theme';
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Stack,
  IconButton,
  useTheme,
} from '@mui/material';
import { Listing } from '@/models/interfaces/Listing';
import { 
  ArrowBackIos,
  // Image as ImageIcon,
  Wifi,
  Rule,
  Cancel,
  AccessTime,
  Visibility
} from '@mui/icons-material';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import TitleIcon from '@mui/icons-material/Title';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface LeftPanelProps {
  seleccionado: number;
  onSelect: (index: number) => void;
  detailProperty: Listing;
  handleChangeSelectedCardId: (_: any, newValue: number) => void;
}

interface cardLeftPanelProps {
  onSelectCard: (index: number) => void;
  item: number;
  title: string;
  subtitle: string;
  lineClamp?: number;
  icon: React.ReactNode;
  isSelected?: boolean;
}

const CardLeftPanel: React.FC<cardLeftPanelProps> = ({ onSelectCard, item, title, subtitle, lineClamp=0, icon, isSelected = false }) => {

  const { typography } = useTheme();

  return (
    <Box
      onClick={() => onSelectCard(item)}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        py: 2,
        pl: '10px',        
        borderBottom: '1px solid #e0e0e0',
        cursor: 'pointer',
        textAlign: 'left',
        backgroundColor: isSelected ? '#e5e7eb' : 'transparent',
        borderLeft: isSelected ? '3px solid #5B55C8' : '3px solid transparent',
        '&:hover': {
          backgroundColor: isSelected ? '#e5e7eb' : '#f9f9f9',
        },
      }}
    >
      <Box sx={{ 
        color: '#757575', 
        display: 'flex', 
        alignItems: 'center',
        minWidth: '24px',
        mt: 0.5
      }}>
        {icon}
      </Box>
      
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ 
          fontFamily: typography.paragraph1Medium, 
          fontSize: '14px',
          mt: 0.3,
          mb: 0.5, 
          color: '#000',
          fontWeight: 600
        }}>
          {title}
        </Typography>
        <Typography sx={{ 
          fontFamily: typography.paragraph1Regular,
          fontSize: '13px',
          display: lineClamp > 0 ? '-webkit-box' : 'block',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          WebkitLineClamp: lineClamp > 0 ? lineClamp : 'unset',
          textOverflow: 'ellipsis', 
          color: '#757575'
        }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}

export const LeftPanel = ({ seleccionado, onSelect, detailProperty, handleChangeSelectedCardId }: LeftPanelProps) => {


  // hooks
  const { typography } = useTheme();
  const { t } = useTranslation();

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#fff',
      borderRadius: 2,
    }}>
      {/* Título fijo */}
      <Box sx={{ display: 'flex', alignItems: 'center',  p: 0.5, borderBottom: '1px solid #e0e0e0' }}>
        <IconButton
          edge="end"
          sx={{ ml: 0.5, color: 'black' }}
          onClick={() => handleChangeSelectedCardId(null, 1)}
        >
          <ArrowBackIos />
        </IconButton>
        <Typography sx={{  fontSize: '16px', fontWeight: 600, ml: 2 }}>
          {t('listingEditor.title')}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {/* Item 0: Recorrido fotográfico */}
        <Box
          onClick={() => onSelect(0)}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            py: 2,
            width: '100%',
            borderBottom: '1px solid #e0e0e0',
            cursor: 'pointer',
            backgroundColor: seleccionado === 0 ? '#e5e7eb' : 'transparent',
            borderLeft: seleccionado === 0 ? '3px solid #5B55C8' : '3px solid transparent',
            '&:hover': {
              backgroundColor: seleccionado === 0 ? '#e5e7eb' : '#f9f9f9',
            },
          }}
        >
          <Box sx={{ 
            color: '#757575', 
            display: 'flex', 
            alignItems: 'center',
            minWidth: '24px',
            mt: 0.5,
            pl: '10px',
            pr: '6px'
          }}>
            <CollectionsOutlinedIcon />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ 
              fontFamily: typography.paragraph1Medium,
              fontSize: '14px',
              mt: 0.1,
              color: '#000',
              fontWeight: 600
            }}>
              {t('listingEditor.sections.photos.title')}
            </Typography>
            <Typography sx={{ 
              fontFamily: typography.paragraph1Regular, 
              fontSize: '13px',
              color: '#757575',
              mb: 1
            }}>
              {detailProperty?.bedrooms} {t('listingEditor.sections.photos.detailsBedroom')}(s) {detailProperty?.beds} {t('listingEditor.sections.photos.detailsBed')}(s) {detailProperty?.privateBathroom  + detailProperty?.privateBathroomLodging + detailProperty?.sharedBathroom} {t('listingEditor.sections.photos.detailsBathroom')}(s)
            </Typography>
            <Stack direction="row" spacing={1}>
              {detailProperty?.photos.slice(0, 2).map((src, i) => (
                <Card key={i} sx={{ flex: 1, borderRadius: 1, boxShadow: 'none', overflow: 'hidden', maxWidth: '80px' }}>
                  <CardMedia
                    component="img"
                    height="60"
                    image={src.photoLink}
                    alt={`img${i}`}
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>
              ))}
            </Stack>
            <Typography variant="body2" sx={{ fontSize: '12px', color: '#757575', mt: 0.5 }}>
              {detailProperty?.photos.length} {t('listingEditor.sections.photos.count')}
            </Typography>
          </Box>
        </Box>

        {/* Item 1: Titulo descriptivo */}
        <CardLeftPanel
          onSelectCard={onSelect}
          item={1}
          title={t('listingEditor.sections.description')}
          subtitle={detailProperty?.name}
          icon={<TitleIcon />}
          isSelected={seleccionado === 1}
        />
        
        {/* Item 2: Tipo de alojamiento */}
        <CardLeftPanel
          onSelectCard={onSelect}
          item={2}
          title={t('listingEditor.sections.propertyType.title')}
          subtitle={t('listingEditor.sections.propertyType.subtitle')}
          icon={<HomeOutlinedIcon />}
          isSelected={seleccionado === 2}
        />
        
        {/* Item 3: Precios */}
        <CardLeftPanel
          onSelectCard={onSelect}
          item={3}
          title={t('listingEditor.sections.prices.title')}
          subtitle={t('listingEditor.sections.prices.subtitle', {
            nightPrice: detailProperty?.price?.priceNightly,
            weekendPrice: detailProperty?.price?.tlListingDiscountForRates?.[0]?.discountCalculated ?? 0
          })}
          icon={<LocalOfferOutlinedIcon />}
          isSelected={seleccionado === 3}
        />

        {/* Item 4: servicios */}
        <Box
          onClick={() => onSelect(4)}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            py: 2,
            borderBottom: '1px solid #e0e0e0',
            cursor: 'pointer',
            backgroundColor: seleccionado === 4 ? '#e5e7eb' : 'transparent',
            borderLeft: seleccionado === 4 ? '3px solid #5B55C8' : '3px solid transparent',
            '&:hover': {
              backgroundColor: seleccionado === 4 ? '#e5e7eb' : '#f9f9f9',
            },
          }}
        >
          <Box sx={{ 
            color: '#757575', 
            display: 'flex', 
            alignItems: 'center',
            minWidth: '24px',
            mt: 0.5,
            pl: '10px',
          }}>
            <Wifi />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ 
              fontFamily: typography.paragraph1Medium,
              fontSize: '14px',
              mb: 0.5,
              color: '#000',
              fontWeight: 600
            }}>
              {t('listingEditor.sections.services.title')}
            </Typography>
            <Typography sx={{ 
              fontFamily: typography.paragraph1Regular,
              fontSize: '13px',
              color: '#757575'
            }}>
              {[
                t('listingEditor.sections.services.types.basic'), 
                t('listingEditor.sections.services.types.highlighted'), 
                t('listingEditor.sections.services.types.security')
              ].join(', ')}
            </Typography>
          </Box>
        </Box>

        {/* Item 5: Cantidad de huespedes*/}
        <CardLeftPanel
          onSelectCard={onSelect}
          item={5}
          title={t('listingEditor.sections.guests.title')}
          subtitle={t('listingEditor.sections.guests.subtitle', { count: detailProperty?.maxGuests ?? 0 })}
          icon={<PeopleAltOutlinedIcon />}
          isSelected={seleccionado === 5}
        />

        {/* Item 6: Ubicación de la propiedad */}
        <CardLeftPanel
          onSelectCard={onSelect}
          item={6}
          title={t('listingEditor.sections.location')}
          subtitle={detailProperty?.description}
          lineClamp={2}
          icon={<FmdGoodOutlinedIcon />}
          isSelected={seleccionado === 6}
        />

        {/* Item 8: tipo reservacion */}
        <CardLeftPanel
          onSelectCard={onSelect}
          item={8}
          title={t('listingEditor.sections.reservationType')}
          subtitle={detailProperty?.approvalPolicy?.description}
          icon={<EventAvailableOutlinedIcon />}
          isSelected={seleccionado === 8}
        />

        {/* Item 7: reglas de casa */}
        <Box
          onClick={() => onSelect(7)}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            py: 2,
            borderBottom: '1px solid #e0e0e0',
            cursor: 'pointer',
            backgroundColor: seleccionado === 7 ? '#e5e7eb' : 'transparent',
            borderLeft: seleccionado === 7 ? '3px solid #5B55C8' : '3px solid transparent',
            '&:hover': {
              backgroundColor: seleccionado === 7 ? '#e5e7eb' : '#f9f9f9',
            },
          }}
        >
          <Box sx={{ 
            color: '#757575', 
            display: 'flex', 
            alignItems: 'center',
            minWidth: '24px',
            mt: 0.5,
            pl: '10px'          
          }}>
            <Rule />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ 
              fontFamily: typography.paragraph1Medium,
              fontSize: '14px',
              mb: 0.5,
              color: '#000',
              fontWeight: 600
            }}>
              {t('listingEditor.sections.houseRules')}
            </Typography>
            <Typography sx={{ 
              fontFamily: typography.paragraph1Regular,
              fontSize: '13px',
              color: '#757575'
            }}>
              {detailProperty?.rentRules?.length} {t('listingEditor.sections.houseRules')} activas
            </Typography>
          </Box>
        </Box>

        {/* Item 9: politica de cancelacion */}
        <CardLeftPanel
          onSelectCard={onSelect}
          item={9}
          title={t('listingEditor.sections.cancellationPolicy')}
          subtitle={detailProperty?.cancelationPolicy?.name}
          icon={<Cancel />}
          isSelected={seleccionado === 9}
        />
        
        {/* Item 10: checkIN OUT */}
        <CardLeftPanel
          onSelectCard={onSelect}
          item={10}
          title={t('listingEditor.sections.checkIn.title')}
          subtitle={t('listingEditor.sections.checkIn.subtitle')}
          icon={<AccessTime />}
          isSelected={seleccionado === 10}
        />
        
        {/* Item 11: Estado del anuncio */}
        <CardLeftPanel
          onSelectCard={onSelect}
          item={11}
          title={t('listingEditor.sections.status.title')}
          subtitle={t('listingEditor.sections.status.subtitle')}
          icon={<Visibility />}
          isSelected={seleccionado === 11}
        />
      </Box>
    </Box>
  );
};

export default LeftPanel;
