import React from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ParameterEditor from '../../components/ParameterEditor/ParameterEditor';
import styles from './ParameterEditorPage.module.css';

const ParameterEditorPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="xl" className={styles.parameterEditorPage}>
      <Box className={styles.header}>
        <Typography variant="h2" component="h1" gutterBottom>
          {t('parameterEditor.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {t('parameterEditor.description')}
        </Typography>
        
        <Alert severity="info" className={styles.infoAlert}>
          <Typography variant="body2">
            <strong>How to use:</strong> Configure your server parameters on the left, 
            and the generated commands will appear on the right. You can copy any of the 
            generated outputs to use in your deployment.
          </Typography>
        </Alert>
      </Box>

      <ParameterEditor />
    </Container>
  );
};

export default ParameterEditorPage;
