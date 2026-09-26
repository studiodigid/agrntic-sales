import {
  AIProvider,
  GenerateParams,
  GenerateResult,
  ProviderId,
  ProviderPublicConfig,
  ProviderStatus,
  StructuredOutputParams,
  TestConnectionResult,
} from '../types';

export class PlaceholderProvider implements AIProvider {
  public readonly id: ProviderId;
  public readonly name: string;

  private apiKey: string = '';
  private model: string = '';
  private enabled: boolean = false;
  private status: ProviderStatus = 'not_configured';
  private lastTestedAt?: string;
  private lastMessage?: string;

  constructor(id: ProviderId, name: string) {
    this.id = id;
    this.name = name;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0 && this.model && this.model.trim().length > 0);
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getModel(): string {
    return this.model;
  }

  public setModel(model: string): void {
    this.model = model ? model.trim() : '';
  }

  public setApiKey(key: string): void {
    this.apiKey = key ? key.trim() : '';
    if (this.apiKey) {
      this.status = 'configured';
    } else {
      this.status = 'not_configured';
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public getStatus(): ProviderStatus {
    if (!this.isConfigured()) return 'not_configured';
    return this.status;
  }

  public setStatus(status: ProviderStatus, message?: string): void {
    this.status = status;
    if (message) this.lastMessage = message;
  }

  public getPublicConfig(): ProviderPublicConfig {
    let masked = '';
    if (this.apiKey) {
      masked = '••••••••••••';
    }

    return {
      id: this.id,
      name: this.name,
      model: this.model,
      enabled: this.enabled,
      hasKey: Boolean(this.apiKey),
      apiKeyMasked: masked,
      status: this.getStatus(),
      isPlaceholder: true,
      lastTestedAt: this.lastTestedAt,
      lastMessage: this.lastMessage || 'Slot konfigurasi placeholder (menunggu penentuan spesifikasi provider).',
    };
  }

  public async generate(_params: GenerateParams): Promise<GenerateResult> {
    throw new Error(`${this.name} adalah slot placeholder dan belum memiliki implementasi API aktif.`);
  }

  public async structuredOutput<T = any>(_params: StructuredOutputParams): Promise<T> {
    throw new Error(`${this.name} adalah slot placeholder dan belum memiliki implementasi API aktif.`);
  }

  public async testConnection(): Promise<TestConnectionResult> {
    this.lastTestedAt = new Date().toLocaleTimeString('id-ID');
    this.status = 'not_configured';
    this.lastMessage = `${this.name} adalah configuration slot placeholder. Implementasi API resmi belum ditentukan.`;
    return {
      success: false,
      message: `✕ ${this.name} belum dikonfigurasi (Slot Placeholder menunggu penentuan provider resmi).`,
    };
  }
}
