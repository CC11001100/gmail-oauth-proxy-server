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
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Api as ApiIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import styles from './Documentation.module.css';
import SyntaxHighlighter from '../../components/SyntaxHighlighter/SyntaxHighlighter';

const Documentation: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <SecurityIcon color="primary" />,
      title: t('documentation.features.dualAuth.title'),
      description: t('documentation.features.dualAuth.description')
    },
    {
      icon: <CheckCircleIcon color="success" />,
      title: t('documentation.features.httpsEnforcement.title'),
      description: t('documentation.features.httpsEnforcement.description')
    },
    {
      icon: <CodeIcon color="info" />,
      title: t('documentation.features.ipWhitelist.title'),
      description: t('documentation.features.ipWhitelist.description')
    },
    {
      icon: <InfoIcon color="warning" />,
      title: t('documentation.features.logSanitization.title'),
      description: t('documentation.features.logSanitization.description')
    }
  ];

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/token',
      description: t('documentation.apiEndpoints.token.description'),
      headers: ['Content-Type: application/json', 'X-API-Key: <your_api_key>'],
      requestBody: {
        code: 'string (required)',
        client_id: 'string (required)',
        client_secret: 'string (required)',
        redirect_uri: 'string (required)',
        grant_type: 'string (required, must be "authorization_code")'
      },
      status: ['200 - Success', '400 - Bad Request', '401 - Unauthorized', '500 - Server Error'],
    },
    {
      method: 'GET',
      path: '/health',
      description: t('documentation.apiEndpoints.health.description'),
      headers: [],
      requestBody: null,
      status: ['200 - OK'],
    },
  ];

  const configOptions = [
    {
      name: 'OAUTH_PROXY_API_KEY',
      type: 'string',
      required: false,
      default: 'auto-generated',
      description: 'API key for authentication (auto-generated if not set)',
    },
    {
      name: 'OAUTH_PROXY_IP_WHITELIST',
      type: 'string',
      required: false,
      default: 'none',
      description: 'IP whitelist, comma-separated (supports CIDR notation)',
    },
    {
      name: 'OAUTH_PROXY_PORT',
      type: 'number',
      required: false,
      default: '8080',
      description: 'Server port to listen on',
    },
    {
      name: 'OAUTH_PROXY_ENVIRONMENT',
      type: 'string',
      required: false,
      default: 'development',
      description: 'Runtime environment (development/production)',
    },
    {
      name: 'OAUTH_PROXY_LOG_LEVEL',
      type: 'string',
      required: false,
      default: 'info',
      description: 'Log level (debug, info, warn, error)',
    },
    {
      name: 'OAUTH_PROXY_TIMEOUT',
      type: 'number',
      required: false,
      default: '10',
      description: 'Request timeout in seconds',
    },
  ];

  return (
    <Container maxWidth="lg" className={styles.documentation}>
      {/* Header Section */}
      <Box className={styles.header}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t('documentation.header.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {t('documentation.header.subtitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('documentation.header.description')}
        </Typography>
      </Box>

      {/* Features Section */}
      <Box className={styles.content} sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          {t('documentation.features.title')}
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className={styles.featureCard}>
                <CardContent className={styles.featureContent}>
                  <Box className={styles.featureIcon}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className={styles.content}>
        {/* Overview Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">
              <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {t('documentation.overview.title')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              {t('documentation.overview.description1')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('documentation.overview.description2')}
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* API Endpoints Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">
              <ApiIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {t('documentation.apiEndpoints.title')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {apiEndpoints.map((endpoint, index) => (
              <Paper key={index} className={styles.endpointCard} sx={{ mb: 3 }}>
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
                      {t('documentation.apiEndpoints.token.headers')}
                    </Typography>
                    {endpoint.headers.map((header, idx) => (
                      <Typography key={idx} variant="body2" className={styles.codeText}>
                        {header}
                      </Typography>
                    ))}
                  </Box>
                )}

                {endpoint.requestBody && (
                  <Box className={styles.endpointSection}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('documentation.apiEndpoints.token.requestBody')}
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: 600 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>{t('documentation.configuration.variable')}</strong></TableCell>
                            <TableCell><strong>{t('documentation.configuration.type')}</strong></TableCell>
                            <TableCell><strong>{t('documentation.configuration.required')}</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(endpoint.requestBody).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className={styles.codeText}>{key}</TableCell>
                              <TableCell>{value}</TableCell>
                              <TableCell>
                                <Chip
                                  label={value.includes('required') ? t('documentation.common.yes') : t('documentation.common.no')}
                                  color={value.includes('required') ? 'error' : 'default'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                
                <Box className={styles.endpointSection}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('documentation.apiEndpoints.token.responseStatus')}
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
              <SyntaxHighlighter
                code={`curl -X POST http://localhost:8080/token \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-secret-api-key" \\
  -d '{
    "code": "4/0AeaYshBpVe...",
    "client_id": "your-client-id.apps.googleusercontent.com",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uri": "https://yourdomain.com/auth/callback",
    "grant_type": "authorization_code"
  }'`}
                language="bash"
              />
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* Authentication Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">
              <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {t('documentation.authentication.title')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" gutterBottom>
              {t('documentation.authentication.methods')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('documentation.authentication.description')}
            </Typography>
            
            <Box className={styles.authMethod}>
              <Typography variant="h6" gutterBottom>
                {t('documentation.authentication.apiKey.title')}
              </Typography>
              <Typography variant="body2" paragraph>
                {t('documentation.authentication.apiKey.description')}
              </Typography>
              <SyntaxHighlighter
                code={`curl -H "X-API-Key: your-secret-api-key" http://localhost:8080/token`}
                language="bash"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('documentation.authentication.apiKey.note')}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box className={styles.authMethod}>
              <Typography variant="h6" gutterBottom>
                {t('documentation.authentication.ipWhitelist.title')}
              </Typography>
              <Typography variant="body2" paragraph>
                {t('documentation.authentication.ipWhitelist.description')}
              </Typography>
              <ul>
                <li><strong>{t('documentation.authentication.ipWhitelist.individualIP')}</strong> <code>192.168.1.100</code></li>
                <li><strong>{t('documentation.authentication.ipWhitelist.cidrNetworks')}</strong> <code>192.168.1.0/24</code></li>
                <li><strong>{t('documentation.authentication.ipWhitelist.ipv6Addresses')}</strong> <code>::1</code>, <code>2001:db8::/32</code></li>
              </ul>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t('documentation.authentication.ipWhitelist.note')}
              </Typography>
            </Box>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>{t('documentation.authentication.securityNote')}</strong>
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* Configuration Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">
              <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {t('documentation.configuration.title')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" gutterBottom>
              {t('documentation.configuration.envVars')}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>{t('documentation.configuration.variable')}</strong></TableCell>
                    <TableCell><strong>{t('documentation.configuration.type')}</strong></TableCell>
                    <TableCell><strong>{t('documentation.configuration.required')}</strong></TableCell>
                    <TableCell><strong>{t('documentation.configuration.default')}</strong></TableCell>
                    <TableCell><strong>{t('documentation.configuration.description')}</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {configOptions.map((option, index) => (
                    <TableRow key={index}>
                      <TableCell className={styles.codeText}>{option.name}</TableCell>
                      <TableCell>{option.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={option.required ? t('documentation.common.yes') : t('documentation.common.no')}
                          color={option.required ? 'error' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell className={styles.codeText}>{option.default}</TableCell>
                      <TableCell>{option.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

        {/* Examples Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">
              <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              {t('documentation.examples.title')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" gutterBottom>
              {t('documentation.examples.quickStart')}
            </Typography>
            
            <Box className={styles.example}>
              <Typography variant="subtitle1" gutterBottom>
                {t('documentation.examples.apiKeyOnly')}
              </Typography>
              <SyntaxHighlighter
                code={`export OAUTH_PROXY_API_KEY="your-secret-api-key"
./gmail-oauth-proxy server`}
                language="bash"
              />
            </Box>

            <Box className={styles.example}>
              <Typography variant="subtitle1" gutterBottom>
                {t('documentation.examples.ipWhitelistOnly')}
              </Typography>
              <SyntaxHighlighter
                code={`export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1,127.0.0.1"
./gmail-oauth-proxy server`}
                language="bash"
              />
            </Box>

            <Box className={styles.example}>
              <Typography variant="subtitle1" gutterBottom>
                {t('documentation.examples.dualAuth')}
              </Typography>
              <SyntaxHighlighter
                code={`export OAUTH_PROXY_API_KEY="your-secret-api-key"
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1"
./gmail-oauth-proxy server --env production --log-level warn`}
                language="bash"
              />
            </Box>

            <Box className={styles.example}>
              <Typography variant="subtitle1" gutterBottom>
                {t('documentation.examples.configFile')}
              </Typography>
              <SyntaxHighlighter
                code={`# config.yaml
api_key: "your-secret-api-key"
ip_whitelist: "192.168.1.0/24,10.0.0.1"
port: 8080
environment: "production"
log_level: "warn"
timeout: 30

./gmail-oauth-proxy server --config config.yaml`}
                language="yaml"
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default Documentation;
