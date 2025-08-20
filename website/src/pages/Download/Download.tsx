import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,

  Paper,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Computer as ComputerIcon,
  Apple as AppleIcon,
  Android as AndroidIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import styles from './Download.module.css';

const Download: React.FC = () => {
  const { t } = useTranslation();

  const platforms = [
    {
      name: 'Linux AMD64',
      icon: <ComputerIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_linux_amd64.tar.gz',
      description: 'For most Linux distributions (64-bit)',
    },
    {
      name: 'Linux ARM64',
      icon: <ComputerIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_linux_arm64.tar.gz',
      description: 'For ARM-based Linux systems (64-bit)',
    },
    {
      name: 'macOS Intel',
      icon: <AppleIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_darwin_amd64.tar.gz',
      description: 'For Intel-based Mac computers',
    },
    {
      name: 'macOS Apple Silicon',
      icon: <AppleIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_darwin_arm64.tar.gz',
      description: 'For M1/M2 Mac computers',
    },
    {
      name: 'Windows AMD64',
      icon: <AndroidIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_windows_amd64.tar.gz',
      description: 'For Windows (64-bit)',
    },
    {
      name: 'FreeBSD AMD64',
      icon: <ComputerIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_freebsd_amd64.tar.gz',
      description: 'For FreeBSD systems (64-bit)',
    },
  ];

  const installationMethods = [
    {
      title: 'Download Pre-built Binaries',
      description: 'Download and extract the binary for your platform',
      steps: [
        'Download the appropriate binary for your platform',
        'Extract the archive: tar -xzf filename.tar.gz',
        'Make executable: chmod +x gmail-oauth-proxy',
        'Run: ./gmail-oauth-proxy server',
      ],
    },
    {
      title: 'Build from Source',
      description: 'Compile from source code using Go',
      steps: [
        'Clone: git clone https://github.com/cc11001100/gmail-oauth-proxy-server.git',
        'Navigate: cd gmail-oauth-proxy-server',
        'Install dependencies: go mod tidy',
        'Build: go build -o gmail-oauth-proxy main.go',
      ],
    },
    {
      title: 'Install with Go',
      description: 'Install directly using Go toolchain',
      steps: [
        'Run: go install github.com/cc11001100/gmail-oauth-proxy-server@latest',
        'The binary will be available in your $GOPATH/bin',
      ],
    },
  ];

  const baseUrl = 'https://github.com/cc11001100/gmail-oauth-proxy-server/releases/latest/download/';

  return (
    <Container maxWidth="lg" className={styles.download}>
      <Box className={styles.header}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t('download.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {t('download.description')}
        </Typography>
      </Box>

      <Alert severity="info" className={styles.alert}>
        <Typography variant="body2">
          <strong>Latest Release:</strong> All binaries are automatically built and published 
          to GitHub Releases with checksums for verification. Replace VERSION with the actual 
          version number from the releases page.
        </Typography>
      </Alert>

      <Box className={styles.section}>
        <Typography variant="h4" gutterBottom>
          {t('download.platforms')}
        </Typography>
        <Grid container spacing={3}>
          {platforms.map((platform, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card className={styles.platformCard}>
                <CardContent>
                  <Box className={styles.platformHeader}>
                    {platform.icon}
                    <Typography variant="h6" component="h3">
                      {platform.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {platform.description}
                  </Typography>
                  <Typography variant="body2" className={styles.filename}>
                    {platform.filename}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    fullWidth
                    href={`${baseUrl}${platform.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadButton}
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h4" gutterBottom>
          Installation Methods
        </Typography>
        <Grid container spacing={3}>
          {installationMethods.map((method, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card className={styles.methodCard}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {method.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {method.description}
                  </Typography>
                  <Box component="ol" className={styles.stepsList}>
                    {method.steps.map((step, stepIndex) => (
                      <Typography key={stepIndex} component="li" variant="body2">
                        {step}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h4" gutterBottom>
          {t('download.sourceCode')}
        </Typography>
        <Card>
          <CardContent>
            <Box className={styles.sourceCodeHeader}>
              <CodeIcon />
              <Typography variant="h6">
                GitHub Repository
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Access the complete source code, contribute to the project, or report issues.
            </Typography>
            <Box className={styles.sourceCodeActions}>
              <Button
                variant="contained"
                href="https://github.com/cc11001100/gmail-oauth-proxy-server"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Button>
              <Button
                variant="outlined"
                href="https://github.com/cc11001100/gmail-oauth-proxy-server/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                All Releases
              </Button>
              <Button
                variant="outlined"
                href="https://github.com/cc11001100/gmail-oauth-proxy-server/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report Issues
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h4" gutterBottom>
          Verification
        </Typography>
        <Typography variant="body1" paragraph>
          All releases include SHA256 checksums for verification. After downloading, 
          verify the integrity of your download:
        </Typography>
        <Paper className={styles.codeBlock}>
          <pre>
{`# Download checksums
wget https://github.com/cc11001100/gmail-oauth-proxy-server/releases/latest/download/checksums.txt

# Verify (Linux/macOS)
sha256sum -c checksums.txt

# Verify (Windows)
certutil -hashfile filename.tar.gz SHA256`}
          </pre>
        </Paper>
      </Box>
    </Container>
  );
};

export default Download;
