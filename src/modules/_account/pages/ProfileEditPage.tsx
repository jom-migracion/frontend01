import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PetsIcon from '@mui/icons-material/Pets';
import LanguageIcon from '@mui/icons-material/Language';
import MapIcon from '@mui/icons-material/Map';
import CakeIcon from '@mui/icons-material/Cake';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import WhatIDoSection from '../components/profile/WhatIDoSection';
import { useTranslation } from 'react-i18next';
import { ProfileAditionalInfo } from '@/components/ProfileAditionalInfo';
import { usePost } from '@/hooks/api';
import WhereToGoSection from '../components/profile/WhereToGoSection';
import PetsSection from '../components/profile/PetsSection';
import BirthdaySection from '../components/profile/BirthdaySection';
import LanguagesSection from '../components/profile/LanguagesSection';
import ILiveInSection from '../components/profile/ILiveInSection';
import AboutMeSection from '../components/profile/AboutMeSection';
import AssertModal from '@/components/AssertModal';
import UploadPhoto from '../components/profile/UploadPhoto';
import { RestClient } from '@/services/RestClient';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { ProfileInfo } from '@/models/interfaces/ProfileInfo';
import { useAuthStore } from '@/store/auth.store';

const ProfileEditPage: React.FC = () => {
  const { t } = useTranslation();
  const authToken = useAuthStore((state) => state.userToken);
  const [userData, setUserData] = useState<any>();
  const [isUploading, setIsUploading] = useState(false);
  const [srcAvatar, setSrcAvatar] = useState('');
  const { mutate: ProfileAditionalInfoPost } = usePost<ProfileAditionalInfo>(
    '/GetAdditionalProfileData'
  );
  const [openModalAssert, setOpenModalAssert] = useState(false);

  useEffect(() => {
    handleSubmitListingRent();
  }, []);

  const handleSubmitListingRent = async () => {
    ProfileAditionalInfoPost(
      {},
      {
        onSuccess: (responseData) => {
          setUserData(responseData?.data || null);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  const { mutate: ProfileInfoPost } = usePost<ProfileInfo>('/GetProfile');

  useEffect(() => {
    handleGetProfile();
  }, []);

  const handleGetProfile = async () => {
    ProfileInfoPost(
      {},
      {
        onSuccess: (responseData) => {
          setSrcAvatar(
            responseData?.data?.avatar?.replace(
              'https://localhost:44317',
              'https://assert-ui.netlify.app'
            ) || ''
          );
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  };

  const handleNewModalFiles = async (newFile: File | null) => {
    setIsUploading(true);
    if (newFile) {
      try {
        const dataToSend = new FormData();
        dataToSend.append('ProfilePhoto', newFile);
        const response = await RestClient.post('/UpdateProfilePhoto', dataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const newPhotoUrl = response.data.data.replace(
          'https://localhost:44317',
          'https://assert-ui.netlify.app/'
        );
        setSrcAvatar(newPhotoUrl);
        localStorage.setItem('userPhoto', newPhotoUrl);
        // Update Zustand store so Navbar avatar reflects the change immediately
        useAuthStore.getState().login(authToken ?? '', newPhotoUrl);
        window.dispatchEvent(new CustomEvent('profilePhotoUpdated', { detail: newPhotoUrl }));
        setIsUploading(false);
        setOpenModalAssert(false);
        handleSubmitListingRent();
      } catch (error: any) {
        setIsUploading(false);
      }
    }
  };

  const liveAtShow = (userData?.liveAt?.liveAtShow?.split('-')[0] || '').trim();

  return (
    <Box p={6}>
      {<LoadingThreeDotsJumping open={isUploading} modal={true} />}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Box display="grid" justifyContent="center" alignItems="center">
            <Avatar alt="Host" src={srcAvatar} sx={{ width: 240, height: 240 }} />
            <Button
              variant="secondary"
              sx={{ mt: 2, borderRadius: '20px', textTransform: 'none', px: 4 }}
              onClick={() => setOpenModalAssert(true)}
            >
              {t('commonNames.edit')} <PhotoCameraOutlinedIcon />
            </Button>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Box sx={{ p: { xs: 1, md: 3 }, backgroundColor: 'white' }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              {t('myProfile.myProfilePage.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('myProfile.myProfilePage.message')}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <WhatIDoSection
                  icon={<PersonOutlineIcon color="action" />}
                  value={userData?.whatIDo || ''}
                  aditionalId={parseInt(userData?.additionalProfileDataId || 0)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <WhereToGoSection
                  icon={<MapIcon color="action" />}
                  value={userData?.wantedToGo || ''}
                  aditionalId={parseInt(userData?.additionalProfileDataId || 0)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <PetsSection
                  icon={<PetsIcon color="action" />}
                  value={userData?.pets || ''}
                  aditionalId={parseInt(userData?.additionalProfileDataId || 0)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <BirthdaySection
                  icon={<CakeIcon color="action" />}
                  value={userData?.birthday || ''}
                  aditionalId={parseInt(userData?.additionalProfileDataId || 0)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LanguagesSection
                  icon={<LanguageIcon color="action" />}
                  value={userData?.languages}
                  aditionalId={parseInt(userData?.additionalProfileDataId || 0)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <ILiveInSection
                  icon={<PlaceOutlinedIcon color="action" />}
                  value={liveAtShow}
                  aditionalId={parseInt(userData?.additionalProfileDataId || 0)}
                  cityId={userData?.liveAt?.cityId}
                  liveAtShow={liveAtShow}
                  liveAtType={userData?.liveAt?.type ?? 1}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12 }}>
                <AboutMeSection
                  value={userData?.introduceYourself || ''}
                  aditionalId={parseInt(userData?.additionalProfileDataId || 0)}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <AssertModal
        title={t('myProfile.myProfilePage.uploadTitle')}
        content={
          <UploadPhoto
            title={t('myProfile.myProfilePage.dropTitle')}
            subtitle={t('myProfile.myProfilePage.dropSubtitle')}
            onFilesChange={handleNewModalFiles}
          />
        }
        showCloseLeft={false}
        showRightIcon
        open={openModalAssert}
        onClose={() => setOpenModalAssert(false)}
      />
    </Box>
  );
};

export default ProfileEditPage;
