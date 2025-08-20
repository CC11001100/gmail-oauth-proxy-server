import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Https as HttpsIcon,
  List as ListIcon,
  Visibility as VisibilityIcon,
  SwapHoriz as SwapHorizIcon,
  Download as DownloadIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import FeatureCard from '../../components/FeatureCard/FeatureCard';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <SecurityIcon />,
      title: t('home.features.dualAuth.title'),
      description: t('home.features.dualAuth.description'),
    },
    {
      icon: <ShieldIcon />,
      title: t('home.features.flexibleAuth.title'),
      description: t('home.features.flexibleAuth.description'),
    },
    {
      icon: <HttpsIcon />,
      title: t('home.features.httpsEnforcement.title'),
      description: t('home.features.httpsEnforcement.description'),
    },
    {
      icon: <ListIcon />,
      title: t('home.features.ipWhitelist.title'),
      description: t('home.features.ipWhitelist.description'),
    },
    {
      icon: <VisibilityIcon />,
      title: t('home.features.logSanitization.title'),
      description: t('home.features.logSanitization.description'),
    },
    {
      icon: <SwapHorizIcon />,
      title: t('home.features.requestProxy.title'),
      description: t('home.features.requestProxy.description'),
    },
  ];

  const quickStartSteps = [
    t('home.quickStart.step1'),
    t('home.quickStart.step2'),
    t('home.quickStart.step3'),
    t('home.quickStart.step4'),
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <Box className={styles.heroSection}>
        <Container maxWidth="lg">
          <Box className={styles.heroContent}>
            <Typography
              variant="h1"
              component="h1"
              className={styles.heroTitle}
              gutterBottom
            >
              {t('home.title')}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              className={styles.heroSubtitle}
              gutterBottom
            >
              {t('home.subtitle')}
            </Typography>
            <Box className={styles.heroButtons}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/parameter-editor"
                startIcon={<PlayArrowIcon />}
                className={styles.primaryButton}
              >
                {t('home.getStarted')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/documentation"
                startIcon={<DownloadIcon />}
                className={styles.secondaryButton}
              >
                {t('home.learnMore')}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" className={styles.section}>
        <Typography variant="h2" component="h2" className={styles.sectionTitle}>
          {t('home.features.title')}
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Quick Start Section */}
      <Container maxWidth="lg" className={styles.section}>
        <Typography variant="h2" component="h2" className={styles.sectionTitle}>
          {t('home.quickStart.title')}
        </Typography>
        <Paper className={styles.quickStartPaper}>
          <List>
            {quickStartSteps.map((step, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={step}
                  primaryTypographyProps={{
                    variant: 'body1',
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Box className={styles.quickStartActions}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/download"
              startIcon={<DownloadIcon />}
            >
              {t('nav.download')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/parameter-editor"
            >
              {t('nav.parameterEditor')}
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Home;
