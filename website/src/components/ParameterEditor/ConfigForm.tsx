import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Box,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import { useTranslation } from 'react-i18next';
import type { ServerConfig } from '../../types/config';
import { ENVIRONMENT_OPTIONS, LOG_LEVEL_OPTIONS } from '../../types/config';
import type { ValidationError } from '../../utils/configValidator';
import { getOrGenerateApiKey, regenerateApiKey } from '../../utils/apiKeyGenerator';

interface ConfigFormProps {
  config: ServerConfig;
  onChange: (config: ServerConfig) => void;
  errors: ValidationError[];
}

const ConfigForm: React.FC<ConfigFormProps> = ({ config, onChange, errors }) => {
  const { t } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化时从LocalStorage加载API密钥
  useEffect(() => {
    if (!isInitialized) {
      const storedApiKey = getOrGenerateApiKey();
      onChange({
        ...config,
        apiKey: storedApiKey,
      });
      setIsInitialized(true);
    }
  }, [isInitialized, config, onChange]);

  const handleTextChange = (field: keyof ServerConfig) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    
    if (field === 'ipWhitelist') {
      // Handle textarea input for IP whitelist
      const ipList = value
        .split('\n')
        .map((ip: string) => ip.trim())
        .filter((ip: string) => ip.length > 0);
      
      onChange({
        ...config,
        [field]: ipList,
      });
    } else if (field === 'port' || field === 'timeout') {
      // Handle numeric fields
      const numValue = parseInt(value, 10);
      onChange({
        ...config,
        [field]: isNaN(numValue) ? 0 : numValue,
      });
    } else {
      onChange({
        ...config,
        [field]: value,
      });
    }
  };

  const handleSelectChange = (field: keyof ServerConfig) => (
    event: SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleRegenerateApiKey = () => {
    const newApiKey = regenerateApiKey();
    onChange({
      ...config,
      apiKey: newApiKey,
    });
  };

  const getFieldError = (field: string): string | undefined => {
    const error = errors.find(e => e.field === field);
    return error?.message;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('parameterEditor.form.title')}
      </Typography>
      
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            {t('parameterEditor.form.errors.title')}:
          </Typography>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('parameterEditor.form.apiKey')}
            placeholder={t('parameterEditor.form.apiKeyPlaceholder')}
            value={config.apiKey || ''}
            onChange={handleTextChange('apiKey')}
            variant="outlined"
            helperText={t('parameterEditor.form.apiKeyHelper')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={t('parameterEditor.form.regenerateApiKey')}>
                    <IconButton
                      onClick={handleRegenerateApiKey}
                      edge="end"
                      color="primary"
                      aria-label={t('parameterEditor.form.regenerateApiKey')}
                    >
                      <CasinoIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('parameterEditor.form.ipWhitelist')}
            placeholder={t('parameterEditor.form.ipWhitelistPlaceholder')}
            value={config.ipWhitelist.join('\n')}
            onChange={handleTextChange('ipWhitelist')}
            variant="outlined"
            error={!!getFieldError('ipWhitelist')}
            helperText={getFieldError('ipWhitelist') || t('parameterEditor.form.ipWhitelistHelper')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={t('parameterEditor.form.port')}
            value={config.port}
            onChange={handleTextChange('port')}
            variant="outlined"
            error={!!getFieldError('port')}
            helperText={getFieldError('port') || t('parameterEditor.form.portHelper')}
            inputProps={{ min: 1, max: 65535 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={t('parameterEditor.form.timeout')}
            value={config.timeout}
            onChange={handleTextChange('timeout')}
            variant="outlined"
            error={!!getFieldError('timeout')}
            helperText={getFieldError('timeout') || t('parameterEditor.form.timeoutHelper')}
            inputProps={{ min: 1, max: 300 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>{t('parameterEditor.form.environment')}</InputLabel>
            <Select
              value={config.environment}
              onChange={handleSelectChange('environment')}
              label={t('parameterEditor.form.environment')}
            >
              {ENVIRONMENT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(`parameterEditor.options.environment.${option.value}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>{t('parameterEditor.form.logLevel')}</InputLabel>
            <Select
              value={config.logLevel}
              onChange={handleSelectChange('logLevel')}
              label={t('parameterEditor.form.logLevel')}
            >
              {LOG_LEVEL_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {t(`parameterEditor.options.logLevel.${option.value}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConfigForm;
