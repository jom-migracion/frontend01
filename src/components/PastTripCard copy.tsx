import { Avatar, Box, Card, CardContent, Stack, Typography } from '@mui/material';

interface ReviewCardProps {
  imageUrl: string;
  title: string;
  date: string;
  onClick?: () => void;
}

const PastTripCard: React.FC<ReviewCardProps> = ({ imageUrl, title, date, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 4,
        width: 440,
        boxShadow: 4,
        paddingBottom: 0,
        mb: 0,
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:last-child': {
            paddingBottom: '14px',
          },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: '0px' }}>
          <Avatar
            src={imageUrl}
            variant="rounded"
            sx={{ width: 65, height: 65, borderRadius: 2 }}
          />
          <Box sx={{ pb: '0px', mb: '0px' }}>
            <Typography fontWeight={600}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {date}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PastTripCard;
