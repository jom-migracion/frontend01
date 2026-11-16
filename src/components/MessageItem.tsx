import { formatDateDdMmYyyy } from "@/common/util/dateFunctions";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export interface MessageItemProps {
  id: string;
  name: string;
  avatarUrl?: string;
  message: string;
  date: string;
}

interface MessageItemComponentProps extends MessageItemProps {
  onView: (id: string) => void;
}

export const MessageItem: React.FC<MessageItemComponentProps> = ({
  id,
  name,
  avatarUrl,
  message,
  date,
  onView,
}) => {

  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.8fr) 180px 130px' },
        alignItems: 'center',
      }}
    >
      {/* Avatar + Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 2,
          minWidth: 0,
        }}
      >
        <Avatar src={avatarUrl}>{name[0]}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight="bold">{name}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {message}
          </Typography>
          {/* {location && (
            <Typography variant="caption" color="text.secondary">
              {location}
            </Typography>
          )} */}
        </Box>
      </Box>
      {/* Fecha */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', md: 'center' },
          px: 2,
          py: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {formatDateDdMmYyyy(date)}
        </Typography>
      </Box>

      {/* Botón */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', md: 'center' },
          px: 2,
          py: 2,
        }}
      >
        <Button
          variant="contained"
          size="small"
          sx={{ borderRadius: '20px', textTransform: 'none' }}
          onClick={() => onView(id)}
        >
          {t('MessageItem.seeBtn', {
              defaultValue: 'verrr',
          })}
        </Button>
      </Box>
    </Box>
  );
};
