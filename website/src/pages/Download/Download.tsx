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
import CodeHighlight from '../../components/CodeHighlight';

const Download: React.FC = () => {
  const { t } = useTranslation();

  const platforms = [
    {
      name: t('download.platforms.linuxAmd64.name'),
      icon: <ComputerIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_linux_amd64.tar.gz',
      description: t('download.platforms.linuxAmd64.description'),
    },
    {
      name: t('download.platforms.linuxArm64.name'),
      icon: <ComputerIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_linux_arm64.tar.gz',
      description: t('download.platforms.linuxArm64.description'),
    },
    {
      name: t('download.platforms.macosIntel.name'),
      icon: <AppleIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_darwin_amd64.tar.gz',
      description: t('download.platforms.macosIntel.description'),
    },
    {
      name: t('download.platforms.macosAppleSilicon.name'),
      icon: <AppleIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_darwin_arm64.tar.gz',
      description: t('download.platforms.macosAppleSilicon.description'),
    },
    {
      name: t('download.platforms.windowsAmd64.name'),
      icon: <AndroidIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_windows_amd64.tar.gz',
      description: t('download.platforms.windowsAmd64.description'),
    },
    {
      name: t('download.platforms.freebsdAmd64.name'),
      icon: <ComputerIcon />,
      filename: 'gmail-oauth-proxy-server_VERSION_freebsd_amd64.tar.gz',
      description: t('download.platforms.freebsdAmd64.description'),
    },
  ];

  const installationMethods = [
    {
      title: t('download.methods.prebuilt.title'),
      description: t('download.methods.prebuilt.description'),
      steps: t('download.methods.prebuilt.steps'),
    },
    {
      title: t('download.methods.source.title'),
      description: t('download.methods.source.description'),
      steps: t('download.methods.source.steps'),
    },
    {
      title: t('download.methods.go.title'),
      description: t('download.methods.go.description'),
      steps: t('download.methods.go.steps'),
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
                    {t('download.downloadButton')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h4" gutterBottom>
          {t('download.installationMethods')}
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
                    {Array.isArray(method.steps) && method.steps.map((step, stepIndex) => {
                      // 检查步骤是否包含代码
                      const hasCode = step.includes('tar -xzf') || 
                                    step.includes('chmod +x') || 
                                    step.includes('go ') || 
                                    step.includes('git clone') ||
                                    step.includes('cd ') ||
                                    step.includes('./gmail-oauth-proxy');
                      
                      if (hasCode) {
                        return (
                          <Box key={stepIndex} component="li" sx={{ mb: 1 }}>
                            <Typography variant="body2" component="span">
                              {step.split(':')[0]}:
                            </Typography>
                            <CodeHighlight 
                              code={step.split(':')[1] || step}
                              language="bash"
                              className={styles.stepCode}
                            />
                          </Box>
                        );
                      }
                      
                      return (
                        <Typography key={stepIndex} component="li" variant="body2">
                          {step}
                        </Typography>
                      );
                    })}
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
                {t('download.sourceCode')}
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {t('download.sourceCodeDescription')}
            </Typography>
            <Box className={styles.sourceCodeActions}>
                              <Button
                  variant="contained"
                  href="https://github.com/cc11001100/gmail-oauth-proxy-server"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('download.viewOnGitHub')}
                </Button>
                <Button
                  variant="outlined"
                  href="https://github.com/cc11001100/gmail-oauth-proxy-server/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('download.allReleases')}
                </Button>
                <Button
                  variant="outlined"
                  href="https://github.com/cc11001100/gmail-oauth-proxy-server/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('download.reportIssues')}
                </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box className={styles.section}>
        <Typography variant="h4" gutterBottom>
          {t('download.verification')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('download.verificationDescription')}
        </Typography>
        <CodeHighlight 
          code={`# Download checksums
wget https://github.com/cc11001100/gmail-oauth-proxy-server/releases/latest/download/checksums.txt

# Verify (Linux/macOS)
sha256sum -c checksums.txt

# Verify (Windows)
certutil -hashfile filename.tar.gz SHA256`}
          language="bash"
        />
      </Box>
    </Container>
  );
};

export default Download;
