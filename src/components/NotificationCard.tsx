import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  Divider,
  Box,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import TextNotification from './TextNotification';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';

interface NotificationCardProps {
  notifications: any[];
  handleMarkAsRead: (id: number) => void;
  handleMarkAllAsRead: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notifications, handleMarkAsRead, handleMarkAllAsRead }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [data, setData] = useState<any[]>(notifications);
  const isEmpty = data.length === 0;
  const open = Boolean(anchorEl);
  const theme = useTheme();

  // Actualizar el estado local cuando cambie el prop notifications
  useEffect(() => {
    setData(notifications || []);
  }, [notifications]);

  // agregar para traducir
  const { t } = useTranslation();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOnMarkAsRead = (id: number) => {
    setData((prev) => prev.filter((n) => n.id !== id));
    handleMarkAsRead(id);
  };

  const handleOnMarkAllAsRead = () => {
    //setData([]);
    handleMarkAllAsRead();
  };

  return (
    <Card
      sx={{
        p: 1,
        boxShadow: 'none',
        minHeight: isEmpty ? 320 : 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid transparent',
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ fontFamily: theme.typography.h5Medium }}>
          {t('notifications.title')}
        </Typography>

        {/* 🔹 Botón marcar todas */}
        {!isEmpty && (
          // <Button size="small" onClick={handleMarkAllAsRead}>
          //   ...{/* Marcar todas como leídas */}
          // </Button>
          // <IconButton onClick={handleMarkAllAsRead}>
          //   <MoreVertIcon />
          // </IconButton>
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={handleOnMarkAllAsRead}>
                <Typography sx={{ fontFamily: theme.typography.small1Regular }}>
                  {t('notifications.textAction')}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      {isEmpty ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            mb: 10,
          }}
        >
          <NotificationsNoneIcon
            sx={{ fontSize: 40, mb: 1, color: theme.palette.customColors.secondary[1] }}
          />
          <Typography sx={{ fontFamily: theme.typography.h5SMedium }}>
            {t('notifications.textNotifications')}
          </Typography>
          <Typography
            sx={{
              fontFamily: theme.typography.paragraph1SRegular,
              color: theme.palette.customColors.secondary[1],
            }}
          >
            {t('notifications.textBoard')}
          </Typography>
        </Box>
      ) : (
        <CardContent sx={{ width: '100%', p: 0 }}>
          <List>
            {data.map((n: any, index) => {
              const textNotification = {
                id: n.notificationId,
                title: n.title,
                message: n.messageBody,
                date: n.createdAt,
              }
              return (
                <React.Fragment key={n.notificationId}>
                  <TextNotification
                    {...textNotification}
                    onMarkAsRead={handleOnMarkAsRead}
                  />
                  {index < data.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </CardContent>
      )}
    </Card>
  );
};

export default NotificationCard;
