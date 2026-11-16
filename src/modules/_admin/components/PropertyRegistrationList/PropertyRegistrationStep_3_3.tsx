import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  styled,
} from '@mui/material';
import Switch, { SwitchProps } from '@mui/material/Switch';
import Grid from '@mui/material/Grid2';
// import CloseIcon from '@mui/icons-material/Close';
// import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
// import { GoQuestion } from 'react-icons/go';
import { PropertyRegistrationProps_3_3 } from '../../interface/IPropertyRegistrationProps';
import { useStepValidation } from '@/context/FormStepContext';
import { RuleTypes } from '@/models/interfaces/ListingRentResponseStep';
import { usePropertyRegistration } from '@/store/listingRentPropertyRegistration.store';
import { useTranslation } from 'react-i18next'; // <-- Descomentado e importado
import { timeOptions } from '@/common/constants/timeOptionsCheckInCheckout';

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

const RuleCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
}));

const RuleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 0),
  // borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const PropertyRegistrationStep_3_3: React.FC<PropertyRegistrationProps_3_3> = ({
  onChange,
}) => {
  // store
  const { ruleTypes } = usePropertyRegistration((state) => state.data.parametrics);
  const { rules, tlCheckInOutPolicy } = usePropertyRegistration((state) => state.data.listingData);
  
  // useState
  const [arrivalStart, setArrivalStart] = React.useState(tlCheckInOutPolicy?.checkInTime_Str ?? '14:00');
  const [arrivalEnd, setArrivalEnd] = React.useState(tlCheckInOutPolicy?.maxCheckInTime_Str ?? '');
  const [departureTime, setDepartureTime] = React.useState(tlCheckInOutPolicy?.checkOutTime_Str ?? '11:00');
  const [ruleStates, setRuleStates] = React.useState<RuleTypes[]>(
    ruleTypes?.map((rule) => ({ ...rule, isSelected: false })) ?? []
  );
  const [iniQuietHours, setIniQuietHours] = React.useState<string>('');
  const [endQuietHours, setEndQuietHours] = React.useState<string>('');
  const [seePetAllowed, setSeePetAllowed] = React.useState<boolean>(false);
  const [petAllowed, setPetAllowed] = React.useState<number>(0);

  const [openQuietHours, setOpenQuietHours] = React.useState<boolean>(false);

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
    }

    if (clickedRule?.code == "QUIET_HOURS" && select) {
      setOpenQuietHours(true);
    } else if (clickedRule?.code == "QUIET_HOURS" && !select) {
      setOpenQuietHours(false);
      setEndQuietHours('');
      setIniQuietHours('');
    }

  };

  // hooks
  const { setStepValid } = useStepValidation();
  
  // Hook de traducción
  const { t: tStep33 } = useTranslation('translation', { keyPrefix: 'PropertyRegistrationStep_3_3' });

  useEffect(() => {
    if (rules.length > 0) {
      const ids = rules.map((item) => item.ruleTypeId);
      handleToggleRule(null as any, true, ids);
      if (rules.find((rul) => rul.code == "ALLOW_PETS")) {
        const petRule = rules.find((rul) => rul.code == "ALLOW_PETS");
        setSeePetAllowed(true);
        setPetAllowed(petRule ? Number(petRule.valueString) : 0);
      }
      if (rules.find((rul) => rul.code == "QUIET_HOURS")) {
        const quietRule = rules.find((rul) => rul.code == "QUIET_HOURS");
        setOpenQuietHours(true);
        if (quietRule && quietRule.valueString) {
          const [ini, end] = quietRule.valueString.split('-');
          setIniQuietHours(ini);
          setEndQuietHours(end);
        }
      }
    }
  }, []);

  useEffect(() => {
    const quietHoursValid = !openQuietHours ||
      (!!iniQuietHours && !!endQuietHours && iniQuietHours !== endQuietHours);
    let isValid = !!arrivalStart && !!departureTime && !!arrivalEnd && quietHoursValid;

    if (seePetAllowed) {
      if (!petAllowed || petAllowed <= 0) {
        isValid = false;
      }
    }

    setStepValid(8, isValid);
    onChange({
      step3_3: {
        arrivalStart,
        departureTime,
        arrivalEnd,
        ruleStates: ruleStates.filter((rul) => rul.isSelected).map((ri) => ri.ruleTypeId),
        ruleStatesModels: ruleStates.filter((rul) => rul.isSelected).map((ri) => {
          if (ri.code == "ALLOW_PETS") {
            return { ruleId: ri.ruleTypeId, value: petAllowed.toString() };
          } else if (ri.code == "QUIET_HOURS") {
            return { ruleId: ri.ruleTypeId, value: `${iniQuietHours}-${endQuietHours}` };
          } else {    
            return { ruleId: ri.ruleTypeId, value: '' };
          }
        }),

      },
    });
  }, [arrivalStart, departureTime, arrivalEnd, ruleStates, petAllowed, seePetAllowed, iniQuietHours, endQuietHours, openQuietHours, setStepValid, onChange]);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 650 }}>
      {/* Título principal */}
      <Typography  
        sx={{ 
          fontWeight: 600, 
          fontSize: '1.5rem',
          mb: 1.5,
          color: 'text.primary',
          mt: '25px'
        }}
      >
        {tStep33('headerTitle', { defaultValue: 'Establece las reglas de tu espacio' })}
      </Typography>
      <Typography 
        color="text.secondary" 
        sx={{ mb: 4, lineHeight: 1.6, fontSize: '0.875rem' }}
      >
        {tStep33('headerSubtitle', { defaultValue: 'Define qué está permitido y qué no en tu propiedad para asegurar una buena convivencia y el cuidado de tu espacio.' })}
      </Typography>

      {/* Sección de Horarios */}
      <RuleCard>
        <Typography 
          sx={{ 
            fontWeight: 600, 
            fontSize: '16px',
            mb: 3,
            color: 'text.primary',
          }}
        >
          {tStep33('scheduleTitle', { defaultValue: 'Horarios' })}
        </Typography>

        <Grid container spacing={4}>
          {/* Check-in */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography              
              sx={{ 
                fontWeight: 600,
                fontSize: '14px', 
                mb: 2.5,
                color: 'text.primary',
              }}
            >
              {tStep33('checkInTime', { defaultValue: 'Hora de check-in' })}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary" sx={{ mb: 1, fontWeight: 500, fontSize: '12px' }}>
                  {tStep33('from', { defaultValue: 'Desde' })}
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={arrivalStart}
                    onChange={(e) => setArrivalStart(e.target.value)}
                    sx={{ borderRadius: '0.75rem', fontSize: '14px' }}
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

              <Grid size={{ xs: 6 }}>
                <Typography color="text.secondary" sx={{ mb: 1, fontWeight: 500, fontSize: '12px' }}>
                  {tStep33('to', { defaultValue: 'Hasta' })}
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={arrivalEnd}
                    onChange={(e) => setArrivalEnd(e.target.value)}
                    sx={{ borderRadius: '0.75rem', fontSize: '14px' }}
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
          </Grid>

          {/* Check-out */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography 
              sx={{ 
                fontWeight: 600,
                fontSize: '14px',
                mb: 5.5,
                color: 'text.primary',
              }}
            >
              {tStep33('checkOutTime', { defaultValue: 'Hora de check-out' })}
            </Typography>
            <FormControl fullWidth>
              <Select
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                sx={{ borderRadius: '0.75rem', fontSize: '14px' }}
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
      </RuleCard>

      {/* Sección de Reglas Básicas */}
      <RuleCard>
        <Typography 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: 'text.primary',
            fontSize: '16px',
          }}
        >
          {tStep33('basicRules', { defaultValue: 'Reglas básicas' })}
        </Typography>

        {ruleStates &&
          ruleStates.map((rule) => (
            <Box key={rule.ruleTypeId}>
              <RuleRow>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    </Typography>
                    {rule.description && (
                      <Typography variant="body2" color="text.secondary">
                        {rule.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <JOMSwitch onChange={(e) => handleToggleRule(rule, e.target.checked)} checked={rule.isSelected} />
              </RuleRow>

              {/* Contador de mascotas */}
              {seePetAllowed && rule.code === 'ALLOW_PETS' && rule.isSelected && (
                <Box sx={{ mt: 2, mb: 2, pl: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
                    {tStep33('howManyPets', { defaultValue: '¿Cuántas mascotas se permiten?' })} <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <IconButton
                      onClick={() => setPetAllowed((prev) => Math.max(0, prev - 1))}
                      disabled={petAllowed <= 0}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '8px',
                        width: 36,
                        height: 36,
                        '&:disabled': {
                          opacity: 0.5,
                        },
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography 
                      sx={{ 
                        minWidth: '30px', 
                        textAlign: 'center', 
                        fontWeight: 500,
                        color: petAllowed === 0 ? 'error.main' : 'inherit'
                      }}
                    >
                      {petAllowed}
                    </Typography>
                    <IconButton
                      onClick={() => setPetAllowed((prev) => Math.min(10, prev + 1))}
                      disabled={petAllowed >= 10}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '8px',
                        width: 36,
                        height: 36,
                        '&:disabled': {
                          opacity: 0.5,
                        },
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {petAllowed === 0 && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                      {tStep33('petsRequiredError', { defaultValue: 'Debe indicar un número mayor a 0' })}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Horario de silencio */}
              {openQuietHours && rule.code === 'QUIET_HOURS' && rule.isSelected && (
                <Box sx={{ mt: 2, mb: 2, pl: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        {tStep33('from', { defaultValue: 'Desde' })} <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={iniQuietHours}
                          onChange={(e) => setIniQuietHours(e.target.value)}
                          displayEmpty
                          sx={{ 
                            borderRadius: '8px',
                            ...(openQuietHours && !iniQuietHours && {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'error.main',
                              }
                            })
                          }}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                              },
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            {tStep33('selectTime', { defaultValue: 'Seleccionar hora' })}
                          </MenuItem>
                          {timeOptions.map((time) => (
                            <MenuItem key={time.value} value={time.value}>
                              {time.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        {tStep33('to', { defaultValue: 'Hasta' })} <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={endQuietHours}
                          onChange={(e) => setEndQuietHours(e.target.value)}
                          displayEmpty
                          sx={{ 
                            borderRadius: '8px',
                            ...(openQuietHours && !endQuietHours && {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'error.main',
                              }
                            })
                          }}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                              },
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            {tStep33('selectTime', { defaultValue: 'Seleccionar hora' })}
                          </MenuItem>
                          {timeOptions.map((time) => (
                            <MenuItem key={time.value} value={time.value}>
                              {time.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>                {!!iniQuietHours && !!endQuietHours && iniQuietHours === endQuietHours && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                    {tStep33('quietHoursSameError', { defaultValue: 'La hora de desde y hasta no pueden ser iguales' })}
                  </Typography>
                )}                </Box>
              )}
            </Box>
          ))}
      </RuleCard>
    </Box>
  );
};