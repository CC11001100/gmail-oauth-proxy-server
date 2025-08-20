import React from 'react';
import { Button, Menu, MenuItem, ListItemText } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    // 使用新的changeLanguage函数，它会自动保存到LocalStorage
    changeLanguage(language);
    handleClose();
  };

  return (
    <div className={styles.languageSwitcher}>
      <Button
        id="language-button"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        color="inherit"
      >
        {t('common.language')}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        <MenuItem 
          onClick={() => handleLanguageChange('en')}
          selected={i18n.language === 'en'}
        >
          <ListItemText>{t('common.english')}</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleLanguageChange('zh')}
          selected={i18n.language === 'zh'}
        >
          <ListItemText>{t('common.chinese')}</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
