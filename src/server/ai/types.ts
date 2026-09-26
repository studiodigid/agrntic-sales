export type ProviderId = 'gemini' | 'openai' | 'provider3' | 'provider4' | 'provider5';

export type ProviderStatus = 'not_configured' | 'configured' | 'connected' | 'error';

export interface ProviderPublicConfig {
  id: ProviderId;
  name: string;
  model: string;
  enabled: boolean;
  hasKey: boolean;
  apiKeyMasked: string;
  status: ProviderStatus;
  isPlaceholder?: boolean;
  lastTestedAt?: string;
  lastMessage?: string;
}

export interface RouterConfigResponse {
  activeProviderId: ProviderId;
  fallbackProviderId?: ProviderId;
  providers: ProviderPublicConfig[];
}

export interface GenerateParams {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateResult {
  text: string;
  providerId: ProviderId;
  model: string;
}

export interface StructuredOutputParams {
  prompt: string;
  systemInstruction?: string;
  jsonSchema?: Record<string, any>;
  temperature?: number;
}

export interface TestConnectionResult {
  success: boolean;
  message: string;
  latencyMs?: number;
}

export interface AIProvider {
  id: ProviderId;
  name: string;
  isConfigured(): boolean;
  isEnabled(): boolean;
  getModel(): string;
  setModel(model: string): void;
  setApiKey(key: string): void;
  setEnabled(enabled: boolean): void;
  getStatus(): ProviderStatus;
  setStatus(status: ProviderStatus, message?: string): void;
  getPublicConfig(): ProviderPublicConfig;
  generate(params: GenerateParams): Promise<GenerateResult>;
  structuredOutput<T = any>(params: StructuredOutputParams): Promise<T>;
  testConnection(): Promise<TestConnectionResult>;
  stream?(params: GenerateParams): AsyncIterable<{ text: string }>;
  toolCall?(params: any): Promise<any>;
}
