import { Typography, Rating, Paper } from '@mui/material';

export const RatingSection = () => (
  <Paper
    elevation={1}
    sx={{
      mt: 4,
      mb: 3,
      p: 3,
      textAlign: 'center',
      borderRadius: 3,
    }}
  >
    <Typography variant="body1" mb={1}>
      Your review was submitted
    </Typography>
    <Rating value={2} readOnly />
  </Paper>
);
