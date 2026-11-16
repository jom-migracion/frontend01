import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import React from 'react';
import Grid from '@mui/material/Grid2';
import { amenityIconMap } from '@/assets/amenitiesIcons';

interface Amenity {
  value: boolean | null;
  valueString: string | null;
  isPremium: boolean;
  typeCode: string;
  type: string;
  iconLink: string;
  amenitiesTypeId: number;
}

interface ExpandableAmenitiesProps {
  items?: Amenity[];
  visibleCount?: number;
}

const ExpandableAmenities: React.FC<ExpandableAmenitiesProps> = ({
  items = [],
  visibleCount = 3,
}) => {
  const expanded = false;
  const theme = useTheme();
  const visibleItems = expanded ? items : items.slice(0, visibleCount);

  return (
    <Box>
      <Grid container spacing={2} mt={0} mb={1}>
        {visibleItems.map((item) => {
          const cleanType =
            item.type
              ?.replace(/\r?\n|\r/g, '')
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
              .trim() || '';
          const IconComponent = cleanType ? amenityIconMap[cleanType] : undefined;
          return (
            <Grid
              size={{ xs: 4 }}
              key={item.amenitiesTypeId}
              display="flex"
              flexDirection="row"
              alignItems="center"
              textAlign="center"
              gap={1}
            >
              <Box display={'flex'} flexDirection={'row'} gap={2}>
                {IconComponent && (
                  <IconComponent size={24} color="#6B7280" style={{ paddingRight: '8px' }} />
                )}
                <Typography sx={{ fontFamily: theme.typography.paragraph1SRegular }}>
                  {item.valueString}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ExpandableAmenities;
