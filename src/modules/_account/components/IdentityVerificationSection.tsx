import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Modal,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import IdentityVerificationStatus from './IdentityVerificationStatus';
import { useAuthStore } from '@/store/auth.store';

// --- Styled Components ---
const StyledPaper = styled(Paper)(() => ({
  border: 0,
  boxShadow: 'none',
  borderBottom: '1px solid #ccc',
  paddingBottom: '20px',
  borderRadius: 0,
}));

const SectionHeader = styled(Typography)(() => ({
  fontWeight: 600,
}));

const FieldContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: 0,
}));

interface IdentityVerificationSectionProps {
  autoOpen?: boolean;
}

type VerificationStatus = 'initial' | 'document-upload' | 'pending' | 'success' | 'error';

// --- LegalNameSection Component ---
const IdentityVerificationSection: React.FC<IdentityVerificationSectionProps> = ({ autoOpen = false }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<VerificationStatus>('initial');
  const { t } = useTranslation();
  const identifier = useAuthStore((state) => state.identifier);
  const userId = identifier;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (autoOpen) {
      setOpenModal(true);
    }
  }, [autoOpen]);

  // const handleOpenForm = () => {
  //   setShowForm(true);
  // };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <StyledPaper>

      {!showForm ? (
        <>
          <SectionHeader variant="h6">{t("accountSettings.personalInformation.identityVerification.title")}</SectionHeader>
          <FieldContainer>
            <Typography variant="body1" color="textSecondary">
              {t("accountSettings.personalInformation.identityVerification.default")}
            </Typography>
            <Button
              onClick={() => setOpenModal(true)}
              variant="text"
              sx={{
                textTransform: 'none', // Esto previene que el texto se ponga en mayúsculas
                fontSize: '1.1rem', // Makes the text larger
                borderBottom: '1px solid black', // Adds a 1px solid black border at the bottom
                borderRadius: 0,
                fontWeight: 'normal',
              }}
            >
              {t("commonNames.verify")}
            </Button>
          </FieldContainer>
         
        </>
      ) : (
        <>
          <FieldContainer>
            <SectionHeader variant="h6">{t("accountSettings.personalInformation.identityVerification.title")}</SectionHeader>
            <Button 
              variant="text"
              onClick={handleCancel} 
              sx={{
                textTransform: 'none', // Esto previene que el texto se ponga en mayúsculas
                fontSize: '1.1rem', // El tamanio del texto
                borderBottom: '1px solid black', // interlineado sobre el boton
                borderRadius: 0,
                fontWeight: 'normal',
              }}
            >
              {t("commonNames.cancel")}
            </Button>
          </FieldContainer>
          <Typography variant="body1" color="textSecondary">
            {t("accountSettings.personalInformation.identityVerification.default")}
          </Typography>
        </>
      )}
       <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setModalStatus('initial');
          }}
        >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? { xs: '90%', sm: '80%', md: '60%' } : (modalStatus === 'pending' ? 480 : { xs: '90%', sm: '80%', md: '60%' }),
                height: isMobile ? 'auto' : (modalStatus === 'pending' ? 490 : 'auto'),
                maxHeight: isMobile ? '95vh' : (modalStatus === 'pending' ? 310 : '95vh'),
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 2,
                borderRadius: 2,
                overflowY: isMobile ? 'auto' : (modalStatus === 'pending' ? 'hidden' : 'auto'),
              }}
            >
              <IdentityVerificationStatus
                IdUser={userId}
                onClose={() => setOpenModal(false)}
                onStatusChange={setModalStatus}
              />
            </Box>
        </Modal>
    </StyledPaper>
  );
};

export default IdentityVerificationSection;