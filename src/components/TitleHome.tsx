import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface TitleHomeProps {
  title: string;
  subTitle: string;
}

const TitleHome = ({ title, subTitle }: TitleHomeProps) => {
  const theme = useTheme();
  return (
    <Box sx={{ width: '100%', textAlign: 'center', mb: 3 }}>
      <Typography
        sx={{
          fontFamily: theme.typography.h3SRegular,
          color: theme.palette.customColors.primary[1],
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontFamily: theme.typography.paragraph1Regular,
          color: '#797878',
        }}
      >
        {subTitle}
      </Typography>
    </Box>
  );
};

export default TitleHome;
