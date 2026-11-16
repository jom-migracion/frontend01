import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import { Box, Button, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import CustomDialog from './CustomDialog';
import { useTranslation } from 'react-i18next';
import { securityIconMap } from '@/assets/amenitiesIcons';
import { theme } from '@/themes/theme';

interface SecurityItems {
  code: string;
  name: string;
  description: string;
}

interface SectionProps {
  title: string;
  content: SecurityItems[];
  emptyMessage: string;
}

const SectionSecurityModal: React.FC<SectionProps> = ({ title, content, emptyMessage }) => {
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
            const Icon = securityIconMap[item.code?.trim()];
            return (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {Icon ? (
                  <Icon style={{ color: '#64748b', fontSize: '1rem', flexShrink: 0 }} />
                ) : (
                  <LocalPoliceOutlinedIcon
                    sx={{ color: '#64748b', fontSize: '1rem', flexShrink: 0 }}
                  />
                )}
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
                  {item.name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box mt={2} ref={containerRef} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 1 }}>
          {content.map((element: SecurityItems, index: number) => {
            const Icon = securityIconMap[element.code?.trim()];
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start', // Cambiado a start por si la descripción es larga
                  gap: 2,
                  p: 1.5,
                  borderRadius: '12px',
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
                    borderRadius: '10px', // Un poco menos redondeado para variar
                    p: 1,
                    mt: 0.2, // Ajuste para alinear con la primera línea de texto
                  }}
                >
                  {Icon ? (
                    <Icon style={{ color: '#334155', fontSize: '1.2rem', flexShrink: 0 }} />
                  ) : (
                    <LocalPoliceOutlinedIcon
                      sx={{ color: '#334155', fontSize: '1.2rem', flexShrink: 0 }}
                    />
                  )}
                </Box>

                <Box sx={{ pt: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                    {element.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5 }}>
                    {element.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CustomDialog>
    </Box>
  );
};

export default SectionSecurityModal;
