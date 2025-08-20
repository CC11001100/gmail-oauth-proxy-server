import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className={styles.featureCard}>
      <CardContent>
        <Box className={styles.iconContainer}>
          {icon}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom className={styles.title}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className={styles.description}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
