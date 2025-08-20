import type { ServerConfig } from '../types/config';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateConfig = (config: ServerConfig): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Validate port
  if (config.port < 1 || config.port > 65535) {
    errors.push({
      field: 'port',
      message: 'Port must be between 1 and 65535',
    });
  }
  
  // Validate timeout
  if (config.timeout < 1 || config.timeout > 300) {
    errors.push({
      field: 'timeout',
      message: 'Timeout must be between 1 and 300 seconds',
    });
  }
  
  // Validate IP whitelist
  config.ipWhitelist.forEach((ip, index) => {
    if (!isValidIpOrCidr(ip.trim())) {
      errors.push({
        field: 'ipWhitelist',
        message: `Invalid IP address or CIDR range at line ${index + 1}: ${ip}`,
      });
    }
  });
  
  return errors;
};

const isValidIpOrCidr = (value: string): boolean => {
  if (!value) return false;
  
  // Check if it's a CIDR range
  if (value.includes('/')) {
    const [ip, prefix] = value.split('/');
    const prefixNum = parseInt(prefix, 10);
    
    // Validate prefix
    if (isNaN(prefixNum) || prefixNum < 0) return false;
    
    // Check if it's IPv4 or IPv6
    if (isValidIPv4(ip)) {
      return prefixNum <= 32;
    } else if (isValidIPv6(ip)) {
      return prefixNum <= 128;
    }
    
    return false;
  }
  
  // Check if it's a single IP address
  return isValidIPv4(value) || isValidIPv6(value);
};

const isValidIPv4 = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

const isValidIPv6 = (ip: string): boolean => {
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  return ipv6Regex.test(ip);
};
