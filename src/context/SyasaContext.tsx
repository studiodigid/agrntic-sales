import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Lead,
  SalesAgent,
  KnowledgeItem,
  RoutingRule,
  ChatMessage,
  ProviderId,
  ProviderPublicConfig,
  RouterConfigResponse,
} from '../types/syasa';
import {
  INITIAL_LEADS,
  INITIAL_SALES_AGENTS,
  INITIAL_KNOWLEDGE,
  INITIAL_ROUTING_RULES,
} from '../data/initialData';

interface SyasaContextType {
  leads: Lead[];
  salesAgents: SalesAgent[];
  knowledge: KnowledgeItem[];
  routingRules: RoutingRule[];
  activeLeadId: string | null;
  activeView: 'simulator' | 'leads' | 'sales' | 'knowledge' | 'analytics' | 'integrations' | 'ai-config';
  currentRole: 'supervisor' | 'sales' | 'customer';
  selectedSalesId: string;
  // AI Model Router States & Actions
  aiProviders: ProviderPublicConfig[];
  activeProviderId: ProviderId;
  isLoadingAIConfig: boolean;
  fetchAIConfig: () => Promise<void>;
  updateAIProviderConfig: (
    id: ProviderId,
    updates: { apiKey?: string; model?: string; enabled?: boolean }
  ) => Promise<{ success: boolean; message: string }>;
  setActiveAIModel: (id: ProviderId) => Promise<{ success: boolean; message: string }>;
  testAIConnection: (id: ProviderId) => Promise<{ success: boolean; message: string; latencyMs?: number }>;
  setActiveLeadId: (id: string | null) => void;
  setActiveView: (view: 'simulator' | 'leads' | 'sales' | 'knowledge' | 'analytics' | 'integrations' | 'ai-config') => void;
  setCurrentRole: (role: 'supervisor' | 'sales' | 'customer') => void;
  setSelectedSalesId: (id: string) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  addMessageToLead: (leadId: string, message: ChatMessage) => void;
  assignLeadToSales: (leadId: string, salesId: string) => void;
  autoRouteLead: (leadId: string) => SalesAgent | null;
  sendChatMessage: (leadId: string, text: string) => Promise<void>;
  isSendingChat: boolean;
  addKnowledgeItem: (item: KnowledgeItem) => void;
  syncLeadToERPNext: (leadId: string) => Promise<boolean>;
  triggerMetaAdLeadSimulation: (campaignPreset?: string) => void;
}

const SyasaContext = createContext<SyasaContextType | undefined>(undefined);

const LOCAL_STORAGE_LEADS_KEY = 'syasa_leads_v1';
const LOCAL_STORAGE_SALES_KEY = 'syasa_sales_v1';

export const SyasaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (saved) {
      try {
        const parsed: Lead[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((l) => {
            if (l.assignedSalesId === 'sales-01') {
              return {
                ...l,
                assignedSalesName: 'Tri Purwojianto',
                assignedSalesPhone: '+62 889-7364-1682',
              };
            }
            if (l.assignedSalesId === 'sales-02') {
              return {
                ...l,
                assignedSalesName: 'Tri Purwojianto',
                assignedSalesPhone: '+62 881-8210-415',
              };
            }
            return l;
          });
        }
      } catch (e) {
        console.error('Failed to parse saved leads', e);
      }
    }
    return INITIAL_LEADS;
  });

  const [salesAgents, setSalesAgents] = useState<SalesAgent[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SALES_KEY);
    if (saved) {
      try {
        const parsed: SalesAgent[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migration/Sync: Guarantee sales-01 & sales-02 reflect latest names & WhatsApp numbers
          // without deleting or resetting other sales agents
          return parsed.map((agent) => {
            if (agent.id === 'sales-01') {
              return {
                ...agent,
                name: 'Tri Purwojianto',
                phone: '+62 889-7364-1682',
                email: 'tri.demo@syamanah.com',
              };
            }
            if (agent.id === 'sales-02') {
              return {
                ...agent,
                name: 'Tri Purwojianto',
                phone: '+62 881-8210-415',
                email: 'tri.demo@syamanah.com',
              };
            }
            return agent;
          });
        }
      } catch (e) {
        console.error('Failed to parse saved sales', e);
      }
    }
    return INITIAL_SALES_AGENTS;
  });

  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>(INITIAL_ROUTING_RULES);
  const [activeLeadId, setActiveLeadId] = useState<string | null>('SYASA-00001');
  const [activeView, setActiveView] = useState<'simulator' | 'leads' | 'sales' | 'knowledge' | 'analytics' | 'integrations' | 'ai-config'>('simulator');
  const [currentRole, setCurrentRole] = useState<'supervisor' | 'sales' | 'customer'>('supervisor');
  const [selectedSalesId, setSelectedSalesId] = useState<string>('sales-01');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // AI Model Router States
  const [aiProviders, setAiProviders] = useState<ProviderPublicConfig[]>([
    {
      id: 'gemini',
      name: 'Gemini',
      model: 'gemini-3.8-flash',
      enabled: true,
      hasKey: true,
      apiKeyMasked: '••••••••••••',
      status: 'connected',
    },
    {
      id: 'openai',
      name: 'GPT',
      model: 'gpt-4o-mini',
      enabled: false,
      hasKey: false,
      apiKeyMasked: '',
      status: 'not_configured',
    },
    {
      id: 'provider3',
      name: 'Provider 3',
      model: '',
      enabled: false,
      hasKey: false,
      apiKeyMasked: '',
      status: 'not_configured',
      isPlaceholder: true,
    },
    {
      id: 'provider4',
      name: 'Provider 4',
      model: '',
      enabled: false,
      hasKey: false,
      apiKeyMasked: '',
      status: 'not_configured',
      isPlaceholder: true,
    },
    {
      id: 'provider5',
      name: 'Provider 5',
      model: '',
      enabled: false,
      hasKey: false,
      apiKeyMasked: '',
      status: 'not_configured',
      isPlaceholder: true,
    },
  ]);
  const [activeProviderId, setActiveProviderId] = useState<ProviderId>('gemini');
  const [isLoadingAIConfig, setIsLoadingAIConfig] = useState<boolean>(false);

  const fetchAIConfig = useCallback(async () => {
    setIsLoadingAIConfig(true);
    try {
      const res = await fetch('/api/ai/config');
      const rawText = await res.text();
      let json: any;
      try {
        json = JSON.parse(rawText);
      } catch {
        console.warn(`[SyasaContext] /api/ai/config returned non-JSON (HTTP ${res.status}):`, rawText.slice(0, 100));
        return;
      }

      if (json && json.success && json.data) {
        if (Array.isArray(json.data.providers) && json.data.providers.length > 0) {
          setAiProviders(json.data.providers);
        }
        if (json.data.activeProviderId) {
          setActiveProviderId(json.data.activeProviderId);
        }
      }
    } catch (err) {
      console.warn('Could not fetch AI configuration from server:', err);
    } finally {
      setIsLoadingAIConfig(false);
    }
  }, []);

  useEffect(() => {
    fetchAIConfig();
  }, [fetchAIConfig]);

  const updateAIProviderConfig = async (
    id: ProviderId,
    updates: { apiKey?: string; model?: string; enabled?: boolean }
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      const rawText = await res.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        const cleanSnippet = rawText
          .replace(/<[^>]+>/g, ' ')
          .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
          .replace(/sk-[A-Za-z0-9_\-\.]+/gi, '[REDACTED]')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 100);

        return {
          success: false,
          message: `✕ Server mengembalikan respon non-JSON (HTTP ${res.status}): ${cleanSnippet || '[empty body]'}`,
        };
      }

      if (data && data.success && data.data) {
        if (Array.isArray(data.data.providers) && data.data.providers.length > 0) {
          setAiProviders(data.data.providers);
        }
        if (data.data.activeProviderId) {
          setActiveProviderId(data.data.activeProviderId);
        }
        return { success: true, message: data.message || 'Konfigurasi berhasil disimpan.' };
      }

      return { success: false, message: data?.error || 'Gagal menyimpan konfigurasi.' };
    } catch (err: any) {
      const cleanErr = (err?.message || 'Gagal terhubung ke server')
        .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
        .replace(/sk-[A-Za-z0-9_\-\.]+/gi, '[REDACTED]');
      return { success: false, message: cleanErr };
    }
  };

  const setActiveAIModel = async (id: ProviderId): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/ai/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeProviderId: id }),
      });

      const rawText = await res.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        const cleanSnippet = rawText
          .replace(/<[^>]+>/g, ' ')
          .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
          .replace(/sk-[A-Za-z0-9_\-\.]+/gi, '[REDACTED]')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 100);

        return {
          success: false,
          message: `✕ Server mengembalikan respon non-JSON (HTTP ${res.status}): ${cleanSnippet || '[empty body]'}`,
        };
      }

      if (data && data.success && data.data) {
        setActiveProviderId(data.data.activeProviderId);
        if (Array.isArray(data.data.providers) && data.data.providers.length > 0) {
          setAiProviders(data.data.providers);
        }
        return { success: true, message: data.message || 'Active model berhasil diperbarui.' };
      }

      return { success: false, message: data?.error || 'Gagal mengganti active model.' };
    } catch (err: any) {
      const cleanErr = (err?.message || 'Gagal terhubung ke server')
        .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
        .replace(/sk-[A-Za-z0-9_\-\.]+/gi, '[REDACTED]');
      return { success: false, message: cleanErr };
    }
  };

  const testAIConnection = async (
    id: ProviderId
  ): Promise<{ success: boolean; message: string; latencyMs?: number }> => {
    try {
      const res = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: id }),
      });

      const rawText = await res.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        const cleanSnippet = rawText
          .replace(/<[^>]+>/g, ' ')
          .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
          .replace(/sk-[A-Za-z0-9_\-\.]+/gi, '[REDACTED]')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 100);

        return {
          success: false,
          message: `✕ Server mengembalikan respon non-JSON (HTTP ${res.status}): ${cleanSnippet || '[empty body]'}`,
        };
      }

      // Refresh configs to reflect status changes
      await fetchAIConfig();
      return data;
    } catch (err: any) {
      const cleanErr = (err.message || 'Gagal menghubungi server')
        .replace(/Bearer\s+[A-Za-z0-9_\-\.]+/gi, 'Bearer [REDACTED]')
        .replace(/sk-[A-Za-z0-9_\-\.]+/gi, '[REDACTED]');
      return { success: false, message: `✕ Connection failed: ${cleanErr}` };
    }
  };

  // Persist leads and sales to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SALES_KEY, JSON.stringify(salesAgents));
  }, [salesAgents]);

  const addLead = (lead: Lead) => {
    setLeads((prev) => [lead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates, updatedAt: 'Baru saja' } : lead))
    );
  };

  const addMessageToLead = (leadId: string, message: ChatMessage) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          messages: [...lead.messages, message],
          updatedAt: 'Baru saja',
        };
      })
    );
  };

  // Lead Routing Algorithm (Matches Product -> Available Sales in Category -> Workload Check)
  const autoRouteLead = (leadId: string): SalesAgent | null => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return null;

    let targetCategory: SalesAgent['category'] = 'All_Rounder';
    const prodLower = (lead.product || '').toLowerCase();

    if (prodLower.includes('jersey') || prodLower.includes('futsal') || prodLower.includes('olahraga')) {
      targetCategory = 'Jersey';
    } else if (prodLower.includes('jaket') || prodLower.includes('varsity') || prodLower.includes('bomber') || prodLower.includes('coach')) {
      targetCategory = 'Jaket';
    } else if (prodLower.includes('kemeja') || prodLower.includes('pdh') || prodLower.includes('pdl') || prodLower.includes('seragam')) {
      targetCategory = 'Kemeja_PDH';
    } else if (prodLower.includes('kaos') || prodLower.includes('polo') || prodLower.includes('tshirt')) {
      targetCategory = 'Kaos_Polo';
    } else if (prodLower.includes('rompi') || prodLower.includes('safety')) {
      targetCategory = 'Rompi';
    }

    // Filter available sales
    let candidates = salesAgents.filter(
      (s) => s.category === targetCategory && s.status !== 'offline' && s.currentDailyLeads < s.dailyLeadQuota
    );

    if (candidates.length === 0) {
      // Fallback to All_Rounder or any online sales with quota
      candidates = salesAgents.filter(
        (s) => s.status !== 'offline' && s.currentDailyLeads < s.dailyLeadQuota
      );
    }

    if (candidates.length === 0) {
      candidates = salesAgents.filter((s) => s.status !== 'offline');
    }

    if (candidates.length === 0) return null;

    // Pick sales with lowest workload (round-robin / load-balance)
    candidates.sort((a, b) => a.currentDailyLeads - b.currentDailyLeads);
    const chosenSales = candidates[0];

    // Assign to lead
    assignLeadToSales(leadId, chosenSales.id);
    return chosenSales;
  };

  const assignLeadToSales = (leadId: string, salesId: string) => {
    const sales = salesAgents.find((s) => s.id === salesId);
    if (!sales) return;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assignedSalesId: sales.id,
              assignedSalesName: sales.name,
              assignedSalesPhone: sales.phone,
              updatedAt: 'Baru saja',
            }
          : l
      )
    );

    // Increment sales daily workload
    setSalesAgents((prev) =>
      prev.map((s) =>
        s.id === salesId ? { ...s, currentDailyLeads: s.currentDailyLeads + 1 } : s
      )
    );
  };

  const sendChatMessage = async (leadId: string, text: string) => {
    const currentLead = leads.find((l) => l.id === leadId);
    if (!currentLead) return;

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-c`,
      sender: 'customer',
      senderName: currentLead.customerName,
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    const updatedMessages = [...currentLead.messages, userMsg];
    addMessageToLead(leadId, userMsg);
    setIsSendingChat(true);

    try {
      // Call server-side API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          message: text,
          customerName: currentLead.customerName,
          conversationHistory: updatedMessages,
          currentQualification: {
            product: currentLead.product,
            quantity: currentLead.quantity,
            designStatus: currentLead.designStatus,
            fabric: currentLead.fabric,
            specs: currentLead.specs,
          },
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const {
          reply,
          product,
          quantity,
          designStatus,
          fabric,
          specs,
          handoverTriggered,
          handoverReason,
          suggestedSalesCategory,
          aiSummary,
          qualificationScore,
        } = resJson.data;

        // Create AI response message
        const providerTag = resJson.meta?.activeProvider ? ` (${resJson.meta.activeProvider})` : '';
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now()}-a`,
          sender: 'ai',
          senderName: `SYASA AI${providerTag}`,
          text: reply,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          meta: {
            isHandoverTrigger: handoverTriggered,
            reason: handoverReason,
            extractedFields: { product, quantity, fabric },
          },
        };

        // Determine updated status
        let nextStatus = currentLead.status;
        let isHandoverVal = currentLead.isHandover;
        let handoverAtVal = currentLead.handoverAt;

        if (handoverTriggered) {
          nextStatus = 'HANDOVER';
          isHandoverVal = true;
          handoverAtVal = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
        } else if (qualificationScore >= 80) {
          nextStatus = 'QUALIFIED';
        } else if (qualificationScore >= 30) {
          nextStatus = 'QUALIFYING';
        } else {
          nextStatus = 'AI_HANDLING';
        }

        // Apply updates to the lead
        updateLead(leadId, {
          product: product || currentLead.product,
          quantity: quantity || currentLead.quantity,
          designStatus: designStatus || currentLead.designStatus,
          fabric: fabric || currentLead.fabric,
          specs: specs || currentLead.specs,
          qualificationScore: qualificationScore ?? currentLead.qualificationScore,
          isHandover: isHandoverVal,
          handoverReason: handoverReason || currentLead.handoverReason,
          handoverAt: handoverAtVal,
          aiSummary: aiSummary || currentLead.aiSummary,
          status: nextStatus,
        });

        addMessageToLead(leadId, aiMsg);

        // If handover was triggered and lead isn't assigned yet, auto-route to suitable Sales
        if (handoverTriggered && !currentLead.assignedSalesId) {
          autoRouteLead(leadId);
        }
      }
    } catch (err) {
      console.error('Failed to communicate with SYASA AI backend:', err);
    } finally {
      setIsSendingChat(false);
    }
  };

  const addKnowledgeItem = (item: KnowledgeItem) => {
    setKnowledge((prev) => [item, ...prev]);
  };

  const syncLeadToERPNext = async (leadId: string): Promise<boolean> => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return false;

    // Simulate ERPNext DocType generation & API push
    await new Promise((resolve) => setTimeout(resolve, 800));

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const docType = lead.status === 'CLOSED' ? 'Quotation' : 'Opportunity';

    updateLead(leadId, {
      erpNextSync: {
        synced: true,
        docType,
        erpLeadId: `ERP-${docType.toUpperCase()}-2026-${randomId}`,
        lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        status: 'SYNCED',
      },
    });

    return true;
  };

  const triggerMetaAdLeadSimulation = (campaignPreset?: string) => {
    const idNum = leads.length + 1;
    const formattedId = `SYASA-${String(idNum).padStart(5, '0')}`;

    const presets = [
      {
        name: 'Aris Munandar (Komunitas Gowes BDG)',
        phone: '+62 813-7722-5401',
        campaign: 'ID_Meta_Jersey_Sepeda_Sublim_Promo',
        creative: 'Video_Jersey_Gowes_Dryfit_Adem',
        product: 'Jersey Sepeda Gowes Printing',
        firstMsg: 'Halo Syamanah, saya lihat iklan IG promo jersey sepeda. Untuk komunitas kita 25 orang bisa pesan?',
      },
      {
        name: 'Vicky Anggoro (Panitia Dies Natalis ITB)',
        phone: '+62 858-9901-3321',
        campaign: 'ID_Meta_Jaket_Varsity_Campus_Hype',
        creative: 'Carousel_Varsity_Bordir_Laken_Unpad',
        product: 'Jaket Varsity Angkatan',
        firstMsg: 'Siang min, mau tanya jaket varsity untuk panitia kampus sekitar 50 pcs. Ada sampel bahannya?',
      },
      {
        name: 'PT. Andalan Logistik Sentosa (Pak Teguh)',
        phone: '+62 821-3344-9988',
        campaign: 'ID_Meta_PDH_Instansi_Corporate_Q3',
        creative: 'Feed_Seragam_Bordir_Presisi_PT_BUMN',
        product: 'Kemeja Seragam PDH Drill',
        firstMsg: 'Selamat siang Syamanah Garment. Kantor kami butuh seragam kemeja kantor 40 pcs, apakah bisa pengadaan via faktur resmi?',
      },
    ];

    const chosen = presets[Math.floor(Math.random() * presets.length)];

    const newLead: Lead = {
      id: formattedId,
      customerName: chosen.name,
      customerPhone: chosen.phone,
      channelNumber: '+62 821-4455-6677 (WA Center 1 - Meta Ads Inbound)',
      metaAdSource: {
        campaignName: chosen.campaign,
        adCreative: chosen.creative,
        sourcePlatform: 'Meta Ads',
      },
      product: chosen.product,
      quantity: 'Belum pasti',
      designStatus: 'Menunggu konfirmasi',
      fabric: 'Belum ditentukan',
      specs: 'Belum terisi',
      status: 'NEW',
      assignedSalesId: null,
      assignedSalesName: null,
      assignedSalesPhone: null,
      qualificationScore: 20,
      isHandover: false,
      aiSummary: 'Lead inbound baru masuk dari kampanye Meta Ads. Menunggu respons pertama SYASA.',
      createdAt: 'Baru saja',
      updatedAt: 'Baru saja',
      messages: [
        {
          id: `msg-${Date.now()}-c`,
          sender: 'customer',
          senderName: chosen.name,
          text: chosen.firstMsg,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        },
      ],
    };

    addLead(newLead);
    setActiveLeadId(newLead.id);
    setActiveView('simulator');

    // Trigger AI response after short delay
    setTimeout(() => {
      sendChatMessage(newLead.id, chosen.firstMsg);
    }, 600);
  };

  return (
    <SyasaContext.Provider
      value={{
        leads,
        salesAgents,
        knowledge,
        routingRules,
        activeLeadId,
        activeView,
        currentRole,
        selectedSalesId,
        // AI Model Router
        aiProviders,
        activeProviderId,
        isLoadingAIConfig,
        fetchAIConfig,
        updateAIProviderConfig,
        setActiveAIModel,
        testAIConnection,
        setActiveLeadId,
        setActiveView,
        setCurrentRole,
        setSelectedSalesId,
        addLead,
        updateLead,
        addMessageToLead,
        assignLeadToSales,
        autoRouteLead,
        sendChatMessage,
        isSendingChat,
        addKnowledgeItem,
        syncLeadToERPNext,
        triggerMetaAdLeadSimulation,
      }}
    >
      {children}
    </SyasaContext.Provider>
  );
};

export const useSyasa = () => {
  const context = useContext(SyasaContext);
  if (!context) {
    throw new Error('useSyasa must be used within a SyasaProvider');
  }
  return context;
};
