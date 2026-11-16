import React, { useState, useCallback, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid2';
import { Box, Typography, Button, useTheme } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SearchIcon from '@mui/icons-material/Search'; // Icon for the search input
import { useTranslation } from 'react-i18next';
import { useGet, usePost } from '@/hooks/api';
import LoadingThreeDotsJumping from '@/components/LoadingThreeDotsJumping';
import { Language } from '@/models/interfaces/profile/Language';
import { useAuthStore } from '@/store/auth.store';
import { useNotification } from '@/context/NotificationContext';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const filter = createFilterOptions<Language>();

interface LanguageFormProps {
  onSave: (data: Language[]) => void;
  initialSelectedLanguages?: Language[];
  initialId: number;
}

const LanguageForm: React.FC<LanguageFormProps> = ({
  initialSelectedLanguages = [],
  initialId,
  onSave,
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(initialSelectedLanguages);
  const { t } = useTranslation();
  const showNotification = useNotification();
  const theme = useTheme();
  const { identifier } = useAuthStore.getState();
  const { data: ParamLanguageTypes, isLoading: isLoadingProp } = useGet<Language[]>(
    'ParamLanguageTypes',
    '/Parametrics/GetLanguageTypes'
  );

  const { mutate: UpdatePersonalInformation } = usePost<any>('/UpsertAdditionalProfileData');

  useEffect(() => {
    setSelectedLanguages(initialSelectedLanguages);
  }, []);

  const handleChange = useCallback((_event: React.SyntheticEvent, value: Language[]) => {
    setSelectedLanguages(value);
  }, []);

  const handleSubmit = () => {
    let dataRequest = {
      additionalProfileDataId: initialId,
      userId: identifier,
      whatIDo: null,
      wantedToGo: null,
      pets: null,
      birthday: null,
      languages: selectedLanguages,
      liveAt: null,
      introduceYourself: null,
    };

    UpdatePersonalInformation(dataRequest, {
      onSuccess: (response) => {
        console.log(response);
        onSave(dataRequest.languages);
      },
      onError: (error: any) => {
        console.log('Existe error: ', error);
        showNotification(
          'error',
          'Perfil: ¿Idiomas que hablas?',
          'Hubo un error al actualizar la información.'
        );
      },
    });
  };

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Box mb={1}>
          <Typography
            sx={{
              fontFamily: theme.typography.h6,
              color: theme.palette.text.primary,
            }}
          >
            {t('myProfile.myProfilePage.languagesSpoken.question')}
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        {isLoadingProp ? (
          <LoadingThreeDotsJumping />
        ) : (
          <>
            <Autocomplete
              multiple // selecione multiples lenguajes
              id="checkboxes-idiomas"
              options={ParamLanguageTypes?.data ?? []}
              disableCloseOnSelect
              getOptionLabel={(option) => option.detail}
              fullWidth
              isOptionEqualToValue={(option, value) => option.languageId === value.languageId}
              renderOption={(props, option, { selected }) => (
                <li {...props} key={option.languageId}>
                  <ListItemText primary={option.detail} />
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                </li>
              )}
              filterOptions={(options, params) => {
                const { inputValue } = params;

                if (inputValue === '') {
                  return options.slice(0, 10);
                }

                const filtered = filter(options, params);
                // const isExisting = options.some(
                //   (option) => option.detail.toLowerCase() === inputValue.toLowerCase()
                // );

                return filtered;
              }}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  placeholder={t('myProfile.myProfilePage.languagesSpoken.languageSearch')}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <React.Fragment>
                          <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                          {params.InputProps.startAdornment}
                        </React.Fragment>
                      ),
                    },
                  }}
                />
              )}
              value={selectedLanguages}
            />
            <Box sx={{ width: '100%', mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="primary"
                sx={{ width: '150px' }}
                onClick={handleSubmit}
              >
                {t('commonNames.save')}
              </Button>
            </Box>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default LanguageForm;
