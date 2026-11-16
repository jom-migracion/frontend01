import React, { useState } from 'react';
import { pdf, DocumentProps } from '@react-pdf/renderer';
import {
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  // IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Box,
  // Typography,
  CircularProgress,
  useTheme,
  // Divider,
} from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
import { estadoColorReserva } from '@/common/util/statusFunctios';
import { useTranslation } from 'react-i18next';
import CustomDialog from '@/components/CustomDialog';
import { formatSemicolon } from '@/common/util/numbersFuntios';

interface DownloadDialogProps {
  open: boolean;
  onClose: () => void;
  pdfDocument?: React.ReactElement<DocumentProps>;
  fileName?: string;
  data?: any[];
  dateRangeText?: string;
}

const DownloadDialog: React.FC<DownloadDialogProps> = ({
  open,
  onClose,
  pdfDocument,
  fileName,
  data = [],
  dateRangeText,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState('csv');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue((event.target as HTMLInputElement).value);
  };

  const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return '';

    const headers = [
      t('downloadDialog.headers.status'),
      t('downloadDialog.headers.guest'),
      t('downloadDialog.headers.guests'),
      t('downloadDialog.headers.checkin'),
      t('downloadDialog.headers.checkout'),
      t('downloadDialog.headers.reservationDate'),
      t('downloadDialog.headers.reservationTime'),
      t('downloadDialog.headers.property'),
      t('downloadDialog.headers.confirmationCode'),
      t('downloadDialog.headers.totalAmount'),
    ];

    // Función auxiliar para escapar valores CSV
    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      // Si contiene comas, comillas o saltos de línea, envolver en comillas
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Función para formatear fechas
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    };

    const formatTime = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    // Crear el encabezado CSV
    const csvRows = [headers.map(escapeCSV).join(',')];

    // Agregar información del rango de fechas si existe
    if (dateRangeText) {
      csvRows.push(`"${t('downloadDialog.headers.dateRange')}: ${dateRangeText}"`);
      csvRows.push(''); // Línea en blanco
    }

    // Agregar las filas de datos
    data.forEach((row) => {
      const estadoResult: any = estadoColorReserva(
        row?.bookStatus?.code,
        row?.checkin,
        row?.checkout
      );

      //nuevo- Traducimos el estado para el CSV usando la misma lógica que la tabla
      const statusCode = estadoResult?.code || 'Desconocido';
      const translatedStatus = t(`reservationsTable.status.${statusCode}`, {
        defaultValue: estadoResult?.estado || '',
      });

      const values = [
        //estadoResult?.estado || '',
        translatedStatus, // el estado traducido
        `${row?.userIdRenterNavigation?.name || ''} ${row?.userIdRenterNavigation?.lastName || ''}`.trim(),
        row?.gests || '0',
        formatDate(row?.checkin),
        formatDate(row?.checkout),
        formatDate(row?.datetimePayment),
        formatTime(row?.datetimePayment),
        row?.listingRent?.name || '',
        row?.paymentCode || '',
        formatSemicolon(row?.payPriceCalculations?.[0]?.priceCalculation?.hostResume?.amountToCollect??0) || '',
      ];
      csvRows.push(values.map(escapeCSV).join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    // Agregar BOM para UTF-8 para que Excel reconozca los caracteres especiales
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      if (selectedValue === 'pdf' && pdfDocument) {
        const blob = await pdf(pdfDocument).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (selectedValue === 'csv') {
        const csvContent = convertToCSV(data);
        const filename = fileName
          ? fileName.replace('.pdf', '.csv')
          : t('downloadDialog.filenames.csvDefault');
        downloadCSV(csvContent, filename);
      } else if (selectedValue === 'xlsx') {
        alert(t('downloadDialog.alerts.xlsxComingSoon'));
      }
    } catch (error) {
      console.error('Error al generar el archivo:', error);
      alert(t('downloadDialog.alerts.genericError'));
    } finally {
      setIsDownloading(false);
      onClose();
    }
  };

  return (
    <>
      <CustomDialog isOpen={open} onClose={onClose} maxWidth="xs" title={t('downloadDialog.title')}>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup name="download-format-group" value={selectedValue} onChange={handleChange}>
            <FormControlLabel
              value="csv"
              control={
                <Radio sx={{ '&.Mui-checked': { color: theme.palette.customColors.primary[1] } }} />
              }
              label=".csv"
              sx={{ '.MuiTypography-root': { fontWeight: 500 } }}
            />
            <FormControlLabel
              value="pdf"
              control={
                <Radio sx={{ '&.Mui-checked': { color: theme.palette.customColors.primary[1] } }} />
              }
              label="pdf"
              sx={{ '.MuiTypography-root': { fontWeight: 500 } }}
            />
          </RadioGroup>
        </FormControl>
        <Box display={'flex'} gap={2} mt={2}>
          <Button onClick={handleDownload} variant="primary" fullWidth disabled={isDownloading}>
            {isDownloading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('downloadDialog.button.download')
            )}
          </Button>
        </Box>
      </CustomDialog>
      {/* <Dialog
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 6,
              boxShadow: 3,
              width: 320,
            },
          },
        }}
      >
        <DialogTitle sx={{ p: 2, pb: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {t('downloadDialog.title')}
            </Typography>
            <IconButton aria-label="close" onClick={onClose} sx={{ color: 'black' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider sx={{ mx: 2, borderColor: theme.palette.customColors.primary[1] }} />

        <DialogContent sx={{ p: 2, pt: 1, borderTop: '1px solid #e0e0e0' }}>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup name="download-format-group" value={selectedValue} onChange={handleChange}>
              <FormControlLabel
                value="csv"
                control={
                  <Radio
                    sx={{ '&.Mui-checked': { color: theme.palette.customColors.primary[1] } }}
                  />
                }
                label=".csv"
                sx={{ '.MuiTypography-root': { fontWeight: 500 } }}
              />
              <FormControlLabel
                value="pdf"
                control={
                  <Radio
                    sx={{ '&.Mui-checked': { color: theme.palette.customColors.primary[1] } }}
                  />
                }
                label="pdf"
                sx={{ '.MuiTypography-root': { fontWeight: 500 } }}
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={handleDownload}
            variant="primary"
            fullWidth
            disabled={isDownloading}
          >
            {isDownloading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('downloadDialog.button.download')
            )}
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default DownloadDialog;
