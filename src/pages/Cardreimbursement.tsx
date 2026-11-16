import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import { IoCalendarOutline } from 'react-icons/io5';
import { BiUser } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

interface CancelationPolicy {
  code: string;
  name: string;
  detail1: string | null;
  refoundUpToPercentage: number | null;
  refoundUpToDays: number | null;
  detail2: string | null;
  discountPercentage: number | null;
  withinDays: number | null;
  status: boolean | null;
  cancelationPolicyTypeId: number | null;
}

interface TravelCardProps {
  image: string;
  title: string | undefined;
  location: string;
  rating: number | undefined;
  reviews: number | undefined;
  checkIn: string | undefined;
  checkOut: string | undefined;
  travelers: string;
  paid: string;
  refund: string;
  cancelPolicy: CancelationPolicy | null | undefined;
  penality?: string | null | undefined;
}

const Cardreimbursement: React.FC<TravelCardProps> = ({
  image,
  title,
  location,
  rating,
  reviews,
  checkIn,
  checkOut,
  travelers,
  paid,
  refund,
  cancelPolicy,
  penality,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const brandColor = theme.palette.primary.main;
  const subtleBorderColor = alpha(brandColor, 0.25);
  const hoverBgColor = alpha(brandColor, 0.04);
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: { xs: 3, md: 6 },
          border: '1px solid rgba(0, 0, 0, 0.08)',
          p: { xs: 2, md: 3 },
          maxWidth: 400,
        }}
      >
        {/* Encabezado con imagen + info */}
        <Box display={'flex'} flexDirection={'row'} gap={2}>
          <Box flex={1.2} display={'flex'} justifyContent={'center'} alignItems={'center'} mb={2}>
            <img
              width={'100%'}
              height={'130px'}
              src={image}
              alt={title}
              style={{ margin: 2, borderRadius: 4, objectFit: 'cover' }}
            />
          </Box>
          <Box
            flex={1.5}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'flex-start'}
          >
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1F2937' }}>
              {title}
            </Typography>
            <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#6B7280' }}>
              {location}
            </Typography>

            <Box display="flex" alignItems="center" gap={0.5} mt={1} mb={0}>
              <StarIcon sx={{ fontSize: '20px', color: theme.palette.warning.main }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                {rating} ({reviews} reviews)
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Contenido */}
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {/* Detalles del viaje */}
          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', mb: 2 }}>
            {t('cardReimbursement.title')}
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            mb={2}
            borderRadius={3}
            border={'1px solid rgba(0, 0, 0, 0.08)'}
            bgcolor={'#f8fafc'}
            p={2}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0,
                pr: 3,
                borderRight: '1px solid rgba(100, 116, 139, 0.2)',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: hoverBgColor },
              }}
            >
              <Box display={'flex'} gap={1} alignItems={'center'}>
                <IoCalendarOutline size={16} color={'#64748b'} style={{ opacity: 0.7 }} />
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('cardReimbursement.departure')}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  {checkIn}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0,
                pr: 1,
                borderRight: '1px solid rgba(100, 116, 139, 0.2)',
              }}
            >
              <Box display={'flex'} gap={1} alignItems={'center'}>
                <IoCalendarOutline size={16} color={'#64748b'} style={{ opacity: 0.7 }} />
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('cardReimbursement.arrival')}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  {checkOut}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0,
                pl: 0,
              }}
            >
              <Box display={'flex'} gap={1} alignItems={'center'}>
                <BiUser size={16} color={'#64748b'} style={{ opacity: 0.7 }} />
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('cardReimbursement.guests')}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                  {travelers}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 2, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

          {/* penalidad */}
          {penality !== null && penality !== undefined ? (
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>
                {t('cardReimbursement.payment.penality')}
              </Typography>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                {`${penality}`}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Pago y reembolso */}
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>
                  {t('cardReimbursement.payment.paid')}
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                  {paid}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>
                  {t('cardReimbursement.payment.refund')}
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                  {refund}
                </Typography>
              </Box>
            </>
          )}
          <Divider sx={{ mb: 2, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

          {/* Política de cancelación */}
          <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', mb: 1 }}>
            {t('cardReimbursement.cancellation.title')}
          </Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#64748b', mb: 1 }}>
            {cancelPolicy?.detail1 || t('cardReimbursement.cancellation.notAvailable')}
          </Typography>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleOpen();
            }}
            underline="always"
            sx={{
              display: 'inline-block',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': {
                color: '#1e293b',
              },
            }}
          >
            {t('cardReimbursement.cancellation.readMore')}
          </Link>
        </CardContent>
      </Card>

      {/* Modal de Políticas de Cancelación */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="cancelation-policy-title"
        slotProps={{
          paper: {
            sx: {
              borderRadius: { xs: 3, md: 6 },
              maxWidth: 520,
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
            },
          },
        }}
      >
        <DialogTitle
          id="cancelation-policy-title"
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}
        >
          <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>
            {t('cardReimbursement.cancellation.modalTitle')}
          </Typography>
          <IconButton aria-label="close" onClick={handleClose} sx={{ color: '#64748b' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ mx: 2, borderColor: 'rgba(0, 0, 0, 0.08)' }} />
        <DialogContent sx={{ pt: 3 }}>
          {cancelPolicy?.detail1 && (
            <DialogContentText sx={{ mb: 2, fontSize: '14px', color: '#334155' }}>
              {cancelPolicy.detail1}
            </DialogContentText>
          )}
          {cancelPolicy?.refoundUpToDays !== null &&
            cancelPolicy?.refoundUpToDays !== undefined && (
              <DialogContentText sx={{ mb: 2, fontSize: '14px', color: '#334155' }}>
                {/* Reembolso del {cancelPolicy.refoundUpToPercentage}% hasta{' '}
                {cancelPolicy.refoundUpToDays} días antes de la fecha de llegada. */}
                {t('cardReimbursement.cancellation.refundInfo', {
                  percentage: cancelPolicy.refoundUpToPercentage,
                  days: cancelPolicy.refoundUpToDays,
                })}
              </DialogContentText>
            )}
          {cancelPolicy?.detail2 && (
            <DialogContentText sx={{ mb: 2, fontSize: '14px', color: '#334155' }}>
              {cancelPolicy.detail2}
            </DialogContentText>
          )}
          {/* {cancelPolicy?.discountPercentage && cancelPolicy.discountPercentage > 0 && ( */}
          {(cancelPolicy?.discountPercentage || 0) > 0 && (
            <DialogContentText sx={{ fontSize: '14px', color: '#334155' }}>
              {/* Descuento del {cancelPolicy.discountPercentage}% aplicable dentro de{' '}
              {cancelPolicy.withinDays} días. */}
              {t('cardReimbursement.cancellation.discountInfo', {
                percentage: cancelPolicy?.discountPercentage || 0,
                days: cancelPolicy?.withinDays || 0,
              })}
            </DialogContentText>
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default Cardreimbursement;
