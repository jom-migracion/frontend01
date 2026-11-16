import { Box, Button, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

// interface ProfileItemProps {
//   icon: React.ReactNode;
//   label: string;
//   value?: string;
//   onClick?: () => void;
// }

// Define the form data type
interface FormData {
  occupation: string;
}

interface OccupationModalProps {
  //   open: boolean;
  //   onClose: () => void;
  //   onSave: (data: FormData) => void;
  maxCharacters: number;
  initialOccupation?: string; // Optional: for pre-filling the input
}

// const FormStept1: React.FC<ProfileItemProps> = ({ icon, label, value, onClick }) => (
const FormStept1: React.FC<OccupationModalProps> = ({ maxCharacters, initialOccupation }) => {
  const MAX_CHARACTERS = 20;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      occupation: initialOccupation,
    },
    mode: 'onChange', // Validate on change to update character count and errors immediately
  });

  // Watch the input field to get its current value for character counting
  const occupationValue = watch('occupation');
  const charactersRemaining = (maxCharacters || MAX_CHARACTERS) - (occupationValue?.length || 0);

  const onSubmit = (data: FormData) => {
    console.log(data);
    //onSave(data);
    // onClose(); // Close the modal after saving
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="occupation"
          control={control}
          rules={{
            required: 'Este campo es obligatorio',
            maxLength: {
              value: maxCharacters || MAX_CHARACTERS,
              message: `El texto no puede exceder los ${maxCharacters || MAX_CHARACTERS} caracteres`,
            },
            max: maxCharacters || MAX_CHARACTERS,
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="A qué me dedico:"
              variant="outlined"
              error={!!errors.occupation}
              helperText={errors.occupation ? errors.occupation.message : ''}
              InputProps={
                {
                  // Optional: add a character count display directly in the input helper text area
                  // endAdornment: (
                  //   <Typography variant="caption" color="text.secondary">
                  //     {occupationValue?.length || 0}/{MAX_CHARACTERS}
                  //   </Typography>
                  // ),
                }
              }
            />
          )}
        />
        <Box display="flex" justifyContent="flex-end" alignItems="center" mt={1} mb={2}>
          <Typography
            variant="caption"
            color={charactersRemaining < 0 ? 'error' : 'text.secondary'}
          >
            {charactersRemaining} caracteres disponibles
          </Typography>
        </Box>

        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: 'black',
              color: 'white',
              '&:hover': {
                bgcolor: 'darkgray',
              },
              borderRadius: '8px',
              textTransform: 'uppercase',
            }}
          >
            Guardar
          </Button>
        </Box>
      </form>
    </>
  );
};

export default FormStept1;
