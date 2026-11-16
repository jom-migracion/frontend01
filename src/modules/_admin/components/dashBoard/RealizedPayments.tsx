import { ApiService } from '@/services/ApiService';
import CircleIcon from '@mui/icons-material/Circle';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PaymentCompletedModal from './PaymentCompletedModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PayoutsGroupedResponse {
  data: PayoutGroup[];
  statusCode: string;
  hasError: boolean;
  resultError: null | unknown; // o string si puede venir mensaje de error
}

interface PayoutGroup {
  status: string; // ej: "AUTHORIZED"
  datePayment: string; // "YYYY-MM-DD"
  totalAmount: string; // string con coma como separador decimal "1,069.50"
  currency: string; // "Bolivianos" | "United States dollar"
  methodOfPayment: string; // ej: "Transferencia Bancaria"
  transactions: number; // cantidad de pagos en el grupo
  paymentsList: PayoutTransaction[];
}

interface PayoutTransaction {
  payoutTransactionId: number;
  bookId: number;
  listingRentId: number;
  scheduled: string; // ISO datetime
  processed: string; // ISO datetime con milisegundos
  processed_STR: string; // "YYYY-MM-DD"
  amount: number; // número flotante (ej: 25.3)
  currency: string;
  status: string;
  paymentMethod: string;
  paymentMethodDescription: string;
  paymentDetails: PaymentDetails;
  book: BookDetail;
}

interface PaymentDetails {
  amount: number;
  currency: string;
  processed: string;
  account: null | string; // en los datos siempre null
}

// Interfaces para el servicio PayoutAuthorizedDetails
interface PayoutAuthorizedDetailsResponse {
  data: PayoutAuthorizedTransaction[];
  statusCode: string;
  hasError: boolean;
  resultError: null | unknown;
}

interface PayoutAuthorizedTransaction {
  payoutTransactionId: number;
  amount: number;
  currencyCode: string | null;
  originalAmount: number;
  timeDiff: number;
  PayoutDate: string;
  ScheduledPayoutDate: string;
  poCode: string | null;
  priceCalculation: PriceCalculation;
  book: BookDetail;
  payoutStatus: string;
  transactionStatusId: number;
  payoutAccount: PayoutAccount;
}

interface PriceCalculation {
  additionalFees: number | null;
  amount: number;
  discounts: number;
  platformFee: number | null;
  BreakdownInfo: any[] | null;
  CleanFee: any | null;
  currencyCode: string | null;
}

interface BookDetail {
  bookId: number;
  timeDiff: number | null;
  bookingCode: string | null;
  checkin: string | null;
  checkout: string | null;
  AmountPerNight: number | null;
  startDate: string;
  endDate: string;
  nigths: number;
  status: string | null;
  bookStatusId: number;
  Guest: GuestInfo;
  listingRent: ListingRentInfo;
}

interface GuestInfo {
  name: string;
  lastname: string;
  photoLink: string | null;
}

interface ListingRentInfo {
  name: string;
  Owner: OwnerInfo;
}

interface OwnerInfo {
  name: string;
  lastname: string;
  photoLink: string | null;
}

interface PayoutAccount {
  numberAccount: string;
  formOfPayment: string;
  provider: string;
}

interface RealizedPaymentsProps {
  hostUserId?: number;
}

const RealizedPayments: React.FC<RealizedPaymentsProps> = ({ hostUserId }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payoutAuthorizedDetails, setPayoutAuthorizedDetails] = useState<
    PayoutAuthorizedTransaction[] | null
  >(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleRowClick = async (group: PayoutGroup) => {
    setIsModalOpen(true);
    try {
      await fetchPayoutAuthorizedDetails({
        date: group.datePayment,
        paymentMethodId: getPaymentMethodId(group.methodOfPayment),
      });
    } catch (error) {
      console.error('Error loading payout authorized details:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPayoutAuthorizedDetails(null);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  // Función para mapear el nombre del método de pago a su ID
  function getPaymentMethodId(methodName: string): number {
    const methodMap: { [key: string]: number } = {
      'Transferencia Bancaria': 3,
      PayPal: 2,
      Stripe: 1,
      // Agregar más métodos según sea necesario
    };
    return methodMap[methodName] || 3; // Por defecto retorna 3
  }

  async function fetchPayoutAuthorizedDetails(params: {
    date: string;
    paymentMethodId: number;
    books?: string;
    hostId?: number;
  }) {
    try {
      setIsLoadingDetails(true);
      const queryParams = new URLSearchParams();

      queryParams.append('date', params.date);
      queryParams.append('paymentMethodId', params.paymentMethodId.toString());
      if (params.books) queryParams.append('books', params.books);
      if (params.hostId) queryParams.append('hostId', params.hostId.toString());

      const url = `/PayoutAuthorizedDetails?${queryParams.toString()}`;
      const response = await ApiService.get<PayoutAuthorizedDetailsResponse>(url);
      setPayoutAuthorizedDetails(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching payout authorized details:', error);
      throw error;
    } finally {
      setIsLoadingDetails(false);
    }
  }

  async function fetchAuthorizedPayouts(params?: {
    start?: string;
    end?: string;
    books?: string;
    hostId?: number;
  }) {
    try {
      const queryParams = new URLSearchParams();

      if (params?.start) queryParams.append('start', params.start);
      if (params?.end) queryParams.append('end', params.end);
      if (params?.books) queryParams.append('books', params.books);
      if (params?.hostId) queryParams.append('hostId', params.hostId.toString());

      const url = `/AuthorizedPayouts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await ApiService.get<PayoutsGroupedResponse>(url);
    } catch (error) {
      console.error('Error fetching authorized payouts:', error);
      throw error;
    }
  }

  const newFormatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const now = new Date();
  const startMonth = new Date(now);
  startMonth.setMonth(startMonth.getMonth() - 1);
  const startDate = newFormatDate(startMonth);
  const endDate = newFormatDate(now);

  const {
    data: dataPayout,
    isLoading: isLoadingPayout,
    isError,
    error,
  } = useQuery<PayoutsGroupedResponse>({
    queryKey: ['authorizedPayouts', hostUserId],
    queryFn: () => {
      return fetchAuthorizedPayouts({
        start: startDate,
        end: endDate,
      });
    },
  });

  console.log(dataPayout);

  function convertAuthorizedPaymentsList(paymentsList: PayoutAuthorizedTransaction[]): any[] {
    if (!paymentsList || paymentsList.length === 0) {
      return [];
    }

    return paymentsList
      .map((selectedPayment) => {
        if (!selectedPayment || !selectedPayment.book) {
          return null;
        }

        const { book } = selectedPayment;

        return {
          bookId: book.bookId,
          startDate: book.startDate,
          endDate: book.endDate,
          checkin: book.checkin,
          checkout: book.checkout,
          nights: book.nigths,
          bookStatusId: book.bookStatusId,
          listingRentId: 0,
          amountTotal: selectedPayment.amount,
          listingRent: {
            name: book.listingRent?.name || '',
            property: {
              address: {
                city: {
                  city: '',
                  country: '',
                },
              },
            },
          },
          bookStatus: {
            bookStatusId: book.bookStatusId,
            name: book.status || selectedPayment.payoutStatus,
            description: `${book.listingRent?.Owner?.name || ''} ${book.listingRent?.Owner?.lastname || ''}, ${selectedPayment.payoutAccount?.numberAccount || ''} (${selectedPayment.currencyCode || 'BOB'})`,
            code: book.status || selectedPayment.payoutStatus,
          },
          photos: book.Guest?.photoLink ? [{ photoLink: book.Guest.photoLink }] : [],
          // Include all payment transaction details
          payoutTransactionId: selectedPayment.payoutTransactionId,
          currency: selectedPayment.currencyCode || 'BOB',
          paymentMethod: selectedPayment.payoutAccount?.formOfPayment || '',
          paymentMethodDescription: `${selectedPayment.payoutAccount?.formOfPayment || ''} - ${selectedPayment.payoutAccount?.provider || ''}`,
          processed: selectedPayment.PayoutDate,
          scheduled: selectedPayment.ScheduledPayoutDate,
          status: book.status,
          payoutStatus: selectedPayment.payoutStatus,
          paymentDetails: {
            amount: selectedPayment.amount,
            currency: selectedPayment.currencyCode,
            processed: selectedPayment.PayoutDate,
            account: selectedPayment.payoutAccount?.numberAccount || null,
          },
          host: {
            userId: 0,
            name: book.listingRent?.Owner?.name || '',
            lastName: book.listingRent?.Owner?.lastname || '',
          },
          guest: {
            userId: 0,
            name: book.Guest?.name || '',
            lastName: book.Guest?.lastname || '',
            photoLink: book.Guest?.photoLink || undefined,
          },
          // Datos adicionales del servicio
          payoutAccount: selectedPayment.payoutAccount,
          priceCalculation: selectedPayment.priceCalculation,
        };
      })
      .filter(Boolean);
  }

  if (isLoadingPayout) return <Typography>Cargando...</Typography>;
  if (isError) return <Typography>Error loading data: {error.message}</Typography>;

  if (isMobile) {
    return (
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {dataPayout?.data?.map((group: PayoutGroup, index: number) => {
            const statusColor =
              group.status === 'AUTHORIZED'
                ? '#4caf50'
                : group.status === 'Pending'
                  ? '#ff9800'
                  : '#f44336';
            const currencySymbol =
              group.currency === 'Bolivianos'
                ? 'Bs'
                : group.currency === 'United States dollar'
                  ? '$'
                  : '';
            return (
              <Box key={`${group.datePayment}-${group.currency}-${index}`}>
                <Box sx={{ py: 2, cursor: 'pointer' }} onClick={() => handleRowClick(group)}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircleIcon sx={{ fontSize: 10, color: statusColor, mr: 0.75 }} />
                      <Typography variant="body1" fontWeight={600}>
                        {t(`realizedPayments.status.${group.status}`, {
                          defaultValue: group.status,
                        })}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600}>
                      {currencySymbol} {group.totalAmount}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(group.datePayment).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {group.methodOfPayment || 'N/A'} · {group.transactions} trans.
                    </Typography>
                  </Box>
                </Box>
                {index < (dataPayout?.data?.length ?? 0) - 1 && <Divider />}
              </Box>
            );
          })}
        </Box>
        <PaymentCompletedModal
          open={isModalOpen}
          onClose={handleCloseModal}
          bookData={
            isLoadingDetails
              ? null
              : payoutAuthorizedDetails
                ? convertAuthorizedPaymentsList(payoutAuthorizedDetails)
                : null
          }
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
        <Table sx={{ minWidth: 650 }} aria-label="realized payments table">
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
              <TableCell>{t('realizedPayments.tableHeaders.status')}</TableCell>
              <TableCell>{t('realizedPayments.tableHeaders.date')}</TableCell>
              <TableCell>{t('realizedPayments.tableHeaders.totalPaid')}</TableCell>
              <TableCell>{t('realizedPayments.tableHeaders.paymentMethod')}</TableCell>
              <TableCell>{t('realizedPayments.tableHeaders.transactions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPayout?.data?.map((group: PayoutGroup, index: number) => {
              const statusColor =
                group.status === 'AUTHORIZED'
                  ? '#4caf50'
                  : group.status === 'Pending'
                    ? '#ff9800'
                    : '#f44336';
              return (
                <TableRow
                  key={`${group.datePayment}-${group.currency}-${index}`}
                  onClick={() => handleRowClick(group)}
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
                      <CircleIcon sx={{ fontSize: 10, color: statusColor, mr: 1 }} />
                      {group.status == 'AUTHORIZED' ? 'Autorizado' : ''}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {/* {new Date(group.datePayment).toLocaleDateString()} */}
                    {formatDate(group.datePayment)}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {group.currency === 'Bolivianos'
                      ? 'BOB'
                      : group.currency === 'United States dollar'
                        ? '$'
                        : ''}{' '}
                    {group.totalAmount}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {group.methodOfPayment || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{group.transactions}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <PaymentCompletedModal
        open={isModalOpen}
        onClose={handleCloseModal}
        bookData={
          isLoadingDetails
            ? null
            : payoutAuthorizedDetails
              ? convertAuthorizedPaymentsList(payoutAuthorizedDetails)
              : null
        }
      />
    </>
  );
};

export default RealizedPayments;
