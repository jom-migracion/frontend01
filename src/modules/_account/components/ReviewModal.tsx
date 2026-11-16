import React from 'react';
import ReviewCard from './ReviewCard';
import CustomDialog from '@/components/CustomDialog';
import { useTranslation } from 'react-i18next';

interface ReviewModalProps {
  open: boolean;
  data: any[];
  onClose: () => void;
  isHost: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, data }) => {
  const { t } = useTranslation();
  return (
    <CustomDialog isOpen={open} onClose={onClose} maxWidth="sm" title={t('reviewsModal.title')}>
      {data?.map((review, index) => <ReviewCard key={index} {...review} />)}
    </CustomDialog>
  );
};

export default ReviewModal;
