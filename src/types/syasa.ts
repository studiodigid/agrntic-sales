export type LeadStatus =
  | 'NEW'
  | 'AI_HANDLING'
  | 'QUALIFYING'
  | 'QUALIFIED'
  | 'HANDOVER'
  | 'SALES_HANDLING'
  | 'CLOSED';

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

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai' | 'sales' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  meta?: {
    intent?: string;
    extractedFields?: Record<string, any>;
    isHandoverTrigger?: boolean;
    reason?: string;
  };
}

export interface Digid3DConfig {
  modelType: 'jersey' | 'jaket' | 'kemeja' | 'polo';
  primaryColor: string;
  secondaryColor: string;
  pattern: string;
  teamName: string;
  collarType: string;
  previewSvg?: string;
}

export interface ERPNextSyncData {
  synced: boolean;
  docType: 'Lead' | 'Opportunity' | 'Quotation';
  erpLeadId?: string;
  lastSyncedAt?: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}

export interface Lead {
  id: string;
  customerName: string;
  customerPhone: string;
  channelNumber: string;
  metaAdSource?: {
    campaignName: string;
    adCreative: string;
    sourcePlatform: 'Meta Ads' | 'Instagram' | 'TikTok' | 'Direct WA';
  };
  product: string;
  quantity: string | number;
  designStatus: string;
  fabric: string;
  specs: string;
  deadline?: string;
  estimatedBudget?: string;
  status: LeadStatus;
  assignedSalesId: string | null;
  assignedSalesName: string | null;
  assignedSalesPhone: string | null;
  qualificationScore: number; // 0 - 100
  isHandover: boolean;
  handoverReason?: string;
  handoverAt?: string;
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  digid3DConfig?: Digid3DConfig;
  erpNextSync?: ERPNextSyncData;
  notes?: string;
}

export interface SalesAgent {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: 'Jersey' | 'Jaket' | 'Kemeja_PDH' | 'Kaos_Polo' | 'Rompi' | 'All_Rounder';
  dailyLeadQuota: number;
  currentDailyLeads: number;
  status: 'online' | 'busy' | 'offline';
  conversionRate: number; // in %
  totalDealsWon: number;
  avgResponseMinutes: number;
  avatarColor: string;
}

export interface KnowledgeItem {
  id: string;
  category: 'product' | 'fabric' | 'addon' | 'company' | 'sop';
  title: string;
  summary: string;
  content: string;
  tags: string[];
  moq?: string;
  leadTime?: string;
  keySpecs?: string[];
  priceGuidelineNote?: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  productKeyword: string;
  assignedCategory: SalesAgent['category'];
  maxDailyLeadsPerSales: number;
  routingMode: 'round_robin' | 'lowest_workload' | 'highest_conversion';
  enabled: boolean;
}
