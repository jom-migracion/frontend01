import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import React from 'react';
import { amenityIconMap } from '@/assets/amenitiesIcons';

interface Highlighted {
  value: string | null;
  code: string | null;
  name: string;
  featuredAspectTypeId: number;
}

interface ExpandableHighlightedProps {
  items?: Highlighted[];
  visibleCount?: number;
}
const ExpandableHighlighted: React.FC<ExpandableHighlightedProps> = ({
  items = [],
  visibleCount = 3,
}) => {
  const expanded = false;
  const theme = useTheme();
  const visibleItems = expanded ? items : items.slice(0, visibleCount);

  return (
    <Box>
      <Grid2 container spacing={2} mt={0} mb={1}>
        {visibleItems.map((item) => {
          const cleanType =
            item.name
              ?.replace(/\r?\n|\r/g, '')
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
              .trim() || '';
          const IconComponent = cleanType ? amenityIconMap[cleanType] : undefined;
          return (
            <Grid2
              size={{ xs: 4 }}
              key={item.featuredAspectTypeId}
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
                  {item.name}
                </Typography>
              </Box>
            </Grid2>
          );
        })}
      </Grid2>
    </Box>
  );
};

export default ExpandableHighlighted;
