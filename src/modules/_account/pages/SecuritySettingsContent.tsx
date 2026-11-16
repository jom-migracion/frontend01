import React from 'react';
import { Box, Typography } from '@mui/material';
import PasswordChangeSection from '../components/PasswordChangeSection';
// import { styled } from '@mui/material/styles';
// import DeactivationReasonModal from '../components/profile/DeactivationReasonModal';
// import DeactivationConfirmationModal from '../components/profile/DeactivationConfirmationModal';
// import { useGet } from '@/hooks/api';
// import { RestClient } from '@/services/RestClient';
// import { useSnackbar } from '@/context/SnackbarContext';
import { useTranslation } from 'react-i18next';
// import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';

// const StyledPaper = styled(Paper)(() => ({
//   border: 0,
//   boxShadow: 'none',
//   borderBottom: '1px solid #ccc',
//   paddingBottom: '20px',
//   borderRadius: 0,
// }));

// const SectionHeader = styled(Typography)(() => ({
//   fontWeight: 600,
// }));

// const FieldContainer = styled(Box)(() => ({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   border: 0,
// }));

const SecuritySettingsContent: React.FC = () => {
  // const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  // const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  // const [selectedReason, setSelectedReason] = useState<any>(null);
  // const [loading, setLoading] = useState(false);
  // const showSnackbar = useSnackbar();
  // const dataUser: any = localStorage.getItem('auth-store');
  // const parsed = JSON.parse(dataUser ?? '{}');
  const { t } = useTranslation();

  // const { data: paramOption } = useGet<any>('ParamOption', '/GetUserSelectionOptions');
  // const { data: paramAccountClosed, refetch: refetchAccountClosed } = useGet<any>(
  //   'ParamAccountClosed',
  //   '/GetUserAccountClosed'
  // );
  // const handleConfirmReason = (reason: any) => {
  //   setSelectedReason(reason);
  //   setIsConfirmationModalOpen(true);
  // };

  // const handleFinalConfirm = () => {
  //   let userAccountClosedId = 0;
  //   let userSelectionOptionsId = 0;
  //   if (selectedReason?.userSelectionOptionsId > 0) {
  //     userSelectionOptionsId = selectedReason?.userSelectionOptionsId;

  //     setLoading(true);

  //     RestClient.post(
  //       `/CloseUserAccount?userAccountClosedId=${userAccountClosedId}&userSelectionOptionsId=${userSelectionOptionsId}`
  //     )
  //       .then((x: any) => {
  //         if (x?.data?.statusCode == '200') {
  //           showSnackbar('Su cuenta fue desactivada.', 'success');
  //           setIsConfirmationModalOpen(false);
  //           refetchAccountClosed();
  //         }
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error('Error closing account:', error);
  //         showSnackbar('Ops, ocurrió un error al desactivar la cuenta', 'error');
  //         setLoading(false);
  //       });
  //   }
  // };

  // const handleActiveAccount = () => {
  //   let userAccountClosedId = 0;
  //   if (paramAccountClosed?.data?.userAccountClosedId > 0) {
  //     setLoading(true);
  //     userAccountClosedId = paramAccountClosed?.data?.userAccountClosedId;
  //     RestClient.put(`/RestoreUserAccount/${userAccountClosedId}`)
  //       .then((x: any) => {
  //         if (x?.data?.statusCode == '200') {
  //           showSnackbar('Su cuenta ya fue activada', 'success');
  //           refetchAccountClosed();
  //         }
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error('Error closing account:', error);
  //         showSnackbar('Ops, ocurrió un error al activar la cuenta', 'error');
  //         setLoading(false);
  //       });
  //   }
  // };

  const handleEmergencyContactSave = async (
    id: number,
    name: string,
    relationship: string,
    email: string
  ) => {
    console.log('Save...', id, name, relationship, email);
  };

  return (
    <Box>
      {/* {<LoadingThreeDotsJumping open={loading} modal={true} />} */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t('securitySettings.title')}
      </Typography>
      <PasswordChangeSection initialId={0} onSave={handleEmergencyContactSave} />
      {/* {paramOption?.data?.length > 0 && (
        <StyledPaper>
          <SectionHeader variant="h6">
            {t('securitySettings.deactivateAccount.sectionTitle')}
          </SectionHeader>
          <FieldContainer>
            <Typography variant="body1" color="textSecondary">
              {t('securitySettings.deactivateAccount.sectionMessage')}
            </Typography>
            {paramAccountClosed?.data?.userAccountClosedId > 0 ? (
              <Button
                onClick={handleActiveAccount}
                component="button"
                sx={{
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  borderBottom: '1px solid black',
                  borderRadius: 0,
                  fontWeight: 'normal',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                  color: 'primary.main',
                }}
              >
                {t('commonNames.activate')}
              </Button>
            ) : (
              <Button
                onClick={() => setIsReasonModalOpen(true)}
                component="button"
                sx={{
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  borderBottom: '1px solid black',
                  borderRadius: 0,
                  fontWeight: 'normal',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                  color: 'primary.main',
                }}
              >
                {t('commonNames.deactivate')}
              </Button>
            )}
          </FieldContainer>
        </StyledPaper>
      )} */}
      {/* <DeactivationReasonModal
        open={isReasonModalOpen}
        onClose={() => setIsReasonModalOpen(false)}
        onConfirm={handleConfirmReason}
        options={paramOption?.data || []}
      />
      <DeactivationConfirmationModal
        open={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleFinalConfirm}
        userEmail={parsed.state?.user || ''}
      /> */}
    </Box>
  );
};

export default SecuritySettingsContent;
