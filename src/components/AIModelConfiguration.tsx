import React, { useState } from 'react';
import { useSyasa } from '../context/SyasaContext';
import { ProviderId, ProviderPublicConfig } from '../types/syasa';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  ArrowRight,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const AIModelConfiguration: React.FC = () => {
  const {
    aiProviders,
    activeProviderId,
    setActiveAIModel,
    updateAIProviderConfig,
    testAIConnection,
    fetchAIConfig,
  } = useSyasa();

  // Local state for editing fields per provider
  const [keyInputs, setKeyInputs] = useState<Record<string, string>>({});
  const [modelInputs, setModelInputs] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [activeMessage, setActiveMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const activeProvider = aiProviders.find((p) => p.id === activeProviderId) || aiProviders[0];

  const handleToggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleKeyChange = (id: string, value: string) => {
    setKeyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleModelChange = (id: string, value: string) => {
    setModelInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleToggleEnabled = async (provider: ProviderPublicConfig) => {
    const nextEnabled = !provider.enabled;
    const res = await updateAIProviderConfig(provider.id, { enabled: nextEnabled });
    if (res.success) {
      setTestResults((prev) => ({
        ...prev,
        [provider.id]: {
          success: true,
          message: nextEnabled ? '✓ Provider diaktifkan' : '✓ Provider dinonaktifkan',
        },
      }));
    } else {
      setTestResults((prev) => ({
        ...prev,
        [provider.id]: { success: false, message: `✕ ${res.message}` },
      }));
    }
  };

  const handleSaveConfig = async (provider: ProviderPublicConfig) => {
    setIsSaving((prev) => ({ ...prev, [provider.id]: true }));

    const enteredKey = keyInputs[provider.id];
    const enteredModel = modelInputs[provider.id] !== undefined ? modelInputs[provider.id] : provider.model;

    const payload: { apiKey?: string; model?: string; enabled?: boolean } = {
      model: enteredModel,
      enabled: provider.enabled,
    };

    if (enteredKey && enteredKey.trim().length > 0) {
      payload.apiKey = enteredKey.trim();
    }

    const res = await updateAIProviderConfig(provider.id, payload);
    setIsSaving((prev) => ({ ...prev, [provider.id]: false }));

    if (res.success) {
      // Clear typed key from input so it reverts to masked view
      setKeyInputs((prev) => ({ ...prev, [provider.id]: '' }));
      setTestResults((prev) => ({
        ...prev,
        [provider.id]: { success: true, message: '✓ Konfigurasi tersimpan di server' },
      }));
    } else {
      setTestResults((prev) => ({
        ...prev,
        [provider.id]: { success: false, message: `✕ ${res.message}` },
      }));
    }
  };

  const handleTestConnection = async (provider: ProviderPublicConfig) => {
    setIsTesting((prev) => ({ ...prev, [provider.id]: true }));
    setTestResults((prev) => ({ ...prev, [provider.id]: { success: false, message: 'Menguji koneksi...' } }));

    // If user has unsaved key input, save it first before testing
    const enteredKey = keyInputs[provider.id];
    if (enteredKey && enteredKey.trim().length > 0) {
      await updateAIProviderConfig(provider.id, { apiKey: enteredKey.trim() });
    }

    const res = await testAIConnection(provider.id);
    setIsTesting((prev) => ({ ...prev, [provider.id]: false }));
    setTestResults((prev) => ({
      ...prev,
      [provider.id]: { success: res.success, message: res.message },
    }));
  };

  const handleSwitchActiveModel = async (newId: ProviderId) => {
    setActiveMessage(null);
    const target = aiProviders.find((p) => p.id === newId);

    if (!target) return;
    if (!target.enabled) {
      setActiveMessage({
        text: `✕ Provider '${target.name}' tidak dapat dipilih karena statusnya saat ini Disabled. Silakan aktifkan terlebih dahulu.`,
        isError: true,
      });
      return;
    }
    if (!target.hasKey) {
      setActiveMessage({
        text: `✕ Provider '${target.name}' belum memiliki API Key yang valid. Silakan isi konfigurasi terlebih dahulu.`,
        isError: true,
      });
      return;
    }

    const res = await setActiveAIModel(newId);
    if (res.success) {
      setActiveMessage({ text: res.message, isError: false });
    } else {
      setActiveMessage({ text: res.message, isError: true });
    }
  };

  const getStatusBadge = (status: ProviderPublicConfig['status'], isPlaceholder?: boolean) => {
    if (isPlaceholder && status === 'not_configured') {
      return (
        <span className="bg-slate-800 text-slate-400 border border-slate-700 text-xs px-2.5 py-0.5 rounded-full font-mono">
          Slot Placeholder
        </span>
      );
    }

    switch (status) {
      case 'connected':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Connected
          </span>
        );
      case 'configured':
        return (
          <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Configured
          </span>
        );
      case 'error':
        return (
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Error
          </span>
        );
      case 'not_configured':
      default:
        return (
          <span className="bg-slate-800 text-slate-400 border border-slate-700 text-xs px-2.5 py-0.5 rounded-full font-mono">
            Not Configured
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              AI Provider Layer / Model Router
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                5 Slots Ready
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Abstraction layer AI generic untuk Agentic Engine. Model AI dapat diganti tanpa merubah business logic, knowledge, maupun tools.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAIConfig}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Config</span>
        </button>
      </div>

      {/* SECTION: ACTIVE AI MODEL SELECTOR */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 fill-current text-yellow-300" />
              ACTIVE AI MODEL
            </div>
            <h2 className="text-base font-bold text-white">
              Model Aktif yang Digunakan Agentic Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hanya provider yang <strong>Enabled</strong> dan memiliki <strong>API Key valid</strong> yang dapat dipilih.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={activeProviderId}
                onChange={(e) => handleSwitchActiveModel(e.target.value as ProviderId)}
                className="bg-slate-950 border border-emerald-500/50 text-white font-bold text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-400 shadow-lg cursor-pointer min-w-[200px]"
              >
                {aiProviders.map((p) => {
                  const isSelectable = p.enabled && p.hasKey;
                  return (
                    <option
                      key={p.id}
                      value={p.id}
                      disabled={!isSelectable}
                      className={isSelectable ? 'bg-slate-900 text-white' : 'bg-slate-900 text-slate-500'}
                    >
                      {p.name} {p.model ? `(${p.model})` : ''} {!isSelectable ? '— [Disabled/Belum Siap]' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Active Provider Status Indicator */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status Router:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {activeProvider?.name} ({activeProvider?.model || 'default'}) Aktif Melayani Percakapan
            </span>
          </div>

          {activeMessage && (
            <div
              className={`text-xs px-3 py-1 rounded-lg border font-medium ${
                activeMessage.isError
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {activeMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* SECTION: AI MODEL CONFIGURATION (5 SLOTS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>AI MODEL CONFIGURATION</span>
            </h2>
            <p className="text-xs text-slate-400">
              Kelola kredensial dan model name untuk 5 slot provider. API key disimpan secara aman di sisi server.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {aiProviders.map((provider) => {
            const isEditingKey = keyInputs[provider.id] !== undefined && keyInputs[provider.id] !== '';
            const isKeyVisible = showKeys[provider.id];
            const currentKeyValue = keyInputs[provider.id] !== undefined ? keyInputs[provider.id] : '';
            const currentModelValue =
              modelInputs[provider.id] !== undefined ? modelInputs[provider.id] : provider.model;

            const isSavingCurrent = isSaving[provider.id];
            const isTestingCurrent = isTesting[provider.id];
            const testResult = testResults[provider.id];
            const isActive = activeProviderId === provider.id;

            return (
              <div
                key={provider.id}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all ${
                  isActive
                    ? 'border-emerald-500/50 bg-slate-900/90 ring-1 ring-emerald-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  {/* Provider Title & Badges */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        provider.id === 'gemini'
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                          : provider.id === 'openai'
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {provider.name.substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{provider.name}</h3>
                        {isActive && (
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                            Active Model
                          </span>
                        )}
                        {getStatusBadge(provider.status, provider.isPlaceholder)}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {provider.isPlaceholder
                          ? 'Slot konfigurasi placeholder (menunggu penentuan spesifikasi model oleh pengguna).'
                          : provider.id === 'gemini'
                          ? 'Google Gemini AI via server-side @google/genai SDK.'
                          : 'OpenAI GPT via server-side chat completions.'}
                      </p>
                    </div>
                  </div>

                  {/* Enable / Disable Toggle */}
                  <div className="flex items-center gap-3 self-start lg:self-center">
                    <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                      <span className="text-slate-400">Enabled:</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={provider.enabled}
                        onClick={() => handleToggleEnabled(provider)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                          provider.enabled ? 'bg-emerald-600' : 'bg-slate-800 border border-slate-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            provider.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </label>

                    {provider.enabled && provider.hasKey && !isActive && (
                      <button
                        onClick={() => handleSwitchActiveModel(provider.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Set as Active
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields: API Key & Model Name */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 text-xs">
                  {/* API Key Input (7 cols) */}
                  <div className="md:col-span-7">
                    <label className="block text-slate-400 font-semibold mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                        <span>API Key</span>
                      </span>
                      {provider.hasKey && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Key terpasang: {provider.apiKeyMasked}
                        </span>
                      )}
                    </label>

                    <div className="relative">
                      <input
                        type={isKeyVisible ? 'text' : 'password'}
                        value={currentKeyValue}
                        onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                        placeholder={
                          provider.hasKey
                            ? '•••••••••••••••• (Ketik untuk mengganti key baru)'
                            : provider.isPlaceholder
                            ? 'Masukkan API Key ketika provider slot ditentukan'
                            : 'Masukkan API Key Anda (tersimpan aman di server)'
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleToggleKeyVisibility(provider.id)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white transition-colors"
                        title={isKeyVisible ? 'Sembunyikan' : 'Tampilkan'}
                      >
                        {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Masked input: Key tidak akan pernah diekspos ke client bundle atau browser console.
                    </span>
                  </div>

                  {/* Model Name Input (5 cols) */}
                  <div className="md:col-span-5">
                    <label className="block text-slate-400 font-semibold mb-1">Model Name</label>
                    <input
                      type="text"
                      value={currentModelValue}
                      onChange={(e) => handleModelChange(provider.id, e.target.value)}
                      placeholder={
                        provider.id === 'gemini'
                          ? 'gemini-3.8-flash'
                          : provider.id === 'openai'
                          ? 'gpt-4o-mini'
                          : 'Model name identifier'
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <div className="mt-1 flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-400 font-mono">
                      <span>Rekomendasi:</span>
                      {provider.id === 'gemini' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleModelChange(provider.id, 'gemini-3.8-flash')}
                            className="underline hover:text-emerald-400"
                          >
                            gemini-3.8-flash
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => handleModelChange(provider.id, 'gemini-3.1-pro-preview')}
                            className="underline hover:text-emerald-400"
                          >
                            gemini-3.1-pro
                          </button>
                        </>
                      )}
                      {provider.id === 'openai' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleModelChange(provider.id, 'gpt-4o-mini')}
                            className="underline hover:text-emerald-400"
                          >
                            gpt-4o-mini
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => handleModelChange(provider.id, 'gpt-4o')}
                            className="underline hover:text-emerald-400"
                          >
                            gpt-4o
                          </button>
                        </>
                      )}
                      {provider.isPlaceholder && <span>(Belum ditentukan)</span>}
                    </div>
                  </div>
                </div>

                {/* Actions & Test Status Row */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {testResult && (
                      <span
                        className={`font-semibold flex items-center gap-1.5 ${
                          testResult.success ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {testResult.message}
                      </span>
                    )}
                    {!testResult && provider.lastMessage && (
                      <span className="text-slate-500 font-mono text-[11px] truncate max-w-md">
                        {provider.lastMessage}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={isTestingCurrent || !provider.hasKey}
                      onClick={() => handleTestConnection(provider)}
                      className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTestingCurrent ? 'animate-spin' : ''}`} />
                      <span>{isTestingCurrent ? 'Testing...' : 'Test Connection'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSavingCurrent}
                      onClick={() => handleSaveConfig(provider)}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingCurrent ? 'Menyimpan...' : 'Save Configuration'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ARCHITECTURE & SECURITY CALLOUT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-xs space-y-3">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Informasi Keamanan & Arsitektur Provider Layer (PRD Section 5 & 6)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <strong className="text-white block mb-1">1. Server-Side Execution</strong>
            Seluruh panggilan API model AI dieksekusi 100% pada Node.js/Express server. Browser client tidak pernah memanggil AI endpoint pihak ketiga secara langsung.
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <strong className="text-white block mb-1">2. Zero Plaintext Exposure</strong>
            Kunci API tidak pernah dikirimkan ke browser atau dimasukkan ke dalam client bundle. Respons konfigurasi selalu berupa referensi bertopeng (masked).
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <strong className="text-white block mb-1">3. Generic Engine Decoupling</strong>
            Agentic engine, 5 pilar kualifikasi, dan persona bisnis (Syamanah / Kulina / DIGID) sepenuhnya independen dari penyedia AI spesifik.
          </div>
        </div>
      </div>
    </div>
  );
};
