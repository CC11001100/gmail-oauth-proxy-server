import type { ServerConfig, GeneratedOutput } from '../types/config';
import * as yaml from 'js-yaml';

export const generateCommands = (config: ServerConfig): GeneratedOutput => {
  // Generate command line
  const commandParts = ['./gmail-oauth-proxy server'];
  
  if (config.apiKey) {
    commandParts.push(`--api-key ${config.apiKey}`);
  }
  
  if (config.port !== 8080) {
    commandParts.push(`--port ${config.port}`);
  }
  
  if (config.environment !== 'development') {
    commandParts.push(`--env ${config.environment}`);
  }
  
  if (config.logLevel !== 'info') {
    commandParts.push(`--log-level ${config.logLevel}`);
  }
  
  if (config.timeout !== 10) {
    commandParts.push(`--timeout ${config.timeout}`);
  }
  
  if (config.ipWhitelist.length > 0) {
    config.ipWhitelist.forEach(ip => {
      commandParts.push(`--ip-whitelist ${ip}`);
    });
  }
  
  const commandLine = commandParts.join(' ');
  
  // Generate environment variables
  const envVars: string[] = [];
  
  if (config.apiKey) {
    envVars.push(`export OAUTH_PROXY_API_KEY="${config.apiKey}"`);
  }
  
  if (config.ipWhitelist.length > 0) {
    envVars.push(`export OAUTH_PROXY_IP_WHITELIST="${config.ipWhitelist.join(',')}"`);
  }
  
  if (config.port !== 8080) {
    envVars.push(`export OAUTH_PROXY_PORT=${config.port}`);
  }
  
  if (config.environment !== 'development') {
    envVars.push(`export OAUTH_PROXY_ENVIRONMENT=${config.environment}`);
  }
  
  if (config.logLevel !== 'info') {
    envVars.push(`export OAUTH_PROXY_LOG_LEVEL=${config.logLevel}`);
  }
  
  if (config.timeout !== 10) {
    envVars.push(`export OAUTH_PROXY_TIMEOUT=${config.timeout}`);
  }
  
  const environmentVariables = envVars.join('\n');
  
  // Generate YAML config file
  const yamlConfig: any = {};
  
  if (config.apiKey) {
    yamlConfig.api_key = config.apiKey;
  }
  
  if (config.ipWhitelist.length > 0) {
    yamlConfig.ip_whitelist = config.ipWhitelist;
  }
  
  if (config.port !== 8080) {
    yamlConfig.port = config.port;
  }
  
  if (config.environment !== 'development') {
    yamlConfig.environment = config.environment;
  }
  
  if (config.logLevel !== 'info') {
    yamlConfig.log_level = config.logLevel;
  }
  
  if (config.timeout !== 10) {
    yamlConfig.timeout = config.timeout;
  }
  
  const configFile = Object.keys(yamlConfig).length > 0 
    ? yaml.dump(yamlConfig, { indent: 2 })
    : '# No custom configuration needed\n# All values are using defaults';
  
  return {
    commandLine,
    environmentVariables: environmentVariables || '# No environment variables needed',
    configFile,
  };
};
