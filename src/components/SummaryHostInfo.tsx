import { Avatar, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface SummaryHostInfoProps {
  title?: string;
  location?: string;
  hostName?: string;
  hostingTime?: string;
  avatarUrl?: string;
  onReviewsClick?: () => void;
}

const SummaryHostInfo: React.FC<SummaryHostInfoProps> = ({
  title,
  location,
  hostName,
  hostingTime,
  avatarUrl,
  onReviewsClick: scrollToSection,
}) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ py: 2 }}>
      {/* Título Principal con color Slate-900 */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
        {`${title} - ${location}`}
      </Typography>
      {/* Tarjeta del Anfitrión */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        onClick={scrollToSection}
        sx={{
          cursor: scrollToSection ? 'pointer' : 'default',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={avatarUrl}
            alt={hostName}
            sx={{
              width: 52,
              height: 52,
              border: '2px solid #fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          />
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '1.05rem',
              color: '#1e293b',
              lineHeight: 1.2,
            }}
          >
            {`${t('SummaryHostInfo.host')}: ${hostName}`}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: '#64748b',
              mt: 0.3,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
          {location} 
          </Typography>
          <Typography
            sx={{
              fontSize: '0.875rem',
              color: '#64748b',
              mt: 0.3,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <span>✨</span> {hostingTime}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SummaryHostInfo;
