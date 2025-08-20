import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  color = 'primary' 
}) => {
  return (
    <Card className={styles.featureCard} elevation={0}>
      <CardContent className={styles.cardContent}>
        <Box className={`${styles.iconContainer} ${styles[color]}`}>
          <Box className={styles.iconWrapper}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h6" component="h3" gutterBottom className={styles.title}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className={styles.description}>
          {description}
        </Typography>
        <Box className={styles.cardFooter}>
          <Chip 
            label="了解更多" 
            size="small" 
            color={color} 
            variant="outlined"
            className={styles.chip}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
