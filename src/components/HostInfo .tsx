import { Avatar, Stack, Typography } from '@mui/material';

interface SummaryHostInfoProps {
  title?: string;
  location?: string;
  hostName?: string;
  hostingTime?: string;
  avatarUrl?: string;
}
 const HostInfo = ({
  // title,
  // location,
  hostName,
  hostingTime,
  avatarUrl
}: SummaryHostInfoProps) => {
  return (
  <Stack direction="row" spacing={2} alignItems="center" mt={2}>
    <Avatar src={avatarUrl} alt={hostName} />
    <Stack>
      <Typography fontWeight={600}>{hostName}</Typography>
      <Typography variant="body2" color="text.secondary">
        Anfitrión · {hostingTime} meses anfitrionando
      </Typography>
    </Stack>
  </Stack>
  )
};

export default HostInfo;
