import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import { GitHub as GitHubIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t('footer.links.github'),
      url: 'https://github.com/cc11001100/gmail-oauth-proxy-server',
    },
    {
      title: t('footer.links.documentation'),
      url: 'https://github.com/cc11001100/gmail-oauth-proxy-server#readme',
    },
    {
      title: t('footer.links.releases'),
      url: 'https://github.com/cc11001100/gmail-oauth-proxy-server/releases',
    },
    {
      title: t('footer.links.issues'),
      url: 'https://github.com/cc11001100/gmail-oauth-proxy-server/issues',
    },
  ];

  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ py: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Gmail OAuth Proxy Server
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('footer.description')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component={Link}
                href="https://github.com/cc11001100/gmail-oauth-proxy-server"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {t('footer.links.github')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="text.secondary"
                  underline="hover"
                  variant="body2"
                >
                  {link.title}
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>
        
        <Divider />
        
        <Box sx={{ py: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('footer.copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
