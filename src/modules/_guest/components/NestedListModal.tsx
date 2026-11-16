import CustomDialog from '@/components/CustomDialog';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  // useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ComplaintItem {
  id: number;
  code: string;
  description: string;
  isActive: boolean;
  requiresFreeText: boolean;
  severityLevel: number;
  parentId: number | null;
  hasChildren: boolean;
  children: ComplaintItem[];
}

interface NestedListModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
  onSubmit?: (selected: ComplaintItem, text?: string) => void; // Nuevo callback
}

export const NestedListModal: React.FC<NestedListModalProps> = ({
  open,
  onClose,
  data,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [path, setPath] = useState<ComplaintItem[]>([]);
  const [currentList, setCurrentList] = useState<ComplaintItem[]>(data);
  const [selectedItem, setSelectedItem] = useState<ComplaintItem | null>(null);
  const [freeText, setFreeText] = useState('');
  const [finalSelected, setFinalSelected] = useState<boolean>(false);
  const [finalItem, setFinalItem] = useState<ComplaintItem | null>(null);

  // HELPER PARA TRADUCIR
  const getTranslatedText = (item: ComplaintItem) => {
    // Busca en el JSON usando el código (ej: COMP_FRD). Si no existe, usa la descripción original.
    return t(`complaintReasons.${item.code}`, { defaultValue: item.description });
  };

  const handleOptionClick = (item: ComplaintItem) => {
    if (item.hasChildren && item.children.length > 0) {
      // Avanzar al siguiente nivel
      setPath((prev) => [...prev, item]);
      setCurrentList(item.children);
    } else if (item.requiresFreeText) {
      // Mostrar formulario de texto
      setSelectedItem(item);
    } else {
      // Nodo final sin texto libre
      setFinalItem(item);
      setFinalSelected(true);
    }
  };

  const handleSubmitComplaint = () => {
    finalItem && onSubmit?.(finalItem);
    handleClose();
    setFinalSelected(false);
    setFinalItem(null);
  };

  const handleBack = () => {
    if (selectedItem) {
      // Si estaba en el formulario de texto, salir de él
      setSelectedItem(null);
      setFreeText('');
      return;
    }

    if (path.length > 0) {
      const newPath = [...path];
      newPath.pop();
      setPath(newPath);
      if (newPath.length === 0) {
        setCurrentList(data); // volver al nivel raíz
      } else {
        setCurrentList(newPath[newPath.length - 1].children);
      }
    }
    setFinalSelected(false);
    setFinalItem(null);
  };

  const handleSubmitText = () => {
    if (selectedItem) {
      onSubmit?.(selectedItem, freeText);
      handleClose();
    }
  };

  const handleClose = () => {
    setPath([]);
    setCurrentList(data);
    setSelectedItem(null);
    setFreeText('');
    onClose();
  };

  const currentTitle = selectedItem
    ? /* ? selectedItem.description */
      getTranslatedText(selectedItem) // Título = Ítem seleccionado para texto
    : path.length === 0
      ? t('complaintModal.defaultTitle')
      : /* : path[path.length - 1].description; */
        getTranslatedText(path[path.length - 1]); // Corregido para usar la traducción

  useEffect(() => {
    if (open && data) {
      setCurrentList(data);
      setPath([]);
      setSelectedItem(null);
      setFreeText('');
      setFinalSelected(false);
      setFinalItem(null);
    }
  }, [open, data]);

  return (
    <>
      <CustomDialog isOpen={open} onClose={handleClose} maxWidth="sm" title={currentTitle}>
        {finalSelected ? (
          <Box display="flex" flexDirection="column" gap={0} py={0} alignItems="center">
            <Typography>{t('complaintModal.finalMessage.part1')}</Typography>
            <Typography>{t('complaintModal.finalMessage.part2')}</Typography>
            <Button variant="primary" fullWidth onClick={handleSubmitComplaint} sx={{ mt: 2 }}>
              {t('complaintModal.acceptButton')}
            </Button>
          </Box>
        ) : !selectedItem ? (
          <List>
            {currentList?.map((item) => (
              <ListItemButton
                key={item.id}
                onClick={() => handleOptionClick(item)}
                sx={{ paddingY: 1 }}
              >
                <ListItemText
                  primary={t(`complaintReasons.${item.code}`, {
                    defaultValue: item.description,
                  })}
                  slotProps={{
                    primary: {
                      variant: 'body1',
                      fontWeight: 'medium',
                    },
                  }}
                />
                {item.hasChildren && (
                  <ListItemIcon sx={{ minWidth: 10 }}>
                    <ArrowForwardIosIcon
                      fontSize="small"
                      sx={{
                        ml: 1,
                        color: 'text.secondary',
                        borderRadius: '20px',
                      }}
                    />
                  </ListItemIcon>
                )}
              </ListItemButton>
            ))}
            {currentList?.length === 0 && (
              <Box textAlign="center" py={3} color="text.secondary">
                {t('complaintModal.noOptions')}
              </Box>
            )}
          </List>
        ) : (
          <Box display="flex" flexDirection="column" gap={2} py={2} alignItems="center">
            <TextField
              multiline
              fullWidth
              minRows={3}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              label={t('complaintModal.freeTextLabel')}
              placeholder={t('complaintModal.freeTextPlaceholder')}
            />
            <Button
              variant="primary"
              fullWidth
              onClick={handleSubmitText}
              disabled={freeText.trim() === ''}
            >
              {t('complaintModal.acceptButton')}
            </Button>
          </Box>
        )}
      </CustomDialog>
    </>
  );
};
