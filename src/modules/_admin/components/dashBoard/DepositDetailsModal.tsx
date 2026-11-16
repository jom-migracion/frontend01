import CustomDialog from '@/components/CustomDialog';
import { ApiService } from '@/services/ApiService';
import { Avatar, Box, Divider, Typography } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState } from 'react';
import { useViewReservationStore } from '@/store/message.store';
import AddPaymentMethodContent from './AddPaymentMethodContent';
import { theme } from '@/themes/theme';

export interface PriceCalculation {
  additionalFees: number;
  amount: number;
  discounts: number;
  platformFee: number;
  paymentPlatformFee: number | null;
  payoutAmount: number | null;
  BreakdownInfo: BreakdownItem[];
  CleanFee: number | null;
  currencyCode: string;
  EndorsementDocumentType: string | null;
  EndorsementDocumentNumber: string | null;
  endorsementReason: string | null;
  forGuest: boolean | null;
  guestResume: GuestResume;
  hostResume: HostResume;
}

export interface BreakdownItem {
  type: string;
  description: string;
  amount: number;
  percentage: number | null;
  date: string | null;
}

export interface AccommodationResume {
  ratePerNight: number;
  nightsCount: number;
  baseAmount: number;
  weekend_RatePerNight: number;
  weekend_NightsCount: number;
  weekend_BaseAmount: number;
  totalBaseAmount: number;
  appliedDiscount: number;
  discountedAmount: number;
}

export interface AdditionalCharges {
  extraGuestFee: number;
  petFee: number;
  cleaningFee: number;
  otherFees: number;
}

export interface GuestResume {
  accommodation: AccommodationResume;
  additionalCharges: AdditionalCharges;
  subtotal: number;
  guestCommission: number;
  guestCommissionPercent: number;
  total: number;
  currencyCode: string;
}

export interface HostResume {
  accommodation: AccommodationResume;
  additionalCharges: AdditionalCharges;
  subtotal: number;
  hostCommission: number;
  hostCommissionPercent: number;
  amountToCollect: number;
  currencyCode: string;
  penaltyApplied: number;
  originalAmountToCollect: number;
}

export interface PersonInfo {
  name: string;
  lastname: string;
  photoLink: string;
  document: string | null;
  documentType: string | null;
  socialReason: string | null;
}

export interface ListingRent {
  name: string;
  Owner: PersonInfo;
}

export interface Book {
  bookId: string;
  timeDiff: number;
  bookingCode: string | null;
  checkin: string;
  checkout: string;
  AmountPerNight: number | null;
  startDate: string;
  endDate: string;
  nigths: number;
  status: string | null;
  bookStatusId: number;
  bookIdentifier: string | null;
  listingBedrooms: number | null;
  listingBeds: number | null;
  listingBathrooms: number | null;
  listingSofabeds: number | null;
  gests: number | null;
  adtCount: number | null;
  infCount: number | null;
  chdCount: number | null;
  Guest: PersonInfo;
  listingRent: ListingRent;
}

export interface PayoutAccount {
  numberAccount: string;
  formOfPayment: string;
  provider: string;
}

export interface PayoutDetailsData {
  payoutTransactionId: string;
  amount: number;
  currencyCode: string;
  originalAmount: number;
  timeDiff: number;
  poCode: string;
  penaltyApplied: number | null;
  PayoutDate: string | null;
  ScheduledPayoutDate: string;
  priceCalculation: PriceCalculation;
  book: Book;
  payoutStatus: string;
  transactionStatusId: number;
  payoutAccount: PayoutAccount;
}

interface DepositDetailsModalProps {
  open: boolean;
  onClose: () => void;
  bookData?: PayoutDetailsData | null;
}

const DepositDetailsModal: React.FC<DepositDetailsModalProps> = ({ open, onClose, bookData }) => {
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const setViewReservation = useViewReservationStore((state: any) => state.setViewReservation);

  const handleRefClick = async () => {
    if (!bookData?.book?.bookId) return;
    try {
      const response = await ApiService.get<any>('/Book/ReservationsListUser/ALL');
      if (response && !response.hasError && response.statusCode === '200') {
        const reservations: any[] = Array.isArray(response.data) ? response.data : [];
        const found = reservations.find((r) => String(r.bookId) === String(bookData.book.bookId));
        if (found) {
          setViewReservation(found);
          onClose();
        }
      }
    } catch {
      // silently ignore
    }
  };

  if (!bookData) return null;

  const formatDate = (dateString: string, pattern = "dd 'de' MMMM 'de' yyyy"): string => {
    try {
      return format(new Date(dateString), pattern, { locale: es });
    } catch {
      return dateString;
    }
  };

  const fmt = (n: number) => n.toLocaleString('es-BO', { minimumFractionDigits: 2 });
  const currency = bookData.currencyCode;
  const hostResume = bookData.priceCalculation.hostResume;
  const fmtPct = (p: number) => (Number.isInteger(p) ? p : parseFloat(p.toFixed(2)));

  const totalAmount = `${currency} ${fmt(bookData.amount)}`;
  const depositDate = formatDate(bookData.ScheduledPayoutDate);
  const guest = bookData.book.Guest;
  const guestName = `${guest.name} ${guest.lastname}`;
  const propertyName = bookData.book.listingRent.name;
  const checkin = formatDate(bookData.book.checkin, 'dd/MM/yyyy');
  const checkout = formatDate(bookData.book.checkout, 'dd/MM/yyyy');
  const { accommodation, additionalCharges } = hostResume;

  return (
    <>
      <CustomDialog isOpen={open} onClose={onClose} maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {totalAmount}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main', mr: 0.5 }}
            />
            <Typography variant="body2" color="text.primary">
              Se depositará el {depositDate}.
              <Typography
                component="span"
                onClick={() => setIsPaymentMethodOpen(true)}
                sx={{
                  textDecoration: 'underline',
                  fontWeight: 'semibold',
                  ml: 0.5,
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                Detalle
              </Typography>
            </Typography>
          </Box>
        </Box>

        {/* Cuenta bancaria */}
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 2, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Cuenta bancaria
          </Typography>
          <Typography variant="body2">
            {bookData.payoutAccount.numberAccount} ({currency}) —{' '}
            {bookData.payoutAccount.formOfPayment}
          </Typography>
        </Box>

        {/* Info de reserva + desglose */}
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            <Avatar src={guest.photoLink || undefined} alt={guestName}>
              {!guest.photoLink ? guestName.charAt(0).toUpperCase() : null}
            </Avatar>
            <Typography
              variant="body2"
              onClick={handleRefClick}
              sx={{
                color: theme.palette.customColors.primary[1],
                fontWeight: 'bold',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Cod: {bookData.book.bookId}
            </Typography>
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {guestName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {propertyName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {bookData.book.nigths} noche{bookData.book.nigths !== 1 ? 's' : ''} · Check-in:{' '}
            {checkin} / Check-out: {checkout}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Ingresos Potenciales
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Hospedaje
          </Typography>

          {/* Rate per night × nights */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {currency} {fmt(accommodation.ratePerNight)} × {accommodation.nightsCount} noche
              {accommodation.nightsCount !== 1 ? 's' : ''}
            </Typography>
            <Typography variant="body2">
              {fmt(accommodation.discountedAmount)} {currency}
            </Typography>
          </Box>

          {additionalCharges.cleaningFee > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Tarifa de limpieza
              </Typography>
              <Typography variant="body2">
                {fmt(additionalCharges.cleaningFee)} {currency}
              </Typography>
            </Box>
          )}
          {additionalCharges.extraGuestFee > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Tarifa por huésped extra
              </Typography>
              <Typography variant="body2">
                {fmt(additionalCharges.extraGuestFee)} {currency}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Subtotal generado
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {fmt(hostResume.subtotal)} {currency}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Comisión JOM anfitrión {fmtPct(hostResume.hostCommissionPercent)}%
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {fmt(hostResume.hostCommission)} {currency}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Recibirás
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {fmt(bookData.amount)} {currency}
            </Typography>
          </Box>

          <Box sx={{ mt: 1.5, mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Estado: {bookData.payoutStatus}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Método de pago: {bookData.payoutAccount.formOfPayment}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Total ({currency})
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {totalAmount}
            </Typography>
          </Box>
        </Box>

        <AddPaymentMethodContent
          open={isPaymentMethodOpen}
          onClose={() => setIsPaymentMethodOpen(false)}
        />
      </CustomDialog>
    </>
  );
};

export default DepositDetailsModal;
