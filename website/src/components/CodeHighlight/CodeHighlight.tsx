import React, { useEffect, useRef } from 'react';
import { Paper, Box } from '@mui/material';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-markdown';
import styles from './CodeHighlight.module.css';

interface CodeHighlightProps {
  code: string;
  language?: string;
  className?: string;
}

const CodeHighlight: React.FC<CodeHighlightProps> = ({ 
  code, 
  language = 'bash',
  className 
}) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <Paper className={`${styles.codeBlock} ${className || ''}`} elevation={1}>
      <Box className={styles.codeHeader}>
        <span className={styles.language}>{language}</span>
      </Box>
      <Box className={styles.codeContent}>
        <pre className={styles.pre}>
          <code 
            ref={codeRef} 
            className={`language-${language}`}
          >
            {code}
          </code>
        </pre>
      </Box>
    </Paper>
  );
};

export default CodeHighlight; 