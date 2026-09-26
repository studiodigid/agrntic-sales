import React from 'react';
import { useSyasa } from '../context/SyasaContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  PhoneCall,
  Users,
  Zap,
  Award,
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { leads, salesAgents } = useSyasa();

  const totalLeads = leads.length;
  const handoverLeads = leads.filter((l) => l.isHandover).length;
  const qualifiedLeads = leads.filter((l) => l.qualificationScore >= 80).length;
  const closedDeals = leads.filter((l) => l.status === 'CLOSED').length;

  const qualificationRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
  const handoverRate = totalLeads > 0 ? Math.round((handoverLeads / totalLeads) * 100) : 0;

  // Breakdown by product
  const productDistribution = [
    { name: 'Jersey Custom Sublim', count: 184, percent: 43, color: 'bg-emerald-500' },
    { name: 'Jaket (Varsity & Bomber)', count: 96, percent: 22, color: 'bg-amber-500' },
    { name: 'Kemeja PDH / PDL Kantor', count: 88, percent: 20, color: 'bg-purple-500' },
    { name: 'Kaos Combed & Polo Shirt', count: 42, percent: 10, color: 'bg-cyan-500' },
    { name: 'Rompi Safety K3 & Tactical', count: 22, percent: 5, color: 'bg-rose-500' },
  ];

  // Funnel steps
  const funnelSteps = [
    { label: '1. Inbound Leads (Meta Ads & Direct WA)', count: 432, percent: 100, color: 'bg-sky-500' },
    { label: '2. AI SYASA Greeting & Edukasi Bahan', count: 418, percent: 96.7, color: 'bg-indigo-500' },
    { label: '3. Qualification Lengkap (>=80% Spek)', count: 356, percent: 82.4, color: 'bg-emerald-500' },
    { label: '4. Handover ke Sales Manusia (Quotation)', count: 284, percent: 65.7, color: 'bg-amber-500' },
    { label: '5. Closing Won Penjualan (PO Terbit)', count: 146, percent: 33.8, color: 'bg-teal-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            Reporting & Monitoring Dashboard (PRD Bab 17)
          </h1>
          <p className="text-xs text-slate-400">
            Monitoring performa otomatisasi AI SYASA, efisiensi penanganan lead, dan efektivitas routing ke 20+ Sales Syamanah Garment.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto font-mono">
          <span>Periode:</span>
          <strong className="text-emerald-400">Hari Ini (Real-time Live Sync)</strong>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Leads Hari Ini</div>
          <div className="text-3xl font-black text-white mt-1">
            432 <span className="text-xs font-normal text-emerald-400 font-mono">+18% vs d-1</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Volume ±20 leads/sales tercapai merata</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tingkat Kualifikasi AI</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            82.4%
          </div>
          <p className="text-[11px] text-slate-400 mt-2">356 leads terkualifikasi 5 pilar sebelum handover</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Handover ke Sales</div>
          <div className="text-3xl font-black text-amber-400 mt-1">
            284 <span className="text-xs font-normal text-slate-400">leads</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Diteruskan saat menanyakan harga/quotation</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Kecepatan Respons Awal</div>
          <div className="text-3xl font-black text-cyan-400 mt-1">
            1.8 <span className="text-xs font-normal text-slate-400">detik (AI)</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2">Zero lead terlewat karena keterlambatan respon</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Conversion Funnel (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Funnel Konversi Aliran Lead (PRD Bab 20)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Closing Won: 33.8%</span>
          </div>

          <div className="space-y-3 pt-2">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{step.label}</span>
                  <span className="font-mono text-white font-bold">
                    {step.count} ({step.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`${step.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${step.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-slate-200">SOP Batasan AI Terjaga:</strong> Seluruh tahap negosiasi, penerbitan quotation, dan closing 100% ditangani human sales setelah data dirapikan SYASA.
            </div>
          </div>
        </div>

        {/* RIGHT: Product Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Distribusi Produk Pesanan</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">432 Inbound</span>
          </div>

          <div className="space-y-3">
            {productDistribution.map((prod, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{prod.name}</span>
                  <span className="font-mono text-white font-bold">
                    {prod.count} pcs ({prod.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className={`${prod.color} h-full`} style={{ width: `${prod.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-400 font-semibold mb-2">Meta Ads Campaign Attribution</div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between p-1.5 bg-slate-950 rounded-lg">
                <span className="text-slate-300">ID_Meta_Jersey_Futsal_Q3</span>
                <span className="text-emerald-400">188 leads (43%)</span>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-950 rounded-lg">
                <span className="text-slate-300">ID_Meta_Jaket_Varsity_Hype</span>
                <span className="text-amber-400">104 leads (24%)</span>
              </div>
              <div className="flex justify-between p-1.5 bg-slate-950 rounded-lg">
                <span className="text-slate-300">ID_Meta_PDH_Instansi_Corp</span>
                <span className="text-purple-400">92 leads (21%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
