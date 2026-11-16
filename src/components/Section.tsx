import countTextLines from '@/utilities/countTextLines';
import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import CustomDialog from './CustomDialog';
import { useTranslation } from 'react-i18next';
import { securityIconMap, cancellationPolicyIconMap } from '@/assets/amenitiesIcons';
import theme from '@/themes/theme';

interface SectionProps {
  name: string;
  title: string;
  content: string;
  emptyMessage: string;
  code?: string;
}

const Section: React.FC<SectionProps> = ({ title, content, emptyMessage, code, name }) => {
  const DynamicIcon = code
    ? (securityIconMap[code.trim()] ?? cancellationPolicyIconMap[code.trim()])
    : undefined;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (containerRef.current && content) {
      const lines = countTextLines(
        content,
        containerRef.current.offsetWidth,
        getComputedStyle(containerRef.current).font
      );
      setShowButton(lines > 3);
    }
  }, [content]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.5rem' }}>
          {title}
        </Typography>
      </Box>

      <Box mt={2} ref={containerRef} sx={{ display: 'flex', gap: 2 }}>
        <Box display={'flex'} gap={2}>
          <Box display={'flex'} justifyContent={'flex-end'} mt={0.5}>
            {DynamicIcon ? (
              <DynamicIcon style={{ color: '#64748b', fontSize: '1rem', flexShrink: 0 }} />
            ) : (
              <LocalPoliceOutlinedIcon sx={{ color: '#64748b', fontSize: '1rem', flexShrink: 0 }} />
            )}
          </Box>
          <Typography
            sx={{
              color: content ? '#475569' : '#94a3b8',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '1rem',
            }}
          >
            {content || emptyMessage}
          </Typography>
        </Box>
      </Box>

      {showButton && (
        <Box mt={2}>
          <Button
            variant="text"
            onClick={() => setIsModalOpen(true)}
            sx={{
              p: 0,
              textDecoration: 'none',
              minWidth: 0,
              fontSize: '0.9rem',
              textTransform: 'none',
              color: theme.palette.primary.main,
            }}
          >
            {t('section.showMore')}
          </Button>
        </Box>
      )}

      <CustomDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={title}>
        <Box sx={{ py: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              p: 2,
              borderRadius: '12px',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#f1f5f9',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: '10px',
                p: 1,
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              {DynamicIcon ? (
                <DynamicIcon style={{ color: '#334155', fontSize: '1.2rem', flexShrink: 0 }} />
              ) : (
                <LocalPoliceOutlinedIcon
                  sx={{ color: '#334155', fontSize: '1.2rem', flexShrink: 0 }}
                />
              )}
            </Box>
            <Box display={'flex'} flexDirection="column" gap={1}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                {name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#334155',
                  lineHeight: 1.6,
                  fontWeight: 500,
                  pt: 0.5,
                }}
              >
                {content}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CustomDialog>
    </Box>
  );
};

export default Section;
