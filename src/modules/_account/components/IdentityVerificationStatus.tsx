import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Button,
  Divider,
  useTheme,
} from '@mui/material';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedIcon from '@mui/icons-material/Verified';
// import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import OtherHousesOutlinedIcon from '@mui/icons-material/OtherHousesOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import noOkVerificacionIdentidad from '../../../assets/noOkVerificacionIdentidad.png';
import AssertModal from '@/components/AssertModal';
import UploadPhoto from './profile/UploadPhoto';
import { RestClient } from '@/services/RestClient';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '@/modules/_auth/context';
import { useSignalR } from '@/modules/_guest/hooks/useSignalR';
import { DeviceInfo, useDeviceType } from '@/common/util/useDeviceType';
import LocalSeeOutlinedIcon from '@mui/icons-material/LocalSeeOutlined';

type VerificationStatus = 'initial' | 'document-upload' | 'pending' | 'success' | 'error';
type DocumentTypeCode = 'CI' | 'LIC' | 'PASS';

const DOCUMENT_TYPE_OPTIONS: Array<{ code: DocumentTypeCode; label: string }> = [
  { code: 'CI', label: 'DNI' },
  { code: 'LIC', label: 'Licencia de conducir' },
  { code: 'PASS', label: 'Pasaporte' },
];

interface IdentityVerificationProps {
  IdUser: string;
  onClose?: () => void;
  onStatusChange?: (status: VerificationStatus) => void;
}

const IdentityVerificationStatus: React.FC<IdentityVerificationProps> = ({
  IdUser,
  onClose,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<VerificationStatus>('initial');
  const [isInitializingVerification, setIsInitializingVerification] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedDocType] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDocumentTypeCode] = useState<DocumentTypeCode | ''>('CI');
  const [isRedirectingToVerification, setIsRedirectingToVerification] = useState(false);
  const [userVerifyId, setUserVerifyId] = useState(0);
  const [currentUploadSide, setCurrentUploadSide] = useState<'front' | 'back' | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const { t } = useTranslation();
  const { isHostAuthenticated } = useAuthContext();
  const { isIOS, isAndroid, isDesktop, isMobile }: DeviceInfo = useDeviceType();
  const [isQr, setIsQr] = useState<boolean>(false);
  const [qrImg, setQrImg] = useState<string>('');
  const theme = useTheme();

  // SignalR hook
  const { notifications, isConnected } = useSignalR();

  const getSelectedDocumentLabel = (code: DocumentTypeCode | '' = selectedDocumentTypeCode) => {
    return DOCUMENT_TYPE_OPTIONS.find((option) => option.code === code)?.label ?? '';
  };

  const getSelectedDocumentSideLabel = (side: 'front' | 'back') => {
    const documentLabel = getSelectedDocumentLabel();

    if (!documentLabel) {
      return '';
    }

    if (selectedDocumentTypeCode === 'PASS' && side === 'front') {
      return documentLabel;
    }

    return `${documentLabel} ${side === 'front' ? 'Frontal' : 'Reverso'}`;
  };

  useEffect(() => {
    let isMounted = true;

    setIsInitializingVerification(true);

    RestClient.get('/GetUserVerification')
      .then((res: any) => {
        if (!isMounted) {
          return;
        }

        if (res?.data?.statusCode === '200' && res?.data?.data) {
          const verifyData = res.data.data;

          if (verifyData.userVerifyId) {
            setUserVerifyId(verifyData.userVerifyId);
          }
          if (verifyData.userVerifyStatusCode === 'PEN') {
            setStatus('pending');
            setIsApproved(false);
            setIsRejected(false);
            setPendingUrl(res.data.resultError?.message || null);
            setQrImg(res.data.resultError?.title || '');
          } else if (verifyData.userVerifyStatusCode === 'APR') {
            setStatus('success');
            setIsApproved(true);
            setIsRejected(false);
            setPendingUrl(null);
          } else if (verifyData.userVerifyStatusCode === 'REJ') {
            setStatus('initial');
            setIsApproved(false);
            setIsRejected(true);
            setPendingUrl(null);
            setQrImg('');
          } else if (verifyData.userVerifyStatusCode === 'INI') {
            setStatus('initial');
            setIsApproved(false);
            setIsRejected(false);
            setPendingUrl(null);
            setQrImg('');
          } else {
            setIsApproved(false);
            setIsRejected(false);
            setPendingUrl(null);
            setQrImg('');
          }
        }
      })
      .catch((err: any) => {
        if (!isMounted) {
          return;
        }

        console.error('Error checking user verification status:', err);
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }

        setIsInitializingVerification(false);
      });

    return () => {
      isMounted = false;
    };
  }, [IdUser]);

  useEffect(() => {
    RestClient.get(`/Parametrics/GetVerifyDocTypes`).then((x: any) => {
      if (x?.data?.statusCode == '200') {
        void x;
      }
    });
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      if (latestNotification.type === 'UserVerificationApproved') {
        setStatus('success');
        setIsApproved(true);
        setIsRejected(false);
        setErrorMsg(null);
      } else if (latestNotification.type === 'UserVerificationRejected') {
        setStatus('initial');
        setIsApproved(false);
        setIsRejected(true);
        setErrorMsg(
          latestNotification?.messageBody || 'Tu verificación fue rechazada. Intente mas tarde.'
        );
      }
    }
  }, [notifications, isConnected]);

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  const handleInitialContinue = async () => {
    try {
      setErrorMsg(null);
      setIsRedirectingToVerification(true);

      const formData = new FormData();

      const currentUserVerifyId = userVerifyId;
      if (currentUserVerifyId > 0) {
        formData.append('UserVerifyId', currentUserVerifyId.toString());
      }

      const response = await RestClient.post('/IdentityVerification', formData, {
        headers: {
          Accept: 'text/plain',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response?.data?.statusCode.toString() !== '200') {
        setErrorMsg(
          response?.data?.resultError?.message ||
            'No se pudo iniciar la verificación de identidad. Inténtalo nuevamente.'
        );
        return;
      } else {
        const redirectUrl =
          response?.data?.data?.url ??
          response?.data?.url ??
          response?.data?.data?.URL ??
          response?.data?.URL;
        const qrCode = response?.data?.data?.qrCode ?? response?.data?.qrCode;
        console.log('Es Mobile: ', isMobile, 'Es Desktop: ', isDesktop);
        if (!isMobile && isDesktop) {
          if (qrCode) {
            setPendingUrl(redirectUrl);
            setStatus('pending');
            setIsApproved(false);
            setIsRejected(false);
            setQrImg(qrCode);
            setIsQr(true);
          }
        } else {
          if (!redirectUrl) {
            setErrorMsg('No se pudo iniciar la verificación de identidad. Inténtalo nuevamente.');
            return;
          }
          window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      // console.error('Error starting identity verification:', error);
      setErrorMsg('No se pudo iniciar la verificación de identidad. Inténtalo nuevamente.');
    } finally {
      setIsRedirectingToVerification(false);
    }
  };

  const handlePendingContinue = () => {
    if (pendingUrl) {
      window.location.href = pendingUrl;
    }
  };

  const handleFileUpload = (newFile: File | null) => {
    if (newFile && newFile.size > 2 * 1024 * 1024) {
      setErrorMsg(t('identityVerification.error.fileSizeError'));
      return;
    }

    setErrorMsg(null);
    setUploadModalOpen(false);
    setCurrentUploadSide(null);
  };

  const renderInitial = () => (
    <Box sx={{ px: { xs: 0.5, sm: 1 }, pb: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          mb: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#6B7280',
            fontWeight: 700,
            letterSpacing: 0.2,
            fontSize: { xs: '1.2rem', sm: '1.2rem' },
          }}
        >
          JOM · Seguridad
        </Typography>
        {onClose && (
          <Button
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 0,
              minWidth: 'auto',
              padding: 1,
              color: '#6B7280',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#1F2937',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </Button>
        )}
      </Box>

      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: '#ECE9FF',
          border: '1px solid #DDD6FE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 4,
        }}
      >
        <BadgeOutlinedIcon sx={{ fontSize: 76, color: theme.palette.primary.main }} />
      </Box>

      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 800,
          color: '#1F2937',
          fontSize: { xs: '1rem', sm: '1.45rem' },
          lineHeight: 1.1,
          mb: 2,
        }}
      >
        Verifica tu identidad
      </Typography>

      <Typography
        align="center"
        sx={{
          color: '#6B7280',
          fontSize: { xs: '0.82rem', sm: '0.95rem' },
          lineHeight: 1.55,
          maxWidth: 660,
          mx: 'auto',
          mb: 3.5,
        }}
      >
        Solicitamos a nuestros{' '}
        <Box component="span" sx={{ fontWeight: 800, color: '#1F2937' }}>
          huéspedes y anfitriones
        </Box>{' '}
        que se verifiquen para contribuir a la seguridad de nuestra comunidad.
      </Typography>

      {isApproved && (
        <Box mt={2} mb={2} p={1.5} borderRadius={1.5} bgcolor="#e8f5e9" border="1px solid #66bb6a">
          <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
            La ultima solicitud de verificación de identidad ya fue validada.
          </Typography>
        </Box>
      )}

      {isRejected && (
        <Box mt={2} mb={2} p={1.5} borderRadius={1.5} bgcolor="#ffebee" border="1px solid #ef9a9a">
          <Typography variant="body2" sx={{ color: '#c62828', fontWeight: 600 }}>
            La ultima solicitud fue rechazada.
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 3, borderColor: '#E5E7EB' }} />

      <Box sx={{ display: 'grid', gap: 1.5 }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #E5E7EB',
            backgroundColor: '#F8FAFC',
            boxShadow: 'none',
            p: 0,
            m: 0,
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              // gap: 1.5,
              pt: 1.2,
              pb: 0,
              pr: 1.2,
              pl: 1.2,
              m: 0,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#ECE9FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
                flexShrink: 0,
              }}
            >
              <BadgeOutlinedIcon sx={{ fontSize: 30 }} />
            </Box>

            <Box sx={{ p: 0, m: 0 }}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2937', mb: 0.5 }}>
                ¿Qué necesitas?
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.98rem', lineHeight: 1.55 }}>
                Foto del frente y reverso de tu DNI o documento de identidad vigente.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #E5E7EB',
            backgroundColor: '#F8FAFC',
            boxShadow: 'none',
            p: 0,
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              pt: 1.2,
              pb: 0,
              pr: 1.2,
              pl: 1.5,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#ECE9FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
                flexShrink: 0,
              }}
            >
              <TimerOutlinedIcon sx={{ fontSize: 30 }} />
            </Box>

            <Box sx={{ p: 0, m: 0 }}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2937' }}>
                Solo toma 2 minutos
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.98rem', lineHeight: 1.05 }}>
                Proceso rápido que realizarás una sola vez. Tus datos quedan guardados de forma
                segura.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #E5E7EB',
            backgroundColor: '#F8FAFC',
            boxShadow: 'none',
            p: 0,
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              pt: 1.2,
              pb: 0,
              pr: 1.2,
              pl: 1.5,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#ECE9FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
                flexShrink: 0,
              }}
            >
              <LocalSeeOutlinedIcon sx={{ fontSize: 30 }} />
            </Box>

            <Box sx={{ p: 0, m: 0 }}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2937' }}>
                Notas
              </Typography>
              <Typography sx={{ color: '#6B7280', fontSize: '0.98rem', lineHeight: 1.05 }}>
                Se sugiere que tenga una buena cámara y buena luz para que las fotos sean claras y
                legibles.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {errorMsg && (
        <Box mt={2} mb={2} p={1.5} borderRadius={1.5} bgcolor="#ffebee" border="1px solid #ef9a9a">
          <Typography variant="body2" sx={{ color: '#c62828', fontWeight: 600 }}>
            {errorMsg}
          </Typography>
        </Box>
      )}

      {/* {isQr && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0, pb: 1 }}>
          <Box
            sx={{
              width: 210,
              height: 210,
              backgroundColor: '#ECE9FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <img
              src={qrImg}
              alt="QR Code"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>
        </Box>
      )} */}

      {/* {!isQr && ( */}
      <Button
        variant="primary"
        fullWidth
        onClick={handleInitialContinue}
        disabled={isRedirectingToVerification}
        startIcon={<ArrowForwardIcon />}
        sx={{
          mt: 1,
          minHeight: 55,
          borderRadius: 3,
          fontSize: { xs: '1rem', sm: '1.15rem' },
          fontWeight: 800,
          boxShadow: '0 14px 30px rgba(93, 83, 214, 0.24)',
        }}
      >
        {isRedirectingToVerification ? 'Redirigiendo...' : 'Continuar'}
      </Button>
      {/* )} */}

      <Box mt={3} display="none">
        <Typography fontWeight="bold">{t('identityVerification.initial.privacyTitle')}</Typography>
        <Typography variant="body2" mt={1}>
          {t('identityVerification.initial.privacyText')}
        </Typography>
      </Box>

      <Box mt={4} p={2} border="1px solid #ccc" borderRadius={2} display="none">
        <Typography fontWeight="bold">{t('identityVerification.initial.tipsTitle')}</Typography>
        {(t('identityVerification.initial.tips', { returnObjects: true }) as string[]).map(
          (tip, i) => (
            <Typography key={i} variant="body2">
              • {tip}
            </Typography>
          )
        )}
      </Box>
    </Box>
  );

  const renderPending = () => (
    <Box sx={{ px: { xs: 0.5, sm: 1 }, pb: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          pb: 1.8,
        }}
      >
        {onClose && (
          <Button
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 0,
              minWidth: 'auto',
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '1px solid #E5E7EB',
              color: '#6B7280',
              backgroundColor: '#F8FAFC',
              '&:hover': { backgroundColor: '#EEF2F7' },
            }}
          >
            <CloseIcon sx={{ fontSize: 22 }} />
          </Button>
        )}
        {/* <Typography
          sx={{ fontWeight: 700, color: '#1F2937', fontSize: { xs: '1rem', sm: '1.1rem' } }}
        >
          ¡Tu cuenta está siendo verificada!
        </Typography> */}
      </Box>

      {/* <Box sx={{ pt: 2.5, pb: 2, borderBottom: '1px solid #E5E7EB' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            Paso 2 de 2
          </Typography>
          <Typography
            sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
          >
            50% completado
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={50}
          sx={{
            height: 8,
            borderRadius: 999,
            backgroundColor: '#E8EAF8',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.main,
              borderRadius: 999,
            },
          }}
        />
      </Box> */}

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, pb: 1 }}>
        {/* <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#ECE9FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
          }}
        >
          <NewReleasesIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
        </Box> */}

        {/* <Typography sx={{ color: '#6B7280', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
          Anfitrion JOM
        </Typography> */}

        <Typography
          align="center"
          sx={{
            color: '#1F2937',
            fontWeight: 800,
            fontSize: { xs: '1.2rem', sm: '1.4rem' },
            lineHeight: 1.1,
            mb: 1.2,
          }}
        >
          Verifica tu identidad
        </Typography>

        <Typography
          align="center"
          sx={{
            color: '#6B7280',
            fontWeight: 700,
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            lineHeight: 1.55,
            maxWidth: 640,
            mb: 1.8,
          }}
        >
          {/* Debe continuar con el proceso de verificación de identidad para poder publicar su primer
          espacio y comenzar a recibir huéspedes. Recuerde que debe tener a la mano su documento de
          identidad vigente y una buena cámara para que las fotos. */}
          Necesitamos validar tu identidad.
        </Typography>
        <Typography
          align="center"
          sx={{
            color: '#6B7280',
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            lineHeight: 1.55,
            maxWidth: 640,
            mb: 1.8,
          }}
        >
          Ten a mano tu documento y una selfie. Toca el botón Continuar para iniciar el proceso.
        </Typography>
        {/* {!isMobile && isDesktop && qrImg && (
          <Box
            sx={{
              width: 210,
              height: 210,
              backgroundColor: '#ECE9FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <img
              src={qrImg}
              alt="QR Code"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </Box>
        )} */}
      </Box>
      {errorMsg && (
        <Box mt={2}>
          <Typography color="error" variant="body2">
            {errorMsg}
          </Typography>
        </Box>
      )}
      {pendingUrl && (
        <Button
          variant="primary"
          fullWidth
          onClick={handlePendingContinue}
          disabled={isRedirectingToVerification}
          startIcon={<ArrowForwardIcon />}
          sx={{
            mt: 1,
            minHeight: 55,
            borderRadius: 3,
            fontSize: { xs: '1rem', sm: '1.15rem' },
            fontWeight: 800,
            boxShadow: '0 14px 30px rgba(93, 83, 214, 0.24)',
          }}
        >
          {isRedirectingToVerification ? 'Redirigiendo...' : 'Continuar'}
        </Button>
      )}
    </Box>
  );

  const renderSuccess = () => (
    <Box sx={{ px: { xs: 0.5, sm: 1 }, pb: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          pb: 1.8,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        {onClose && (
          <Button
            onClick={onClose}
            sx={{
              position: 'absolute',
              left: 0,
              minWidth: 'auto',
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '1px solid #E5E7EB',
              color: '#6B7280',
              backgroundColor: '#F8FAFC',
              '&:hover': { backgroundColor: '#EEF2F7' },
            }}
          >
            <CloseIcon sx={{ fontSize: 22 }} />
          </Button>
        )}
        <Typography
          sx={{ fontWeight: 700, color: '#1F2937', fontSize: { xs: '1rem', sm: '1.1rem' } }}
        >
          ¡Tu cuenta está verificada!
        </Typography>
      </Box>

      <Box sx={{ pt: 2.5, pb: 2, borderBottom: '1px solid #E5E7EB' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          {/* <Typography sx={{ color: theme.palette.primary.main, fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            Paso 2 de 2
          </Typography> */}
          <Typography
            sx={{ color: '#9CA3AF', fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
          >
            100% completado
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={100}
          sx={{
            height: 8,
            borderRadius: 999,
            backgroundColor: '#E8EAF8',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.main,
              borderRadius: 999,
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3.5, pb: 1 }}>
        <Box
          sx={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            backgroundColor: '#ECE9FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2.5,
          }}
        >
          <VerifiedIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />
        </Box>

        <Typography sx={{ color: '#6B7280', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
          Anfitrion JOM
        </Typography>

        <Typography
          align="center"
          sx={{
            color: '#1F2937',
            fontWeight: 800,
            fontSize: { xs: '1.6rem', sm: '1.9rem' },
            lineHeight: 1.1,
            mb: 1.5,
          }}
        >
          ¡Tu cuenta está verificada!
        </Typography>

        <Typography
          align="center"
          sx={{
            color: '#6B7280',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            lineHeight: 1.55,
            maxWidth: 440,
          }}
        >
          Ya eres parte de la comunidad de anfitriones JOM. Ahora puedes publicar tu primer espacio
          y comenzar a recibir huéspedes.
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          mt: 3,
          borderRadius: 3,
          border: '1px solid #E5E7EB',
          backgroundColor: '#F8FAFC',
        }}
      >
        <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.2 }}>
          {[
            {
              icon: <TaskAltIcon sx={{ fontSize: 26, color: '#22C55E' }} />,
              iconBg: '#DCFCE7',
              title: 'Identidad verificada',
              description: 'Tu documento fue validado correctamente',
            },
            {
              icon: (
                <OtherHousesOutlinedIcon sx={{ fontSize: 26, color: theme.palette.primary.main }} />
              ),
              iconBg: '#ECE9FF',
              title: 'Listo para publicar anuncios',
              description: 'Crea y gestiona tus propiedades sin restricciones',
            },
            {
              icon: (
                <PaymentsOutlinedIcon sx={{ fontSize: 26, color: theme.palette.primary.main }} />
              ),
              iconBg: '#ECE9FF',
              title: 'Cobros habilitados',
              description: 'Recibe pagos de tus huéspedes de forma segura',
            },
          ].map((item, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.8, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  backgroundColor: item.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: '#1F2937',
                    fontWeight: 700,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    mb: 0.3,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: '#6B7280',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    lineHeight: 1.4,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
      {isHostAuthenticated && (
        <Button
          fullWidth
          sx={{
            mt: 3,
            minHeight: 56,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            textTransform: 'none',
            color: '#FFFFFF',
            backgroundColor: theme.palette.primary.main,
            '&:hover': { backgroundColor: theme.palette.primary.dark },
          }}
        >
          Crear mi primer anuncio
        </Button>
      )}

      {isHostAuthenticated && (
        <Button
          fullWidth
          sx={{
            mt: 1.5,
            minHeight: 52,
            borderRadius: 3,
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            textTransform: 'none',
            color: '#1F2937',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            '&:hover': { backgroundColor: '#F8FAFC' },
          }}
        >
          Ir al panel de control
        </Button>
      )}
    </Box>
  );

  const renderError = () => (
    <>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t('identityVerification.error.title')}
      </Typography>
      <Typography gutterBottom>{t('identityVerification.error.mainText')}</Typography>
      <Box textAlign="center" mt={2}>
        <img
          src={noOkVerificacionIdentidad}
          alt="Error en verificación"
          style={{ maxWidth: 200 }}
        />
      </Box>
      <Typography variant="h6" mt={2}>
        {t('identityVerification.error.subTitle')}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {t('identityVerification.error.subText')}
      </Typography>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="primary">{t('identityVerification.error.retryBtn')}</Button>
        <Button variant="primary">{t('identityVerification.error.supportBtn')}</Button>
      </Box>
    </>
  );

  const renderInitialLoader = () => (
    <Box
      sx={{
        px: { xs: 0.5, sm: 1 },
        pb: 1,
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          mb: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#6B7280',
            fontWeight: 700,
            letterSpacing: 0.2,
            fontSize: { xs: '1.2rem', sm: '1.2rem' },
          }}
        >
          JOM · Seguridad
        </Typography>
        {onClose && (
          <Button
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 0,
              minWidth: 'auto',
              padding: 1,
              color: '#6B7280',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#1F2937',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 8, mb: 2, px: 1 }}>
        <Typography
          align="center"
          sx={{ color: '#1F2937', fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' }, mb: 2 }}
        >
          Cargando estado de verificacion...
        </Typography>
        <LinearProgress
          sx={{
            height: 8,
            borderRadius: 999,
            backgroundColor: '#E8EAF8',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.main,
              borderRadius: 999,
            },
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box p={2}>
      {/* <div>{`isIOS=${isIOS}, isAndroid=${isAndroid}, isDesktop=${isDesktop}, isMobile=${isMobile}`}</div> */}
      {/* {status !== 'initial' && status !== 'document-upload' ? renderProgressBar() : null} */}
      {isInitializingVerification ? (
        renderInitialLoader()
      ) : (
        <>
          {status === 'initial' && renderInitial()}
          {/* {status === 'document-upload' && renderDocumentUpload()} */}
          {status === 'pending' && renderPending()}
          {status === 'success' && renderSuccess()}
          {status === 'error' && renderError()}
        </>
      )}

      <AssertModal
        title={
          currentUploadSide === 'front'
            ? getSelectedDocumentSideLabel('front') || t('identityVerification.modal.frontTitle')
            : getSelectedDocumentSideLabel('back') || t('identityVerification.modal.backTitle')
        }
        content={
          <UploadPhoto
            title={
              currentUploadSide === 'front'
                ? getSelectedDocumentSideLabel('front') ||
                  t('identityVerification.modal.frontDropzoneTitle')
                : getSelectedDocumentSideLabel('back') ||
                  t('identityVerification.modal.backDropzoneTitle')
            }
            subtitle={`${t('identityVerification.modal.dropzoneSubtitle')} ${getSelectedDocumentLabel() || selectedDocType?.name || ''}`}
            onFilesChange={handleFileUpload}
          />
        }
        showCloseLeft={false}
        showRightIcon
        open={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setCurrentUploadSide(null);
        }}
      />
    </Box>
  );
};

export default IdentityVerificationStatus;
