import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
const PrivacyPolicy: React.FC = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Container maxWidth={matches ? 'lg' : 'md'} sx={{ py: 6 }}>
      <Box>
        <Typography
          variant="h3"
          fontWeight={700}
          mb={4}
          sx={{ color: theme.palette.customColors.primary[1] }}
        >
          Política de Privacidad
        </Typography>

        <Typography variant="body1" mb={3} sx={{ color: theme.palette.customColors.primary[2] }}>
          Última actualización:{' '}
          {new Date().toLocaleDateString('es-BO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>

        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            1. Información que Recopilamos
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            En Assert, valoramos tu privacidad y nos comprometemos a proteger tus datos personales.
            Recopilamos la siguiente información:
          </Typography>
          <Typography
            variant="body1"
            component="ul"
            sx={{ color: theme.palette.customColors.primary[2], pl: 4 }}
          >
            <li>
              Información de registro: nombre, apellido, correo electrónico, número de teléfono
            </li>
            <li>Información de perfil: fotografía, preferencias de hospedaje</li>
            <li>Información de reservas: fechas, propiedades seleccionadas, datos de pago</li>
            <li>Información de navegación: cookies, dirección IP, tipo de navegador</li>
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            2. Uso de la Información
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            Utilizamos tu información para:
          </Typography>
          <Typography
            variant="body1"
            component="ul"
            sx={{ color: theme.palette.customColors.primary[2], pl: 4 }}
          >
            <li>Procesar y gestionar tus reservas</li>
            <li>Mejorar nuestros servicios y experiencia de usuario</li>
            <li>Comunicarnos contigo sobre tus reservas y actualizaciones del servicio</li>
            <li>Cumplir con requisitos legales y regulatorios</li>
            <li>Prevenir fraudes y garantizar la seguridad de la plataforma</li>
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            3. Compartir Información
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            No vendemos ni alquilamos tu información personal a terceros. Compartimos información
            únicamente:
          </Typography>
          <Typography
            variant="body1"
            component="ul"
            sx={{ color: theme.palette.customColors.primary[2], pl: 4 }}
          >
            <li>Con los anfitriones para procesar tus reservas</li>
            <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
            <li>Cuando sea requerido por ley o para proteger nuestros derechos legales</li>
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            4. Seguridad de los Datos
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información
            contra acceso no autorizado, pérdida o alteración. Esto incluye encriptación de datos,
            acceso restringido y monitoreo constante de nuestros sistemas.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            5. Tus Derechos
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            Tienes derecho a:
          </Typography>
          <Typography
            variant="body1"
            component="ul"
            sx={{ color: theme.palette.customColors.primary[2], pl: 4 }}
          >
            <li>Acceder a tu información personal</li>
            <li>Corregir datos inexactos</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Oponerte al procesamiento de tus datos</li>
            <li>Solicitar la portabilidad de tus datos</li>
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            6. Cookies
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso
            del sitio y personalizar el contenido. Puedes controlar el uso de cookies a través de la
            configuración de tu navegador.
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            7. Cambios a esta Política
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            Podemos actualizar esta política de privacidad periódicamente. Te notificaremos sobre
            cambios significativos publicando la nueva política en esta página y actualizando la
            fecha de "Última actualización".
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            sx={{ color: theme.palette.customColors.primary[1] }}
          >
            8. Contacto
          </Typography>
          <Typography variant="body1" mb={2} sx={{ color: theme.palette.customColors.primary[2] }}>
            Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos,
            contáctanos en:
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.customColors.primary[2], pl: 4 }}>
            Email: privacidad@assert.com
            <br />
            Dirección: Santa Cruz, Bolivia
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
