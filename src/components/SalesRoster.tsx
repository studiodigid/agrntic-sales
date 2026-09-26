import React, { useState } from 'react';
import { useSyasa } from '../context/SyasaContext';
import { SalesAgent } from '../types/syasa';
import { formatDisplayPhone, getRawWhatsAppNumber } from '../utils/formatters';
import {
  Users,
  Smartphone,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  Zap,
  Sliders,
  Search,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

export const SalesRoster: React.FC = () => {
  const { salesAgents, routingRules, leads } = useSyasa();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSales = salesAgents.filter((s) => {
    const matchesCat = filterCategory === 'ALL' || s.category === filterCategory;
    const rawPhone = getRawWhatsAppNumber(s.phone);
    const displayPhone = formatDisplayPhone(s.phone);
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      rawPhone.includes(searchQuery) ||
      displayPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalCapacity = salesAgents.reduce((acc, s) => acc + s.dailyLeadQuota, 0);
  const totalAssignedToday = salesAgents.reduce((acc, s) => acc + s.currentDailyLeads, 0);
  const onlineAgents = salesAgents.filter((s) => s.status !== 'offline').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs font-medium">Total Tim Sales / CS</div>
          <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-2">
            <span>{salesAgents.length} Personel</span>
            <span className="text-xs text-emerald-400 font-normal">({onlineAgents} Siaga Aktif)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Multi-number &gt;20 nomor WA unik</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs font-medium">Beban Alokasi Hari Ini</div>
          <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-2">
            <span>{totalAssignedToday}</span>
            <span className="text-xs text-slate-400 font-mono">/ {totalCapacity} Quota Lead</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(totalAssignedToday / totalCapacity) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs font-medium">Rata-rata Kuota per Sales</div>
          <div className="text-2xl font-black text-white mt-1">
            20 <span className="text-xs text-slate-400 font-normal">leads / hari</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">Mencegah burnout & lead terabaikan</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="text-slate-400 text-xs font-medium">Rata-rata Kecepatan Respon</div>
          <div className="text-2xl font-black text-white mt-1">
            3.2 <span className="text-xs text-slate-400 font-normal">menit</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">AI SYASA menjawab &lt; 2 detik</p>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Roster Sales & Distribusi Nomor WhatsApp</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Sesuai PRD Bab 11
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Setiap Sales memiliki nomor WhatsApp sendiri. SYASA merutekan lead setelah kualifikasi sesuai spesialisasi produk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari sales atau nomor WA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Jersey">Spesialis Jersey</option>
            <option value="Jaket">Spesialis Jaket</option>
            <option value="Kemeja_PDH">Spesialis Kemeja & Seragam</option>
            <option value="Kaos_Polo">Spesialis Kaos & Polo</option>
            <option value="Rompi">Spesialis Rompi</option>
            <option value="All_Rounder">All Rounder</option>
          </select>
        </div>
      </div>

      {/* Sales Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSales.map((sales) => {
          const quotaPercent = Math.round((sales.currentDailyLeads / sales.dailyLeadQuota) * 100);
          const isFull = sales.currentDailyLeads >= sales.dailyLeadQuota;

          return (
            <div
              key={sales.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${sales.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                      {sales.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {sales.name}
                        {sales.status === 'busy' && (
                          <span className="w-2 h-2 rounded-full bg-amber-400" title="Sedang sibuk tangani lead" />
                        )}
                        {sales.status === 'online' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online siaga" />
                        )}
                        {sales.status === 'offline' && (
                          <span className="w-2 h-2 rounded-full bg-slate-500" title="Offline" />
                        )}
                      </h3>
                      <div className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Smartphone className="w-3 h-3 text-slate-400" />
                        <span>{formatDisplayPhone(sales.phone)}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {sales.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Daily Workload Progress */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Alokasi Lead Hari Ini:</span>
                    <span className={`font-mono font-bold ${isFull ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {sales.currentDailyLeads} / {sales.dailyLeadQuota} leads ({quotaPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isFull
                          ? 'bg-rose-500'
                          : quotaPercent > 70
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(quotaPercent, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center bg-slate-950/60 p-2 rounded-xl border border-slate-800/60 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Closing</div>
                    <div className="font-bold text-white mt-0.5">{sales.conversionRate}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Won Deals</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{sales.totalDealsWon}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Respon</div>
                    <div className="font-bold text-slate-300 mt-0.5 font-mono">{sales.avgResponseMinutes}m</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Email:{' '}
                  <span className="font-mono text-slate-300">
                    {sales.id === 'sales-01' && (sales.email.includes('rian') || !sales.email)
                      ? 'tri.demo@syamanah.com'
                      : sales.email}
                  </span>
                </span>

                <a
                  href={`https://wa.me/${getRawWhatsAppNumber(sales.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  <span>Chat WA</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Routing Rules Engine Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Aturan Routing Otomatis SYASA (PRD Bab 10)</h3>
          </div>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
            5 Active Routing Rules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {routingRules.map((rule) => (
            <div key={rule.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{rule.name}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                  Active
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Kategori Tujuan: <strong className="text-emerald-400">{rule.assignedCategory}</strong>
              </div>
              <div className="text-slate-500 font-mono text-[10px] truncate">
                Filter Regex: {rule.productKeyword}
              </div>
              <div className="text-slate-400 text-[11px]">
                Mode: <span className="font-mono text-slate-300">{rule.routingMode} (Max 20 leads/hari)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
