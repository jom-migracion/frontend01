import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTranslation } from 'react-i18next';
import { useGet, usePost } from '@/hooks/api';
import { useSnackbar } from '@/context/SnackbarContext';
import { RestClient } from '@/services/RestClient';
import { useQueryClient } from '@tanstack/react-query';

interface BankAccountRow {
  id: string;
  bank: string;
  bankCode: string;
  accountNumber: string;
  accountDetails: string;
  accStatus: string;
  isPrincipal: boolean;
  expiryDate?: string;
}

interface BankCodeOption {
  Name: string;
  Value: string;
}

interface PayoutFormConfig {
  formOfPaymentId?: number;
  methodOfPaymentId?: number;
  fopCode?: string;
  displayName?: string;
  parametrics?: {
    BankCodes?: BankCodeOption[];
    BankBranch?: string[];
  };
}

const PAGE_SIZE = 5;

const BankAccountGrid: React.FC = () => {
  const { t } = useTranslation();
  const showSnackbar = useSnackbar();
  const queryClient = useQueryClient();
  const { data: payoutAccountsResponse } = useGet<any[]>('payoutAccounts', '/Payout/Account');
  const { data: payoutFormsResponse } = useGet<PayoutFormConfig[]>(
    'enabledPayoutForms',
    '/Payout/GetEnablePayoutForms',
    { countryId: 2 }
  );
  const { mutate: createPayoutAccount, isPending: isCreatingAccount } = usePost<any>('/Payout/Account');

  const [currentPage, setCurrentPage] = useState(1);
  const [defaultAccountId, setDefaultAccountId] = useState<string>('0');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [selectedBankName, setSelectedBankName] = useState('');
  const [selectedBankBranch, setSelectedBankBranch] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [ciNit, setCiNit] = useState('');
  const [alias, setAlias] = useState('');
  const [expirationDate, setExpirationDate] = useState('2026-03-05');
  const [isIndefinite, setIsIndefinite] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);
  const [settingDefaultAccountId, setSettingDefaultAccountId] = useState<string | null>(null);

  const allRows = useMemo<BankAccountRow[]>(() => {
    const accounts = Array.isArray(payoutAccountsResponse?.data) ? payoutAccountsResponse.data : [];

    return accounts.map((item: any, index: number) => ({
      id: String(item?.id ?? item?.accountId ?? item?.payoutAccountId ?? index.toString()),
      bank: String(item?.bank ?? item?.bankName ?? item?.bankDescription ?? '-'),
      bankCode: String(item?.bankCode ?? item?.metadata?.codeBanco ?? item?.codeBanco ?? '-'),
      accountNumber: String(item?.numberAccount ?? item?.accountNumber ?? item?.number ?? item?.accountNo ?? '-'),
      accountDetails: String(
        item?.accountDetails ??
        item?.owner ??
          item?.ownerName ??
          item?.holderName ??
          item?.beneficiaryName ??
          item?.titular ??
          '-'
      ),
      accStatus: String(item?.accStatus ?? item?.status ?? 'ACT'),
      isPrincipal: Boolean(item?.isPrincipal),
      expiryDate: item?.expiryDate ? String(item.expiryDate) : undefined,
    }));
  }, [payoutAccountsResponse]);

  const transferPayoutForm = useMemo(() => {
    const forms = Array.isArray(payoutFormsResponse?.data) ? payoutFormsResponse.data : [];
    return forms.find(
      (item) =>
        item?.fopCode === 'TRS' || String(item?.displayName || '').toLowerCase().includes('transfer')
    );
  }, [payoutFormsResponse]);

  const bankOptions = useMemo<BankCodeOption[]>(() => {
    const options = transferPayoutForm?.parametrics?.BankCodes;
    return Array.isArray(options) ? options : [];
  }, [transferPayoutForm]);

  const bankBranches = useMemo<string[]>(() => {
    const options = transferPayoutForm?.parametrics?.BankBranch;
    return Array.isArray(options) ? options : [];
  }, [transferPayoutForm]);

  useEffect(() => {
    if (bankOptions.length === 0) {
      setSelectedBankCode('');
      setSelectedBankName('');
      return;
    }

    const selectedBank = bankOptions.find((item) => item.Value === selectedBankCode);
    if (!selectedBank) {
      setSelectedBankCode(bankOptions[0].Value);
      setSelectedBankName(bankOptions[0].Name);
      return;
    }

    setSelectedBankName(selectedBank.Name);
  }, [bankOptions, selectedBankCode]);

  useEffect(() => {
    if (bankBranches.length === 0) {
      setSelectedBankBranch('');
      return;
    }

    if (!bankBranches.includes(selectedBankBranch)) {
      setSelectedBankBranch(bankBranches[0]);
    }
  }, [bankBranches, selectedBankBranch]);

  useEffect(() => {
    if (allRows.length === 0) {
      setDefaultAccountId('0');
      return;
    }

    const principalRow = allRows.find((row) => row.isPrincipal);
    if (principalRow) {
      setDefaultAccountId(String(principalRow.id));
      return;
    }

    setDefaultAccountId((prev) => (allRows.some((row) => row.id === prev) ? prev : String(allRows[0].id)));
  }, [allRows]);

  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));
    if (currentPage > maxPages) {
      setCurrentPage(maxPages);
    }
  }, [allRows.length, currentPage]);

  const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));

  const rows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allRows.slice(start, start + PAGE_SIZE);
  }, [currentPage, allRows]);

  const activeBankCodeCounts = useMemo(() => {
    return allRows.reduce((acc, row) => {
      if (row.accStatus !== 'DEL') {
        acc[row.bankCode] = (acc[row.bankCode] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [allRows]);

  const resetForm = () => {
    setSelectedBankCode(bankOptions[0]?.Value || '');
    setSelectedBankName(bankOptions[0]?.Name || '');
    setSelectedBankBranch(bankBranches[0] || '');
    // setAccountType('CAJA DE AHORRO - CUENTA CORRIENTE');
    setAccountNumber('');
    setAccountDetails('');
    setCiNit('');
    setAlias('');
    setExpirationDate('2026-03-05');
    setIsIndefinite(false);
  };

  const handleCreateAccount = () => {
    if (!accountNumber.trim() || !accountDetails.trim() || !alias.trim()) {
      showSnackbar(t('accountSettings.payments.bankGrid.messages.validationError', { defaultValue: 'Completa los campos requeridos para registrar la cuenta.' }), 'error');
      return;
    }

    if (!transferPayoutForm?.formOfPaymentId || !transferPayoutForm?.methodOfPaymentId) {
      showSnackbar(t('accountSettings.payments.bankGrid.messages.configError', { defaultValue: 'No se encontró la configuración de transferencia para crear la cuenta.' }), 'error');
      return;
    }

    const payload = {
      accountNumber: accountNumber.trim(),
      alias: alias.trim(),
      isPrincipal: allRows.length === 0,
      branchBank: selectedBankBranch || 'LPZ',
      currencyCode: 'BOB',
      formOfPaymentId: transferPayoutForm.formOfPaymentId,
      methodOfPaymentId: transferPayoutForm.methodOfPaymentId,
      metadata: {
        codeBanco: selectedBankCode || selectedBankName,
        ciNit: ciNit.trim() || 'S/N',
        holder: accountDetails.trim(),
      },
      expiryDate: isIndefinite
        ? new Date('2099-12-31T00:00:00.000Z').toISOString()
        : new Date(`${expirationDate}T00:00:00`).toISOString(),
    };

    createPayoutAccount(payload, {
      onSuccess: (response) => {
        if (response?.statusCode === '200' && !response?.hasError) {
          showSnackbar(t('accountSettings.payments.bankGrid.messages.createSuccess', { defaultValue: 'Cuenta registrada correctamente.' }), 'success');
          setIsModalOpen(false);
          resetForm();
          return;
        }

        showSnackbar(response?.resultError?.message || t('accountSettings.payments.bankGrid.messages.createError', { defaultValue: 'No se pudo registrar la cuenta.' }), 'error');
      },
      onError: (error) => {
        showSnackbar(error?.response?.data?.resultError?.message || t('accountSettings.payments.bankGrid.messages.createError', { defaultValue: 'No se pudo registrar la cuenta.' }), 'error');
      },
    });
  };

  const handleDeleteAccount = async (accountId: string) => {
    const confirmed = window.confirm(t('accountSettings.payments.bankGrid.messages.deleteConfirm', { defaultValue: '¿Estás seguro de eliminar esta cuenta?' }));
    if (!confirmed) return;

    setDeletingAccountId(accountId);
    try {
      const response = await RestClient.delete(`/Payout/Account/Delete/${accountId}`);
      if (response?.data?.statusCode === '200' && !response?.data?.hasError) {
        showSnackbar(t('accountSettings.payments.bankGrid.messages.deleteSuccess', { defaultValue: 'Cuenta eliminada correctamente.' }), 'success');
        queryClient.invalidateQueries({ queryKey: ['payoutAccounts'] });
        return;
      }

      showSnackbar(response?.data?.resultError?.message || t('accountSettings.payments.bankGrid.messages.deleteError', { defaultValue: 'No se pudo eliminar la cuenta.' }), 'error');
    } catch (error: any) {
      showSnackbar(error?.response?.data?.resultError?.message || t('accountSettings.payments.bankGrid.messages.deleteError', { defaultValue: 'No se pudo eliminar la cuenta.' }), 'error');
    } finally {
      setDeletingAccountId(null);
    }
  };

  const handleSetDefaultAccount = async (accountId: string) => {
    setSettingDefaultAccountId(accountId);
    try {
      const response = await RestClient.patch(`/Payout/Account/Default/${accountId}`, {});

      if (response?.data?.statusCode === '200' && !response?.data?.hasError) {
        setDefaultAccountId(accountId);
        showSnackbar(t('accountSettings.payments.bankGrid.messages.defaultSuccess', { defaultValue: 'Cuenta principal actualizada correctamente.' }), 'success');
        queryClient.invalidateQueries({ queryKey: ['payoutAccounts'] });
        return;
      }

      showSnackbar(
        response?.data?.resultError?.message || t('accountSettings.payments.bankGrid.messages.defaultError', { defaultValue: 'No se pudo actualizar la cuenta principal.' }),
        'error'
      );
    } catch (error: any) {
      showSnackbar(
        error?.response?.data?.resultError?.message || t('accountSettings.payments.bankGrid.messages.defaultError', { defaultValue: 'No se pudo actualizar la cuenta principal.' }),
        'error'
      );
    } finally {
      setSettingDefaultAccountId(null);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: '16px',
          border: '1px solid #e0e0e0',
          minHeight: 300,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="bank account table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: 200 }}>{t('accountSettings.payments.bankGrid.bank', { defaultValue: 'Banco' })}</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 150 }}>
                {t('accountSettings.payments.bankGrid.account', {
                  defaultValue: 'Número de cuenta',
                })}
              </TableCell>
              <TableCell sx={{ fontWeight: 700, width: 180 }}>{t('accountSettings.payments.bankGrid.owner', { defaultValue: 'Alias' })}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: 140 }}>
                {t('accountSettings.payments.bankGrid.status', {
                  defaultValue: 'Estado',
                })}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: 150 }}>
                {t('accountSettings.payments.bankGrid.defaultAction', {
                  defaultValue: 'Predeterminado',
                })}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, width: 130 }}>
                {t('accountSettings.payments.bankGrid.deleteAction', {
                  defaultValue: 'Eliminar',
                })}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => {
              const isDefault = row.id === defaultAccountId;
              const isDeleted = row.accStatus === 'DEL';
              const isExpired = row.accStatus === 'EXP';
              const isOnlyAccountForBank = activeBankCodeCounts[row.bankCode] <= 1;

              return (
                <TableRow 
                  key={row.id} 
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    ...(isExpired && {
                      backgroundColor: 'rgba(255, 152, 0, 0.08)',
                      '& td': {
                        borderLeft: '4px solid #FF9800',
                      }
                    })
                  }}
                >
                  <TableCell sx={{ fontWeight: 700, width: 200, paddingY: 1.5 }}>{row.bank}</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 150, paddingY: 1.5 }}>{row.accountNumber}</TableCell>
                  <TableCell sx={{ width: 180, paddingY: 1.5 }}>{row.accountDetails}</TableCell>

                  <TableCell align="center" sx={{ width: 140, fontWeight: 700, paddingY: 1.5 }}>
                    <Box>
                      {row.accStatus === 'ACT'
                        ? t('accountSettings.payments.bankGrid.activeStatus', { defaultValue: 'Activo' })
                        : row.accStatus === 'DEL'
                          ? t('accountSettings.payments.bankGrid.deletedStatus', {
                              defaultValue: 'Eliminado',
                            })
                          : row.accStatus === 'EXP'
                            ? t('accountSettings.payments.bankGrid.expiredStatus', {
                                defaultValue: 'Expirado',
                              })
                            : row.accStatus}
                    </Box>
                    {row.accStatus === 'EXP' && row.expiryDate && (
                      <Typography variant="caption" sx={{ display: 'block', fontSize: '0.75rem', color: '#FF9800', fontWeight: 600, mt: 0.25 }}>
                        {new Date(row.expiryDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 150, paddingY: 1.5 }}>
                    {!isDeleted && !isExpired && (
                      <Button
                        variant={isDefault ? 'contained' : 'outlined'}
                        onClick={() => handleSetDefaultAccount(row.id)}
                        disabled={settingDefaultAccountId === row.id}
                        sx={{
                          textTransform: 'none',
                          minWidth: 120,
                          borderRadius: 1.5,
                          fontWeight: 700,
                          ...(isDefault
                            ? {
                                backgroundColor: '#5C4FB2',
                                '&:hover': { backgroundColor: '#4f4499' },
                              }
                            : {
                                color: '#5C4FB2',
                                borderColor: '#5C4FB2',
                                '&:hover': {
                                  borderColor: '#4f4499',
                                  color: '#4f4499',
                                  backgroundColor: 'rgba(92,79,178,0.06)',
                                },
                              }),
                        }}
                      >
                        {isDefault
                          ? t('accountSettings.payments.bankGrid.default', { defaultValue: 'Por defecto' })
                          : t('accountSettings.payments.bankGrid.setDefault', {
                              defaultValue: 'Establecer por defecto',
                            })}
                      </Button>
                    )}
                  </TableCell>

                  <TableCell align="center" sx={{ width: 130, paddingY: 1.5 }}>
                    {!isDeleted && (
                      <Button
                        variant="outlined"
                        color={isExpired ? 'error' : 'inherit'}
                        onClick={() => handleDeleteAccount(row.id)}
                        disabled={deletingAccountId === row.id || (isOnlyAccountForBank && !isExpired)}
                        startIcon={<DeleteOutlineIcon />}
                        sx={{ textTransform: 'none', minWidth: 110, borderRadius: 1.5 }}
                      >
                        {t('accountSettings.payments.bankGrid.deleteAction', { defaultValue: 'Eliminar' })}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
        <Pagination
          color="primary"
          shape="rounded"
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
        />
      </Stack>

      <Box sx={{ px: 1, pb: 1 }}>
        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          sx={{
            backgroundColor: '#5C4FB2',
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            '&:hover': { backgroundColor: '#4f4499' },
          }}
        >
          <Typography sx={{ fontWeight: 500,color: '#fff' }}>
            {t('accountSettings.payments.bankGrid.add', { defaultValue: 'Agregar' })}
            <Box component="span" sx={{ ml: 1, fontWeight: 700,color: '#fff' }}>
              {t('accountSettings.payments.bankGrid.accountNoun', { defaultValue: 'Cuenta' })}
            </Box>
          </Typography>
        </Button>
      </Box>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: { xs: 1, md: 2 },
          },
        }}
      >
        <DialogContent>
          <Stack spacing={2.25}>
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={2}>
              <Typography sx={{ width: { md: 240 }, fontWeight: 700, color: '#5A5A5A' }}>
                {t('accountSettings.payments.bankGrid.modal.banksLabel', { defaultValue: 'Bancos:' })}
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedBankCode}
                  onChange={(event) => {
                    const nextCode = String(event.target.value);
                    const option = bankOptions.find((item) => item.Value === nextCode);
                    setSelectedBankCode(nextCode);
                    setSelectedBankName(option?.Name || '');
                  }}
                  sx={{
                    backgroundColor: '#5C4FB2',
                    color: '#fff',
                    '& .MuiSvgIcon-root': { color: '#fff' },
                  }}
                >
                  {bankOptions.length === 0 ? (
                    <MenuItem value="" disabled>
                      {t('accountSettings.payments.bankGrid.modal.noBanks', { defaultValue: 'Sin bancos disponibles' })}
                    </MenuItem>
                  ) : (
                    bankOptions.map((option) => (
                      <MenuItem key={option.Value} value={option.Value}>
                        {option.Name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={2}>
              <Typography sx={{ width: { md: 240 }, fontWeight: 700, color: '#5A5A5A' }}>
                {t('accountSettings.payments.bankGrid.modal.accountNumberLabel', { defaultValue: 'Numero de cuenta a adicionar:' })}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={accountNumber}
                onChange={(event) => setAccountNumber(event.target.value)}
              />
            </Stack>

            <Box
              sx={{
                ml: { md: '256px' },
                border: '1px solid #f0c976',
                backgroundColor: '#FFF6D6',
                borderRadius: 1.5,
                p: 1.5,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <WarningAmberIcon sx={{ color: '#C7941E', mt: 0.25 }} fontSize="small" />
                <Typography sx={{ fontSize: 14, color: '#5E5E5E' }}>
                  {t('accountSettings.payments.bankGrid.modal.warningText', { defaultValue: 'Es responsabilidad del cliente verificar el numero de cuenta del destinatario, este registro es importante para que se complete la transaccion.' })}
                </Typography>
              </Stack>
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={2}>
              <Typography sx={{ width: { md: 240 }, fontWeight: 700, color: '#5A5A5A' }}>
                {t('accountSettings.payments.bankGrid.modal.ownerLabel', { defaultValue: 'Titular:' })}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={accountDetails}
                onChange={(event) => setAccountDetails(event.target.value)}
              />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={2}>
              <Typography sx={{ width: { md: 240 }, fontWeight: 700, color: '#5A5A5A' }}>
                {t('accountSettings.payments.bankGrid.modal.ciNitLabel', { defaultValue: 'CI/NIT:' })}
              </Typography>
              <TextField fullWidth size="small" value={ciNit} onChange={(event) => setCiNit(event.target.value)} />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={2}>
              <Typography sx={{ width: { md: 240 }, fontWeight: 700, color: '#5A5A5A' }}>
                {t('accountSettings.payments.bankGrid.modal.aliasLabel', { defaultValue: 'Alias:' })}
              </Typography>
              <TextField fullWidth size="small" value={alias} onChange={(event) => setAlias(event.target.value)} />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={2}>
              <Typography sx={{ width: { md: 240 }, fontWeight: 700, color: '#5A5A5A' }}>
                {t('accountSettings.payments.bankGrid.modal.expirationDateLabel', { defaultValue: 'Fecha de Vencimiento' })}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                <TextField
                  type="date"
                  size="small"
                  value={expirationDate}
                  onChange={(event) => setExpirationDate(event.target.value)}
                  disabled={isIndefinite}
                  sx={{ width: { xs: '100%', md: 230 } }}
                  InputLabelProps={{ shrink: true }}
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={isIndefinite} onChange={(event) => setIsIndefinite(event.target.checked)} />
                  }
                  label={t('accountSettings.payments.bankGrid.modal.indefinite', { defaultValue: 'Indefinido' })}
                />
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="center" spacing={2} sx={{ pt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                sx={{ textTransform: 'none', borderColor: '#5C4FB2', color: '#5C4FB2', minWidth: 150 }}
              >
                {t('accountSettings.payments.bankGrid.modal.cancel', { defaultValue: 'Cancelar' })}
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateAccount}
                disabled={isCreatingAccount}
                sx={{
                  textTransform: 'none',
                  minWidth: 180,
                  borderRadius: 2,
                  backgroundColor: '#5C4FB2',
                  '&:hover': { backgroundColor: '#4f4499' },
                }}
              >
                {t('accountSettings.payments.bankGrid.add', { defaultValue: 'Agregar' })}
                <Box component="span" sx={{ ml: 1, fontWeight: 700 }}>
                  {t('accountSettings.payments.bankGrid.accountNoun', { defaultValue: 'Cuenta' })}
                </Box>
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BankAccountGrid;