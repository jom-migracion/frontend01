import { Box, Paper } from '@mui/material';
import SearchBar from '@/components/SearchBar';
// import CategoryTabs from "@/components/CategoryTabs";

const HeroSection = () => {
  return (
    <Paper
      sx={{
        position: 'relative',
        width: '100%',
        // height: "400px",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#fff',
        // borderRadius: "0",
        border: 'none',
        p: 0,
        borderRadius: 0,
        boxShadow: 0,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '482px',
          backgroundImage: 'url("/images/hero-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // display: "flex",
          // flexDirection: "column",
          // justifyContent: "center",
          // alignItems: "center",
          // textAlign: "center",
          // color: "#fff",
          borderRadius: '10px',
          // overflow: "hidden",
        }}
      ></Box>
      {/* Barra de Búsqueda */}
      <Box width="90%" style={{ marginTop: '-140px', zIndex: 999 }}>
        <SearchBar />
      </Box>
    </Paper>
  );
};

export default HeroSection;
