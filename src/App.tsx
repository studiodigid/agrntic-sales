import React from 'react';
import { SyasaProvider, useSyasa } from './context/SyasaContext';
import { Navbar } from './components/Navbar';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { LeadManagement } from './components/LeadManagement';
import { SalesRoster } from './components/SalesRoster';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { IntegrationsModal } from './components/IntegrationsModal';
import { AIModelConfiguration } from './components/AIModelConfiguration';
import { ShieldCheck, Heart, Sparkles, Smartphone, Bot, Cpu } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView } = useSyasa();

  return (
    <main className="flex-1 pb-16">
      {activeView === 'simulator' && <WhatsAppSimulator />}
      {activeView === 'leads' && <LeadManagement />}
      {activeView === 'sales' && <SalesRoster />}
      {activeView === 'knowledge' && <KnowledgeBaseView />}
      {activeView === 'analytics' && <AnalyticsDashboard />}
      {activeView === 'integrations' && <IntegrationsModal />}
      {activeView === 'ai-config' && <AIModelConfiguration />}
    </main>
  );
};

const FooterContent: React.FC = () => {
  const { activeProviderId, aiProviders } = useSyasa();
  const current = aiProviders.find((p) => p.id === activeProviderId);

  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
            SY
          </div>
          <span>
            <strong>SYASA (Syamanah Sales Assistant)</strong> — CV. Generasi Sugih Sejahtera (Syamanah Garment)
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Active AI Router: <strong>{current?.name || activeProviderId}</strong> ({current?.model || 'active'})</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>24 Multi-Number Channels</span>
          </span>
          <span>•</span>
          <span>Bandung, Jawa Barat</span>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <SyasaProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <Navbar />
        <MainContent />
        <FooterContent />
      </div>
    </SyasaProvider>
  );
}
