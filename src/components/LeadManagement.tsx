import React, { useState } from 'react';
import { useSyasa } from '../context/SyasaContext';
import { Lead, LeadStatus } from '../types/syasa';
import {
  Search,
  Filter,
  PhoneCall,
  UserCheck,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  Share2,
  Calendar,
  Box,
  Layers,
  ChevronRight,
  X,
} from 'lucide-react';

export const LeadManagement: React.FC = () => {
  const {
    leads,
    salesAgents,
    activeLeadId,
    setActiveLeadId,
    updateLead,
    assignLeadToSales,
    autoRouteLead,
    syncLeadToERPNext,
    setActiveView,
  } = useSyasa();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [selectedDrawerLead, setSelectedDrawerLead] = useState<Lead | null>(null);
  const [isSyncingERP, setIsSyncingERP] = useState(false);

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesSearch =
      lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customerPhone.includes(searchQuery) ||
      lead.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.assignedSalesName && lead.assignedSalesName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">New</span>;
      case 'AI_HANDLING':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">AI Handling</span>;
      case 'QUALIFYING':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">Qualifying</span>;
      case 'QUALIFIED':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">Qualified</span>;
      case 'HANDOVER':
        return (
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
            <PhoneCall className="w-3 h-3" /> Handover Sales
          </span>
        );
      case 'SALES_HANDLING':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">Sales Handling</span>;
      case 'CLOSED':
        return <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">Closed Won</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs">{status}</span>;
    }
  };

  const handleOpenLead = (lead: Lead) => {
    setSelectedDrawerLead(lead);
    setActiveLeadId(lead.id);
  };

  const handleSyncERP = async (leadId: string) => {
    setIsSyncingERP(true);
    await syncLeadToERPNext(leadId);
    setIsSyncingERP(false);
    // Refresh local drawer ref
    const updated = leads.find((l) => l.id === leadId);
    if (updated) setSelectedDrawerLead(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Lead Management Console
            <span className="text-xs bg-slate-800 text-emerald-400 border border-slate-700 px-2.5 py-0.5 rounded-full font-mono">
              Total: {leads.length} Leads
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Monitor aliran lead dari Meta Ads, kualifikasi otomatis 5 pilar, handover status, dan riwayat percakapan.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nama, ID lead, produk, nomor WA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {(['ALL', 'HANDOVER', 'QUALIFYING', 'QUALIFIED', 'SALES_HANDLING', 'AI_HANDLING', 'NEW', 'CLOSED'] as const).map((status) => {
          const count = status === 'ALL' ? leads.length : leads.filter((l) => l.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{status === 'ALL' ? 'Semua Status' : status.replace('_', ' ')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${statusFilter === status ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Leads Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Lead ID & Tanggal</th>
                <th className="py-3 px-4">Customer & Kontak</th>
                <th className="py-3 px-4">Kebutuhan Produk & Qty</th>
                <th className="py-3 px-4">Status & Kualifikasi</th>
                <th className="py-3 px-4">Sales / CS Ditugaskan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Tidak ada lead yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => handleOpenLead(lead)}
                      className={`hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        lead.status === 'HANDOVER' ? 'bg-rose-950/10' : ''
                      }`}
                    >
                      {/* Lead ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white text-xs">{lead.id}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{lead.createdAt}</span>
                        </div>
                        {lead.metaAdSource && (
                          <div className="mt-1">
                            <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-1.5 py-0.2 rounded font-sans">
                              {lead.metaAdSource.sourcePlatform}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{lead.customerName}</div>
                        <div className="text-slate-400 font-mono text-[11px] mt-0.5">{lead.customerPhone}</div>
                      </td>

                      {/* Product & Qty */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{lead.product}</div>
                        <div className="text-emerald-400 font-mono text-[11px]">
                          {lead.quantity ? `Jumlah: ${lead.quantity}` : 'Qty: Belum pasti'}
                        </div>
                      </td>

                      {/* Status & Qualification Score */}
                      <td className="py-3.5 px-4">
                        <div className="mb-1">{getStatusBadge(lead.status)}</div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full"
                              style={{ width: `${lead.qualificationScore}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{lead.qualificationScore}%</span>
                        </div>
                      </td>

                      {/* Assigned Sales */}
                      <td className="py-3.5 px-4">
                        {lead.assignedSalesName ? (
                          <div>
                            <div className="font-medium text-slate-200 flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{lead.assignedSalesName}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">{lead.assignedSalesPhone}</div>
                          </div>
                        ) : (
                          <span className="text-yellow-400/90 text-xs italic">Menunggu Rute</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setActiveLeadId(lead.id);
                              setActiveView('simulator');
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                            title="Buka Chat WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                          </button>
                          <button
                            onClick={() => handleOpenLead(lead)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                            title="Detail Lead & Riwayat"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER / MODAL */}
      {selectedDrawerLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto flex flex-col p-6 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedDrawerLead.id}</h2>
                    {getStatusBadge(selectedDrawerLead.status)}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedDrawerLead.customerName} • {selectedDrawerLead.customerPhone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDrawerLead(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 py-6 flex-1">
              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setActiveLeadId(selectedDrawerLead.id);
                    setActiveView('simulator');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Buka Live Chat</span>
                </button>

                {selectedDrawerLead.status === 'HANDOVER' && (
                  <button
                    onClick={() => {
                      updateLead(selectedDrawerLead.id, { status: 'SALES_HANDLING' });
                      setSelectedDrawerLead({ ...selectedDrawerLead, status: 'SALES_HANDLING' });
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Terima Handover (Mulai Tangani)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    updateLead(selectedDrawerLead.id, { status: 'CLOSED' });
                    setSelectedDrawerLead({ ...selectedDrawerLead, status: 'CLOSED' });
                  }}
                  className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Closed Won</span>
                </button>

                <button
                  onClick={() => handleSyncERP(selectedDrawerLead.id)}
                  disabled={isSyncingERP}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Box className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isSyncingERP ? 'Syncing...' : 'Sync ERPNext'}</span>
                </button>
              </div>

              {/* AI Briefing Summary */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Summary Handover untuk Sales
                  </h3>
                  <button
                    onClick={() => {
                      if (selectedDrawerLead.aiSummary) {
                        navigator.clipboard.writeText(selectedDrawerLead.aiSummary);
                        alert('Disalin!');
                      }
                    }}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Salin
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedDrawerLead.aiSummary || 'Belum ada ringkasan AI.'}
                </p>
                {selectedDrawerLead.handoverReason && (
                  <div className="mt-3 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
                    <strong>Penyebab Handover:</strong> {selectedDrawerLead.handoverReason}
                  </div>
                )}
              </div>

              {/* 5 Pilar Data Detail */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Data Kualifikasi Spesifikasi (5 Pilar)
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">1. Produk</div>
                    <div className="text-white font-medium mt-0.5">{selectedDrawerLead.product || '-'}</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">2. Quantity (Jumlah)</div>
                    <div className="text-emerald-400 font-medium font-mono mt-0.5">{selectedDrawerLead.quantity || '-'}</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">3. Desain Mockup</div>
                    <div className="text-white font-medium mt-0.5">{selectedDrawerLead.designStatus || '-'}</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">4. Bahan Kain</div>
                    <div className="text-white font-medium mt-0.5">{selectedDrawerLead.fabric || '-'}</div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">5. Spesifikasi Tambahan</div>
                  <div className="text-white mt-0.5">{selectedDrawerLead.specs || '-'}</div>
                </div>
              </div>

              {/* Sales Assignment Controls */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Penugasan Sales / CS
                  </h3>
                  <button
                    onClick={() => {
                      const routed = autoRouteLead(selectedDrawerLead.id);
                      if (routed) {
                        setSelectedDrawerLead({
                          ...selectedDrawerLead,
                          assignedSalesId: routed.id,
                          assignedSalesName: routed.name,
                          assignedSalesPhone: routed.phone,
                        });
                      }
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    Rute Otomatis
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={selectedDrawerLead.assignedSalesId || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      assignLeadToSales(selectedDrawerLead.id, val);
                      const targetSales = salesAgents.find((s) => s.id === val);
                      setSelectedDrawerLead({
                        ...selectedDrawerLead,
                        assignedSalesId: val,
                        assignedSalesName: targetSales?.name || null,
                        assignedSalesPhone: targetSales?.phone || null,
                      });
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Pilih Sales Manual (20+ Roster) --</option>
                    {salesAgents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category}) - Beban: {s.currentDailyLeads}/{s.dailyLeadQuota}
                      </option>
                    ))}
                  </select>

                  {selectedDrawerLead.assignedSalesPhone && (
                    <a
                      href={`https://wa.me/${selectedDrawerLead.assignedSalesPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>WA Sales</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Full Conversation History */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  Riwayat Percakapan Utuh ({selectedDrawerLead.messages.length} Pesan)
                </h3>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {selectedDrawerLead.messages.map((m) => {
                    const isCust = m.sender === 'customer';
                    return (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl text-xs ${
                          isCust ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-emerald-950/70 border border-emerald-900/60 text-emerald-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 font-mono">
                          <span className="font-semibold">{m.senderName}</span>
                          <span>{m.timestamp}</span>
                        </div>
                        <p className="leading-relaxed">{m.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
