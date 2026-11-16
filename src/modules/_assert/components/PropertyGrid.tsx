// import React, { useState } from 'react';
// import { Box, Pagination } from '@mui/material';
// import Grid from '@mui/material/Grid2';
// import DetailedPropertyCard from './propertyManagement/DetailedPropertyCard';


// // Datos de ejemplo para las propiedades
// const sampleProperties = [
//   {
//     id: 1,
//     title: 'Rocha Villa',
//     location: 'Santa Cruz, Bolivia',
//     date: '26-08-2025',
//     imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
//     authorName: 'Jose',
//     authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
//     authorLocation: 'Cochabamba, Bolivia'

//   },
//   {
//     id: 2,
//     title: 'Sara Bolton',
//     location: 'La paz, Bolivia',
//     date: '26-08-2025',
//     imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     authorName: 'Lucho',
//     authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
//     authorLocation: 'Santa cruz, Bolivia'

//   },
//   {
//     id: 3,
//     title: 'Roberto Guzman',
//     location: 'Sucre, Bolivia',
//     date: '26-08-2025',
//     imageUrl: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     authorName: 'Audrey',
//     authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
//     authorLocation: 'Tarija, Bolivia'
//   },
//   {
//     id: 4,
//     title: 'Maria Rene Lora',
//     location: 'Beni, Bolivia',
//     date: '26-08-2025',
//     imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     authorName: 'Suex',
//     authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
//     authorLocation: 'Cochabamba, Bolivia'
//   },
//   {
//     id: 5,
//     title: 'Tomas frias',
//     location: 'Tarija, Bolivia',
//     date: '26-08-2025',
//     imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
//     authorName: 'Gloria',
//     authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
//     authorLocation: 'Cochabamba, Bolivia'
//   },
//   {
//     id: 6,
//     title: 'Norman Lopez',
//     location: 'Oruro, Bolivia',
//     date: '26-08-2025',
//     imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
//     authorName: 'Audrey',
//     authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
//     authorLocation: 'Potosi, Bolivia'
//   }
// ];

// interface PropertyGridProps {
//   searchTerm: string;
//   tabIndex: number
// }

// const PropertyGrid: React.FC<PropertyGridProps> = ({ searchTerm }) => {
//   // useState
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   // constants
//   const itemsPerPage = 6;

//   const filteredProperties = sampleProperties.filter(
//     p =>
//       p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.authorName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Calcular las propiedades a mostrar en la página actual
//   const totalPages = Math.max(1, Math.ceil(filteredProperties.length / itemsPerPage));
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentProperties = filteredProperties.slice(startIndex, endIndex);

//   React.useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   return (
//     <Box sx={{flexGrow: 1}}>
//       {/* Grid de propiedades */}
//       <Grid container spacing={2} sx={{ mb: 4 }}>
//         {currentProperties.map((property) => (
//           <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property.id}>
//             <DetailedPropertyCard property={property} />
//           </Grid>
//         ))}
//       </Grid>

//       {/* Paginación */}
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           mt: 4,
//           mb: 2
//         }}
//       >
//         <Pagination
//           count={totalPages}
//           page={currentPage}
//           onChange={(_, value) => setCurrentPage(value)}
//           variant="outlined"
//           shape="rounded"
//           sx={{
//             '& .MuiPaginationItem-root': {
//               fontSize: '14px',
//               fontWeight: 500,
//               color: '#666',
//               border: 'none',
//               '&:hover': {
//                 backgroundColor: '#f5f5f5',
//               },
//             },
//             '& .MuiPaginationItem-root.Mui-selected': {
//               backgroundColor: '#000',
//               color: '#fff',
//               '&:hover': {
//                 backgroundColor: '#333',
//               },
//             },
//             '& .MuiPaginationItem-previousNext': {
//               fontSize: '16px',
//             },
//           }}
//         />
//       </Box>
//     </Box>
//   );
// }

// export default PropertyGrid;

