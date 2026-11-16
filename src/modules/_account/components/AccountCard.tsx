import { Card, CardContent, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

interface Props {
  title: string;
  description: string;
}

const AccountCard = ({ title, description }: Props) => (
  <Card
    sx={{
      width: 300,
      height: 200,
      boxShadow: 3,
      borderRadius: 2,
      p: 2,
      cursor: "pointer",
      transition: "all 0.3s",
      "&:hover": {
        boxShadow: 6,
      },
    }}
  >
    <CardContent>
      <Box display="flex" flexDirection="column" gap={2}>
        <PersonIcon fontSize="large" />
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default AccountCard;