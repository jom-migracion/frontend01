import React, { useState } from 'react';
import {
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // IconButton,
  Typography,
  Box,
  Divider,
  Avatar,
  // useTheme,
} from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import TransferStatusCard, { TransferData } from './TransferStatusCard';
import { useTranslation } from 'react-i18next';
import CustomDialog from '@/components/CustomDialog';

interface Book {
  bookId: number;
  startDate: string;
  endDate: string;
  checkin?: string;
  checkout?: string;
  nights?: number;
  bookStatusId: number;
  listingRentId: number;
  amountTotal: number;
  listingRent?: {
    name?: string;
    property?: {
      address?: {
        city?: {
          city?: string;
          country?: string;
        };
      };
    };
  };
  bookStatus?: {
    bookStatusId: number;
    name?: string;
    description?: string;
    code?: string;
  } | null;
  photos?: { photoLink: string }[];
  payoutTransactionId?: number;
  currency?: string;
  paymentMethod?: string;
  paymentMethodDescription?: string;
  processed?: string;
  processed_STR?: string;
  scheduled?: string;
  status?: string;
  payoutStatus?: string;
  paymentDetails?: {
    amount?: number;
    currency?: string;
    processed?: string;
    account?: string | null;
  };
  host?: {
    userId: number;
    name: string;
    lastName: string;
  };
  guest?: {
    userId: number;
    name: string;
    lastName: string;
    photoLink?: string;
  };
}

interface ModalPaymentCompletedProps {
  open: boolean;
  onClose: () => void;
  bookData?: Book[] | null;
}

const PaymentCompletedModal: React.FC<ModalPaymentCompletedProps> = ({
  open,
  onClose,
  bookData,
}) => {
  const { t } = useTranslation();
  // const theme = useTheme();
  // Estado para controlar el TransferStatusCard
  const [isTransferStatusOpen, setIsTransferStatusOpen] = useState(false);
  const [selectedTransferData, setSelectedTransferData] = useState<TransferData | undefined>(
    undefined
  );

  // No mostrar el modal si no hay datos o el array está vacío
  if (!bookData || bookData.length === 0) {
    return null;
  }

  // Función para formatear fechas
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  // Funciones para manejar el TransferStatusCard
  const handleOpenTransferStatus = (data: TransferData) => {
    setSelectedTransferData(data);
    setIsTransferStatusOpen(true);
  };

  const handleCloseTransferStatus = () => {
    setIsTransferStatusOpen(false);
    setSelectedTransferData(undefined);
  };

  // Calcular el total acumulado de todos los pagos
  const totalAmountValue = bookData.reduce((sum, book) => sum + book.amountTotal, 0);
  const totalAmount = `${totalAmountValue.toLocaleString('es-BO', { minimumFractionDigits: 2 })} BOB`;

  // Usar el primer pago para información general
  const firstBook = bookData[0];
  const depositDate = formatDate(firstBook.startDate);

  return (
    <>
      <CustomDialog isOpen={open} onClose={onClose} maxWidth="xs" title="">
        {/* Sección de Monto Total y Fecha de Depósito */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'semibold', mb: 0.5 }}>
            {totalAmount}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {bookData.length} {bookData.length === 1 ? 'Pago' : 'Pagos'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'error.main', // Punto rojo
                mr: 0.5,
              }}
            />
            <Typography variant="body2" color="text.primary">
              {t('paymentCompletedModal.depositInfo')} {depositDate}.
              <Typography
                component="span"
                onClick={() =>
                  handleOpenTransferStatus({
                    amount: `${firstBook.amountTotal.toLocaleString('es-BO', { minimumFractionDigits: 2 })} ${firstBook.currency || 'BOB'}`,
                    sentDate: firstBook.processed || firstBook.startDate,
                    arrivalDate: firstBook.scheduled || firstBook.endDate,
                  })
                }
                sx={{
                  textDecoration: 'underline',
                  fontWeight: 'semibold',
                  ml: 0.5,
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {t('paymentCompletedModal.detailLink')}
              </Typography>
            </Typography>
          </Box>
        </Box>

        {/* Sección de Cuenta Bancaria */}
        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            p: 2,
            mb: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('paymentCompletedModal.bankAccountTitle')}
          </Typography>
          <Typography variant="body2">
            {firstBook.bookStatus?.description || firstBook.paymentDetails?.account || 'N/A'}
          </Typography>
          {/* <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {t('paymentCompletedModal.paymentIdTitle')}
          </Typography>
          <Typography variant="body2">
            {firstBook.payoutTransactionId
              ? `TXN-${firstBook.payoutTransactionId}`
              : 'G-WZJAPPLTE6BE'}
          </Typography> */}
        </Box>

        {/* Lista de todas las reservas */}
        {bookData.map((book, index) => {
          const bookDepositDate = formatDate(book.startDate);
          const propertyName = book.listingRent?.name || '';
          const cityName = book.listingRent?.property?.address?.city?.city || '';
          const countryName = book.listingRent?.property?.address?.city?.country || '';
          const statusName =
            book.payoutStatus ||
            book.status ||
            book.bookStatus?.name ||
            t('paymentCompletedModal.unknownStatus');
          const bookAmount = `${book.amountTotal.toLocaleString('es-BO', { minimumFractionDigits: 2 })} ${book.currency || 'BOB'}`;
          const guestPhotoLink = book.guest?.photoLink || book.photos?.[0]?.photoLink || '';

          // Formatear check-in y check-out
          const checkinDate = book.checkin ? formatDate(book.checkin) : '';
          const checkoutDate = book.checkout ? formatDate(book.checkout) : '';
          const nightsInfo = book.nights
            ? `${book.nights} ${book.nights === 1 ? 'noche' : 'noches'}`
            : '';

          return (
            <Box
              key={`${book.bookId}-${book.payoutTransactionId || index}`}
              onClick={() =>
                handleOpenTransferStatus({
                  amount: bookAmount,
                  sentDate: book.processed || book.startDate,
                  arrivalDate: book.scheduled || book.endDate,
                })
              }
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                p: 2,
                mb: 2,
                cursor: 'pointer',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 1 }}></Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Avatar src={guestPhotoLink} sx={{ mb: 1 }}>
                      {!guestPhotoLink && book.guest?.name?.[0]}
                    </Avatar>
                    {/* <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', fontWeight: 'bold' }}
                    >
                      REF-{book.bookId}
                    </Typography> */}
                  </Box>
                  {/* <Typography variant="subtitle2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                    {t('paymentCompletedModal.reservationTitle')}
                    {book.bookId}
                  </Typography> */}
                  {book.host && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Host: {book.host.name} {book.host.lastName}
                    </Typography>
                  )}
                  {book.guest && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Guest: {book.guest.name} {book.guest.lastName}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {t('paymentCompletedModal.accommodationLabel')} {bookDepositDate}
                  </Typography>
                  {nightsInfo && checkinDate && checkoutDate && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {nightsInfo} - Check-in: {checkinDate} / Check-out: {checkoutDate}
                    </Typography>
                  )}
                  {propertyName && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {propertyName}
                    </Typography>
                  )}
                  {(cityName || countryName) && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {cityName}
                      {cityName && countryName && ', '}
                      {countryName} - {t('paymentCompletedModal.statusLabel')} {statusName}
                    </Typography>
                  )}
                  {book.paymentMethodDescription && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      {t('paymentCompletedModal.paymentMethod', {
                        defaultValue: 'Método de pago999',
                      })}
                      : {book.paymentMethodDescription}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* Desglose de costos */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color={'text.secondary'}>
                  {t('paymentCompletedModal.cancellationMessage')}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Total del pago individual */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {t('paymentCompletedModal.totalLabel')}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {bookAmount}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </CustomDialog>

      <TransferStatusCard
        open={isTransferStatusOpen}
        onClose={handleCloseTransferStatus}
        data={selectedTransferData}
      />
    </>
  );
};

export default PaymentCompletedModal;
