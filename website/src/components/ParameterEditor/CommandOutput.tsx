import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { GeneratedOutput } from '../../types/config';

interface CommandOutputProps {
  output: GeneratedOutput;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`output-tabpanel-${index}`}
      aria-labelledby={`output-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const CommandOutput: React.FC<CommandOutputProps> = ({ output }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const outputs = [
    {
      label: t('parameterEditor.output.commandLine'),
      content: output.commandLine,
      language: 'bash',
    },
    {
      label: t('parameterEditor.output.environmentVariables'),
      content: output.environmentVariables,
      language: 'bash',
    },
    {
      label: t('parameterEditor.output.configFile'),
      content: output.configFile,
      language: 'yaml',
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('parameterEditor.output.title')}
      </Typography>
      
      <Paper variant="outlined">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label={t('parameterEditor.output.tabsLabel')}>
            {outputs.map((output, index) => (
              <Tab
                key={index}
                label={output.label}
                id={`output-tab-${index}`}
                aria-controls={`output-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>
        
        {outputs.map((outputItem, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                <Tooltip title={t('parameterEditor.output.copy')}>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(outputItem.content)}
                    sx={{
                      backgroundColor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '8px',
                  fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  overflow: 'auto',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {outputItem.content}
              </pre>
            </Box>
          </TabPanel>
        ))}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {t('parameterEditor.output.copied')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CommandOutput;
