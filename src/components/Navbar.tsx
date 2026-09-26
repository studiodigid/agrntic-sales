import React, { useState } from 'react';
import { useSyasa } from '../context/SyasaContext';
import {
  MessageSquare,
  Users,
  Database,
  BarChart3,
  Bot,
  Zap,
  SlidersHorizontal,
  Box,
  ShieldCheck,
  Smartphone,
  PhoneCall,
  Sparkles,
  Cpu,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentRole,
    setCurrentRole,
    salesAgents,
    selectedSalesId,
    setSelectedSalesId,
    leads,
    activeProviderId,
    triggerMetaAdLeadSimulation,
  } = useSyasa();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handoverCount = leads.filter((l) => l.status === 'HANDOVER').length;
  const activeLinesCount = salesAgents.filter((s) => s.status !== 'offline').length;

  const handleSelectNav = (view: typeof activeView) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'simulator' as const, label: 'WhatsApp Live', icon: MessageSquare },
    { id: 'leads' as const, label: 'Lead Pipeline', icon: SlidersHorizontal, badge: leads.length },
    { id: 'sales' as const, label: 'Sales Roster', icon: Users, subtitle: '20+ Sales' },
    { id: 'knowledge' as const, label: 'Knowledge Base', icon: Database },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'integrations' as const, label: '3D / ERP', icon: Box },
    { id: 'ai-config' as const, label: 'Model Router (Settings)', icon: Cpu, badge: activeProviderId.toUpperCase() },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Bar with Company & Channel Status - Desktop Only */}
      <div className="hidden sm:flex border-b border-slate-800/80 px-4 py-1.5 items-center justify-between text-xs text-slate-400 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('ai-config')}
            className="flex items-center gap-1.5 font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            title="Buka AI Model Router / Provider Configuration"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>AI Router: <strong className="text-white uppercase font-mono">{activeProviderId}</strong></span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span>Multi-Channel WA:</span>
            <strong className="text-slate-200">{activeLinesCount} Nomor Sales Aktif</strong>
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>CV. Generasi Sugih Sejahtera (Syamanah Garment)</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {handoverCount > 0 && (
            <button
              onClick={() => setActiveView('leads')}
              className="flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-medium animate-pulse hover:bg-rose-500/30 transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{handoverCount} Butuh Handover Sales</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <span className="text-slate-400">Role View:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as any)}
              className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="supervisor" className="bg-slate-900 text-slate-200">
                Supervisor / Admin
              </option>
              <option value="sales" className="bg-slate-900 text-slate-200">
                Sales / CS
              </option>
              <option value="customer" className="bg-slate-900 text-slate-200">
                Customer View
              </option>
            </select>
          </div>

          {currentRole === 'sales' && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-slate-400">Login sebagai:</span>
              <select
                value={selectedSalesId}
                onChange={(e) => setSelectedSalesId(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                {salesAgents.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-16">
        {/* Brand: [icon robot] SYASA / SALES ASSISTANT */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20 shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white leading-none">
              SYASA
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-emerald-400 uppercase mt-0.5 sm:mt-1 leading-none">
              SALES ASSISTANT
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links (Hidden on Mobile) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveView('simulator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'simulator'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Live</span>
          </button>

          <button
            onClick={() => setActiveView('leads')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'leads'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Lead Pipeline</span>
            <span className="bg-slate-800/80 text-slate-300 text-xs px-1.5 py-0.2 rounded font-mono">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('sales')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'sales'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>20+ Sales Roster</span>
          </button>

          <button
            onClick={() => setActiveView('knowledge')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'knowledge'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Knowledge Base</span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'analytics'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveView('integrations')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'integrations'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>3D / ERP</span>
          </button>

          <button
            onClick={() => setActiveView('ai-config')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeView === 'ai-config'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Model Router</span>
          </button>
        </nav>

        {/* Right Section: Desktop Action Button + Mobile Hamburger Button */}
        <div className="flex items-center gap-2">
          {/* Desktop "+ Inbound Meta Ads" Button */}
          <button
            onClick={() => triggerMetaAdLeadSimulation()}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg shadow-emerald-900/30 transition-all border border-emerald-400/30 active:scale-95 cursor-pointer"
            title="Simulasikan lead baru masuk dari iklan Meta Ads"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
            <span>+ Inbound Meta Ads</span>
          </button>

          {/* Mobile Hamburger Toggle Button (☰) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Buka navigasi menu"
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors focus:outline-none cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-5 shadow-2xl animate-fadeIn space-y-4">
          {/* Mobile Lead & AI Status Card */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active AI Router:</span>
              <span className="font-mono text-emerald-400 font-bold uppercase bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/80">
                {activeProviderId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nomor Sales Aktif:</span>
              <span className="text-slate-200 font-medium">{activeLinesCount} Nomor WA</span>
            </div>

            {handoverCount > 0 && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <PhoneCall className="w-3 h-3" /> {handoverCount} Butuh Handover
                </span>
                <button
                  onClick={() => handleSelectNav('leads')}
                  className="text-xs text-rose-300 underline font-medium"
                >
                  Lihat Lead
                </button>
              </div>
            )}
          </div>

          {/* Role Switcher in Mobile Drawer */}
          <div className="flex items-center justify-between bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">Role Mode:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as any)}
              className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="supervisor" className="bg-slate-900 text-slate-200">
                Supervisor / Admin
              </option>
              <option value="sales" className="bg-slate-900 text-slate-200">
                Sales / CS
              </option>
              <option value="customer" className="bg-slate-900 text-slate-200">
                Customer View
              </option>
            </select>
          </div>

          {/* Navigation Links List */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Menu Navigasi
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Inbound Lead Simulation Trigger */}
          <div className="pt-2">
            <button
              onClick={() => {
                triggerMetaAdLeadSimulation();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
              <span>+ Simulasi Lead Meta Ads</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
