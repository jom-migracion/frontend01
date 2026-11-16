import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";

type EditableField = "legalName" | "preferredName" | "email" | "phone";

export default function PersonalInfoPage() {
  const [formData, setFormData] = useState({
    legalName: { firstName: "Ever", lastName: "Arrazola Candia" },
    preferredName: "",
    email: "r***i@gmail.com",
    phone: ""
  });

  const [editing, setEditing] = useState<EditableField | null>(null);

  const handleChange = (field: string, value: string) => {
    if (editing === "legalName") {
      setFormData((prev) => ({
        ...prev,
        legalName: {
          ...prev.legalName,
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [editing!]: value
      }));
    }
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleSave = () => {
    // Aquí podrías conectar con tu backend si deseas
    setEditing(null);
  };

  const isDisabled = (field: EditableField) => editing && editing !== field;

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" my={4}>
        Información personal
      </Typography>

      {/* Nombre Legal */}
      <Box py={2} borderBottom="1px solid #eee">
        <Typography fontWeight="bold">Nombre legal</Typography>
        <Typography variant="body2" color="textSecondary" mb={1}>
          Asegúrate de que coincide con el nombre que aparece en tu documento de identidad oficial.
        </Typography>

        {editing === "legalName" ? (
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mb={2}>
            <TextField
              label="Nombre que aparece en el documento de identidad"
              fullWidth
              value={formData.legalName.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
            <TextField
              label="Apellidos que aparecen en el documento de identidad"
              fullWidth
              value={formData.legalName.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </Box>
        ) : (
          <>
            <Typography>{formData.legalName.firstName} {formData.legalName.lastName}</Typography>
            {!editing && (
              <Link component="button" underline="hover" onClick={() => setEditing("legalName")}>
                Editar
              </Link>
            )}
          </>
        )}

        {editing === "legalName" && (
          <Box display="flex" gap={2}>
            <Button variant="contained" onClick={handleSave}>
              Guardar
            </Button>
            <Link component="button" underline="hover" onClick={handleCancel}>
              Cancelar
            </Link>
          </Box>
        )}
      </Box>

      {/* Nombre preferido */}
      <Box py={2} borderBottom="1px solid #eee" color={isDisabled("preferredName") ? "grey.500" : "inherit"}>
        <Typography fontWeight="bold">Nombre preferido</Typography>
        <Typography variant="body2">
          {formData.preferredName || "No proporcionado"}
        </Typography>
        {!editing && (
          <Link component="button" underline="hover" onClick={() => setEditing("preferredName")}>
            Agregar
          </Link>
        )}
      </Box>

      {/* Email */}
      <Box py={2} borderBottom="1px solid #eee" color={isDisabled("email") ? "grey.500" : "inherit"}>
        <Typography fontWeight="bold">Dirección de correo electrónico</Typography>
        <Typography variant="body2">{formData.email}</Typography>
        {!editing && (
          <Link component="button" underline="hover" onClick={() => setEditing("email")}>
            Edita
          </Link>
        )}
      </Box>

      {/* Teléfono */}
      <Box py={2} borderBottom="1px solid #eee" color={isDisabled("phone") ? "grey.500" : "inherit"}>
        <Typography fontWeight="bold">Números de teléfono</Typography>
        <Typography variant="body2">
          Agrega un número para que los huéspedes con reservaciones confirmadas y Airbnb puedan ponerse en contacto contigo.
        </Typography>
        {!editing && (
          <Link component="button" underline="hover" onClick={() => setEditing("phone")}>
            Agregar
          </Link>
        )}
      </Box>
    </Container>
  );
}