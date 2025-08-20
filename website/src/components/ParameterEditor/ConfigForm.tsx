import React from 'react';
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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ServerConfig } from '../../types/config';
import { ENVIRONMENT_OPTIONS, LOG_LEVEL_OPTIONS } from '../../types/config';
import type { ValidationError } from '../../utils/configValidator';

interface ConfigFormProps {
  config: ServerConfig;
  onChange: (config: ServerConfig) => void;
  errors: ValidationError[];
}

const ConfigForm: React.FC<ConfigFormProps> = ({ config, onChange, errors }) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof ServerConfig) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
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

  const getFieldError = (field: string): string | undefined => {
    const error = errors.find(e => e.field === field);
    return error?.message;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Server Configuration
      </Typography>
      
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Please fix the following errors:
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
            onChange={handleChange('apiKey')}
            variant="outlined"
            helperText="Leave empty to auto-generate a secure API key"
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
            onChange={handleChange('ipWhitelist')}
            variant="outlined"
            error={!!getFieldError('ipWhitelist')}
            helperText={getFieldError('ipWhitelist') || 'Examples: 192.168.1.0/24, 10.0.0.1, ::1'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={t('parameterEditor.form.port')}
            value={config.port}
            onChange={handleChange('port')}
            variant="outlined"
            error={!!getFieldError('port')}
            helperText={getFieldError('port') || 'Default: 8080'}
            inputProps={{ min: 1, max: 65535 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label={t('parameterEditor.form.timeout')}
            value={config.timeout}
            onChange={handleChange('timeout')}
            variant="outlined"
            error={!!getFieldError('timeout')}
            helperText={getFieldError('timeout') || 'Default: 10 seconds'}
            inputProps={{ min: 1, max: 300 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>{t('parameterEditor.form.environment')}</InputLabel>
            <Select
              value={config.environment}
              onChange={handleChange('environment')}
              label={t('parameterEditor.form.environment')}
            >
              {ENVIRONMENT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
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
              onChange={handleChange('logLevel')}
              label={t('parameterEditor.form.logLevel')}
            >
              {LOG_LEVEL_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
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
