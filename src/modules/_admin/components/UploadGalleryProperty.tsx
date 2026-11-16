import { Box, Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import { uploadGallery } from '@/assets';
import CustomButton from '@/components/CustomButton';
import React, { useState, DragEvent } from 'react';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface UploadGalleryPropertyProps {
  icon?: string;
  title?: string;
  subtitle?: string;
  textButton?: string;
  widthGallery?: string;
  onFilesChange?: (files: File[]) => void; // Nueva prop para enviar archivos
}

const UploadGalleryProperty: React.FC<UploadGalleryPropertyProps> = ({
  icon = uploadGallery,
  title,
  subtitle,
  textButton = 'Agregar fotos',
  widthGallery = '100%',
  onFilesChange,
}) => {
  
  // useState
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // hooks
  const showSnackbar = useSnackbar();
  const { typography, palette: { customColors }} = useTheme();
  const { t } = useTranslation('translation', { keyPrefix: 'uploadGalleryProperty'});

  // functions
  const handleFileSelection = (selectedFiles: File[]): void => {
    const allowedTypes: string[] = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize: number = 5 * 1024 * 1024; // 5MB

    let validFiles: File[] = [];

    for (let file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        showSnackbar(`${t('msgFormat')} "${file.name}" ${t('msgFormat2')}`, 'warning');
        continue;
      }
      if (file.size > maxSize) {
        showSnackbar(`${t('msgFormat')} "${file.name}" ${t('msgMaxSize')}`, 'warning');
        continue;
      }
      validFiles.push(file);
    }
    // Combinar con los anteriores (evitando duplicados por nombre)
    const newFiles = [...files, ...validFiles].filter(
      (file, index, self) =>
        index ===
        self.findIndex((f) => f.name === file.name && f.lastModified === file.lastModified)
    );

    setFiles(newFiles);

    if (onFilesChange) {
      onFilesChange(newFiles); // Notificamos al componente padre
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles: File[] = Array.from(e.dataTransfer.files);
    handleFileSelection(droppedFiles);
  };

  return (
    <Card sx={{ height: '100%', boxSizing: 'border-box', width: '100%', boxShadow: 'none' }}>
      <CardContent>
        <Box
          sx={{
            width: widthGallery,
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
            flexDirection: 'column',
            justifyContent: 'center',
            border: isDragging ? '2px dashed #007bff' : '2px dashed #B6B6B6',
            padding: 2,
            ml: -2,
            transition: 'border 0.2s ease-in-out',
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          {files.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))',
                gap: 1,
                width: '80%',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 5,
              }}
            >
              <img src={icon} alt="imgUpload" width={80} />
            </Box>
          ) : (
            <Stack direction="row" flexWrap="wrap" gap={2} mt={2}>
              {files.map((file, i) => (
                <Paper
                  key={i}
                  variant="outlined"
                  sx={{
                    p: 1,
                    fontSize: '0.875rem',
                    backgroundColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  {file.type.startsWith('image/') ? (
                    <Box
                      component="img"
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Typography variant="body2">{file.name}</Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
          <Typography
            sx={{ ml: 4, mr: 5, mb: 2, fontFamily: typography.h4Medium, color: '#000000' }}
          >
            {title}
          </Typography>
          <Typography sx={{ ml: 4, mr: 5, fontFamily: typography.paragraph1Regular, color: '#000000' }}>
            {subtitle}
          </Typography>
          <CustomButton
            label={t('add')}
            type="button"
            hoverColor={customColors.secondary[4]}
            onClick={() => {
              const fileInput = document.getElementById('property-photo-input-assert');
              if (fileInput) (fileInput as HTMLInputElement).click();
            }}
            borderRadius={15}
            sx={{
              width: '30%',
              borderRadius: '5px',
              fontFamily: typography.paragraph1Regular,
              mt: 2,
              bgcolor: '#e0e0e0',
              color: `${customColors.primary[1]}`,
            }}
          />
          <input
            id="property-photo-input-assert"
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelection(Array.from(e.target.files ?? []))}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
export default UploadGalleryProperty;
