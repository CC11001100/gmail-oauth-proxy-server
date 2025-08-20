import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import styles from './Documentation.module.css';

const Documentation: React.FC = () => {
  const { t } = useTranslation();

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/token',
      description: 'OAuth token exchange endpoint',
      headers: ['Content-Type: application/json', 'X-API-Key: <your_api_key>'],
      status: ['200 - Success', '400 - Bad Request', '401 - Unauthorized', '500 - Server Error'],
    },
    {
      method: 'GET',
      path: '/health',
      description: 'Health check endpoint',
      headers: [],
      status: ['200 - OK'],
    },
  ];

  const configOptions = [
    {
      name: 'OAUTH_PROXY_API_KEY',
      type: 'string',
      required: false,
      description: 'API key (optional, auto-generated if not set)',
    },
    {
      name: 'OAUTH_PROXY_IP_WHITELIST',
      type: 'string',
      required: false,
      description: 'IP whitelist, comma-separated (optional)',
    },
    {
      name: 'OAUTH_PROXY_PORT',
      type: 'number',
      required: false,
      description: 'Server port (default: 8080)',
    },
    {
      name: 'OAUTH_PROXY_ENVIRONMENT',
      type: 'string',
      required: false,
      description: 'Runtime environment (default: development)',
    },
    {
      name: 'OAUTH_PROXY_LOG_LEVEL',
      type: 'string',
      required: false,
      description: 'Log level (default: info)',
    },
    {
      name: 'OAUTH_PROXY_TIMEOUT',
      type: 'number',
      required: false,
      description: 'Request timeout in seconds (default: 10)',
    },
  ];

  return (
    <Container maxWidth="lg" className={styles.documentation}>
      <Box className={styles.header}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t('documentation.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Complete documentation for Gmail OAuth Proxy Server
        </Typography>
      </Box>

      <Box className={styles.content}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">{t('documentation.apiSpec')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" gutterBottom>
              API Endpoints
            </Typography>
            {apiEndpoints.map((endpoint, index) => (
              <Paper key={index} className={styles.endpointCard}>
                <Box className={styles.endpointHeader}>
                  <Chip
                    label={endpoint.method}
                    color={endpoint.method === 'POST' ? 'primary' : 'secondary'}
                    size="small"
                  />
                  <Typography variant="h6" component="span" className={styles.endpointPath}>
                    {endpoint.path}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {endpoint.description}
                </Typography>
                
                {endpoint.headers.length > 0 && (
                  <Box className={styles.endpointSection}>
                    <Typography variant="subtitle2" gutterBottom>
                      Required Headers:
                    </Typography>
                    {endpoint.headers.map((header, idx) => (
                      <Typography key={idx} variant="body2" className={styles.codeText}>
                        {header}
                      </Typography>
                    ))}
                  </Box>
                )}
                
                <Box className={styles.endpointSection}>
                  <Typography variant="subtitle2" gutterBottom>
                    Response Status:
                  </Typography>
                  {endpoint.status.map((status, idx) => (
                    <Typography key={idx} variant="body2" className={styles.codeText}>
                      {status}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            ))}

            <Alert severity="info" className={styles.alert}>
              <Typography variant="body2">
                <strong>Example Request:</strong>
              </Typography>
              <pre className={styles.codeBlock}>
{`curl -X POST http://localhost:8080/token \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-secret-api-key" \\
  -d '{
    "code": "4/0AeaYshBpVe...",
    "client_id": "your-client-id.apps.googleusercontent.com",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uri": "https://yourdomain.com/auth/callback",
    "grant_type": "authorization_code"
  }'`}
              </pre>
            </Alert>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">{t('documentation.configuration')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" gutterBottom>
              Environment Variables
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Variable</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Required</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {configOptions.map((option, index) => (
                    <TableRow key={index}>
                      <TableCell className={styles.codeText}>{option.name}</TableCell>
                      <TableCell>{option.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={option.required ? 'Yes' : 'No'}
                          color={option.required ? 'error' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{option.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">{t('documentation.authentication')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" gutterBottom>
              Authentication Methods
            </Typography>
            <Typography variant="body1" paragraph>
              Gmail OAuth Proxy Server supports two authentication methods that can be used individually or in combination:
            </Typography>
            
            <Box className={styles.authMethod}>
              <Typography variant="h6" gutterBottom>
                1. API Key Authentication
              </Typography>
              <Typography variant="body2" paragraph>
                Authenticate via HTTP header <code>X-API-Key</code>:
              </Typography>
              <pre className={styles.codeBlock}>
{`curl -H "X-API-Key: your-secret-api-key" http://localhost:8080/token`}
              </pre>
            </Box>

            <Box className={styles.authMethod}>
              <Typography variant="h6" gutterBottom>
                2. IP Whitelist Authentication
              </Typography>
              <Typography variant="body2" paragraph>
                Access control based on client IP address, supports:
              </Typography>
              <ul>
                <li><strong>Individual IP addresses:</strong> <code>192.168.1.100</code></li>
                <li><strong>CIDR networks:</strong> <code>192.168.1.0/24</code></li>
                <li><strong>IPv6 addresses:</strong> <code>::1</code>, <code>2001:db8::/32</code></li>
              </ul>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">{t('documentation.examples')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" gutterBottom>
              Usage Examples
            </Typography>
            
            <Box className={styles.example}>
              <Typography variant="subtitle1" gutterBottom>
                Start with API Key only:
              </Typography>
              <pre className={styles.codeBlock}>
{`export OAUTH_PROXY_API_KEY="your-secret-api-key"
./gmail-oauth-proxy server`}
              </pre>
            </Box>

            <Box className={styles.example}>
              <Typography variant="subtitle1" gutterBottom>
                Start with IP whitelist only:
              </Typography>
              <pre className={styles.codeBlock}>
{`export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1,127.0.0.1"
./gmail-oauth-proxy server`}
              </pre>
            </Box>

            <Box className={styles.example}>
              <Typography variant="subtitle1" gutterBottom>
                Start with dual authentication:
              </Typography>
              <pre className={styles.codeBlock}>
{`export OAUTH_PROXY_API_KEY="your-secret-api-key"
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1"
./gmail-oauth-proxy server --env production --log-level warn`}
              </pre>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default Documentation;
