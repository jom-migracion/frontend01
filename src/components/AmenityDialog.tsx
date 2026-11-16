import { amenityIconMap } from '@/assets/amenitiesIcons';
import theme from '@/themes/theme';
import Grid2 from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import React from 'react';
import CustomDialog from './CustomDialog';

interface Amenity {
  value: null | number;
  valueString: null | string;
  isPremium: boolean;
  typeCode: string;
  type: string;
  iconLink: string;
  amenitiesTypeId: number;
}

const AmenityDialog: React.FC<{ open: boolean; onClose: () => void; amenities: Amenity[] }> = ({
  open,
  onClose,
  amenities,
}) => {
  return (
    <>
      <CustomDialog isOpen={open} onClose={onClose} title="Servicios" maxWidth="sm">
        {amenities.length === 0 ? (
          <Typography sx={{ fontSize: '0.8rem', color: grey[600] }}>
            Sin servicios disponibles
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            <Grid2 container spacing={2}>
              {amenities.map((amenity, index) => {
                const cleanType =
                  amenity.valueString
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
                            {amenity.valueString}
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

export default AmenityDialog;
