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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Api as ApiIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Http as HttpIcon,
  Key as KeyIcon,
  NetworkCheck as NetworkIcon,
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
      description: 'OAuth token exchange endpoint for Gmail API integration',
      requestHeaders: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your-secret-api-key',
        'User-Agent': 'YourApp/1.0',
        'Accept': 'application/json'
      },
      requestBodyExample: {
        code: '4/0AeaYshBpVe1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        client_id: 'your-client-id.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'https://yourdomain.com/auth/callback',
        grant_type: 'authorization_code'
      },
      requestBody: {
        code: 'string (required) - Authorization code from Google OAuth',
        client_id: 'string (required) - Google OAuth client ID',
        client_secret: 'string (required) - Google OAuth client secret',
        redirect_uri: 'string (required) - Redirect URI used in authorization',
        grant_type: 'string (required, must be "authorization_code") - OAuth grant type'
      },
      responseHeaders: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-ID': 'req_123456789abcdef',
        'X-Rate-Limit-Remaining': '999'
      },
      status: ['200 - Success', '400 - Bad Request', '401 - Unauthorized', '500 - Server Error'],
      responseExample: {
        access_token: 'ya29.a0AfH6SMC1234567890abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: '1//0eYour-Refresh-Token-ABC123DEF456GHI789',
        scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email',
        id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoieW91ci1jbGllbnQtaWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiJ5b3VyLWNsaWVudC1pZC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEyMzQ1Njc4OTAxMjM0NTY3ODkwMSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiX0xMS0tpdmZ2Zm1lOWVvUTNXY01JZyIsIm5hbWUiOiJKb2huIERvZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLRXhhbXBsZTEyMyIsImdpdmVuX25hbWUiOiJKb2huIiwiZmFtaWx5X25hbWUiOiJEb2UiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTY1MDA1MzE4NSwiZXhwIjoxNjUwMDU2Nzg1fQ.signature_here'
      },
      errorExample: {
        error: 'invalid_grant',
        error_description: 'Authorization code has expired or been used',
        error_uri: 'https://tools.ietf.org/html/rfc6749#section-5.2'
      }
    },
    {
      method: 'POST',
      path: '/token',
      description: 'Refresh access token using refresh token',
      requestHeaders: {
        'Content-Type': 'application/json',
        'X-API-Key': 'your-secret-api-key',
        'User-Agent': 'YourApp/1.0',
        'Accept': 'application/json'
      },
      requestBodyExample: {
        refresh_token: '1//0eYour-Refresh-Token-ABC123DEF456GHI789',
        client_id: 'your-client-id.apps.googleusercontent.com',
        client_secret: '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',
        grant_type: 'refresh_token'
      },
      requestBody: {
        refresh_token: 'string (required) - Valid refresh token',
        client_id: 'string (required) - Google OAuth client ID',
        client_secret: 'string (required) - Google OAuth client secret',
        grant_type: 'string (required, must be "refresh_token") - OAuth grant type'
      },
      responseHeaders: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Request-ID': 'req_987654321fedcba',
        'X-Rate-Limit-Remaining': '998'
      },
      status: ['200 - Success', '400 - Bad Request', '401 - Unauthorized', '500 - Server Error'],
      responseExample: {
        access_token: 'ya29.a0AfH6SMC9876543210zyxwvutsrqponmlkjihgfedcba1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email'
      },
      errorExample: {
        error: 'invalid_grant',
        error_description: 'Invalid refresh token',
        error_uri: 'https://tools.ietf.org/html/rfc6749#section-5.2'
      }
    },
    {
      method: 'GET',
      path: '/auth',
      description: 'Redirect to Google OAuth authorization page to initiate OAuth flow',
      requestHeaders: {
        'X-API-Key': 'your-secret-api-key',
        'User-Agent': 'YourApp/1.0',
        'Accept': 'text/html,application/xhtml+xml'
      },
      requestBody: null,
      queryParams: {
        client_id: 'string (required) - Google OAuth client ID',
        redirect_uri: 'string (required) - Callback URL after authorization',
        scope: 'string (required) - Space-separated list of scopes',
        state: 'string (required) - Anti-CSRF token',
        response_type: 'string (required, must be "code") - OAuth response type',
        access_type: 'string (optional) - "online" or "offline"',
        prompt: 'string (optional) - "none", "consent", "select_account"'
      },
      queryParamsExample: {
        client_id: 'your-client-id.apps.googleusercontent.com',
        redirect_uri: 'https://yourdomain.com/auth/callback',
        scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email',
        state: 'random-csrf-token-abc123',
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent'
      },
      responseHeaders: {
        'Location': 'https://accounts.google.com/oauth/v2/auth?client_id=...',
        'Cache-Control': 'no-cache',
        'X-Request-ID': 'req_auth_123456'
      },
      status: ['302 - Redirect', '400 - Bad Request', '401 - Unauthorized'],
    },
    {
      method: 'GET',
      path: '/userinfo',
      description: 'Proxy request to Google UserInfo API to get user information',
      requestHeaders: {
        'Authorization': 'Bearer ya29.a0AfH6SMC1234567890abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'X-API-Key': 'your-secret-api-key',
        'User-Agent': 'YourApp/1.0',
        'Accept': 'application/json'
      },
      requestBody: null,
      responseHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'private, max-age=0',
        'X-Request-ID': 'req_userinfo_789012',
        'X-Rate-Limit-Remaining': '997'
      },
      status: ['200 - Success', '401 - Unauthorized', '403 - Forbidden', '500 - Server Error'],
      responseExample: {
        id: '123456789012345678901',
        email: 'user@example.com',
        verified_email: true,
        name: 'John Doe',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'https://lh3.googleusercontent.com/a/ACg8ocKExample123',
        locale: 'en',
        hd: 'example.com'
      },
      errorExample: {
        error: {
          code: 401,
          message: 'Invalid Credentials',
          status: 'UNAUTHENTICATED'
        }
      }
    },
    {
      method: 'GET',
      path: '/tokeninfo',
      description: 'Proxy request to Google TokenInfo API to validate access token',
      requestHeaders: {
        'X-API-Key': 'your-secret-api-key',
        'User-Agent': 'YourApp/1.0',
        'Accept': 'application/json'
      },
      requestBody: null,
      queryParams: {
        access_token: 'string (required) - Access token to validate'
      },
      queryParamsExample: {
        access_token: 'ya29.a0AfH6SMC1234567890abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      },
      responseHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'private, max-age=0',
        'X-Request-ID': 'req_tokeninfo_345678',
        'X-Rate-Limit-Remaining': '996'
      },
      status: ['200 - Success', '400 - Bad Request', '401 - Unauthorized', '500 - Server Error'],
      responseExample: {
        issued_to: 'your-client-id.apps.googleusercontent.com',
        audience: 'your-client-id.apps.googleusercontent.com',
        user_id: '123456789012345678901',
        scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email',
        expires_in: 3456,
        email: 'user@example.com',
        verified_email: true,
        access_type: 'offline'
      },
      errorExample: {
        error_description: 'Invalid Value'
      }
    },
    {
      method: 'GET',
      path: '/health',
      description: 'Health check endpoint for monitoring and load balancers',
      requestHeaders: {
        'User-Agent': 'HealthChecker/1.0',
        'Accept': 'application/json'
      },
      requestBody: null,
      responseHeaders: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Request-ID': 'req_health_901234'
      },
      status: ['200 - OK', '503 - Service Unavailable'],
      responseExample: {
        status: 'ok',
        service: 'gmail-oauth-proxy-server',
        version: '1.0.0',
        timestamp: '2024-08-22T09:30:00Z',
        uptime: '72h30m15s',
        checks: {
          database: 'healthy',
          memory: 'healthy',
          disk: 'healthy'
        }
      },
      errorExample: {
        status: 'error',
        service: 'gmail-oauth-proxy-server',
        message: 'Service temporarily unavailable'
      }
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

  const errorCodes = [
    {
      code: 'AUTH_NOT_CONFIGURED',
      status: 500,
      description: 'No authentication method is configured on the server',
      solution: 'Configure at least one authentication method (API key or IP whitelist)'
    },
    {
      code: 'AUTH_API_KEY_MISSING',
      status: 401,
      description: 'X-API-Key header is missing from the request',
      solution: 'Include X-API-Key header with your API key'
    },
    {
      code: 'AUTH_API_KEY_INVALID',
      status: 401,
      description: 'The provided API key is invalid',
      solution: 'Verify your API key is correct'
    },
    {
      code: 'AUTH_IP_NOT_ALLOWED',
      status: 403,
      description: 'Client IP address is not in the whitelist',
      solution: 'Contact administrator to add your IP to the whitelist'
    },
    {
      code: 'AUTH_BOTH_FAILED',
      status: 401,
      description: 'Both API key and IP whitelist validation failed',
      solution: 'Ensure both API key and IP address are valid'
    }
  ];

  const securityBestPractices = [
    {
      icon: <SecurityIcon color="error" />,
      title: 'Use HTTPS in Production',
      description: 'Always use HTTPS in production environments to protect sensitive data in transit'
    },
    {
      icon: <KeyIcon color="warning" />,
      title: 'Secure API Key Management',
      description: 'Store API keys securely and rotate them regularly. Never commit them to version control'
    },
    {
      icon: <NetworkIcon color="info" />,
      title: 'IP Whitelist Configuration',
      description: 'Use specific IP ranges rather than broad network ranges to minimize attack surface'
    },
    {
      icon: <InfoIcon color="success" />,
      title: 'Monitor Access Logs',
      description: 'Regularly monitor access logs for suspicious activity and failed authentication attempts'
    }
  ];

  return (
    <Container maxWidth="lg" className={styles.documentation}>
      {/* Hero Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ 
          fontWeight: 700, 
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 3
        }}>
          Gmail OAuth Proxy Server
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 2 }}>
          Secure Gmail API integration OAuth token exchange proxy service
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '800px' }}>
          A secure intermediary layer between your application and Google OAuth endpoints, 
          providing enhanced security through dual authentication and IP whitelisting.
        </Typography>
      </Box>

      {/* Core Features */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Core Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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

      {/* API Documentation Sections */}
      <Box sx={{ mb: 4 }}>
        {/* Overview Section */}
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'action.hover' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Overview
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Typography paragraph>
              Gmail OAuth Proxy Server is a secure proxy service that provides OAuth token exchange 
              for Gmail API integrations. It acts as a secure intermediary layer between your application 
              and Google OAuth endpoints, ensuring that sensitive OAuth credentials are never exposed 
              to your end users.
            </Typography>
            <Typography paragraph>
              The server acts as a secure bridge, handling the OAuth flow on behalf of your application 
              while maintaining strict security controls through API key authentication and IP address whitelisting.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* API Endpoints Section */}
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'action.hover' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ApiIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                API Endpoints
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            {apiEndpoints.map((endpoint, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip 
                    label={endpoint.method} 
                    color={endpoint.method === 'GET' ? 'success' : 'primary'}
                    sx={{ fontWeight: 600, minWidth: 60 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {endpoint.path}
                  </Typography>
                </Box>
                
                <Typography paragraph color="text.secondary">
                  {endpoint.description}
                </Typography>

                {/* Required Headers */}
                {endpoint.requestHeaders && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Required Headers:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Header</strong></TableCell>
                            <TableCell><strong>Value</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(endpoint.requestHeaders).map(([header, value]) => (
                            <TableRow key={header}>
                              <TableCell sx={{ fontFamily: 'monospace' }}>{header}</TableCell>
                              <TableCell sx={{ fontFamily: 'monospace' }}>{value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Request Body Parameters */}
                {endpoint.requestBody && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Request Body Parameters:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Parameter</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Required</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(endpoint.requestBody).map(([param, type]) => (
                            <TableRow key={param}>
                              <TableCell sx={{ fontFamily: 'monospace' }}>{param}</TableCell>
                              <TableCell>{type}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={type.includes('required') ? 'Yes' : 'No'} 
                                  size="small"
                                  color={type.includes('required') ? 'error' : 'default'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Request Body Example */}
                {endpoint.requestBodyExample && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Request Body Example:
                    </Typography>
                    <SyntaxHighlighter 
                      language="json" 
                      code={JSON.stringify(endpoint.requestBodyExample, null, 2)}
                    />
                  </Box>
                )}

                {/* Query Parameters */}
                {endpoint.queryParams && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Query Parameters:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Parameter</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Required</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(endpoint.queryParams).map(([param, type]) => (
                            <TableRow key={param}>
                              <TableCell sx={{ fontFamily: 'monospace' }}>{param}</TableCell>
                              <TableCell>{type}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={type.includes('required') ? 'Yes' : 'No'} 
                                  size="small"
                                  color={type.includes('required') ? 'error' : 'default'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Query Parameters Example */}
                {endpoint.queryParamsExample && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Query Parameters Example:
                    </Typography>
                    <SyntaxHighlighter 
                      language="bash" 
                      code={Object.entries(endpoint.queryParamsExample)
                        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                        .join('&')}
                    />
                  </Box>
                )}

                {/* Response Status Codes */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Response Status Codes:
                  </Typography>
                  {endpoint.status.map((status, statusIndex) => (
                    <Typography key={statusIndex} variant="body2" sx={{ mb: 0.5 }}>
                      {status}
                    </Typography>
                  ))}
                </Box>

                {/* Response Headers */}
                {endpoint.responseHeaders && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Response Headers:
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Header</strong></TableCell>
                            <TableCell><strong>Value</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(endpoint.responseHeaders).map(([header, value]) => (
                            <TableRow key={header}>
                              <TableCell sx={{ fontFamily: 'monospace' }}>{header}</TableCell>
                              <TableCell sx={{ fontFamily: 'monospace' }}>{value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Response Examples */}
                {endpoint.responseExample && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Success Response Example:
                    </Typography>
                    <SyntaxHighlighter 
                      language="json" 
                      code={JSON.stringify(endpoint.responseExample, null, 2)}
                    />
                  </Box>
                )}

                {endpoint.errorExample && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Error Response Example:
                    </Typography>
                    <SyntaxHighlighter 
                      language="json" 
                      code={JSON.stringify(endpoint.errorExample, null, 2)}
                    />
                  </Box>
                )}

                {index < apiEndpoints.length - 1 && <Divider sx={{ mt: 3 }} />}
              </Box>
            ))}

            {/* Enhanced Examples */}
            <Box sx={{ mt: 4 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Example Request:
                </Typography>
                <SyntaxHighlighter 
                  language="bash" 
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
                />
              </Alert>

              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Example Refresh Token Request:
                </Typography>
                <SyntaxHighlighter 
                  language="bash" 
                  code={`curl -X POST http://localhost:8080/token \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-secret-api-key" \\
  -d '{
    "refresh_token": "1//0eYour-Refresh-Token...",
    "client_id": "your-client-id.apps.googleusercontent.com",
    "client_secret": "YOUR_CLIENT_SECRET",
    "grant_type": "refresh_token"
  }'`}
                />
              </Alert>

              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Example UserInfo Request:
                </Typography>
                <SyntaxHighlighter 
                  language="bash" 
                  code={`curl -X GET http://localhost:8080/userinfo \\
  -H "Authorization: Bearer your-access-token" \\
  -H "X-API-Key: your-secret-api-key"`}
                />
              </Alert>

              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Example TokenInfo Request:
                </Typography>
                <SyntaxHighlighter 
                  language="bash" 
                  code={`curl -X GET "http://localhost:8080/tokeninfo?access_token=your-access-token" \\
  -H "X-API-Key: your-secret-api-key"`}
                />
              </Alert>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Authentication Section */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'action.hover' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Authentication
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Authentication Methods
            </Typography>
            <Typography paragraph>
              The server supports two authentication methods that can be used individually or in combination:
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                1. API Key Authentication
              </Typography>
              <Typography paragraph>
                Authenticate via HTTP header X-API-Key:
              </Typography>
              <SyntaxHighlighter 
                language="bash" 
                code={`curl -H "X-API-Key: your-secret-api-key" http://localhost:8080/token`}
              />
              <Typography paragraph>
                The API key can be set via environment variable or auto-generated during development.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                2. IP Whitelist Authentication
              </Typography>
              <Typography paragraph>
                Access control based on client IP address, supports:
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <NetworkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Individual IP addresses:" 
                    secondary={<code>192.168.1.100</code>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NetworkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="CIDR networks:" 
                    secondary={<code>192.168.1.0/24</code>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NetworkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="IPv6 addresses:" 
                    secondary={<><code>::1</code>, <code>2001:db8::/32</code></>}
                  />
                </ListItem>
              </List>
              <Typography paragraph>
                Multiple IPs can be specified as comma-separated values.
              </Typography>
            </Box>

            <Alert severity="warning">
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Security Note: For production use, it's recommended to use both authentication methods together for maximum security.
              </Typography>
            </Alert>
          </AccordionDetails>
        </Accordion>

        {/* Configuration Section */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'action.hover' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Configuration
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Environment Variables
            </Typography>
            <TableContainer component={Paper} variant="outlined">
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
                  {configOptions.map((option) => (
                    <TableRow key={option.name}>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {option.name}
                      </TableCell>
                      <TableCell>{option.type}</TableCell>
                      <TableCell>
                        <Chip 
                          label={option.required ? 'Yes' : 'No'} 
                          size="small"
                          color={option.required ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>
                        {option.default}
                      </TableCell>
                      <TableCell>{option.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

        {/* Error Handling Section */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'action.hover' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorIcon color="error" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Error Handling
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Common Error Codes
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Error Code</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Solution</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {errorCodes.map((error) => (
                    <TableRow key={error.code}>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {error.code}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={error.status} 
                          size="small"
                          color={error.status >= 500 ? 'error' : error.status >= 400 ? 'warning' : 'success'}
                        />
                      </TableCell>
                      <TableCell>{error.description}</TableCell>
                      <TableCell>{error.solution}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>

        {/* Security Best Practices Section */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'action.hover' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="error" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Security Best Practices
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {securityBestPractices.map((practice, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        {practice.icon}
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {practice.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {practice.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Usage Examples Section */}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'action.hover' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CodeIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Usage Examples
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Start Examples
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Start with API Key only:
              </Typography>
              <SyntaxHighlighter 
                language="bash" 
                code={`export OAUTH_PROXY_API_KEY="your-secret-api-key"
./gmail-oauth-proxy server`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Start with IP whitelist only:
              </Typography>
              <SyntaxHighlighter 
                language="bash" 
                code={`export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1,127.0.0.1"
./gmail-oauth-proxy server`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Start with dual authentication:
              </Typography>
              <SyntaxHighlighter 
                language="bash" 
                code={`export OAUTH_PROXY_API_KEY="your-secret-api-key"
export OAUTH_PROXY_IP_WHITELIST="192.168.1.0/24,10.0.0.1"
./gmail-oauth-proxy server --env production --log-level warn`}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Using configuration file:
              </Typography>
              <SyntaxHighlighter 
                language="yaml" 
                code={`# config.yaml
api_key: "your-secret-api-key"
ip_whitelist:
  - "192.168.1.0/24"
  - "10.0.0.1"
port: "8080"
environment: "production"
log_level: "warn"
timeout: 30

./gmail-oauth-proxy server --config config.yaml`}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default Documentation;
