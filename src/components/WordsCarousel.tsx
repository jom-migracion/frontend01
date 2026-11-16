// import React, { useEffect, useState } from 'react';
// import { Box, Typography, alpha, useTheme } from '@mui/material';

// interface WordsCarouselProps {
//   words: string[];
//   interval?: number;
// }

// const WordsCarousel: React.FC<WordsCarouselProps> = ({ words, interval = 3000 }) => {
//   const [index, setIndex] = useState(0);
//   const prevIndex = (index - 1 + words.length) % words.length;

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((i) => (i + 1) % words.length);
//     }, interval);
//     return () => clearInterval(timer);
//   }, [words.length, interval]);

//   return (
//     <Box
//       sx={{
//         position: 'relative',
//         width: '100%',
//         height: { xs: '45px', md: '60px' },
//         overflow: 'hidden',
//       }}
//     >
//       {words.map((word, i) => {
//         const isCurrent = i === index;
//         const isPrev = i === prevIndex;

//         return (
//           <Box
//             key={word}
//             sx={{
//               position: 'absolute',
//               inset: 0,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'left',
//               width: '100%',
//               transition: 'all 0.8s cubic-bezier(0.65, 0, 0.35, 1)', // Curva elegante
//               opacity: isCurrent ? 1 : 0,
//               // Desplazamiento total: de derecha a centro, de centro a izquierda
//               transform: isCurrent
//                 ? 'translateX(0)'
//                 : isPrev
//                   ? 'translateX(-100%)'
//                   : 'translateX(100%)',
//             }}
//           >
//             <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 3 }}>
//               {word}
//             </Typography>
//           </Box>
//         );
//       })}
//     </Box>
//   );
// };
// export default WordsCarousel;

import React, { useEffect, useState } from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';

interface WordsCarouselProps {
  words: string[];
  interval?: number;
}

const WordsCarousel: React.FC<WordsCarouselProps> = ({ words, interval = 3000 }) => {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const prevIndex = (index - 1 + words.length) % words.length;
  const brandColor = theme.palette.primary.main;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '60px', md: '40px' }, // Aumentamos altura para letras grandes
        overflow: 'hidden',
      }}
    >
      {words.map((word, i) => {
        const isCurrent = i === index;
        const isPrev = i === prevIndex;

        return (
          <Box
            key={word}
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'left', // Centrado para mayor impacto visual
              width: '100%',
              transition: 'all 0.9s cubic-bezier(0.87, 0, 0.13, 1)', // Curva ultra suave
              opacity: isCurrent ? 1 : 0,
              filter: isCurrent ? 'blur(0px)' : 'blur(10px)', // Efecto cinematográfico
              transform: isCurrent
                ? 'translateX(0) scale(1)'
                : isPrev
                  ? 'translateX(-100%) scale(0.9)'
                  : 'translateX(100%) scale(1.1)',
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                // Tamaño de letra impactante
                fontSize: { xs: '1.4rem', sm: '1.4rem', md: '1.4rem' },
                lineHeight: 1,

                textTransform: 'uppercase',
                textAlign: 'center',
                // Estilo de Gradiente en el Texto
                background: `linear-gradient(90deg, #1e293b 0%, ${brandColor} 50%, #1e293b 100%)`,

                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shine 4s linear infinite',
                '@keyframes shine': {
                  '0%': { backgroundPosition: '0% center' },
                  '100%': { backgroundPosition: '200% center' },
                },
                // Sutil sombra para dar profundidad
                textShadow: `0 10px 20px ${alpha(brandColor, 0.1)}`,
              }}
            >
              {word}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default WordsCarousel;
