import { GoogleGenAI } from '@google/genai';
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

export class GeminiProvider implements AIProvider {
  public readonly id: ProviderId = 'gemini';
  public readonly name: string = 'Gemini';

  private apiKey: string = '';
  private model: string = 'gemini-3.8-flash';
  private enabled: boolean = true;
  private status: ProviderStatus = 'not_configured';
  private lastTestedAt?: string;
  private lastMessage?: string;
  private client: GoogleGenAI | null = null;

  constructor(initialKey?: string, initialModel?: string, initialEnabled: boolean = true) {
    if (initialKey) {
      this.apiKey = initialKey;
      this.status = 'configured';
      this.initClient();
    }
    if (initialModel) {
      this.model = initialModel;
    }
    this.enabled = initialEnabled;
  }

  private initClient(): void {
    if (!this.apiKey) {
      this.client = null;
      return;
    }
    this.client = new GoogleGenAI({
      apiKey: this.apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getModel(): string {
    return this.model;
  }

  public setModel(model: string): void {
    if (model && model.trim()) {
      this.model = model.trim();
    }
  }

  public setApiKey(key: string): void {
    if (key && key.trim()) {
      this.apiKey = key.trim();
      this.status = 'configured';
      this.initClient();
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
    if (this.isConfigured()) {
      const len = this.apiKey.length;
      if (len > 8) {
        masked = `${this.apiKey.substring(0, 4)}••••••••${this.apiKey.substring(len - 4)}`;
      } else {
        masked = '••••••••••••';
      }
    }

    return {
      id: this.id,
      name: this.name,
      model: this.model,
      enabled: this.enabled,
      hasKey: this.isConfigured(),
      apiKeyMasked: masked,
      status: this.getStatus(),
      lastTestedAt: this.lastTestedAt,
      lastMessage: this.lastMessage,
    };
  }

  public async generate(params: GenerateParams): Promise<GenerateResult> {
    if (!this.client) {
      throw new Error('GeminiProvider belum dikonfigurasi dengan API Key yang valid.');
    }

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: params.prompt,
      config: params.systemInstruction
        ? { systemInstruction: params.systemInstruction }
        : undefined,
    });

    const text = response.text || '';
    return {
      text,
      providerId: this.id,
      model: this.model,
    };
  }

  public async structuredOutput<T = any>(params: StructuredOutputParams): Promise<T> {
    if (!this.client) {
      throw new Error('GeminiProvider belum dikonfigurasi dengan API Key yang valid.');
    }

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: params.prompt,
      config: {
        systemInstruction: params.systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    try {
      return JSON.parse(text) as T;
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]) as T;
      }
      throw new Error('Gagal mem-parsing output JSON terstruktur dari Gemini');
    }
  }

  public async testConnection(): Promise<TestConnectionResult> {
    if (!this.isConfigured() || !this.client) {
      this.status = 'not_configured';
      return {
        success: false,
        message: '✕ API Key belum dikonfigurasi',
      };
    }

    const startTime = Date.now();
    try {
      const res = await this.client.models.generateContent({
        model: this.model,
        contents: 'Test connection. Jawab singkat: OK',
      });

      const latencyMs = Date.now() - startTime;
      if (res && res.text) {
        this.status = 'connected';
        this.lastTestedAt = new Date().toLocaleTimeString('id-ID');
        this.lastMessage = `Connection successful (${this.model}, ${latencyMs}ms)`;
        return {
          success: true,
          message: `✓ Connection successful (${this.model}, ${latencyMs}ms)`,
          latencyMs,
        };
      }

      this.status = 'error';
      return {
        success: false,
        message: '✕ Respon kosong dari Gemini',
      };
    } catch (err: any) {
      this.status = 'error';
      const cleanMsg = (err.message || 'Koneksi gagal').replace(/key=[^&\s]+/gi, 'key=HIDDEN');
      this.lastMessage = cleanMsg;
      return {
        success: false,
        message: `✕ Connection failed: ${cleanMsg}`,
      };
    }
  }
}
