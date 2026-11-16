import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Link,
  Skeleton,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InvoicePdfDocument from '../components/InvoicePdfDocument';
import { ApiService } from '@/services/ApiService';
import ResponseAssert from '@/models/interfaces/backend/ResponseAssert';
import { useTranslation } from 'react-i18next';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: string;
  role: string;
  pdfUrl?: string;
}

interface GroupedInvoices {
  [year: string]: Invoice[];
}

interface InvoiceListProps {
  type: 'guest' | 'host';
}

const hasInvoices = (groupedInvoices: GroupedInvoices): boolean => {
  return Object.values(groupedInvoices).some((invoices) => invoices.length > 0);
};

const createFallbackInvoices = (role: Invoice['role']): GroupedInvoices => {
  const fallbackRawInvoices = [
    { id: `mock-${role}-1`, invoiceNumber: 'FAC-2026-001', invoiceDate: '2026-04-10', amount: 1250.5 },
    { id: `mock-${role}-2`, invoiceNumber: 'FAC-2026-002', invoiceDate: '2026-03-22', amount: 980 },
    { id: `mock-${role}-3`, invoiceNumber: 'FAC-2025-104', invoiceDate: '2025-12-16', amount: 1490.75 },
  ];

  return fallbackRawInvoices.reduce((accumulator, item, index) => {
    const year = getInvoiceYear(item.invoiceDate);

    if (!accumulator[year]) {
      accumulator[year] = [];
    }

    accumulator[year].push({
      id: item.id,
      invoiceNumber: item.invoiceNumber,
      date: formatInvoiceDate(item.invoiceDate),
      amount: formatInvoiceAmount(item.amount),
      role,
      pdfUrl: undefined,
    });

    return accumulator;
  }, {} as GroupedInvoices);
};

const GUEST_INVOICES_URL = '/Invoice/MyInvoices/Type/GUEST';
const HOST_INVOICES_URL = '/Invoice/MyInvoices/Type/HOST';

const formatInvoiceDate = (value: unknown): string => {
  if (!value) {
    return '';
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const formatInvoiceAmount = (value: unknown): string => {
  const parsedValue = Number(value ?? 0);
  if (Number.isNaN(parsedValue)) {
    return String(value ?? 'Bs 0.00');
  }

  return `Bs ${parsedValue.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getInvoiceYear = (value: unknown): string => {
  if (!value) {
    return 'Sin fecha';
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }

  return String(date.getFullYear());
};

const extractInvoiceArray = (data: unknown): Record<string, unknown>[] => {
  if (Array.isArray(data)) {
    return data as Record<string, unknown>[];
  }

  if (!data || typeof data !== 'object') {
    return [];
  }

  const source = data as Record<string, unknown>;
  const possibleArrays = [source.items, source.invoices, source.results, source.data];

  const foundArray = possibleArrays.find((entry) => Array.isArray(entry));
  return (foundArray as Record<string, unknown>[]) ?? [];
};

const mapApiInvoice = (rawInvoice: Record<string, unknown>, index: number): Invoice & { year: string } => {
  const invoiceDate =
    rawInvoice.invoiceDate ?? rawInvoice.issueDate ?? rawInvoice.createdAt ?? rawInvoice.date;
  const invoiceNumber =
    rawInvoice.invoiceNumber ?? rawInvoice.number ?? rawInvoice.documentNumber ?? `FAC-${index + 1}`;
  const invoiceId =
    rawInvoice.id ?? rawInvoice.invoiceId ?? rawInvoice.userInvoiceId ?? `${invoiceNumber}-${index}`;
  const amountValue =
    rawInvoice.amount ?? rawInvoice.totalAmount ?? rawInvoice.total ?? rawInvoice.subtotal ?? 0;

  return {
    id: String(invoiceId),
    invoiceNumber: String(invoiceNumber),
    date: formatInvoiceDate(invoiceDate),
    amount: formatInvoiceAmount(amountValue),
    role: 'Huésped',
    pdfUrl: (rawInvoice.pdfUrl as string) || (rawInvoice.invoicePdfUrl as string) || undefined,
    year: getInvoiceYear(invoiceDate),
  };
};

export const numberToLiteral = (number: number | string): string => {
    let num = typeof number === 'string' ? parseFloat(number) : number;
    
    if (isNaN(num)) return 'CERO 00/100 BOLIVIANOS';

    const enteros = Math.floor(num);
    const centavos = Math.round((num - enteros) * 100);
    const centavosStr = centavos.toString().padStart(2, '0');

    if (enteros === 0) {
        return `CERO ${centavosStr}/100 BOLIVIANOS`;
    }

    const unidades = (num: number): string => {
        switch (num) {
            case 1: return 'UN';
            case 2: return 'DOS';
            case 3: return 'TRES';
            case 4: return 'CUATRO';
            case 5: return 'CINCO';
            case 6: return 'SEIS';
            case 7: return 'SIETE';
            case 8: return 'OCHO';
            case 9: return 'NUEVE';
            default: return '';
        }
    };

    const decenas = (num: number): string => {
        const decena = Math.floor(num / 10);
        const unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0: return 'DIEZ';
                    case 1: return 'ONCE';
                    case 2: return 'DOCE';
                    case 3: return 'TRECE';
                    case 4: return 'CATORCE';
                    case 5: return 'QUINCE';
                    default: return 'DIECI' + unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + unidades(unidad);
                }
            case 3: return unidades(unidad) === '' ? 'TREINTA' : 'TREINTA Y ' + unidades(unidad);
            case 4: return unidades(unidad) === '' ? 'CUARENTA' : 'CUARENTA Y ' + unidades(unidad);
            case 5: return unidades(unidad) === '' ? 'CINCUENTA' : 'CINCUENTA Y ' + unidades(unidad);
            case 6: return unidades(unidad) === '' ? 'SESENTA' : 'SESENTA Y ' + unidades(unidad);
            case 7: return unidades(unidad) === '' ? 'SETENTA' : 'SETENTA Y ' + unidades(unidad);
            case 8: return unidades(unidad) === '' ? 'OCHENTA' : 'OCHENTA Y ' + unidades(unidad);
            case 9: return unidades(unidad) === '' ? 'NOVENTA' : 'NOVENTA Y ' + unidades(unidad);
            case 0: return unidades(unidad);
            default: return '';
        }
    };

    const centenas = (num: number): string => {
        const centena = Math.floor(num / 100);
        const decena = num - (centena * 100);

        switch (centena) {
            case 1: return decena > 0 ? 'CIENTO ' + decenas(decena) : 'CIEN';
            case 2: return 'DOSCIENTOS ' + decenas(decena);
            case 3: return 'TRESCIENTOS ' + decenas(decena);
            case 4: return 'CUATROCIENTOS ' + decenas(decena);
            case 5: return 'QUINIENTOS ' + decenas(decena);
            case 6: return 'SEISCIENTOS ' + decenas(decena);
            case 7: return 'SETECIENTOS ' + decenas(decena);
            case 8: return 'OCHOCIENTOS ' + decenas(decena);
            case 9: return 'NOVECIENTOS ' + decenas(decena);
            default: return decenas(decena);
        }
    };

    const miles = (num: number): string => {
        const divisor = 1000;
        const cientos = Math.floor(num / divisor);
        const resto = num - (cientos * divisor);
        const strMiles = centenas(cientos);
        const strResto = centenas(resto);

        if (cientos === 0) return strResto;
        if (cientos === 1) return strResto === '' ? 'MIL' : 'MIL ' + strResto;
        return strResto === '' ? strMiles + ' MIL' : strMiles + ' MIL ' + strResto;
    };

    const millones = (num: number): string => {
        const divisor = 1000000;
        const cientos = Math.floor(num / divisor);
        const resto = num - (cientos * divisor);
        const strMillones = miles(cientos);
        const strResto = miles(resto);

        if (cientos === 0) return strResto;
        if (cientos === 1) return strResto === '' ? 'UN MILLON' : 'UN MILLON ' + strResto;
        return strResto === '' ? strMillones + ' MILLONES' : strMillones + ' MILLONES ' + strResto;
    };

    const resultadoLiteral = millones(enteros).trim();
    return `${resultadoLiteral} ${centavosStr}/100 BOLIVIANOS`;
};

const InvoiceList = ({ type }: InvoiceListProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'InvoiceList' });
  const [guestInvoices, setGuestInvoices] = useState<GroupedInvoices>({});
  const [hostInvoices, setHostInvoices] = useState<GroupedInvoices>({});
  const [isLoadingGuestInvoices, setIsLoadingGuestInvoices] = useState(false);
  const [isLoadingHostInvoices, setIsLoadingHostInvoices] = useState(false);
  const [guestInvoicesError, setGuestInvoicesError] = useState<string>('');
  const [hostInvoicesError, setHostInvoicesError] = useState<string>('');
  const theme = useTheme();

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const buildGroupedInvoices = (responseData: unknown) => {
    const rawInvoices = extractInvoiceArray(responseData);
    const mappedInvoices = rawInvoices.map(mapApiInvoice);

    return mappedInvoices.reduce((accumulator, invoice) => {
      if (!accumulator[invoice.year]) {
        accumulator[invoice.year] = [];
      }

      accumulator[invoice.year].push({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date,
        amount: invoice.amount,
        role: invoice.role,
        pdfUrl: invoice.pdfUrl,
      });

      return accumulator;
    }, {} as GroupedInvoices);
  };

  useEffect(() => {
    const fetchGuestInvoices = async () => {
      setIsLoadingGuestInvoices(true);
      setGuestInvoicesError('');

      try {
        const response = await ApiService.get<ResponseAssert<unknown>>(GUEST_INVOICES_URL, {
          pageNumber: 1,
          pageSize: 20,
        });

        if (response?.hasError) {
          setGuestInvoices({});
          setGuestInvoicesError(t('fetchError', { defaultValue: 'No fue posible obtener las facturas.' }));
          return;
        }

        const groupedInvoices = buildGroupedInvoices(response?.data);
        setGuestInvoices(hasInvoices(groupedInvoices) ? groupedInvoices : createFallbackInvoices(t('roles.guest', { defaultValue: 'Huésped' })));
      } catch (error) {
        console.error('Error al consultar facturas del huésped:', error);
        setGuestInvoices({});
        setGuestInvoicesError(t('fetchError', { defaultValue: 'No fue posible obtener las facturas.' }));
      } finally {
        setIsLoadingGuestInvoices(false);
      }
    };

    const fetchHostInvoices = async () => {
      setIsLoadingHostInvoices(true);
      setHostInvoicesError('');

      try {
        const response = await ApiService.get<ResponseAssert<unknown>>(HOST_INVOICES_URL, {
          pageNumber: 1,
          pageSize: 20,
        });

        if (response?.hasError) {
          setHostInvoices({});
          setHostInvoicesError(t('fetchError', { defaultValue: 'No fue posible obtener las facturas.' }));
          return;
        }

        const groupedInvoices = buildGroupedInvoices(response?.data);
        setHostInvoices(hasInvoices(groupedInvoices) ? groupedInvoices : createFallbackInvoices(t('roles.host', { defaultValue: 'Anfitrión' })));
      } catch (error) {
        console.error('Error al consultar facturas del anfitrión:', error);
        setHostInvoices({});
        setHostInvoicesError(t('fetchError', { defaultValue: 'No fue posible obtener las facturas.' }));
      } finally {
        setIsLoadingHostInvoices(false);
      }
    };

    fetchGuestInvoices();
    fetchHostInvoices();
  }, []);

  const currentInvoices = type === 'guest' ? guestInvoices : hostInvoices;
  const isLoadingCurrentInvoices = type === 'guest' ? isLoadingGuestInvoices : isLoadingHostInvoices;
  const currentInvoicesError = type === 'guest' ? guestInvoicesError : hostInvoicesError;
  const currentYears = useMemo(() => {
    return Object.keys(currentInvoices).sort((a, b) => {
      const noDateLabel = t('noDate', { defaultValue: 'Sin fecha' });
      if (a === noDateLabel) return 1;
      if (b === noDateLabel) return -1;
      return Number(b) - Number(a);
    });
  }, [currentInvoices]);

  const handleDownloadPDF = async (invoice: Invoice) => {
    setDownloadingId(invoice.id);
    
    try {
      const response = await ApiService.get<any>(`/SiatInvoice/${invoice.id}`);
      // Accedemos a response.data.data basándonos en el JSON que enviaste
      const safeData = response?.data?.data || response?.data || {};

      // Formateamos las líneas (antes details, ahora lines)
      const formattedItems = (safeData?.lines || []).map((line: any) => ({
        description: line.conceptDescription || '',
        quantity: line.quantity || 1,
        unitPrice: line.unitPrice || 0,
        subTotal: line.lineSubtotal || 0,
      }));

      const montoLiteralFinal = safeData?.totalLiteral || numberToLiteral(safeData?.totalAmount || 0);

      const pdfDocument = (
        <InvoicePdfDocument
          invoiceNumber={String(safeData?.invoiceNumber || invoice?.invoiceNumber || '')}
          nit={safeData?.issuerNit || ''}
          date={formatInvoiceDate(safeData?.issueDateTime) || 'Sin fecha'}
          totalAmount={Number(safeData?.totalAmount || 0).toFixed(2)}
          
          clientName={safeData?.customerName || ''} 
          clientDocument={String(safeData?.customerDocumentNumber || '')}
          
          // El CUF ahora viene dentro de fiscalData
          authorizationCode={safeData?.fiscalData?.cuf || ''} 
          
          literalAmount={montoLiteralFinal} 
          subtotalAmount={Number(safeData?.subtotalAmount || 0).toFixed(2)}
          discountAmount={Number(safeData?.discountAmount || 0).toFixed(2)} 
          items={formattedItems}

          // Datos de la sucursal inyectados dinámicamente
          issuerName={safeData?.issuerBusinessName || 'JOM'}
          issuerCity={safeData?.issuerCity || 'Santa Cruz de la Sierra - Bolivia'}
          issuerBranchName={safeData?.issuerBranchName || 'Sucursal'}
          issuerAddress={safeData?.issuerAddress || ''}
          issuerPhone={safeData?.issuerPhone || ''}

          legend={safeData?.legend || ''}
        />
      );

      const blob = await pdf(pdfDocument).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Factura_JOM_${safeData?.invoiceNumber || invoice?.invoiceNumber || 'Descarga'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error al generar la factura PDF:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const EmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
      }}
    >
      <DescriptionOutlinedIcon
        sx={{
          fontSize: 64,
          color: 'text.disabled',
          mb: 2,
          p: 2,
          borderRadius: '50%',
          backgroundColor: '#f7f7f7',
        }}
      />
      <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 300 }}>
        {t('emptyState', { defaultValue: 'Aún no tienes facturas emitidas en este periodo' })}
      </Typography>
    </Box>
  );

  const InvoiceListSkeleton = () => (
    <Stack spacing={3} sx={{ mt: 1 }}>
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <Box key={sectionIndex}>
          <Skeleton variant="text" width={90} height={26} sx={{ mb: 1 }} />
          <Stack spacing={1.5}>
            {Array.from({ length: 2 }).map((__, cardIndex) => (
              <Card key={`${sectionIndex}-${cardIndex}`} elevation={0}>
                <CardContent>
                  <Skeleton variant="text" width={160} height={26} />
                  <Skeleton variant="text" width={180} height={22} />
                  <Skeleton variant="rounded" width={78} height={22} sx={{ mt: 0.5 }} />
                  <Skeleton variant="text" width={90} height={30} sx={{ mt: 1.5, ml: 'auto' }} />
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4, px: 2 }}>
      <Box>
        {isLoadingCurrentInvoices ? (
          <InvoiceListSkeleton />
        ) : null}

        {!isLoadingCurrentInvoices && currentInvoicesError ? (
          <Typography variant="body2" color="error" sx={{ px: 2, py: 1 }}>
            {currentInvoicesError}
          </Typography>
        ) : null}

        {!isLoadingCurrentInvoices
          ? currentYears.map((year) => (
            <Box key={year} sx={{ mb: 4 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ pl: 2, pt: 0.5, pb: 0.5, mb: 2, fontWeight: 600, background: '#f7f7f7' }}
              >
                {year}
              </Typography>

              {currentInvoices[year].length > 0 ? (
                <Stack spacing={2} sx={{ m: 0.3 }}>
                  {currentInvoices[year].map((invoice) => (
                    <Card
                      key={invoice.id}
                      elevation={0}
                      sx={{
                        borderBottom: '1px solid #f7f7f7',
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
                              {invoice.invoiceNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {invoice.date}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'primary.main',
                                fontWeight: 500,
                                backgroundColor: '#eef2ff',
                                borderRadius: 3,
                                pr: 1,
                                pl: 1,
                                pt: 0.4,
                                pb: 0.4,
                                m: 0.2,
                              }}
                            >
                              {invoice.role}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'table-column',
                              alignItems: 'right',
                              textAlign: 'right',
                              gap: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                            >
                              {invoice.amount}
                            </Typography>

                            {/* <Button
                              variant="text"
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownloadPDF(invoice)}
                              sx={{
                                textTransform: 'none',
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  color: theme.palette.primary.light,
                                },
                              }}
                            >
                              PDFf
                            </Button> */}

                            {/* nuevo boton */}
                            <Button
                              variant="text"
                              size="small"
                              startIcon={downloadingId === invoice.id ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
                              onClick={() => handleDownloadPDF(invoice)}
                              disabled={downloadingId === invoice.id}
                              sx={{
                                textTransform: 'none',
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  color: theme.palette.primary.light,
                                },
                                '&.Mui-disabled': {
                                  color: theme.palette.action.disabled,
                                }
                              }}
                            >
                              {downloadingId === invoice.id ? 'Generando...' : 'PDF'}
                            </Button>


                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <EmptyState />
              )}
            </Box>
          ))
          : null}
      </Box>

      <Box
        sx={{
          py: 3,
          backgroundColor: '#e9e9e9',
          borderRadius: 4,
          mt: 10,
          mb: 4,
          mr: 4,
          ml: 4,
          p: 4,
        }}
      >
        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
          {t('helpTitle', { defaultValue: '¿Necesitas ayuda?' })}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('helpDesc', { defaultValue: 'Resuelve las dudas que tengas sobre las facturas en nuestro centro de ayuda.' })}
        </Typography>
        <Link
          href="/help-center"
          underline="hover"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {t('helpLink', { defaultValue: 'Visitar Centro de Ayuda' })}
          <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </Link>
      </Box>
    </Box>
  );
};

export default InvoiceList;
