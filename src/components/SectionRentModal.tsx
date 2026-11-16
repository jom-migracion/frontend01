import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import { Box, Button, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import CustomDialog from './CustomDialog';
import { useTranslation } from 'react-i18next';
import { securityIconMap, rentRulesIconMap } from '@/assets/amenitiesIcons';
import { theme } from '@/themes/theme';

interface RentRules {
  code: string;
  name: string;
  description: string;
}

interface SectionProps {
  title: string;
  content: RentRules[];
  emptyMessage: string;
}

const SectionRentModal: React.FC<SectionProps> = ({ title, content, emptyMessage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.5rem' }}>
          {title}
        </Typography>
      </Box>
      {content.length > 0 ? (
        <Box mt={2} ref={containerRef} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {content.slice(0, 3).map((item, index) => {
            const code = item.code?.trim();
            const Icon = rentRulesIconMap[code] ?? securityIconMap[code];
            return (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                {Icon ? (
                  <Icon style={{ color: '#64748b', fontSize: '1rem', flexShrink: 0, marginTop: '4px' }} />
                ) : (
                  <LocalPoliceOutlinedIcon
                    sx={{ color: '#64748b', fontSize: '1rem', flexShrink: 0, marginTop: '4px' }}
                  />
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <Typography
                    sx={{
                      color: content ? '#475569' : '#94a3b8',
                      fontSize: '1rem',
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.name}
                  </Typography>
                  {item.description && (
                    <Typography
                      sx={{
                        color: '#64748b',
                        fontSize: '0.75rem',
                        marginTop: '2px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {item.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box mt={2} ref={containerRef} sx={{ display: 'flex', gap: 2 }}>
          <Box display={'flex'} gap={2}>
            <Box display={'flex'} justifyContent={'flex-end'} mt={0.5}>
              <LocalPoliceOutlinedIcon sx={{ color: '#64748b', fontSize: '1rem', flexShrink: 0 }} />
            </Box>
            <Typography
              sx={{
                color: content ? '#475569' : '#94a3b8',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: '1rem',
                wrap: 'wrap',
              }}
            >
              {emptyMessage}
            </Typography>
          </Box>
        </Box>
      )}
      {content.length > 3 && (
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, py: 1 }}>
          {content.map((element: RentRules, index: number) => {
            const code = element.code?.trim();
            const Icon = rentRulesIconMap[code] ?? securityIconMap[code];

            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  borderRadius: '12px',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                  {Icon ? (
                    <Icon style={{ color: '#475569', fontSize: '1.2rem', flexShrink: 0 }} />
                  ) : (
                    <LocalPoliceOutlinedIcon
                      sx={{ color: '#475569', fontSize: '1.2rem', flexShrink: 0 }}
                    />
                  )}
                </Box>

                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      color: '#334155',
                      lineHeight: 1.2,
                    }}
                  >
                    {element.name}
                  </Typography>
                  {element.description && (
                    <Typography
                      variant="caption"
                      sx={{ color: '#64748b', display: 'block', mt: 0.5 }}
                    >
                      {element.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </CustomDialog>
    </Box>
  );
};

export default SectionRentModal;
