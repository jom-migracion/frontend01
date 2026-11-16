import React /*, { useState }*/ from 'react';
import { Box, Typography, Button /*, Container*/ } from '@mui/material';
import UpcomingPayments from './UpcomingPayments';
import RealizedPayments from './RealizedPayments';
import IncomeReport from './IncomeReport';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import FinancialPayTable from '@/components/FinancialPayTable';
import FinancialTable from './FinancialTable';
// import DashboardDetail from './DashboardDetail';
import DashboardDetail from './DashboardDetail';

const PaymentsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  // const [paso1, setPaso1] = useState<boolean>(true);
  // const [paso2, setPaso2] = useState<boolean>(true);
  // const [paso3, setPaso3] = useState<boolean>(true);
  // const [paso4, setPaso4] = useState<boolean>(true);
  // const [paso5, setPaso5] = useState<boolean>(true);
  // const [paso6, setPaso6] = useState<boolean>(true);

  // const showDetailPendingPay = () => {
  //   setPaso1(false);
  //   setPaso2(false);
  //   setPaso3(false);
  //   setPaso4(false);
  //   setPaso5(false);
  //   setPaso6(false);
  // };

  // const showDetailAutorizationPay = () => {
  //   setPaso1(false);
  //   setPaso2(false);
  //   setPaso3(false);
  //   setPaso4(false);
  //   setPaso5(false);
  //   setPaso6(false);
  // };

  return (
    <>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4Medium" component="h2" gutterBottom sx={{ mb: '30px' }}>
          Detalle de dashboard
        </Typography>
        <DashboardDetail
          restoreState={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </Box>
      <Typography variant="h3Medium" component="h1" gutterBottom>
        {t('paymentsPage.title')}
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4Medium" component="h2" gutterBottom sx={{ mb: '30px' }}>
          {t('paymentsPage.upcoming.title')}
        </Typography>
        <UpcomingPayments />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            //  onClick={() => navigation('/host/dashboard/payment')}
            onClick={() => {}}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: 'black',
              '&:hover': {
                borderColor: '#d0d0d0',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            {t('paymentsPage.upcoming.viewMore')}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4Medium" component="h2" gutterBottom sx={{ mb: '30px' }}>
          Detalle de pagos pendientes
        </Typography>
        <FinancialTable />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            //   onClick={() => navigation('/host/dashboard/payment')}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: 'black',
              '&:hover': {
                borderColor: '#d0d0d0',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            {t('paymentsPage.upcoming.viewMore')}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4Medium" component="h2" gutterBottom sx={{ mb: '30px' }}>
          {t('paymentsPage.realized.title')}
        </Typography>
        <RealizedPayments />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={() => navigation('/host/dashboard/income')}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: 'black',
              '&:hover': {
                borderColor: '#d0d0d0',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            {t('paymentsPage.realized.viewMore')}
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4Medium" component="h2" gutterBottom sx={{ mb: '30px' }}>
          Detalle de pagos realizados
        </Typography>
        <FinancialPayTable />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            // onClick={() => navigation('/host/dashboard/income')}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: 'black',
              '&:hover': {
                borderColor: '#d0d0d0',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            {t('paymentsPage.realized.viewMore')}
          </Button>
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4Medium" component="h2" gutterBottom sx={{ mb: '30px' }}>
          {t('paymentsPage.incomeReport.title')}
        </Typography>
        <IncomeReport />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={() => navigation('/host/dashboard/earnings')}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: 'black',
              '&:hover': {
                borderColor: '#d0d0d0',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            {t('paymentsPage.incomeReport.viewMore')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PaymentsPage;
