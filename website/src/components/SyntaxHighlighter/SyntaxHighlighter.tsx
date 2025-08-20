import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-markdown';
import styles from './SyntaxHighlighter.module.css';

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ 
  code, 
  language = 'bash',
  className = '' 
}) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  // 根据内容自动检测语言
  const detectLanguage = (code: string): string => {
    if (code.includes('curl') || code.includes('export') || code.includes('./gmail-oauth-proxy')) {
      return 'bash';
    }
    if (code.includes('{') && code.includes('}') && code.includes('"')) {
      return 'json';
    }
    if (code.includes('#') && code.includes(':')) {
      return 'yaml';
    }
    return language;
  };

  const detectedLang = detectLanguage(code);

  return (
    <div className={`${styles.syntaxHighlighter} ${className}`}>
      <pre className={styles.pre}>
        <code 
          ref={codeRef}
          className={`language-${detectedLang}`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
};

export default SyntaxHighlighter; 