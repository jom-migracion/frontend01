import { Box, Typography, IconButton, Button, Divider, Modal, FormControl, Select, MenuItem, Switch, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGet, usePut } from '@/hooks/api';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { RuleTypes } from '@/models/interfaces/ListingRentResponseStep';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTranslation } from 'react-i18next';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add'
import Grid from '@mui/material/Grid2';
import { timeOptions } from '@/common/constants/timeOptionsCheckInCheckout';
import { SwitchProps } from '@mui/material/Switch';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import SmokingRoomsOutlinedIcon from '@mui/icons-material/SmokingRoomsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';

const JOMSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#5B55C8',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

const SelectorReglasCasa: React.FC<{ listingRentId: number; rentRules: RuleTypes[] }> = ({
  rentRules,
  listingRentId,
}) => {
  // useState
  const [openModal, setOpenModal] = useState(false);
  const [iniQuietHours, setIniQuietHours] = React.useState<string>('');
  const [endQuietHours, setEndQuietHours] = React.useState<string>('');
  const [seePetAllowed, setSeePetAllowed] = React.useState<boolean>(false);
  const [petAllowed, setPetAllowed] = React.useState<number>(0);

  const [openQuietHours, setOpenQuietHours] = React.useState<boolean>(false);
  const [petError, setPetError] = React.useState<boolean>(false);
  const [quietHoursError, setQuietHoursError] = React.useState<boolean>(false);
  const [quietHoursSameError, setQuietHoursSameError] = React.useState<boolean>(false);

  // api
  const { data: ParamListingRentRentRules, isLoading } = useGet<RuleTypes[]>(
    'ParamListingRentRentRules',
    '/Parametrics/RentRules'
  );

  const { mutate: UpdateRules, isPending } = usePut(
    `/Host/ListingRent/${listingRentId}/UpdateRulesV2`
  );

  const [ruleStates, setRuleStates] = useState<RuleTypes[]>([]);

  // functions
  const handleToggleRule = (clickedRule: RuleTypes, select: boolean, ids?: number[]) => {
    setRuleStates((prevRules: RuleTypes[]) =>
      prevRules.map((rule) => {
        if (ids) {
          return {
            ...rule,
            isSelected: ids.includes(rule.ruleTypeId),
          };
        } else if ('ruleTypeId' in clickedRule) {
          return rule.ruleTypeId === clickedRule.ruleTypeId
            ? { ...rule, isSelected: select }
            : rule;
        }
        return rule;
      })
    );
    if (clickedRule?.code == "ALLOW_PETS" && select) {
      setSeePetAllowed(true);
    } else if (clickedRule?.code == "ALLOW_PETS" && !select) {
      setSeePetAllowed(false);
      setPetAllowed(0);
      setPetError(false);
    }

    if (clickedRule?.code == "QUIET_HOURS" && select) {
      setOpenQuietHours(true);
    } else if (clickedRule?.code == "QUIET_HOURS" && !select) {
      setOpenQuietHours(false);
      setEndQuietHours('');
      setIniQuietHours('');
      setQuietHoursError(false);
      setQuietHoursSameError(false);
    }

  };

  const handleGuardar = async () => {
    let hasError = false;
    if (seePetAllowed && petAllowed <= 0) {
      setPetError(true);
      hasError = true;
    }
    if (openQuietHours && (!iniQuietHours || !endQuietHours)) {
      setQuietHoursError(true);
      hasError = true;
    }
    if (openQuietHours && iniQuietHours && endQuietHours && iniQuietHours === endQuietHours) {
      setQuietHoursSameError(true);
      hasError = true;
    }
    if (hasError) {
      showSnackbar('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    const rules = ruleStates.filter((rul) => rul.isSelected).map((ri) => {
      let valueString = '';
      if (ri.code == "ALLOW_PETS") {
        valueString = petAllowed.toString();
      } else if (ri.code == "QUIET_HOURS") {
        valueString = `${iniQuietHours}-${endQuietHours}`;
      }
      return {
        ruleId: ri.ruleTypeId,
        value: ri.code == "ALLOW_PETS" ? petAllowed.toString() : ri.code == "QUIET_HOURS" ? valueString : '',
      };
    }
    );

    UpdateRules(rules, {
      onSuccess: (response) => {
        const { statusCode, resultError } = response;

        if (statusCode === '200') {
          showSnackbar(t('houseRulesSelector.messages.successUpdate'), 'success');
        } else {
          showSnackbar(resultError?.message, 'error');
        }
      },
      onError: (error) => {
        showSnackbar(error?.message, 'error');
      },
    });
  };

  // hooks
  const showSnackbar = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    if (ParamListingRentRentRules?.data) {
      setRuleStates(
        ParamListingRentRentRules.data.map((rule) => ({
          ...rule,
          isSelected: false,
        }))
      );
    }
  }, [ParamListingRentRentRules]);

  useEffect(() => {
    if (rentRules.length > 0 && ParamListingRentRentRules?.data) {
      const ids = rentRules.map((item) => item.ruleTypeId);
      setRuleStates((prevRules) =>
        prevRules.map((rule) => ({
          ...rule,
          isSelected: ids.includes(rule.ruleTypeId),
        }))
      );
      if (rentRules.find((rul) => rul.code == "ALLOW_PETS")) {
        setSeePetAllowed(true);
        const petRule = rentRules.find((rul) => rul.code == "ALLOW_PETS");
        if (petRule && petRule.valueString) {
          setPetAllowed(Number(petRule.valueString));
        }
      }
      const quietHoursRule = rentRules.find((rul) => rul.code == "QUIET_HOURS");
      if (quietHoursRule && quietHoursRule.valueString) {
        const times = quietHoursRule.valueString.split('-');
        setIniQuietHours(times[0]);
        setEndQuietHours(times[1]);
        setOpenQuietHours(true);
      }
    }
  }, [rentRules, isLoading, ParamListingRentRentRules]);

  return (
    <>
      {<LoadingThreeDotsJumping open={isPending} modal={true} />}

      <Box
        sx={{
          maxWidth: 800,
        }}
      >
        <Typography
          fontWeight="600"
          sx={{ fontSize: '18px', mb: 3, color: '#222', mt: -1.8 }}
        >
          {t('admin.editProperty.9.title')}
        </Typography>
        <Divider sx={{ mx: -10, my: -1.6 }} />
        <Box sx={{ pr: '20px' }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            fontWeight="600"
            sx={{ fontSize: '16px', mb: 1, color: '#222', mt: 3.5 }}
          >
            {t('admin.editProperty.9.subtitle')}
          </Typography>
          <Typography
            sx={{ fontSize: '13px', color: '#6b7280' }}
          >
            {t('admin.editProperty.9.description')}
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ mt: 10 }}>
            <LoadingThreeDotsJumping />
          </Box>
        ) : (
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              p: 3,
              mb: 4
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#717171',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 0.5
              }}
            >
              {t('admin.editProperty.9.basicRules')}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                 color: '#717171',
                mb: 3
              }}
            >
              {t('admin.editProperty.9.defineAllowed')}
            </Typography>

            {ruleStates.length > 0 &&
              ruleStates.map((rule, index) => (
                <Box key={rule.ruleTypeId}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    py={2}
                  >
                    <Box display="flex" alignItems="center" gap={2} flex={1}>
                      <Box
                        sx={{
                          fontSize: 24,
                          color: '#717171',
                          minWidth: 32
                        }}
                      >
                        {rule.code === 'ALLOW_PETS' && <PetsOutlinedIcon />}
                        {rule.code === 'ALLOW_PARTIES' && <CelebrationOutlinedIcon />}
                        {rule.code === 'ALLOW_SMOKING' && <SmokingRoomsOutlinedIcon />}
                        {rule.code === 'ALLOW_OUTSIDE_VISITORS' && <PeopleAltOutlinedIcon />}
                        {rule.code === 'QUIET_HOURS' && <VolumeOffOutlinedIcon />}
                        {!['ALLOW_PETS', 'ALLOW_EVENTS', 'ALLOW_SMOKING', 'ALLOW_OUTSIDE_VISITORS', 'QUIET_HOURS'].includes(rule.code) && ''}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 400,
                            color: '#222'
                          }}
                        >
                          {rule.name}
                        </Typography>
                      </Box>
                    </Box>
                    <JOMSwitch
                      checked={rule.isSelected}
                      onChange={(e) => handleToggleRule(rule, e.target.checked)}
                    />

                  </Box>

                  {seePetAllowed && rule.code === 'ALLOW_PETS' && rule.isSelected && (
                    <Box mt={1} mb={2} ml={6}>
                      <Typography sx={{ fontSize: 14, color: '#717171', mb: 1 }}>
                        {t('admin.editProperty.9.petsAllowed')}
                      </Typography>
                      {petError && (
                        <Typography sx={{ fontSize: 12, color: 'error.main', mb: 1 }}>
                          {t('admin.editProperty.9.mustAllowAtLeastOnePet')}
                        </Typography>
                      )}
                      <Box display="flex" alignItems="center" gap={2}>
                        <IconButton
                          onClick={() => { setPetAllowed((prev) => Math.max(0, prev - 1)); setPetError(false); }}
                          disabled={petAllowed <= 0}
                          size="small"
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '50%',
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ fontSize: 16, minWidth: '30px', textAlign: 'center' }}>
                          {petAllowed}
                        </Typography>
                        <IconButton
                          onClick={() => { setPetAllowed((prev) => Math.min(10, prev + 1)); setPetError(false); }}
                          disabled={petAllowed >= 10}
                          size="small"
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '50%',
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  )}

                  {openQuietHours && rule.code === 'QUIET_HOURS' && rule.isSelected && (
                    <Box mt={1} mb={2} ml={6}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                          <Typography sx={{ fontSize: 12, color: quietHoursError && !iniQuietHours ? 'error.main' : '#717171', mb: 0.5 }}>
                            {t('admin.editProperty.9.from')}
                          </Typography>
                          <FormControl fullWidth size="small" error={quietHoursError && !iniQuietHours}>
                            <Select
                              value={iniQuietHours}
                              displayEmpty
                              sx={{ borderRadius: 2, ...(quietHoursError && !iniQuietHours ? { '& fieldset': { borderColor: 'error.main' } } : {}) }}
                              renderValue={(selected) => {
                                if (!selected) {
                                  return <span style={{ color: '#999' }}>{t('admin.editProperty.9.select')}</span>;
                                }
                                const selectedTime = timeOptions.find((option) => option.value === selected);
                                return selectedTime ? selectedTime.label : selected;
                              }}
                              onChange={(e) => { setIniQuietHours(e.target.value); setQuietHoursError(false); setQuietHoursSameError(false); }}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 200,
                                  },
                                },
                              }}
                            >
                              {timeOptions.map((time) => (
                                <MenuItem key={time.value} value={time.value}>
                                  {time.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                          <Typography sx={{ fontSize: 12, color: quietHoursError && !endQuietHours ? 'error.main' : '#717171', mb: 0.5 }}>
                            {t('admin.editProperty.9.to')}
                          </Typography>
                          <FormControl fullWidth size="small" error={quietHoursError && !endQuietHours}>
                            <Select
                              value={endQuietHours}
                              displayEmpty
                              sx={{ borderRadius: 2, ...(quietHoursError && !endQuietHours ? { '& fieldset': { borderColor: 'error.main' } } : {}) }}
                              renderValue={(selected) => {
                                if (!selected) {
                                  return <span style={{ color: '#999' }}>{t('admin.editProperty.9.select')}</span>;
                                }
                                const selectedTime = timeOptions.find((option) => option.value === selected);
                                return selectedTime ? selectedTime.label : selected;
                              }}
                              onChange={(e) => { setEndQuietHours(e.target.value); setQuietHoursError(false); setQuietHoursSameError(false); }}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 200,
                                  },
                                },
                              }}
                            >
                              {timeOptions.map((time) => (
                                <MenuItem key={time.value} value={time.value}>
                                  {time.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      {quietHoursSameError && (
                        <Typography sx={{ fontSize: 12, color: 'error.main', mt: 1 }}>
                          {t('admin.editProperty.9.timeError')}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {index < ruleStates.length - 1 && <Divider />}
                </Box>
              ))}
          </Box>
        )}

        <Box sx={{
            position: 'sticky',
            bottom: -5,
            zIndex: 10,
          display: 'flex',
          justifyContent: 'flex-end',
          pt: 2,
          pb: 5,
          borderTop: '1px solid #e0e0e0',
          bgcolor: 'white',
          // zIndex: 1,
        }}>
          {/* <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              color: '#222',
              borderColor: '#222',
              '&:hover': {
                borderColor: '#000',
                backgroundColor: '#f7f7f7'
              }
            }}
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button> */}
          <Button
            variant="primary"
            disabled={isPending}
            sx={{
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              color: '#fff',
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0',
                color: '#999'
              }
            }}
            onClick={handleGuardar}
          >
            {isPending ? t('commonNames.saving') : t('commonNames.saveChanges')}
          </Button>
        </Box>
        </Box>

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              width: 300,
            }}
          >
            <Typography variant="h6" mb={1}>
              {t('houseRulesSelector.serviceAnimals.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('houseRulesSelector.serviceAnimals.description')}
            </Typography>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default SelectorReglasCasa;
