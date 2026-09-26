import {
  AIProvider,
  GenerateParams,
  GenerateResult,
  ProviderId,
  RouterConfigResponse,
  StructuredOutputParams,
  TestConnectionResult,
} from './types';
import { GeminiProvider } from './providers/GeminiProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { PlaceholderProvider } from './providers/PlaceholderProvider';

export class AIModelRouter {
  private providers: Map<ProviderId, AIProvider> = new Map();
  private activeProviderId: ProviderId = 'gemini';
  private fallbackProviderId?: ProviderId = 'gemini';

  constructor() {
    this.initProviders();
  }

  private initProviders(): void {
    // 1. Gemini Slot
    const geminiKey = process.env.GEMINI_API_KEY || '';
    const gemini = new GeminiProvider(geminiKey, 'gemini-3.8-flash', true);
    this.providers.set('gemini', gemini);

    // 2. GPT Slot
    const openaiKey = process.env.OPENAI_API_KEY || '';
    const openai = new OpenAIProvider(openaiKey, 'gpt-4o-mini', Boolean(openaiKey));
    this.providers.set('openai', openai);

    // 3. Provider 3 Slot (Placeholder)
    this.providers.set('provider3', new PlaceholderProvider('provider3', 'Provider 3'));

    // 4. Provider 4 Slot (Placeholder)
    this.providers.set('provider4', new PlaceholderProvider('provider4', 'Provider 4'));

    // 5. Provider 5 Slot (Placeholder)
    this.providers.set('provider5', new PlaceholderProvider('provider5', 'Provider 5'));

    // Default active: gemini if configured, otherwise first configured or gemini
    if (gemini.isConfigured()) {
      this.activeProviderId = 'gemini';
    }
  }

  public getProvider(id: ProviderId): AIProvider | undefined {
    return this.providers.get(id);
  }

  public getActiveProvider(): AIProvider {
    const active = this.providers.get(this.activeProviderId);
    if (!active) {
      throw new Error(`Active provider '${this.activeProviderId}' tidak ditemukan di registry.`);
    }
    return active;
  }

  public getActiveProviderId(): ProviderId {
    return this.activeProviderId;
  }

  public setActiveProvider(id: ProviderId): { success: boolean; message: string } {
    const target = this.providers.get(id);
    if (!target) {
      throw new Error(`Provider dengan id '${id}' tidak valid.`);
    }

    if (!target.isEnabled()) {
      throw new Error(`Provider '${target.name}' tidak dapat dijadikan model aktif karena statusnya Disabled.`);
    }

    if (!target.isConfigured()) {
      throw new Error(`Provider '${target.name}' belum dikonfigurasi dengan API Key yang valid.`);
    }

    this.activeProviderId = id;
    return {
      success: true,
      message: `Active model berhasil dialihkan ke ${target.name} (${target.getModel()})`,
    };
  }

  public updateProvider(
    id: ProviderId,
    params: { apiKey?: string; model?: string; enabled?: boolean }
  ): { success: boolean; message: string } {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Provider '${id}' tidak ditemukan.`);
    }

    if (typeof params.enabled === 'boolean') {
      provider.setEnabled(params.enabled);
      // If currently active is disabled, auto-switch to fallback if available
      if (!params.enabled && this.activeProviderId === id) {
        if (this.fallbackProviderId && this.fallbackProviderId !== id) {
          const fb = this.providers.get(this.fallbackProviderId);
          if (fb && fb.isEnabled() && fb.isConfigured()) {
            this.activeProviderId = this.fallbackProviderId;
          }
        }
      }
    }

    if (params.model && params.model.trim()) {
      provider.setModel(params.model.trim());
    }

    if (params.apiKey && params.apiKey.trim()) {
      provider.setApiKey(params.apiKey.trim());
    }

    return {
      success: true,
      message: `Konfigurasi ${provider.name} berhasil disimpan.`,
    };
  }

  public async testProviderConnection(id: ProviderId): Promise<TestConnectionResult> {
    const provider = this.providers.get(id);
    if (!provider) {
      return { success: false, message: `Provider '${id}' tidak ditemukan.` };
    }
    return await provider.testConnection();
  }

  public getConfigSummary(): RouterConfigResponse {
    const list: any[] = [];
    const order: ProviderId[] = ['gemini', 'openai', 'provider3', 'provider4', 'provider5'];

    for (const id of order) {
      const p = this.providers.get(id);
      if (p) {
        list.push(p.getPublicConfig());
      }
    }

    return {
      activeProviderId: this.activeProviderId,
      fallbackProviderId: this.fallbackProviderId,
      providers: list,
    };
  }

  /**
   * Dispatches text generation through the active provider, with architectural fallback support
   */
  public async generate(params: GenerateParams): Promise<GenerateResult> {
    const active = this.getActiveProvider();

    try {
      return await active.generate(params);
    } catch (err: any) {
      console.warn(`[ModelRouter] Provider '${active.name}' error:`, err.message);

      // Fallback check
      if (
        this.fallbackProviderId &&
        this.fallbackProviderId !== this.activeProviderId
      ) {
        const fallback = this.providers.get(this.fallbackProviderId);
        if (fallback && fallback.isEnabled() && fallback.isConfigured()) {
          console.info(`[ModelRouter] Falling back to '${fallback.name}'`);
          return await fallback.generate(params);
        }
      }

      throw err;
    }
  }

  /**
   * Dispatches structured output extraction through the active provider
   */
  public async structuredOutput<T = any>(params: StructuredOutputParams): Promise<T> {
    const active = this.getActiveProvider();

    try {
      return await active.structuredOutput<T>(params);
    } catch (err: any) {
      console.warn(`[ModelRouter] Structured output failed on '${active.name}':`, err.message);

      // Fallback check
      if (
        this.fallbackProviderId &&
        this.fallbackProviderId !== this.activeProviderId
      ) {
        const fallback = this.providers.get(this.fallbackProviderId);
        if (fallback && fallback.isEnabled() && fallback.isConfigured()) {
          console.info(`[ModelRouter] Attempting structured output on fallback '${fallback.name}'`);
          return await fallback.structuredOutput<T>(params);
        }
      }

      throw err;
    }
  }
}

// Global router singleton on server
export const modelRouter = new AIModelRouter();
