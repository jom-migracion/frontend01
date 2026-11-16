import BathtubIcon from '@mui/icons-material/Bathtub';
import GroupsIcon from '@mui/icons-material/Groups';
import KingBedIcon from '@mui/icons-material/KingBed';
import LockIcon from '@mui/icons-material/Lock';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ShowerIcon from '@mui/icons-material/Shower';
import WeekendIcon from '@mui/icons-material/Weekend';
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import CustomDialog from './CustomDialog';

interface RoomSpaceProps {
  bedrooms?: number;
  bathrooms?: number;
  beds?: number;
  sofaBeds?: number;
  privateBathroom?: number;
  privateBathroomLodging?: number;
  sharedBathroom?: number;
}

const RoomSpace = ({
  bedrooms,
  bathrooms,
  beds,
  sofaBeds,
  privateBathroom,
  privateBathroomLodging,
  sharedBathroom,
}: RoomSpaceProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const allItems = [
    { value: bedrooms, label: 'habitación(es)', Icon: MeetingRoomIcon },
    { value: bathrooms, label: 'baño(s)', Icon: BathtubIcon },
    { value: beds, label: 'cama(s)', Icon: KingBedIcon },
    { value: sofaBeds, label: 'sofá cama(s)', Icon: WeekendIcon },
    { value: privateBathroom, label: 'baño(s) privado(s)', Icon: ShowerIcon },
    {
      value: privateBathroomLodging,
      label: 'baño(s) privado(s) en el alojamiento',
      Icon: LockIcon,
    },
    { value: sharedBathroom, label: 'baño(s) compartido(s)', Icon: GroupsIcon },
  ].filter((item) => item.value !== undefined && item.value !== null && item.value > 0);

  const visibleItems = allItems.slice(0, 3);
  const hasMore = allItems.length > 3;

  return (
    <Box>
      <Grid container spacing={1.5} mt={0} mb={1}>
        {visibleItems.map((item, index) => {
          const { Icon } = item;
          return (
            <Grid
              size={{ xs: 6, sm: 4 }}
              key={index}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minHeight: 40,
                  pr: 1,
                }}
              >
                <Icon fontSize="small" color="action" sx={{ flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {item.value} {item.label}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {hasMore && (
        <Button sx={{ mt: 2 }} variant="secondary" onClick={() => setDialogOpen(true)}>
          Ver más
        </Button>
      )}

      <CustomDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Espacios"
        maxWidth="sm"
      >
        <List sx={{ p: 0 }}>
          <Grid container spacing={1}>
            {allItems.map((item, index) => {
              const { Icon } = item;
              return (
                <Grid size={{ xs: 6 }} key={index}>
                  <ListItem sx={{ p: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Icon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {item.value} {item.label}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Grid>
              );
            })}
          </Grid>
        </List>
      </CustomDialog>
    </Box>
  );
};

export default RoomSpace;
