import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';

type PropertyFormProps = {
  title: string;
  onTitleChange: (value: string) => void;

  description: string;
  onDescriptionChange: (value: string) => void;

  selectedAspects: string[];
  onAspectToggle: (aspect: string) => void;

  aspectOptions: string[];

  onCancel: () => void;
};

const UpdateNameDescriptionType: React.FC<PropertyFormProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  selectedAspects,
  onAspectToggle,
  aspectOptions,
  onCancel,
}) => {
  const handleUpdate = async () => {
    const payload = {
      title,
      description,
      aspects: selectedAspects,
    };

    console.log('Enviando al servicio...', payload);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // emulación
    alert('¡Propiedad guardada exitosamente!');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item={true} xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Atributos del Inmueble
              </Typography>

              <TextField
                fullWidth
                label="Título"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Typography sx={{ mb: 1 }} variant="body2" color="textSecondary">
                Elige hasta 2 aspectos destacables
              </Typography>

              <Grid container spacing={1} sx={{ mb: 2 }}>
                {aspectOptions.map((aspect) => {
    const isSelected = selectedAspects.includes(aspect);
    //const isDisabled = !selected && selectedAspects.length >= 2;

    return (
      <Grid item key={aspect}>
        <Button
          variant={isSelected ? 'contained' : 'outlined'}
          color="inherit"
          size="small"
          onClick={() => onAspectToggle(aspect)}
        >
          {aspect}
        </Button>
      </Grid>
    );
  })}
              </Grid>

              <TextField
                fullWidth
                multiline
                maxRows={5}
                label="Descripción"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="inherit" onClick={handleUpdate}>
                  Actualizar
                </Button>
                <Button variant="outlined" color="inherit" onClick={onCancel}>
                  Cancelar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};



export default UpdateNameDescriptionType;
