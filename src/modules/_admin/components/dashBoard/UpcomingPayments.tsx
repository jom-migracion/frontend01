import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import DepositDetailsModal from './DepositDetailsModal';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/ApiService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface ScheduledPayoutsResponse {
  data: ScheduledPayout[];
  statusCode: string;
  hasError: boolean;
  resultError: null | unknown;
}

interface ScheduledPayout {
  payoutTransactionId: number;
  bookId: number;
  listingRentId: number;
  scheduled: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: null | string;
  description: null | string;
  attempts: number;
  paymentDetails: PaymentDetails;
  book: ScheduledBook;
  history: PayoutHistoryEntry[];
}

interface PaymentDetails {
  amount: number;
  currency: string;
  processed: string | null;
  lastAttempt: string | null;
  account: null | string;
}

interface ScheduledBook {
  bookId: number;
  status: string;
  start: string;
  end: string;
  paymentDate: string | null;
  paymentDate_STR: string | null;
  propertyName: string;
}

interface PayoutHistoryEntry {
  payoutTransactionHistoryId: number;
  payoutTransactionId: number;
  transactionStatus: string;
  transactionDate: string;
  transactionMessage: string;
  metadata: null | unknown;
}

interface PayoutDetailsResponse {
  data: PayoutDetailsData;
  statusCode: string;
  hasError: boolean;
  resultError: null | unknown;
}

interface PayoutDetailsData {
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

interface UpcomingPaymentsProps {
  hostUserId?: number;
}

const UpcomingPayments: React.FC<UpcomingPaymentsProps> = ({ hostUserId }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payoutDetails, setPayoutDetails] = useState<PayoutDetailsData | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  async function fetchPendingPayouts(params?: {
    start?: string;
    end?: string;
    books?: string;
    hostId?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();

      if (params?.start) queryParams.append('start', params.start);
      if (params?.end) queryParams.append('end', params.end);

      const url = `/PendingPayouts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await ApiService.get<ScheduledPayoutsResponse>(url);
    } catch (error) {
      console.error('Error fetching pending payouts:', error);
      throw error;
    }
  }

  async function fetchPayoutDetails(payoutId: number) {
    try {
      setIsLoadingDetails(true);
      const response = await ApiService.get<PayoutDetailsResponse>(`/PayoutDetails/${payoutId}`);
      setPayoutDetails(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching payout details:', error);
      throw error;
    } finally {
      setIsLoadingDetails(false);
    }
  }

  const newFormatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const startDate = newFormatDate(now);
  const endDate = newFormatDate(nextMonth);

  const {
    data: dataPendingPayouts,
    isLoading: isLoadingPendingPayouts,
    isError,
    error,
  } = useQuery<ScheduledPayoutsResponse>({
    queryKey: ['pendingPayouts', hostUserId],
    queryFn: () => {
      return fetchPendingPayouts({
        start: startDate,
        end: endDate,
      });
    },
  });

  const handleRowClick = async (payout: ScheduledPayout) => {
    setIsModalOpen(true);
    try {
      await fetchPayoutDetails(payout.payoutTransactionId);
    } catch (error) {
      console.error('Error loading payout details:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPayoutDetails(null);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  const getStatusInfo = (status: string | number) => {
    const statusId = typeof status === 'string' ? parseInt(status, 10) : status;
    switch (statusId) {
      case 1:
        return { estado: t('upcomingPayments.status.prebook'), color: '#ff0707' };
      case 2:
        return { estado: t('upcomingPayments.status.approved'), color: '#4caf50' };
      case 3:
        return { estado: t('upcomingPayments.status.rented'), color: '#4caf50' };
      default:
        return { estado: t('upcomingPayments.status.pending'), color: '#ffc107' };
    }
  };

  if (isLoadingPendingPayouts) {
    return (
      <Paper elevation={0} sx={{ borderRadius: '8px', border: '1px solid #e0e0e0', p: 3 }}>
        <Typography>{t('upcomingPayments.loading')}</Typography>
      </Paper>
    );
  }

  if (isError) {
    return (
      <Paper elevation={0} sx={{ borderRadius: '8px', border: '1px solid #e0e0e0', p: 3 }}>
        <Typography>
          {t('upcomingPayments.error')} {error?.message || t('upcomingPayments.unknownError')}
        </Typography>
      </Paper>
    );
  }

  if (isMobile) {
    return (
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {dataPendingPayouts?.data?.map((transaction: ScheduledPayout, index: number) => {
            const statusInfo = getStatusInfo(transaction.status);
            return (
              <Box key={transaction.payoutTransactionId || index}>
                <Box sx={{ py: 2, cursor: 'pointer' }} onClick={() => handleRowClick(transaction)}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body1" fontWeight={600}>
                      {transaction.book.propertyName}
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {transaction.currency}{' '}
                      {transaction.amount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <CircleIcon sx={{ fontSize: 10, color: statusInfo.color, mr: 0.75 }} />
                    <Typography variant="body2" color="text.secondary">
                      {statusInfo.estado}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('upcomingPayments.tableHeaders.date')}: {formatDate(transaction.scheduled)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.paymentMethod ||
                        transaction.paymentDetails.account ||
                        t('upcomingPayments.paymentMethod')}
                    </Typography>
                  </Box>
                </Box>
                {index < (dataPendingPayouts?.data?.length ?? 0) - 1 && <Divider />}
              </Box>
            );
          })}
        </Box>
        <DepositDetailsModal
          open={isModalOpen}
          onClose={handleCloseModal}
          bookData={isLoadingDetails ? null : payoutDetails}
        />
      </>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: '16px', border: '1px solid #e0e0e0' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="upcoming payments table">
          <TableHead>
            <TableRow
              sx={{
                '& .MuiTableCell-root': {
                  backgroundColor: '#f9fbfc',
                  color: '#64748b',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  '&:last-child': { borderRight: 'none' },
                  py: 1.5,
                },
              }}
            >
              <TableCell>{t('upcomingPayments.tableHeaders.status')}</TableCell>
              <TableCell>{t('upcomingPayments.tableHeaders.date')}</TableCell>
              <TableCell>{t('upcomingPayments.tableHeaders.property')}</TableCell>
              <TableCell>{t('upcomingPayments.tableHeaders.amount')}</TableCell>
              <TableCell>{t('upcomingPayments.tableHeaders.method')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPendingPayouts?.data?.map((transaction: ScheduledPayout, index: number) => {
              const statusInfo = getStatusInfo(transaction.status);
              return (
                <TableRow
                  key={transaction.payoutTransactionId || index}
                  onClick={() => handleRowClick(transaction)}
                  sx={{
                    '&:last-child td, &:last-child th': { borderBottom: 0 },
                    '& .MuiTableCell-root': {
                      borderBottom: '1px solid #e5e7eb',
                      '&:last-child': { borderRight: 'none' },
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircleIcon sx={{ fontSize: 10, color: statusInfo.color, mr: 1 }} />
                      {statusInfo.estado}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {formatDate(transaction.scheduled)}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {transaction.book.propertyName}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {/* {transaction.currency} */}
                    {'BOB '}
                    {transaction.amount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {transaction.paymentMethod ||
                      transaction.paymentDetails.account ||
                      t('upcomingPayments.paymentMethod')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <DepositDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        bookData={isLoadingDetails ? null : payoutDetails}
      />
    </>
  );
};

export default UpcomingPayments;
