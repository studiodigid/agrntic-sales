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

function sanitizeSecret(text: string): string {
  if (!text) return '';
  return text
    .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
    .replace(/sk-[A-Za-z0-9_\-\.]+/gi, '[REDACTED]')
    .replace(/key=[A-Za-z0-9_\-\.]+/gi, 'key=[REDACTED]');
}

function sanitizeBodyPreview(raw: string): string {
  if (!raw) return '[empty body]';
  const stripped = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const truncated = stripped.length > 120 ? stripped.substring(0, 120) + '...' : stripped;
  return sanitizeSecret(truncated || '[empty body]');
}

export class OpenAIProvider implements AIProvider {
  public readonly id: ProviderId = 'openai';
  public readonly name: string = 'GPT';

  private apiKey: string = '';
  private model: string = 'gpt-4o-mini';
  private enabled: boolean = false;
  private status: ProviderStatus = 'not_configured';
  private lastTestedAt?: string;
  private lastMessage?: string;

  constructor(initialKey?: string, initialModel?: string, initialEnabled?: boolean) {
    if (initialKey && initialKey.trim()) {
      this.apiKey = initialKey.trim();
      this.status = 'configured';
    }
    if (initialModel && initialModel.trim()) {
      this.model = initialModel.trim();
    }
    if (typeof initialEnabled === 'boolean') {
      this.enabled = initialEnabled;
    } else {
      this.enabled = Boolean(this.getEffectiveApiKey());
    }
  }

  /**
   * Retrieves effective API key: checks runtime in-memory key first,
   * then falls back to server environment variable process.env.OPENAI_API_KEY.
   */
  public getEffectiveApiKey(): string {
    if (this.apiKey && this.apiKey.trim().length > 0) {
      return this.apiKey.trim();
    }
    return (process.env.OPENAI_API_KEY || '').trim();
  }

  public isConfigured(): boolean {
    return Boolean(this.getEffectiveApiKey().length > 0);
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
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public getStatus(): ProviderStatus {
    if (!this.isConfigured()) return 'not_configured';
    if (this.status === 'not_configured') {
      return 'configured';
    }
    return this.status;
  }

  public setStatus(status: ProviderStatus, message?: string): void {
    this.status = status;
    if (message) this.lastMessage = message;
  }

  public getPublicConfig(): ProviderPublicConfig {
    const effectiveKey = this.getEffectiveApiKey();
    let masked = '';
    if (effectiveKey) {
      const len = effectiveKey.length;
      if (len > 8) {
        masked = `${effectiveKey.substring(0, 3)}••••••••${effectiveKey.substring(len - 4)}`;
      } else {
        masked = '••••••••••••';
      }
    }

    return {
      id: this.id,
      name: this.name,
      model: this.model,
      enabled: this.isEnabled(),
      hasKey: this.isConfigured(),
      apiKeyMasked: masked,
      status: this.getStatus(),
      lastTestedAt: this.lastTestedAt,
      lastMessage: this.lastMessage,
    };
  }

  public async generate(params: GenerateParams): Promise<GenerateResult> {
    const key = this.getEffectiveApiKey();
    if (!key) {
      throw new Error('GPT Provider belum dikonfigurasi dengan API Key yang valid.');
    }

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
    if (params.systemInstruction) {
      messages.push({ role: 'system', content: params.systemInstruction });
    }
    messages.push({ role: 'user', content: params.prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1024,
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      let errMsg = `HTTP ${response.status} ${response.statusText}`;
      try {
        const errJson = JSON.parse(rawText);
        if (errJson?.error?.message) {
          errMsg = errJson.error.message;
        }
      } catch {
        errMsg = `HTTP ${response.status}: ${sanitizeBodyPreview(rawText)}`;
      }
      throw new Error(`OpenAI API Error: ${sanitizeSecret(errMsg)}`);
    }

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(`OpenAI returned non-JSON response: ${sanitizeBodyPreview(rawText)}`);
    }

    const text = data?.choices?.[0]?.message?.content || '';
    return {
      text,
      providerId: this.id,
      model: this.model,
    };
  }

  public async structuredOutput<T = any>(params: StructuredOutputParams): Promise<T> {
    const key = this.getEffectiveApiKey();
    if (!key) {
      throw new Error('GPT Provider belum dikonfigurasi dengan API Key yang valid.');
    }

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];
    let systemText = params.systemInstruction || '';
    systemText += '\nPastikan output Anda selalu berupa JSON valid.';

    messages.push({ role: 'system', content: systemText });
    messages.push({ role: 'user', content: params.prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        response_format: { type: 'json_object' },
        temperature: params.temperature ?? 0.2,
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      let errMsg = `HTTP ${response.status} ${response.statusText}`;
      try {
        const errJson = JSON.parse(rawText);
        if (errJson?.error?.message) {
          errMsg = errJson.error.message;
        }
      } catch {
        errMsg = `HTTP ${response.status}: ${sanitizeBodyPreview(rawText)}`;
      }
      throw new Error(`OpenAI API Error: ${sanitizeSecret(errMsg)}`);
    }

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(`OpenAI returned non-JSON response: ${sanitizeBodyPreview(rawText)}`);
    }

    const text = data?.choices?.[0]?.message?.content || '{}';

    try {
      return JSON.parse(text) as T;
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]) as T;
      }
      throw new Error(`Gagal mem-parsing output JSON dari GPT: ${sanitizeBodyPreview(text)}`);
    }
  }

  public async testConnection(): Promise<TestConnectionResult> {
    const key = this.getEffectiveApiKey();
    if (!key) {
      this.status = 'not_configured';
      return {
        success: false,
        message: '✕ API Key belum dikonfigurasi',
      };
    }

    const startTime = Date.now();
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 5,
        }),
      });

      const latencyMs = Date.now() - startTime;
      const rawText = await response.text();

      if (response.ok) {
        let data: any;
        try {
          data = JSON.parse(rawText);
        } catch {
          this.status = 'error';
          const safeBody = sanitizeBodyPreview(rawText);
          const msg = `✕ Connection failed: OpenAI returned non-JSON response: ${safeBody}`;
          this.lastMessage = msg;
          return {
            success: false,
            message: msg,
          };
        }

        this.status = 'connected';
        this.lastTestedAt = new Date().toLocaleTimeString('id-ID');
        this.lastMessage = `Connection successful (${this.model}, ${latencyMs}ms)`;
        return {
          success: true,
          message: `✓ Connection successful (${this.model}, ${latencyMs}ms)`,
          latencyMs,
        };
      }

      // HTTP error response from OpenAI
      let cleanMsg = `HTTP ${response.status} ${response.statusText}`;
      try {
        const errJson = JSON.parse(rawText);
        if (errJson?.error?.message) {
          cleanMsg = errJson.error.message;
        }
      } catch {
        cleanMsg = `HTTP ${response.status}: ${sanitizeBodyPreview(rawText)}`;
      }

      cleanMsg = sanitizeSecret(cleanMsg);
      this.status = 'error';
      this.lastMessage = cleanMsg;
      return {
        success: false,
        message: `✕ Connection failed: ${cleanMsg}`,
      };
    } catch (err: any) {
      this.status = 'error';
      const cleanMsg = sanitizeSecret(err.message || 'Koneksi ke endpoint OpenAI gagal.');
      this.lastMessage = cleanMsg;
      return {
        success: false,
        message: `✕ Connection failed: ${cleanMsg}`,
      };
    }
  }
}
