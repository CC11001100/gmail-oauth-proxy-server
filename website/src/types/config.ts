export interface ServerConfig {
  apiKey?: string;
  ipWhitelist: string[];
  port: number;
  environment: 'development' | 'production';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  timeout: number;
}

export interface GeneratedOutput {
  commandLine: string;
  environmentVariables: string;
  configFile: string;
}

export const DEFAULT_CONFIG: ServerConfig = {
  apiKey: '',
  ipWhitelist: [],
  port: 8080,
  environment: 'development',
  logLevel: 'info',
  timeout: 10,
};

export const ENVIRONMENT_OPTIONS = [
  { value: 'development', label: 'Development' },
  { value: 'production', label: 'Production' },
] as const;

export const LOG_LEVEL_OPTIONS = [
  { value: 'debug', label: 'Debug' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Warning' },
  { value: 'error', label: 'Error' },
] as const;
