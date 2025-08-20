import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box } from '@mui/material';
import type { ServerConfig } from '../../types/config';
import { DEFAULT_CONFIG } from '../../types/config';
import { generateCommands } from '../../utils/commandGenerator';
import { validateConfig } from '../../utils/configValidator';
import type { ValidationError } from '../../utils/configValidator';
import { getOrGenerateApiKey } from '../../utils/apiKeyGenerator';
import ConfigForm from './ConfigForm';
import CommandOutput from './CommandOutput';
import styles from './ParameterEditor.module.css';

const ParameterEditor: React.FC = () => {
  const [config, setConfig] = useState<ServerConfig>(DEFAULT_CONFIG);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [output, setOutput] = useState(generateCommands(DEFAULT_CONFIG));
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化时从LocalStorage加载API密钥
  useEffect(() => {
    if (!isInitialized) {
      const storedApiKey = getOrGenerateApiKey();
      const initialConfig = {
        ...DEFAULT_CONFIG,
        apiKey: storedApiKey,
      };
      setConfig(initialConfig);
      setOutput(generateCommands(initialConfig));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    // 只有在初始化完成后才进行验证和输出生成
    if (!isInitialized) return;

    // Validate configuration
    const validationErrors = validateConfig(config);
    setErrors(validationErrors);

    // Generate output only if no errors
    if (validationErrors.length === 0) {
      const generatedOutput = generateCommands(config);
      setOutput(generatedOutput);
    }
  }, [config, isInitialized]);

  const handleConfigChange = (newConfig: ServerConfig) => {
    setConfig(newConfig);
  };

  return (
    <Box className={styles.parameterEditor}>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Paper className={styles.formPaper}>
            <ConfigForm
              config={config}
              onChange={handleConfigChange}
              errors={errors}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper className={styles.outputPaper}>
            <CommandOutput output={output} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParameterEditor;
