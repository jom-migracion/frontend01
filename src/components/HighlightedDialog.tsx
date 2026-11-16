import { amenityIconMap } from '@/assets/amenitiesIcons';
import theme from '@/themes/theme';
import { Grid2, List, ListItem, ListItemText, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';
import CustomDialog from './CustomDialog';

interface Highlighted {
  value: string | null;
  code: string | null;
  name: string;
  featuredAspectTypeId: number;
}

const HighlightedDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  highlighted: Highlighted[];
}> = ({ open, onClose, highlighted }) => {
  return (
    <>
      <CustomDialog isOpen={open} onClose={onClose} title="Servicios destacados" maxWidth="sm">
        {highlighted.length === 0 ? (
          <Typography sx={{ fontSize: '0.8rem', color: grey[600] }}>
            Sin servicios disponibles
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            <Grid2 container spacing={2}>
              {highlighted.map((item, index) => {
                const cleanType =
                  item.name
                    ?.replace(/\r?\n|\r/g, '')
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()) || '';
                const IconComponent = cleanType ? amenityIconMap[cleanType] : undefined;

                return (
                  <Grid2 size={{ xs: 6 }} key={index}>
                    <ListItem sx={{ p: 0, py: 0.5, display: 'flex', alignItems: 'center' }}>
                      {IconComponent && (
                        <IconComponent size={24} color="#6B7280" style={{ paddingRight: '8px' }} />
                      )}
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontFamily: theme.typography.body1,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {item.name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Grid2>
                );
              })}
            </Grid2>
          </List>
        )}
      </CustomDialog>
    </>
  );
};

export default HighlightedDialog;
