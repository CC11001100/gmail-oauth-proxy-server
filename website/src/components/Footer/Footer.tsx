import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import { 
  GitHub as GitHubIcon,
  Star as StarIcon,
  Code as CodeIcon,
  BugReport as BugReportIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t('footer.links.github'),
      url: 'https://github.com/cc11001100/gmail-oauth-proxy-server',
      icon: <GitHubIcon />,
    },
    {
      title: t('footer.links.documentation'),
      url: 'https://github.com/cc11001100/gmail-oauth-proxy-server#readme',
      icon: <DescriptionIcon />,
    },
    {
      title: t('footer.links.releases'),
      url: 'https://github.com/cc11001100/gmail-oauth-proxy-server/releases',
      icon: <StarIcon />,
    },
    {
      title: t('footer.links.issues'),
      url: 'https://github.com/cc11001100/gmail-oauth-proxy-server/issues',
      icon: <BugReportIcon />,
    },
  ];

  const features = [
    { label: t('footer.features.dualAuth'), color: 'primary' as const },
    { label: t('footer.features.ipWhitelist'), color: 'success' as const },
    { label: t('footer.features.httpsEnforcement'), color: 'info' as const },
    { label: t('footer.features.logSanitization'), color: 'warning' as const },
  ];

  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ py: 6 }}>
          {/* Project Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <SecurityIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Gmail OAuth Proxy
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3, lineHeight: 1.7 }}>
              {t('footer.description')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature.label}
                  color={feature.color}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              {t('footer.quickLinks')}
            </Typography>
            <Stack spacing={2}>
              {footerLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="text.secondary"
                  underline="none"
                  variant="body1"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {link.icon}
                  {link.title}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Tech Stack */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              {t('footer.techStack')}
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CodeIcon color="primary" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t('footer.tech.go.title')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('footer.tech.go.description')}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SecurityIcon color="success" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t('footer.tech.oauth.title')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('footer.tech.oauth.description')}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StarIcon color="warning" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {t('footer.tech.license.title')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('footer.tech.license.description')}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('footer.copyright')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton
              component={Link}
              href="https://github.com/cc11001100/gmail-oauth-proxy-server"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              size="small"
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              component={Link}
              href="https://github.com/cc11001100/gmail-oauth-proxy-server/stargazers"
              target="_blank"
              rel="noopener noreferrer"
              color="warning"
              size="small"
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <StarIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
