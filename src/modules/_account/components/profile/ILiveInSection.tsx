import AssertModal from '@/components/AssertModal';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import CitySearchForm from './CitySearchForm';

interface ProfileItemProps {
  icon: React.ReactNode;
  value?: string;
  aditionalId: number;
  cityId?: number;
  liveAtShow?: string;
  liveAtType?: number;
}

const ILiveInSection: React.FC<ProfileItemProps> = ({
  icon,
  value,
  aditionalId,
  cityId,
  liveAtShow,
  liveAtType = 1,
}) => {
  const { t } = useTranslation();
  const [openAboutSpace, setOpenAboutSpace] = useState(false);
  const [dataItem, setDataItem] = useState(value);
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(cityId);
  const [selectedLiveAtShow, setSelectedLiveAtShow] = useState<string | undefined>(liveAtShow);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (!isUpdated) {
      setDataItem(value);
      setSelectedCityId(cityId);
      setSelectedLiveAtShow(liveAtShow);
    }
  }, [value, cityId, liveAtShow, isUpdated]);

  const handleSave = async (locationData: { label: string; cityId: number }) => {
    setDataItem(locationData.label);
    setSelectedCityId(locationData.cityId || undefined);
    setSelectedLiveAtShow(locationData.label || undefined);
    setIsUpdated(true);
    setOpenAboutSpace(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 1,
          borderBottom: '1px solid #000',
        }}
        onClick={() => setOpenAboutSpace(true)}
      >
        <Box sx={{ minWidth: '32px', display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Box sx={{ ml: 2, flexGrow: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {`${t('myProfile.myProfilePage.iLiveIn.title')}:`}
          </Typography>
          {isUpdated
            ? dataItem && (
                <Typography variant="body2" color="text.secondary">
                  {dataItem}
                </Typography>
              )
            : value && (
                <Typography variant="body2" color="text.secondary">
                  {value}
                </Typography>
              )}
        </Box>
      </Box>
      <AssertModal
        title={''}
        content={
          <CitySearchForm
            initialId={aditionalId}
            onSave={handleSave}
              initialCityId={selectedCityId}
              initialLiveAtShow={selectedLiveAtShow}
            initialType={liveAtType}
          />
        }
        open={openAboutSpace}
        showCloseLeft={false}
        onClose={() => setOpenAboutSpace(false)}
        rightIcon={<CloseIcon />}
        showRightIcon={true}
      />
    </>
  );
};

export default ILiveInSection;
