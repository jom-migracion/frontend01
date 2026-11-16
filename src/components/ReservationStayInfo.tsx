import React from 'react';
import { Box } from '@mui/material';
import HostInfoReservation from '@/components/HostInfoReservation';
import CheckInOutCard from '@/components/CheckInOutCard';
import HostContactLinks from '@/components/HostContactLinks';

interface ReservationStayInfoProps {
  owner?: {
    name?: string;
    lastName?: string;
    photoLink?: string;
  } | null;
  liveAtShow?: string | null;
  listingName?: string | null;
  listingId?: number | null;
  checkin?: string | null;
  checkout?: string | null;
  onMessageClick: () => void;
}

const ReservationStayInfo: React.FC<ReservationStayInfoProps> = ({
  owner,
  liveAtShow,
  listingName,
  listingId,
  checkin,
  checkout,
  onMessageClick,
}) => {
  const ownerName = `${owner?.name || ''} ${owner?.lastName || ''}`.trim();

  return (
    <>
      {/* Info alojamiento */}
      <Box mt={3}>
        <HostInfoReservation owner={owner} liveAtShow={liveAtShow} listingName={listingName} />
      </Box>

      {/* Check-in y Check-out */}
      <CheckInOutCard checkin={checkin} checkout={checkout} />

      {/* Mensaje anfitrión */}
      <HostContactLinks
        ownerName={ownerName}
        listingName={listingName}
        listingId={listingId}
        onMessageClick={onMessageClick}
      />
    </>
  );
};

export default ReservationStayInfo;
