import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';

interface MessageHostCardProps {
  hostName: string;
  hostId: string | number;
}

const MessageHostCard: React.FC<MessageHostCardProps> = ({ hostName, hostId }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/message-host/${hostId}`);
  };

  return (
    <Card sx={{ width: '100%', p: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton sx={{ backgroundColor: '#f0f0f0', borderRadius: '50%' }}>
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Box>
              <Typography variant="body1">Envía un mensaje al anfitrión</Typography>
              <Typography variant="body2" color="text.secondary">
                {hostName}
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" onClick={handleRedirect}>
            Ir al chat
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MessageHostCard;
