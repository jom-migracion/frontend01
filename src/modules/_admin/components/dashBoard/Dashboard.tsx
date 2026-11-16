import FinancialPayTable from '@/components/FinancialPayTable';
import { useGet2 } from '@/hooks/api';
import ResponseAssert from '@/models/interfaces/backend/ResponseAssert';
import { ApiService } from '@/services/ApiService';
import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import React, { useRef, useState } from 'react';
import DashboardDetail from './DashboardDetail';
import EarningsDashboardPage from './EarningsDashboardPage';
import FinancialTable from './FinancialTable';
import IncomeReport from './IncomeReport';
import MainDashboard, { RevenueReport } from './MainDashboard';
import RealizedPayments from './RealizedPayments';
import UpcomingPayments from './UpcomingPayments';
import { Helmet } from 'react-helmet-async';

interface ProfileData {
  userId: number;
  name: string;
  lastName: string;
  favoriteName: string;
  roles: string[];
  avatar: string;
  isDocumentVerified: boolean;
  isSuperHost: boolean;
}

interface ProfileResponse {
  statusCode: string;
  data: ProfileData;
  hasError: boolean;
  resultError: string | null;
}

export interface RowData {
  id: string;
  estado: string;
  detalleEstado: string;
  fecha: string;
  propiedad: string;
  detallePropiedad: string;
  monto: string;
  metodo: string;
}

const Dashboard: React.FC = () => {
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const currentYear = new Date().getFullYear();
  const {
    data: revenueData,
    isLoading: revenueLoading,
    isError: revenueIsError,
    error: revenueError,
  } = useGet2<RevenueReport>('dashboard', `/GetRevenueReportYear/${currentYear}`);

  const { data: profileData } = useQuery<ProfileResponse>({
    queryKey: ['profile'],
    queryFn: () => ApiService.post<ProfileResponse>('/GetProfile'),
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  const hostUserId = profileData?.data?.userId;
  !revenueLoading && !revenueIsError && ((revenueData as any)?.data?.monthlyData?.length ?? 0) > 0;
  const [step1, setStep1] = useState<boolean>(true);
  const [step2, setStep2] = useState<boolean>(false);
  const [step3, setStep3] = useState<boolean>(true);
  const [step4, setStep4] = useState<boolean>(false);
  const [step5, setStep5] = useState<boolean>(true);
  const [step6, setStep6] = useState<boolean>(false);
  const [step7, setStep7] = useState<boolean>(true);
  const [step8, setStep8] = useState<boolean>(false);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  const showDetailDashboard = () => {
    setStep1(false);
    setStep2(true);
    setStep3(false);
    setStep4(false);
    setStep5(false);
    setStep6(false);
    setStep7(false);
    setStep8(false);
  };
  const showDetailPendingPay = () => {
    setStep1(false);
    setStep2(false);
    setStep3(false);
    setStep4(true);
    setStep5(false);
    setStep6(false);
    setStep7(false);
    setStep8(false);
  };

  const showDetailAutorizationPay = () => {
    setStep1(false);
    setStep2(false);
    setStep3(false);
    setStep4(false);
    setStep5(false);
    setStep6(true);
    setStep7(false);
    setStep8(false);
  };

  const showDetailAutorizationPay0 = () => {
    setStep1(false);
    setStep2(false);
    setStep3(false);
    setStep4(false);
    setStep5(false);
    setStep6(false);
    setStep7(false);
    setStep8(true);
  };

  const showDetailAutorizationPay1 = () => {
    setStep1(true);
    setStep2(false);
    setStep3(true);
    setStep4(false);
    setStep5(true);
    setStep6(false);
    setStep7(true);
    setStep8(false);
  };

  React.useEffect(() => {
    if (step4 && ref1.current) {
      const timer = setTimeout(() => {
        ref1.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [step4]);

  React.useEffect(() => {
    if (step6 && ref2.current) {
      const timer = setTimeout(() => {
        ref2.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [step6]);

  return (
    <>
      <Helmet>
        <title>Panel de control</title>
        <meta name="panel de control" content="Página principal del panel de control reporteria" />
      </Helmet>
      <Container
        maxWidth={isLargeScreen ? 'xl' : 'lg'}
        sx={{ px: { xs: 0, sm: 4, md: isLargeScreen ? 5 : 2 } }}
      >
        <Grid container spacing={4}>
          {step1 && (
            <Grid size={{ xs: 12 }} sx={{ mt: { xs: 0, md: 4 } }}>
              <>
                <MainDashboard
                  showDetail={showDetailDashboard}
                  data={revenueData as ResponseAssert<RevenueReport> | undefined}
                  isLoading={revenueLoading}
                  isError={revenueIsError}
                  error={revenueError as Error | null}
                />
              </>
            </Grid>
          )}
          {step2 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 2 }}>
                <>
                  <DashboardDetail
                    restoreState={showDetailAutorizationPay1}
                    hostUserId={hostUserId}
                  />
                </>
              </Box>
            </Grid>
          )}
          {step7 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 2, px: { xs: 2, sm: 0 } }}>
                <Typography variant="h4Medium" component="h2" gutterBottom sx={{ mb: '30px' }}>
                  {t('paymentsPage.incomeReport.title')}
                </Typography>
                <IncomeReport hostUserId={hostUserId} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button onClick={showDetailAutorizationPay0} variant="secondary">
                    {t('paymentsPage.upcoming.viewMore')}
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
          {step3 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 2, px: { xs: 2, sm: 0 } }}>
                <Typography variant="h4Medium" component="h2" gutterBottom sx={{ mb: '30px' }}>
                  {t('paymentsPage.upcoming.title')}
                </Typography>
                <UpcomingPayments hostUserId={hostUserId} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button onClick={showDetailPendingPay} variant="secondary">
                    {t('paymentsPage.upcoming.viewMore')}
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}

          {step4 && (
            <Grid size={{ xs: 12 }} ref={ref1}>
              <Box sx={{ mb: 2 }}>
                <FinancialTable onBack={showDetailAutorizationPay1} hostUserId={hostUserId} />
              </Box>
            </Grid>
          )}
          {step5 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 2, px: { xs: 2, sm: 0 } }}>
                <Typography variant="h4Medium" component="h2" gutterBottom sx={{ mb: '30px' }}>
                  {t('paymentsPage.realized.title')}
                </Typography>
                <RealizedPayments hostUserId={hostUserId} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button onClick={showDetailAutorizationPay} variant="secondary">
                    {t('paymentsPage.realized.viewMore')}
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
          {step6 && (
            <Grid size={{ xs: 12 }} ref={ref2}>
              <Box sx={{ mb: 2 }}>
                <FinancialPayTable onBack={showDetailAutorizationPay1} hostUserId={hostUserId} />
              </Box>
            </Grid>
          )}
          {step8 && (
            <Grid size={{ xs: 12 }}>
              <EarningsDashboardPage
                restoreState={showDetailAutorizationPay1}
                hostUserId={hostUserId}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
