import React, { ReactNode, useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import SearchFilter from './SearchFilter';

interface PropertyTabsProps {
  tabs: string[];
  childrenTab: (props: { searchTerm: string; tabIndex: number }) => ReactNode;
}

const TabPanel: React.FC<{ children: React.ReactNode; value: number; index: number }> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`property-tabpanel-${index}`}
      aria-labelledby={`property-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PropertyTabs: React.FC<PropertyTabsProps> = ({ tabs, childrenTab }) => {
  // useState
  const [value, setValue] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // functions
  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1400px', px: { xs: 1, sm: 5 } }}>
      {/* Tabs de navegación */}
      <Box sx={{ flex: 1, mb: 5 }}>
        <Box sx={{ width: '100%', overflow: 'hidden', height: '10%', borderRadius: '15px', p: 1, alignItems: 'center', boxShadow: 3 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="property tabs assert"
            variant="scrollable" scrollButtons="auto" textColor="primary" indicatorColor="primary"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} sx={{
                textTransform: 'none', '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderRadius: '2px'
                },
                ml: 5 
              }} />
            ))}
          </Tabs>
        </Box>
      </Box>

      {/* Filtro de búsqueda */}
      <SearchFilter value={searchTerm} onSearchChange={setSearchTerm} />
      {/* Contenido de cada tab */}
      {tabs.map((_, index) => (
        <TabPanel key={index} value={value} index={index}>
          {childrenTab({ searchTerm, tabIndex: index })}
        </TabPanel>
      ))}
    </Box>
  );
}

export default PropertyTabs;