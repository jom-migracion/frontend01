import { Box, Typography, useTheme, Grid } from '@mui/material';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Nuevas importaciones para la lógica del chat
import { usePost } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { useNavigate } from 'react-router';

// --- NUEVAS IMPORTACIONES PARA EL LOGIN ---
import { useAuthContext } from '@/modules/_auth/context';
// IMPORTANTE: Ajusta esta ruta a donde realmente tengas tu componente SignInForm
import SignInForm from '../SignInForm';
import { useState } from 'react';
import { useConvertReservationStore } from '@/store/message.store';

const parseBoldText = (text: string, defaultColor: string, strongColor: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Typography key={index} component="strong" sx={{ fontWeight: 600, color: strongColor }}>
          {part.slice(2, -2)}
        </Typography>
      );
    }
    return (
      <Typography key={index} component="span" sx={{ color: defaultColor }}>
        {part}
      </Typography>
    );
  });
};

const ContactContent = ({ sections }: { sections: any[] }) => {
  const theme = useTheme();
  const showSnackbar = useSnackbar()
  const navigate = useNavigate();

  const { isGuestAuthenticated } = useAuthContext();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // API para iniciar el chat
  const { mutate: startConversationSupport, isPending } = usePost(
    `/Messaging/Conversations/Support`
  );
  const setStateConversationId = useConvertReservationStore(
    (state: any) => state.setStateConversationId
  );  

  const handleCardAction = (e: React.MouseEvent, action?: string) => {
    if (action === 'START_SUPPORT_CHAT') {
      e.preventDefault();

      if (!isGuestAuthenticated) {
        setIsLoginModalOpen(true);
        return;
      }

      startConversationSupport(
        {
          bookId: 0,
          messageTypeId: 0,
          body: 'Hola, necesito ayuda con... ',
        },
        {
          onSuccess: (onde:any) => {
            const conversationId = onde?.data?.conversationId;
            showSnackbar('Conversación iniciada con soporte JoM', 'success');
            if (conversationId){
              setStateConversationId(conversationId);
            }
            // redirigir al chat
            navigate('/host/messages');
          },
          onError: (error: any) => {
            showSnackbar(error?.response?.data?.message || 'Debes iniciar sesión para comenzar una conversación con soporte.', 'error');
          },
        }
      );
    }
  };

  const renderIcon = (name: string, props: any) => {
    switch (name) {
      case 'chat':
        return <ChatOutlinedIcon {...props} />;
      case 'mail':
        return <MailOutlinedIcon {...props} />;
      case 'phone':
        return <PhoneIphoneOutlinedIcon {...props} />;
      case 'weekend':
        return <WeekendOutlinedIcon {...props} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Indicador de carga mientras se crea el chat */}
      <LoadingThreeDotsJumping open={isPending} modal={true} />

      {sections.map((section, index) => (
        <Box
          key={section.id}
          id={section.id}
          sx={{
            py: 5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            '&:last-child': { borderBottom: 'none' },
            opacity: 0,
            animation: `fadeUp 0.35s ease forwards`,
            animationDelay: `${index * 0.05}s`,
            '@keyframes fadeUp': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 2.5,
              lineHeight: 1.3,
            }}
          >
            {section.title}
          </Typography>

          {section.type === 'channels' && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3 }}>
                <TipsAndUpdatesOutlinedIcon
                  sx={{ fontSize: '18px', color: theme.palette.primary.main, mt: 0.25 }}
                />
                <Typography
                  sx={{ fontSize: '14px', color: theme.palette.text.primary, lineHeight: 1.6 }}
                >
                  {parseBoldText(
                    section.intro,
                    theme.palette.text.primary,
                    theme.palette.primary.main
                  )}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {section.cards.map((card: any, i: number) => (
                  <Grid item xs={12} sm={6} lg={4} key={i}>
                    <Box
                      sx={{
                        bgcolor: '#fff',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '16px',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        height: '100%',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          boxShadow: `0 4px 16px ${theme.palette.primary.main}1A`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: theme.palette.softHighlight,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {renderIcon(card.icon, {
                          sx: { fontSize: '20px', color: theme.palette.primary.main },
                        })}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: theme.palette.primary.main,
                            opacity: 0.7,
                          }}
                        >
                          {card.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {card.title}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          color: theme.palette.text.secondary,
                          lineHeight: 1.5,
                          flexGrow: 1,
                        }}
                      >
                        {card.desc}
                      </Typography>
                      {card.icon === 'chat' ? (
                        <Box
                          //component="a"
                          component={card.action ? 'button' : 'a'}
                          //href={card.link}
                          href={card.action ? undefined : card.link}
                          onClick={(e: React.MouseEvent) => card.action && handleCardAction(e, card.action)}
                          //target={card.link.startsWith('http') ? "_blank" : "_self"} // Abre externos en nueva pestaña
                          //target="_blank"
                          target={card.action ? undefined : '_blank'}
                          //rel={card.link.startsWith('http') ? "noopener noreferrer" : ""} // Seguridad
                          //rel="noopener noreferrer"
                          rel={card.action ? undefined : 'noopener noreferrer'}
                          disabled={isPending && card.action === 'START_SUPPORT_CHAT'}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            bgcolor: theme.palette.primary.main,
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 600,
                            px: 2,
                            py: 1.25,
                            borderRadius: '12px',
                            textDecoration: 'none',
                            width: 'fit-content',

                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            opacity: (isPending && card.action === 'START_SUPPORT_CHAT') ? 0.7 : 1,

                            '&:hover': { bgcolor: theme.palette.primary.dark },
                          }}
                        >
                          <OpenInNewOutlinedIcon sx={{ fontSize: '16px' }} />
                          {card.cta}
                        </Box>
                      ) : (
                        <Box
                          component="a"
                          href={card.link}
                          //target={card.link.startsWith('http') ? "_blank" : "_self"}
                          target="_blank"
                          //rel={card.link.startsWith('http') ? "noopener noreferrer" : ""} // Seguridad
                          rel="noopener noreferrer"
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {card.cta}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {section.type === 'hours' && (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {section.rows.map((row: any, i: number) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 2,
                    borderBottom:
                      i !== section.rows.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                    pt: i === 0 ? 0 : 2,
                    pb: i === section.rows.length - 1 ? 0 : 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        bgcolor:
                          i === 0 ? theme.palette.softHighlight : theme.palette.background.default,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {renderIcon(row.icon, {
                        sx: {
                          fontSize: '15px',
                          color:
                            i === 0 ? theme.palette.primary.main : theme.palette.text.secondary,
                        },
                      })}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '14px',
                          color: theme.palette.text.primary,
                        }}
                      >
                        {row.title}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary }}>
                        {row.subtitle}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    {row.rightStatus && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          bgcolor: theme.palette.softHighlight,
                          border: `1px solid ${theme.palette.primary.main}40`,
                          borderRadius: '30px',
                          px: 1.5,
                          py: 0.5,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: theme.palette.primary.main,
                        }}
                      >
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            bgcolor: theme.palette.primary.main,
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.4 },
                            },
                          }}
                        />
                        {row.rightStatus}
                      </Box>
                    )}
                    {row.rightTop && (
                      <>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {row.rightTop}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: theme.palette.text.secondary }}>
                          {row.rightBottom}
                        </Typography>
                      </>
                    )}
                    {row.rightBadge && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          bgcolor: theme.palette.background.default,
                          border: `1px solid ${theme.palette.divider}`,
                          color: theme.palette.text.secondary,
                          fontSize: '12px',
                          fontWeight: 600,
                          px: 1.25,
                          py: 0.5,
                          borderRadius: '30px',
                        }}
                      >
                        <InfoOutlinedIcon sx={{ fontSize: '12px' }} />
                        {row.rightBadge}
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {section.type === 'office' && (
            <Box>
              <Box
                sx={{
                  bgcolor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `linear-gradient(${theme.palette.primary.main}0F 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.primary.main}0F 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                  }}
                />
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: theme.palette.primary.main,
                    borderRadius: '50% 50% 50% 0',
                    transform: 'rotate(-45deg)',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}59`,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      width: 14,
                      height: 14,
                      bgcolor: '#fff',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  p: 2,
                  bgcolor: theme.palette.background.default,
                  borderRadius: '12px',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <LocationOnOutlinedIcon
                  sx={{ fontSize: '18px', color: theme.palette.primary.main, mt: 0.25 }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      mb: 0.5,
                    }}
                  >
                    {section.addressLabel}
                  </Typography>
                  {section.addressLines.map((line: string, i: number) => (
                    <Typography
                      key={i}
                      sx={{ fontSize: '12px', color: theme.palette.text.primary, lineHeight: 1.6 }}
                    >
                      {line}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      ))}

      {/* Modal de login */}
      <SignInForm
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        typeLogin="login"
      />

    </Box>
  );
};

export default ContactContent;
