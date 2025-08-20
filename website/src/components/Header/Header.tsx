import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Avatar,
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Close as CloseIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Header.module.css';

interface HeaderProps {
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode = false, onThemeToggle }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { key: 'home', label: t('nav.home'), path: '/' },
    { key: 'documentation', label: t('nav.documentation'), path: '/documentation' },
    { key: 'parameterEditor', label: t('nav.parameterEditor'), path: '/parameter-editor' },
    { key: 'download', label: t('nav.download'), path: '/download' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Gmail OAuth Proxy
        </Typography>
        <IconButton>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 2 }}>
            <LanguageSwitcher />
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" className={styles.appBar}>
        <Container maxWidth="lg">
          <Toolbar sx={{ minHeight: '70px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  mr: 2,
                  width: 40,
                  height: 40,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}
              >
                G
              </Avatar>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                }}
              >
                Gmail OAuth Proxy
              </Typography>
            </Box>

            {isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {onThemeToggle && (
                  <Tooltip title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}>
                    <IconButton
                      color="inherit"
                      onClick={onThemeToggle}
                      sx={{ mr: 1 }}
                    >
                      {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.key}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    className={location.pathname === item.path ? styles.activeNavItem : ''}
                    sx={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      px: 2,
                      py: 1,
                      borderRadius: 0,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {onThemeToggle && (
                    <Tooltip title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}>
                      <IconButton
                        color="inherit"
                        onClick={onThemeToggle}
                        sx={{
                          borderRadius: 0,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
                        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                      </IconButton>
                    </Tooltip>
                  )}
                  <LanguageSwitcher />
                  <Tooltip title="GitHub">
                    <IconButton
                      component="a"
                      href="https://github.com/cc11001100/gmail-oauth-proxy-server"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="inherit"
                      sx={{
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            borderRadius: '0 4px 4px 0',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
