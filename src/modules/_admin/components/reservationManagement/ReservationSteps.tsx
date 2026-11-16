import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Box,
  Link,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Grid2,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { esMenorALaFechaActual, formatDateCheckIn } from '@/common/util/dateFunctions';
import { useGet2 } from '@/hooks/api';
import { estadoColorReserva } from '@/common/util/statusFunctios';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useConvertReservationStore } from '@/store/message.store';
import NewReviewDialog from '@/components/NewReviewDialog';

interface ListItemData {
  id: number;
  text: string;
  subText?: string;
  completed: boolean;
}

const ReservationSteps: React.FC<{
  bookingDetails: any;
  onReportIncident: () => void;
  onCancelReservation: () => void;
}> = ({ bookingDetails, onReportIncident, onCancelReservation }) => {
  const { palette, breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('md'));
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    bookId,
    bookStatus,
    datetimePayment,
    checkin,
    checkout,
    reviewDateTime,
    datetimePayoutProgram,
    canReview,
    tmConversations,
    cancellerRole,
    sidebarData
  } = bookingDetails || {};

  // store
  const setStateConversationId = useConvertReservationStore(
    (state: any) => state.setStateConversationId
  );

  // api
  const { data: ReviewQuestionsMessageReservations } = useGet2<any>(
    'ReviewQuestionsMessageReservations',
    '/Parametrics/ReviewQuestions/HostToGuest'
  );
  // const { data: reviewData } = useGet2<any>(
  //   ['reviewReservations', bookId],
  //   `/Book/${bookId}/Review`,
  //   {
  //     enabled: !!bookId,
  //   }
  // );

  // Calcular codeText y statusObj al inicio para usarlo en todo el componente
  const statusObj = estadoColorReserva(bookStatus?.code, checkin, checkout);
  const initialCodeText = typeof statusObj !== 'string' && statusObj?.code ? statusObj.code : '';
  const [codeText, setCodeText] = useState<string>(initialCodeText);
  const initialSteps: ListItemData[] = useMemo(
    () => [
      {
        id: 1,
        text: t('reservationSteps.steps.request'),
        subText: t('reservationSteps.steps.requestApproved'),
        completed: false,
      },
      {
        id: 2,
        text: t('reservationSteps.steps.processing'),
        subText: t('reservationSteps.steps.processingTime', { time: '00:45:30' }),
        completed: false,
      },
      {
        id: 3,
        text: t('reservationSteps.steps.checkin'),
        subText: 'sab, 31 ago.',
        completed: false,
      },
      {
        id: 4,
        text: t('reservationSteps.steps.checkout'),
        subText: 'dom, 1 sept',
        completed: false,
      },
      {
        id: 5,
        text: t('reservationSteps.steps.review'),
        subText: 'lun, 2 sept - sab, 7 sept',
        completed: false,
      },
      { id: 6, text: t('reservationSteps.steps.payout'), subText: 'lun, 02 ago', completed: false },
    ],
    [t]
  );

  const [steps, setSteps] = useState<ListItemData[]>(initialSteps);
  const [step, setStep] = useState(0);
  const [openReview, setOpenReview] = useState<boolean>(false);
  const [_, setCurrentButtonTextIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleReview = async () => {
    if (codeText == 'finalizada' && canReview) {
      try {
        // await refetch();
        // const length = (await reviewData?.data?.reviewQuestions?.length) ?? 0;
        setStep(0);
        setOpenReview(true);
      } catch (err) {
        console.error('Error refetching review data:', err);
      }
    } else if (codeText == 'en_curso') {
      onReportIncident();
    } else if (codeText == 'proximo') {
      onCancelReservation();
    } else if (codeText == 'revision' || codeText == 'procesando_pago') {
      if (tmConversations && tmConversations.length > 0) {
        const conversation = tmConversations[0];
        setStateConversationId(conversation?.conversationId || null);
        navigate(`/host/messages`);
      } else {
        alert('No hay conversación asociada a esta reserva.');
      }
    } else if (codeText == 'expirada' || codeText == 'pago_expirada') {
      navigate(`/`);
    } else if (sidebarData?.responseCode == 'M21') {
      //window.open('/host/info-profile/reembolso', '_blank', 'noopener,noreferrer')
      window.open(`/host/info-profile/reembolso?penaltyBookId=${bookId}`, '_blank', 'noopener,noreferrer');
    } else {
      navigate('/host/info-profile/payments');
    }
  };

  const handleCloseReview = async (type: boolean) => {
    if (type) {
      setCodeText(''); 
    }
  };  

useEffect(() => {
    const newCode = typeof statusObj !== 'string' && statusObj?.code ? statusObj.code : '';
    setCodeText(newCode);
  }, [bookStatus, checkin, checkout]);

  const typeStep = () => {
    let list = {
      completed1: false,
      completed2: false,
      completed3: false,
      completed4: false,
      completed5: false,
      completed6: false,
    };

    if (codeText) {
      switch (codeText) {
        case 'procesando_pago':
          list = {
            completed1: true,
            completed2: false,
            completed3: false,
            completed4: false,
            completed5: false,
            completed6: false,
          };
          break;
        case 'proximo':
          list = {
            completed1: true,
            completed2: true,
            completed3: false,
            completed4: false,
            completed5: false,
            completed6: false,
          };
          break;
        case 'en_curso':
          list = {
            completed1: true,
            completed2: true,
            completed3: true,
            completed4: false,
            completed5: false,
            completed6: false,
          };
          break;
        case 'finalizada':
          if (canReview) {
            list = {
              completed1: true,
              completed2: true,
              completed3: true,
              completed4: true,
              completed5: false,
              completed6: false,
            };
          } else {
            list = {
              completed1: true,
              completed2: true,
              completed3: true,
              completed4: true,
              completed5: true,
              completed6: false,
            };
          }
          break;
        case 'cancelada':
          list = {
            completed1: true,
            completed2: true,
            completed3: true,
            completed4: false,
            completed5: false,
            completed6: false,
          };
          break;
        case 'revision':
          list = {
            completed1: true,
            completed2: true,
            completed3: true,
            completed4: false,
            completed5: false,
            completed6: false,
          };
          break;
        case 'expirada':
          list = {
            completed1: true,
            completed2: true,
            completed3: false,
            completed4: false,
            completed5: false,
            completed6: false,
          };
          break;
        case 'pago_expirada':
          list = {
            completed1: true,
            completed2: true,
            completed3: false,
            completed4: false,
            completed5: false,
            completed6: false,
          };
          break;          
        case 'no_aprobada':
          list = {
            completed1: true,
            completed2: true,
            completed3: false,
            completed4: false,
            completed5: false,
            completed6: false,
          };
          break;          
        default:
          break;
      }
    }
    return list;
  };

  const listType = typeStep();

  const statusReservation = () => {
    const currentSteps = [...initialSteps];

    const updatedSteps = currentSteps.map((step) => {
      if (step.id === 1) {
        return { ...step, completed: listType.completed1 };
      } else if (step.id === 2) {
        return {
          ...step,
          subText: formatDateCheckIn(datetimePayment, false, true),
          completed: listType.completed2,
        };
      } else if (step.id === 3) {
        return {
          ...step,
          subText: formatDateCheckIn(checkin, false, true),
          completed: listType.completed3,
        };
      } else if (step.id === 4) {
        return {
          ...step,
          subText: formatDateCheckIn(checkout, false, true),
          completed: listType.completed4 && esMenorALaFechaActual(checkout) ? true : false,
        };
      } else if (step.id === 5) {
        return {
          ...step,
          subText: formatDateCheckIn(reviewDateTime, false, true),
          completed: listType.completed5,
        };
      } else if (step.id === 6) {
        return {
          ...step,
          subText: formatDateCheckIn(datetimePayoutProgram, false, true),
          completed: codeText == 'finalizada' && datetimePayoutProgram ? true : false,
        };
      }
      return step;
    });

    setCurrentButtonTextIndex(updatedSteps.length - 1);
    if (codeText == 'cancelada') {
      const step = updatedSteps.slice(0, 2);
      step.push({
        id: 3,
        text: t('reservationSteps.steps.cancelledTitle'),
        subText:
          bookStatus?.code == 'non_approved'
            ? 'Rechazado por anfitrión'
            : ["canceled", "canceled_payed", "canceled_assert", "re_canceled"].includes(bookStatus?.code)
            ? bookStatus?.description
            : '',
        completed: true,
      });
      setCurrentButtonTextIndex(step.length - 1);
      return step;
    } else if (codeText == 'revision') {
      const step = updatedSteps.slice(0, 2);
      step.push({
        id: 3,
        text: t('reservationSteps.steps.caseOpenedTitle'),
        subText: t('reservationSteps.steps.caseOpenedSub'),
        completed: false,
      });
      setCurrentButtonTextIndex(step.length - 1);
      return step;
    } else if (codeText == 'expirada' || codeText == 'pago_expirada') {
      const step = updatedSteps.slice(0, 1);
      step.push({
        id: 2,
        text: codeText == 'pago_expirada' ? t('reservationSteps.steps.payExpire') : t('reservationSteps.steps.canceledRequest'),
        subText: codeText == 'pago_expirada' ? t('reservationSteps.steps.payExpireDesc') :
          cancellerRole == 'GUEST'
            ? t('reservationSteps.steps.canceledRequestByGuest')
            : t('reservationSteps.steps.canceledRequestByHost',{ anfitrion: bookingDetails?.userIdRenterNavigation?.name || 'Anfitrión' }),
        completed: true,
      });

      setCurrentButtonTextIndex(step.length - 1);
      return step;
    }else  if(codeText == 'no_aprobada'){
      const step = updatedSteps.slice(0, 1);
      step.push({
        id: 3,
        text: t('reservationSteps.steps.nonAproved'),
        subText: t('reservationSteps.steps.nonAprovedDesc'),
        completed: true,
      });
      setCurrentButtonTextIndex(step.length - 1);
      return step;
    }
    return updatedSteps;
  };

  // hooks
  const questions = useMemo(
    () =>
      ReviewQuestionsMessageReservations?.data &&
      Array.isArray(ReviewQuestionsMessageReservations.data)
        ? ReviewQuestionsMessageReservations.data.slice(0, 4)
        : [],
    [ReviewQuestionsMessageReservations]
  );

  useEffect(() => {
    const updatedSteps = statusReservation();
    setSteps(updatedSteps);
  }, [bookStatus, initialSteps, codeText]);

  // Helper para el texto del botón
  const getButtonText = () => {
    if (codeText === 'procesando_pago') return t('reservationSteps.buttons.writeMessage');
    if (codeText === 'proximo') return t('reservationSteps.buttons.cancel');
    if (codeText === 'en_curso') return t('reservationSteps.buttons.reportIncident');
    if (codeText === 'finalizada' && canReview) return t('reservationSteps.buttons.leaveReview');
    if (codeText === 'revision') return t('reservationSteps.buttons.caseFollowUp');
    if (codeText === 'expirada' || codeText === 'pago_expirada') return t('reservationSteps.buttons.keepLooking');
    if (sidebarData?.responseCode == 'M21') return t('reservationSteps.buttons.viewPenalty', { defaultValue: 'Ver penalidad' });
    //if (sidebarData?.responseCode == 'M21') return t('viewPenalty');
    return t('reservationSteps.buttons.transactionHistory');
  };

  const activeStep = steps.find((item) => !item.completed) ?? steps[steps.length - 1];

  const getMobileSummary = () => {
    if (codeText === 'finalizada') {
      return {
        title: t('reservationSteps.mobile.completedTitle', { defaultValue: 'Reserva completa' }),
        status: canReview
          ? t('reservationSteps.steps.review')
          : t('reservationSteps.mobile.readyStatus', { defaultValue: 'Todo listo' }),
      };
    }

    if (codeText === 'cancelada') {
      return {
        title: t('reservationSteps.steps.cancelledTitle'),
        status: typeof statusObj !== 'string' ? statusObj?.estado || '' : '',
      };
    }

    if (codeText === 'revision') {
      return {
        title: t('reservationSteps.steps.caseOpenedTitle'),
        status: t('reservationSteps.steps.caseOpenedSub'),
      };
    }

    if (codeText === 'expirada' || codeText === 'pago_expirada') {
      return {
        title: t('reservationSteps.steps.canceledRequest'),
        status: activeStep?.subText || t('reservationSteps.buttons.keepLooking'),
      };
    }

    return {
      title:
        activeStep?.text ||
        t('reservationSteps.mobile.defaultTitle', { defaultValue: 'Estado de reserva' }),
      status:
        (typeof statusObj !== 'string' ? statusObj?.estado : '') ||
        activeStep?.subText ||
        getButtonText(),
    };
  };

  const primary = palette.primary.main;

  type StepItemProps = {
    index?: number;
    label: string;
    secondary?: string;
    done?: boolean;
    active?: boolean;
    isLast?: boolean;
  };

  const StepItem: React.FC<StepItemProps> = ({ index, label, secondary, done, active, isLast }) => (
    <Box display="flex" alignItems="flex-start" gap={2} mb={0} position="relative">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: done || active ? palette.customColors.primary[7] : 'transparent',
            border: active
              ? `2px solid ${palette.customColors.primary[1]}`
              : done
                ? 'none'
                : '2px solid #d0d0d0',
            color: active
              ? palette.customColors.primary[1]
              : done
                ? palette.customColors.primary[1]
                : '#757575',
            fontWeight: 700,
            fontSize: 10,
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          {done ? <CheckIcon sx={{ fontSize: 14 }} /> : index}
        </Box>
        {!isLast && (
          <Box
            sx={{
              width: 2,
              height: 30,
              bgcolor: '#e0e0e0',
              mt: 0,
              mb: 2,
            }}
          />
        )}
      </Box>
      <Box flex={1} pt={0.5}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1f1f1f' }}>{label}</Typography>
        {secondary && (
          <Typography
            sx={{
              fontSize: 12,
              color: active ? primary : 'text.secondary',
              fontWeight: active ? 600 : 400,
            }}
          >
            {secondary}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const mobileSummary = getMobileSummary();

  return (
    <React.Fragment>
      <NewReviewDialog
        open={openReview}
        onClose={() => {
          setOpenReview(false);
        }}
        questions={questions}
        bookId={bookId}
        step={step}
        handleSuccess={handleCloseReview}
      />
      <Grid2 size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: { xs: 'fixed', md: 'sticky' },
            bottom: { xs: 56, md: 'auto' },
            top: { xs: 'auto', md: 88 },
            left: { xs: 0, md: 'auto' },
            right: { xs: 0, md: 'auto' },
            width: { xs: '100%', md: '400px' },
            zIndex: { xs: 1400, md: 10 },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 0, md: 1 },
              borderRadius: { xs: '14px 14px 0 0', md: 4 },
              width: { xs: '100%', md: '98%' },
              maxWidth: { md: '100%' },
              border: '1px solid #E5E7EB',
              borderBottom: { xs: 0, md: '1px solid #E5E7EB' },
              overflow: 'hidden',
              boxShadow: {
                xs: '0px -4px 16px rgba(15, 23, 42, 0.08)',
                md: 'none',
              },
              transition: 'all 0.3s ease-in-out',
              maxHeight: { xs: isExpanded ? 'calc(100vh - 128px)' : 'auto', md: 'none' },
            }}
          >
            {isMobile && (
              <Box
                onClick={() => setIsExpanded((prev) => !prev)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  px: 1.75,
                  pt: 0.75,
                  pb: 1.1,
                  borderBottom: isExpanded ? '1px solid #E5E7EB' : 'none',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 4,
                    borderRadius: 999,
                    backgroundColor: '#D1D5DB',
                    alignSelf: 'center',
                    mb: 0.75,
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.85, minWidth: 0, pr: 1 }}
                  >
                    <Box
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        border: `1.5px solid ${palette.customColors.primary[1]}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckIcon
                        sx={{
                          fontSize: 7,
                          color: palette.customColors.primary[1],
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        color: '#111827',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {mobileSummary.title}{' '}
                      <Box component="span" sx={{ color: palette.customColors.primary[1] }}>
                        · {mobileSummary.status}
                      </Box>
                    </Typography>
                  </Box>

                  <ExpandMoreIcon
                    sx={{
                      fontSize: 20,
                      color: '#94A3B8',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease-in-out',
                      flexShrink: 0,
                    }}
                  />
                </Box>
              </Box>
            )}

            <Box
              sx={{
                display: { xs: isExpanded ? 'block' : 'none', md: 'block' },
                overflowY: { xs: 'auto', md: 'visible' },
                maxHeight: { xs: 'calc(100vh - 190px)', md: 'none' },
                backgroundColor: '#FFFFFF',
              }}
            >
              <Box sx={{ px: 2, pt: isMobile ? 1.75 : 2, pb: isMobile ? 1.5 : 0 }}>
                {(() => {
                  const activeIndex = steps.findIndex((s) => !s.completed);
                  return steps.map((s, index) => (
                    <StepItem
                      key={s.id}
                      index={s.id}
                      label={s.text}
                      secondary={s.subText}
                      done={s.completed}
                      active={index === activeIndex && !s.completed}
                      isLast={index === steps.length - 1}
                    />
                  ));
                })()}
              </Box>

              {!isMobile && (
                <React.Fragment>
                  <Box px={2} pb={3} pt={3}>
                    <Button fullWidth variant="primary" onClick={handleReview}>
                      {getButtonText()}
                    </Button>
                  </Box>
                  <Box px={2} pb={2}>
                    <Link
                      underline="always"
                      href="#"
                      sx={{
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        '&:hover': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      {t('reservationSteps.links.whyProcessing')}
                    </Link>
                  </Box>
                </React.Fragment>
              )}
            </Box>
          </Paper>
        </Box>

        {isMobile && <Box sx={{ height: isExpanded ? 132 : 122 }} />}
      </Grid2>
    </React.Fragment>
  );
};

export default ReservationSteps;
