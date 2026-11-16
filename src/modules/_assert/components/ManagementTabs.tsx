// import React, { ReactNode, useState } from 'react';
// import { Box, Tabs, Tab } from '@mui/material';
// import SearchFilter from './SearchFilter';

// interface PropertyTabsProps {
//   tabs: string[];
//   childrenTab: (props: { searchTerm: string; tabIndex: number }) => ReactNode;
// }

// const TabPanel: React.FC<{ children: React.ReactNode; value: number; index: number }> = ({ children, value, index, ...other }) => {
//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`property-tabpanel-${index}`}
//       aria-labelledby={`property-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ pt: 1 }}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// }

// const ManagementTabs: React.FC<PropertyTabsProps> = ({ tabs, childrenTab }) => {
//   // useState
//   const [value, setValue] = useState<number>(0);
//   const [searchTerm, setSearchTerm] = useState<string>('');

//   // functions
//   const handleChange = (_: any, newValue: number) => {
//     setValue(newValue);
//   };

//   return (
//     <Box sx={{ width: '100%', maxWidth: '1400px', px: { xs: 1, sm: 5 } }}>
//       {/* Tabs de navegación */}
//       <Box sx={{ flex: 1, mb: 5 }}>
//         <Box sx={{ width: '100%', overflow: 'hidden', height: '10%', borderRadius: '15px', p: 1, alignItems: 'center', boxShadow: 3 }}>
//           <Tabs
//             value={value}
//             onChange={handleChange}
//             aria-label="property tabs assert"
//             variant="scrollable" scrollButtons="auto" textColor="primary" indicatorColor="primary"
//           >
//             {tabs.map((tab, index) => (
//               <Tab key={index} label={tab} sx={{
//                 textTransform: 'none', '&.Mui-selected': {
//                   backgroundColor: 'primary.main',
//                   color: 'white',
//                   borderRadius: '2px'
//                 },
//                 ml: 5 
//               }} />
//             ))}
//           </Tabs>
//         </Box>
//       </Box>

//       {/* Filtro de búsqueda */}
//       <SearchFilter value={searchTerm} onSearchChange={setSearchTerm} />
//       {/* Contenido de cada tab */}
//       {tabs.map((_, index) => (
//         <TabPanel key={index} value={value} index={index}>
//           {childrenTab({ searchTerm, tabIndex: index })}
//           ss
//         </TabPanel>
//       ))}
//     </Box>
//   );
// }

// export default ManagementTabs;



// import PropertyGrid from '@/modules/_assert/components/propertyManagement/PropertyGrid';
// import UserGrid from '@/modules/_assert/components/userManagement/UserGrid';
// import { ListingRent } from '@/pages/DetailWishList';
// import SearchIcon from '@mui/icons-material/Search';
// import {
//   Box,
//   InputAdornment,
//   List,
//   ListItemButton,
//   ListItemText,
//   Tab,
//   Tabs,
//   TextField,
//   Typography,
// } from '@mui/material';
// import React, { useState } from 'react';


// // Configuración sidebar
// const sidebarConfig = {
//   user: {
//     label: 'Gestión de usuarios',
//     tabs: [
//       { label: 'Administradores', endpoint: '/User/GetAdministrators' },
//       { label: 'Anfitriones', endpoint: '/User/GetHosts' },
//       { label: 'Huespedes', endpoint: '/User/GetGuests' },
//     ],
//   },
//   property: {
//     label: 'Gestión de propiedades',
//     tabs: [
//       { label: 'Recien añadidas', endpoint: '/ListingRent/RecentlyPublished' },
//       { label: 'Propiedades más alquiladas', endpoint: '/ListingRent/MostRented' },
//       { label: 'Propiedades menos alquiladas', endpoint: '/ListingRent/TopRated' },
//     ],
//   },
//   support: {
//     label: 'Soporte y reclamos',
//     tabs: [
//       { label: 'Archivados', endpoint: '/ListingRent/Archived' },
//       { label: 'Eliminados', endpoint: '/ListingRent/Deleted' },
//       { label: 'Expirados', endpoint: '/ListingRent/Expired' },
//     ],
//   },
//   Metrics: {
//     label: 'Métricas y estadísticas',
//     tabs: [
//       { label: 'Archivados', endpoint: '/ListingRent/Archived' },
//       { label: 'Eliminados', endpoint: '/ListingRent/Deleted' },
//       { label: 'Expirados', endpoint: '/ListingRent/Expired' },
//     ],
//   },
// };

// const ManagementTabs: React.FC = () => {
//   const [selectedOption, setSelectedOption] = useState<keyof typeof sidebarConfig>('property');
//   const [tabIndex, setTabIndex] = useState(0);
//   const [searchCity, setSearchCity] = useState('');
//   const currentTabs = sidebarConfig[selectedOption].tabs;
//   const currentTab = currentTabs[tabIndex];

//   return (
//     <Box display="flex" height="100vh">
//       {/* Sidebar */}
//       <Box
//         sx={{
//           width: 240,
//           borderRight: '1px solid #ddd',
//           bgcolor: '#fafafa',
//         }}
//       >
//         <List>
//           {Object.entries(sidebarConfig).map(([id, option]) => {
//             const isSelected = selectedOption === id;

//             return (
//               <ListItemButton
//                 key={id}
//                 selected={isSelected}
//                 onClick={() => {
//                   setSelectedOption(id as keyof typeof sidebarConfig);
//                   setTabIndex(0);
//                 }}
//                 sx={{
//                   borderRight: isSelected ? '4px solid black' : '4px solid transparent',
//                   '&.Mui-selected': {
//                     bgcolor: '#f0f0f0',
//                   },
//                 }}
//               >
//                 <ListItemText primary={option.label} />
//               </ListItemButton>
//             );
//           })}
//         </List>
//       </Box>

//       {/* Contenido */}
//       <Box flex={1} p={3} overflow="auto">
//         <Typography variant="h5" gutterBottom>
//           {sidebarConfig[selectedOption].label}
//         </Typography>

//         {/* Tabs */}
//         <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)}>
//           {currentTabs.map((tab, index) => (
//             <Tab key={index} label={tab.label} />
//           ))}
//         </Tabs>
//         <h1>{selectedOption}</h1>

//         <Box mt={2}>
//           {selectedOption == 'user' ? (
//             <>
//               <Box mt={2} mb={2}>
//                 <TextField
//                   // label="Buscar por ciudad"
//                   // size="small"
//                   variant="outlined"
//                   value={searchCity}
//                   onChange={(e) => setSearchCity(e.target.value)}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       backgroundColor: '#fff',
//                       borderRadius: '4px',
//                       '& fieldset': {
//                         borderColor: '#e0e0e0',
//                       },
//                       '&:hover fieldset': {
//                         borderColor: '#ccc',
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: '#000',
//                       },
//                     },
//                     '& .MuiInputBase-input': {
//                       padding: '12px 14px',
//                       fontSize: '14px',
//                       color: '#333',
//                       '&::placeholder': {
//                         color: '#999',
//                         opacity: 1,
//                       },
//                     },
//                   }}
//                   slotProps={{
//                     input: {
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon />
//                         </InputAdornment>
//                       ),
//                     },
//                   }}
//                 />
//               </Box>
//               <UserGrid
//                 endpoint={currentTab.endpoint}
//                 queryKey={`${selectedOption}-${tabIndex}`}
//                 cityName={searchCity}
//                 searchTerm={''}
//               />
//             </>
//           ) : selectedOption == 'property' ? (
//             <>
//               <Box mt={2} mb={2}>
//                 <TextField
//                   // label="Buscar por ciudad"
//                   // size="small"
//                   variant="outlined"
//                   value={searchCity}
//                   onChange={(e) => setSearchCity(e.target.value)}
//                   sx={{
//                     '& .MuiOutlinedInput-root': {
//                       backgroundColor: '#fff',
//                       borderRadius: '4px',
//                       '& fieldset': {
//                         borderColor: '#e0e0e0',
//                       },
//                       '&:hover fieldset': {
//                         borderColor: '#ccc',
//                       },
//                       '&.Mui-focused fieldset': {
//                         borderColor: '#000',
//                       },
//                     },
//                     '& .MuiInputBase-input': {
//                       padding: '12px 14px',
//                       fontSize: '14px',
//                       color: '#333',
//                       '&::placeholder': {
//                         color: '#999',
//                         opacity: 1,
//                       },
//                     },
//                   }}
//                   slotProps={{
//                     input: {
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon />
//                         </InputAdornment>
//                       ),
//                     },
//                   }}
//                 />
//               </Box>
//               <PropertyGrid
//                 endpoint={currentTab.endpoint}
//                 queryKey={`${selectedOption}-${tabIndex}`}
//                 cityName={searchCity}
//               />
//             </>
//           ) : (
//             ''
//           )}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ManagementTabs;
