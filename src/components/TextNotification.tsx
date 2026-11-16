import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from "react-i18next";
import { formatearFechaYHora } from "@/common/util/dateFunctions";

interface TextNotificationProps {
  id: number;
  title: string;
  message: string;
  date: string;
  onMarkAsRead: (id: number) => void; 
}

const TextNotification: React.FC<TextNotificationProps> = ({
  id,
  title,
  message,
  date,
  onMarkAsRead,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const { t } = useTranslation();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = () => {
    onMarkAsRead(id); 
    handleMenuClose();
  };
  

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <ListItemText
        disableTypography
        primary={
          <Typography sx={{fontFamily: theme.typography.paragraph1SMedium}}>
            {title}
          </Typography>
        }
        secondary={
          <Box>
            <Typography sx={{fontFamily: theme.typography.small1Regular}}>
              {message}
            </Typography>
            <br />
            <Typography sx={{fontFamily: theme.typography.small1Regular}}>
              {formatearFechaYHora(date)?.fecha}
            </Typography>
          </Box>
        }
      />

      <Box>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleMarkAsRead}>
          <Typography sx={{fontFamily: theme.typography.small1Regular}}>
            {t('notifications.textAction2')}
          </Typography>          
          </MenuItem>
        </Menu>
      </Box>
    </ListItem>
  );
};

export default TextNotification;
