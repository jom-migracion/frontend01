import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

function LoadingJom({ onComplete }: { onComplete?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const letters = ['j', 'o', 'm']; // Separamos las letras

  useEffect(() => {
    if (currentIndex < letters.length) {
      const timeout = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 400); // 400ms entre cada letra
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      // Esperar un poco después de completar antes de llamar onComplete
      const timeout = setTimeout(onComplete, 800);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, letters.length, onComplete]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 0, p: 0 }}>
        {letters.map((letter, index) => (
          <AnimatePresence key={index}>
            {index < currentIndex && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {letter === 'o' ? (
                  // Símbolo con dos arcos: uno grande abajo y uno pequeño arriba
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Arco pequeño arriba (semicírculo superior) */}
                    <Box
                      sx={{
                        fontSize: { xs: '1.6rem', md: '3rem', lg: '4rem' },
                        color: 'white',
                        fontWeight: 800,
                        lineHeight: 0.8,
                        pt: 1.25,
                        WebkitTextStroke: { xs: '2px white', md: '3px white', lg: '4px white' },
                        textStroke: { xs: '2px white', md: '3px white', lg: '4px white' },
                        paintOrder: 'stroke fill',
                      }}
                    >
                      ◡
                    </Box>
                    {/* Arco grande abajo (semicírculo inferior) */}
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '4rem', md: '5.8rem', lg: '8rem' },
                        fontWeight: 800,
                        color: 'white',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        letterSpacing: 2,
                        lineHeight: 0.8,
                        WebkitTextStroke: { xs: '2px white', md: '3px white', lg: '4px white' },
                        textStroke: { xs: '2px white', md: '3px white', lg: '4px white' },
                        paintOrder: 'stroke fill',
                      }}
                    >
                      ◠
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '4rem', md: '6rem', lg: '8rem' },
                      fontWeight: 700,
                      color: 'white',
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      letterSpacing: 2,
                    }}
                  >
                    {letter}
                  </Typography>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </Box>
    </Box>
  );
}
export default LoadingJom;
