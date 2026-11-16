import { Box, Typography, Link, Grid } from "@mui/material";
import AccountCard from "../components/AccountCard";

const AccountPage = () => {
  const userName = "Juan Pérez";
  const userEmail = "juan.perez@email.com";

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={700}>
        Cuenta
      </Typography>

      <Typography variant="subtitle1" mt={1} color="text.secondary">
        ({userName}), ({userEmail}) ·{" "}
        <Link href="/profile" underline="hover">
          Ir al perfil
        </Link>
      </Typography>

      <Grid container spacing={3} mt={3}>
        <Grid item>
          <AccountCard
            title="Datos personales"
            description="Proporciona tus datos personales e indícanos cómo podemos ponernos en contacto contigo"
          />
        </Grid>
        <Grid item>
          <AccountCard
            title="Inicio de sesión y seguridad"
            description="Actualiza tu contraseña y protege tu cuenta."
          />
        </Grid>
        <Grid item>
          <AccountCard
            title="Pagos y cobros"
            description="Revisa pagos, cobros, cupones y tarjetas de regalo"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountPage;