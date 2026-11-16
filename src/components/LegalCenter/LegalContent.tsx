import { Box, Typography, useTheme } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router';

const LegalContent = ({ data }: { data: any }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const renderIcon = (iconName: string) => {
    const props = { sx: { fontSize: '18px' } };
    switch (iconName) {
      case 'gavel': return <GavelIcon {...props} />;
      case 'description': return <DescriptionOutlinedIcon {...props} />;
      case 'contract': return <ArticleOutlinedIcon {...props} />;
      case 'shield': return <ShieldOutlinedIcon {...props} />;
      case 'payments': return <PaymentsOutlinedIcon {...props} />;
      case 'receipt_long': return <ReceiptLongOutlinedIcon {...props} />;
      case 'handshake': return <HandshakeOutlinedIcon {...props} />;
      case 'event_busy': return <EventBusyOutlinedIcon {...props} />;
      case 'block': return <BlockOutlinedIcon {...props} />;
      case 'accessible': return <AccessibleOutlinedIcon {...props} />;
      case 'security': return <SecurityOutlinedIcon {...props} />;
      case 'balance': return <BalanceOutlinedIcon {...props} />;
      default: return <DescriptionOutlinedIcon {...props} />;
    }
  };

  const handleNavigation = (url: string) => {
    if (url && url !== '#') navigate(url);
  };

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Caja de Aviso Superior */}
      <Box sx={{ bgcolor: '#EFF6FF', borderLeft: `3px solid ${theme.palette.primary.main}`, borderRadius: '0 8px 8px 0', p: '12px 16px', fontSize: '13px', color: '#1F2937', lineHeight: 1.6, mb: 4 }}>
        {data.noticeText}
      </Box>

      {/* Renderizado de Grupos */}
      {data.groups.map((group: any, index: number) => (
        <Box 
          key={group.id} id={group.id} 
          sx={{ 
            mb: 5,
            opacity: 0, animation: `fadeUp 0.35s ease forwards`, animationDelay: `${index * 0.05}s`,
            '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
          }}
        >
          <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.palette.text.secondary, mb: 1.25 }}>
            {group.title}
          </Typography>
          
          <Box sx={{ bgcolor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: '12px', overflow: 'hidden' }}>
            {group.links.map((link: any, lIndex: number) => (
              <Box 
                key={lIndex}
                onClick={() => handleNavigation(link.url)}
                sx={{ 
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, 
                  p: '14px 16px', borderBottom: lIndex !== group.links.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                  textDecoration: 'none', cursor: link.url !== '#' ? 'pointer' : 'default',
                  transition: 'background 0.12s, color 0.12s',
                  '&:hover': { bgcolor: link.url !== '#' ? theme.palette.background.default : 'transparent' },
                  '&:hover .hubRight': { color: link.url !== '#' ? theme.palette.text.primary : theme.palette.text.secondary }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, minWidth: 0 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '10px', border: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.background.paper, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {renderIcon(link.icon)}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: theme.palette.text.primary, lineHeight: 1.4 }}>{link.title}</Typography>
                    <Typography sx={{ fontSize: '13px', color: theme.palette.text.secondary, lineHeight: 1.55, mt: 0.5 }}>{link.desc}</Typography>
                  </Box>
                </Box>
                
                {link.url !== '#' && (
                  <Box className="hubRight" sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0.5, color: theme.palette.text.secondary, fontSize: '12px', fontWeight: 500, transition: 'color 0.12s' }}>
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>{data.viewBtn}</Typography>
                    <ChevronRightIcon sx={{ fontSize: '18px' }} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default LegalContent;