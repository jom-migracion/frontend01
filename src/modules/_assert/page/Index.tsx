import PropertyGrid from '@/modules/_assert/components/propertyManagement/PropertyGrid';
import UserGrid from '@/modules/_assert/components/userManagement/UserGrid';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import PropertyDetail from '../components/PropertyDetail';
import Dashboard from '@/modules/_admin/components/dashBoard/Dashboard';
// import DashboardDetail from '@/modules/_admin/components/dashBoard/DashboardDetail';
import GuestMessage from '@/modules/_guest/page/GuestMessage';
import IdentityValidationGrid from '@/modules/_assert/components/identityValidation/IdentityValidationGrid';
import { useTranslation } from 'react-i18next';

interface CardProperty {
  id: number;
  title: string;
  location: string;
  date: string;
  authorName: string;
  authorLocation: string;
  authorAvatarUrl: string;
  imageUrl: string;
  description?: string;
}

interface TabConfig {
  label: string;
  endpoint?: string;
  isDetailTab?: boolean;
}

interface SidebarConfig {
  [key: string]: {
    label: string;
    tabs: TabConfig[];
  };
}

const VerticalTabsAssert: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<keyof typeof sidebarConfig>('user');
  const [tabIndex, setTabIndex] = useState(0);
  const [searchCity, setSearchCity] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<CardProperty | null>(null);
  const [previousTabIndex, setPreviousTabIndex] = useState(0);
  const { t } = useTranslation();

  // Configuración dinámica para que se traduzca al cambiar el idioma
  const sidebarConfig: SidebarConfig = {
    user: {
      label: t('assert.sidebar.user'),
      tabs: [
        { label: t('assert.tabs.administrators'), endpoint: '/User/GetAdministrators' },
        { label: t('assert.tabs.hosts'), endpoint: '/User/GetHosts' },
        { label: t('assert.tabs.guests'), endpoint: '/User/GetGuests' },
      ],
    },
    property: {
      label: t('assert.sidebar.property'),
      tabs: [
        { label: t('assert.tabs.recentlyAdded'), endpoint: '/ListingRent/RecentlyPublished' },
        { label: t('assert.tabs.mostRented'), endpoint: '/ListingRent/MostRented' },
        { label: t('assert.tabs.leastRented'), endpoint: '/ListingRent/LeastRented' },
      ],
    },
    support: {
      label: t('assert.sidebar.support'),
      tabs: [
        { label: t('assert.tabs.archived'), endpoint: '/ListingRent/Archived' },
        { label: t('assert.tabs.deleted'), endpoint: '/ListingRent/Deleted' },
        { label: t('assert.tabs.expired'), endpoint: '/ListingRent/Expired' },
      ],
    },
    metrics: {
      label: t('assert.sidebar.metrics'),
      tabs: [
        { label: t('assert.tabs.income'), endpoint: '/ListingRent/Archived' },
        { label: t('assert.tabs.detail'), endpoint: '/ListingRent/Deleted' },
      ],
    },
    chat: {
      label: t('assert.sidebar.chat'),
      tabs: [{ label: t('assert.tabs.conversations'), endpoint: '/Messaging/Conversations' }],
    },
    identity: {
      label: t('assert.sidebar.identity'),
      /* tabs: [{ label: t('assert.tabs.users'), endpoint: '/Identity/GetPendingUsers' }], */
      tabs: [{ label: t('assert.tabs.users'), endpoint: '/GetPendingVerifications' }],
    },
  };

  const currentTabs =
    selectedProperty && selectedOption === 'property'
      ? [
          ...sidebarConfig[selectedOption].tabs,
          { label: `Detalle: ${selectedProperty.title}`, isDetailTab: true },
        ]
      : sidebarConfig[selectedOption].tabs;

  const validTabIndex = Math.min(tabIndex, currentTabs.length - 1);
  const currentTab = currentTabs[validTabIndex];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleOpenDetail = (property: CardProperty) => {
    setPreviousTabIndex(validTabIndex);
    setSelectedProperty(property);
    setTabIndex(currentTabs.length);
  };

  const handleCloseDetail = () => {
    setSelectedProperty(null);
    setTabIndex(previousTabIndex);
  };

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          borderRight: '1px solid #ddd',
          bgcolor: '#fafafa',
        }}
      >
        <List>
          {Object.entries(sidebarConfig).map(([id, option]) => {
            const isSelected = selectedOption === id;
            return (
              <ListItemButton
                key={id}
                selected={isSelected}
                onClick={() => {
                  setSelectedOption(id as keyof typeof sidebarConfig);
                  setTabIndex(0);
                  setSelectedProperty(null);
                  setPreviousTabIndex(0);
                }}
                sx={{
                  borderRight: isSelected ? '4px solid black' : '4px solid transparent',
                  '&.Mui-selected': {
                    bgcolor: '#f0f0f0',
                  },
                }}
              >
                <ListItemText primary={option.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Content */}
      <Box
        flex={1}
        p={selectedOption === 'chat' ? 0 : 3}
        overflow={selectedOption === 'chat' ? 'hidden' : 'auto'}
        height="100vh"
      >
        {selectedOption !== 'chat' && (
          <>
            <Typography variant="h5" gutterBottom>
              {sidebarConfig[selectedOption].label}
            </Typography>

            {/* Tabs */}
            <Tabs value={validTabIndex} onChange={handleTabChange}>
              {currentTabs.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </Tabs>
          </>
        )}

        <Box mt={selectedOption === 'chat' ? 0 : 2}>
          {selectedOption === 'user' ? (
            <>
              <Box mt={2} mb={2}>
                <TextField
                  placeholder={t('assert.search.userPlaceholder')}
                  variant="outlined"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#ccc',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#000',
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: '12px 14px',
                      fontSize: '14px',
                      color: '#333',
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
              <UserGrid
                endpoint={currentTab?.endpoint || ''}
                queryKey={`${selectedOption}-${validTabIndex}`}
                NameOrSurname={searchUser}
              />
            </>
          ) : selectedOption === 'property' ? (
            currentTab?.isDetailTab && selectedProperty ? (
              <PropertyDetail property={selectedProperty} onClose={handleCloseDetail} />
            ) : (
              <>
                <Box mt={2} mb={2}>
                  <TextField
                    placeholder={t('assert.search.cityPlaceholder')}
                    variant="outlined"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#ccc',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#000',
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px 14px',
                        fontSize: '14px',
                        color: '#333',
                        '&::placeholder': {
                          color: '#999',
                          opacity: 1,
                        },
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
                <PropertyGrid
                  endpoint={currentTab?.endpoint || ''}
                  queryKey={`${selectedOption}-${validTabIndex}`}
                  cityName={searchCity}
                  onDetailClick={handleOpenDetail}
                />
              </>
            )
          ) : selectedOption === 'identity' ? (
            <IdentityValidationGrid /> // nuevo componente
          ) : selectedOption === 'metrics' && currentTab.label === 'Ingresos' ? (
            <Dashboard />
          ) : selectedOption === 'chat' ? (
            <GuestMessage />
          ) : (
            ''
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VerticalTabsAssert;
