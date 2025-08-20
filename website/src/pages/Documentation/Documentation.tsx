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

const Documentation: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <SecurityIcon color="primary" />,
      title: "Dual Authentication",
      description: "API Key and IP whitelist authentication for enhanced security"
    },
    {
      icon: <CheckCircleIcon color="success" />,
      title: "HTTPS Enforcement",
      description: "Secure communication enforced in production environments"
    },
    {
      icon: <CodeIcon color="info" />,
      title: "IP Whitelist",
      description: "CIDR format and individual IP control for access management"
    },
    {
      icon: <InfoIcon color="warning" />,
      title: "Log Sanitization",
      description: "Automatic sensitive data protection in logs"
    }
  ];

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/token',
      description: 'OAuth token exchange endpoint for Gmail API integration',
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
      description: 'Health check endpoint for monitoring and load balancers',
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
          Gmail OAuth Proxy Server
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Secure OAuth token exchange proxy service for Gmail API integration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A secure intermediary layer between your application and Google's OAuth endpoints, 
          providing enhanced security through dual authentication and IP whitelisting.
        </Typography>
      </Box>

      {/* Features Section */}
      <Box className={styles.content} sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Key Features
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
              Overview
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              Gmail OAuth Proxy Server is a secure proxy service that facilitates OAuth token exchange
              for Gmail API integration. It provides a secure intermediary layer between your application
              and Google's OAuth endpoints, ensuring that sensitive OAuth credentials are never exposed
              to your end users.
            </Typography>
            <Typography variant="body1" paragraph>
              The server acts as a secure bridge, handling the OAuth flow on behalf of your application
              while maintaining strict security controls through API key authentication and IP address
              whitelisting.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* API Endpoints Section */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">
              <ApiIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              API Endpoints
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
                      Required Headers:
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
                      Request Body Parameters:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: 600 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Parameter</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Required</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(endpoint.requestBody).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className={styles.codeText}>{key}</TableCell>
                              <TableCell>{value}</TableCell>
                              <TableCell>
                                <Chip
                                  label={value.includes('required') ? 'Yes' : 'No'}
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
                    Response Status Codes:
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

        {/* Authentication Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">
              <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Authentication
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" gutterBottom>
              Authentication Methods
            </Typography>
            <Typography variant="body1" paragraph>
              The server supports two authentication methods that can be used individually or in combination:
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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                The API key can be set via environment variable or auto-generated for development.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Multiple IPs can be specified as comma-separated values.
              </Typography>
            </Box>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Security Note:</strong> For production use, it's recommended to use both 
                authentication methods together for maximum security.
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* Configuration Section */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">
              <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Configuration
            </Typography>
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
                    <TableCell><strong>Default</strong></TableCell>
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
              Usage Examples
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6" gutterBottom>
              Quick Start Examples
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

            <Box className={styles.example}>
              <Typography variant="subtitle1" gutterBottom>
                Using configuration file:
              </Typography>
              <pre className={styles.codeBlock}>
{`# config.yaml
api_key: "your-secret-api-key"
ip_whitelist: "192.168.1.0/24,10.0.0.1"
port: 8080
environment: "production"
log_level: "warn"
timeout: 30

./gmail-oauth-proxy server --config config.yaml`}
              </pre>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default Documentation;
