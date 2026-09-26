import React, { useState } from 'react';
import { useSyasa } from '../context/SyasaContext';
import {
  Box,
  Palette,
  Layers,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Save,
  Database,
  ArrowRight,
  Code,
  ShieldCheck,
} from 'lucide-react';

export const IntegrationsModal: React.FC = () => {
  const { leads, activeLeadId, updateLead, syncLeadToERPNext } = useSyasa();

  const currentLead = leads.find((l) => l.id === activeLeadId) || leads[0];

  // 3D Configurator State
  const [modelType, setModelType] = useState<'jersey' | 'jaket' | 'kemeja' | 'polo'>('jersey');
  const [primaryColor, setPrimaryColor] = useState('#059669'); // Emerald
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b'); // Amber
  const [teamName, setTeamName] = useState(currentLead?.customerName || 'SYAMANAH FC');
  const [playerNumber, setPlayerNumber] = useState('10');
  const [collarType, setCollarType] = useState('V-Neck Rajut');
  const [patternStyle, setPatternStyle] = useState('Hexagon Geometric');
  const [isSavedToLead, setIsSavedToLead] = useState(false);

  // ERPNext Mock State
  const [isSyncing, setIsSyncing] = useState(false);
  const [erpResponse, setErpResponse] = useState<string | null>(null);

  const handleSave3DToLead = () => {
    if (!currentLead) return;

    updateLead(currentLead.id, {
      digid3DConfig: {
        modelType,
        primaryColor,
        secondaryColor,
        pattern: patternStyle,
        teamName,
        collarType,
      },
      specs: `${currentLead.specs || ''} [3D DIGID: ${modelType.toUpperCase()} - Kerah: ${collarType} - Motif: ${patternStyle} - Nama: ${teamName}]`,
    });

    setIsSavedToLead(true);
    setTimeout(() => setIsSavedToLead(false), 2500);
  };

  const handleSyncERP = async () => {
    if (!currentLead) return;
    setIsSyncing(true);
    setErpResponse(null);

    await syncLeadToERPNext(currentLead.id);

    setIsSyncing(false);
    setErpResponse(
      JSON.stringify(
        {
          erpnext_status: '200 OK',
          doctype: currentLead.status === 'CLOSED' ? 'Quotation' : 'Lead',
          docname: currentLead.erpNextSync?.erpLeadId || 'ERP-LEAD-2026-9021',
          customer_name: currentLead.customerName,
          custom_channel: currentLead.channelNumber,
          meta_ad_campaign: currentLead.metaAdSource?.campaignName || 'Direct',
          items: [
            {
              item_code: currentLead.product,
              qty: currentLead.quantity || 1,
              fabric: currentLead.fabric,
              specs: currentLead.specs,
            },
          ],
          assigned_sales_partner: currentLead.assignedSalesName || 'Unassigned',
        },
        null,
        2
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Ecosystem Connectors: DIGID 3D & ERPNext</span>
            <span className="text-xs bg-slate-800 text-cyan-400 border border-slate-700 px-2.5 py-0.5 rounded-full font-mono">
              PRD Bab 16 & 19
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Jembatan integrasi visual 3D garment (DIGID Engine) dan sinkronisasi data master operasional ERPNext Syamanah.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
          Lead Terpilih: <strong className="text-emerald-400">{currentLead?.id} ({currentLead?.customerName})</strong>
        </div>
      </div>

      {/* SECTION 1: DIGID 3D CONFIGURATOR (PRD Bab 16) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">DIGID 3D Configurator Visualizer (PRD Bab 16)</h2>
              <p className="text-xs text-slate-400">
                Visualisasi jersey/jaket kustom interaktif, nama tim, nomor, dan lampiran desain otomatis ke lead data.
              </p>
            </div>
          </div>

          <button
            onClick={handleSave3DToLead}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
          >
            {isSavedToLead ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{isSavedToLead ? 'Tersimpan ke Lead!' : 'Lampirkan ke Lead SYASA'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D Visualizer Canvas Mockup (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[380px]">
            {/* Background Studio Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

            {/* Simulated 3D Garment Render */}
            <div className="relative z-10 w-64 h-80 flex flex-col items-center justify-center transition-transform hover:scale-105 duration-300">
              {/* Garment SVG Body */}
              <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)]">
                <defs>
                  <linearGradient id="garmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={primaryColor} />
                    <stop offset="100%" stopColor={secondaryColor} />
                  </linearGradient>
                </defs>

                {/* Jersey / Jaket Shape */}
                <path
                  d="M50,30 L75,15 L125,15 L150,30 L190,70 L165,100 L145,85 L145,220 L55,220 L55,85 L35,100 L10,70 Z"
                  fill="url(#garmentGrad)"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Collar */}
                <polygon points="75,15 125,15 100,50" fill={secondaryColor} stroke="#ffffff" strokeWidth="1.5" />

                {/* Sleeve Accents */}
                <path d="M10,70 L35,100 L25,110 L0,80 Z" fill={secondaryColor} opacity="0.8" />
                <path d="M190,70 L165,100 L175,110 L200,80 Z" fill={secondaryColor} opacity="0.8" />

                {/* Side Stripes */}
                <line x1="60" y1="85" x2="60" y2="215" stroke={secondaryColor} strokeWidth="3" opacity="0.9" />
                <line x1="140" y1="85" x2="140" y2="215" stroke={secondaryColor} strokeWidth="3" opacity="0.9" />

                {/* Sublimation Pattern Lines */}
                <circle cx="100" cy="140" r="45" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
                <circle cx="100" cy="140" r="30" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.2" />

                {/* Team Name Text */}
                <text
                  x="100"
                  y="105"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  letterSpacing="1"
                >
                  {teamName.toUpperCase()}
                </text>

                {/* Player Number */}
                <text
                  x="100"
                  y="155"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="38"
                  fontWeight="900"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {playerNumber}
                </text>

                {/* Syamanah Crest Logo */}
                <circle cx="100" cy="70" r="7" fill="#ffffff" />
                <text x="100" y="73" textAnchor="middle" fill={primaryColor} fontSize="8" fontWeight="bold">
                  S
                </text>
              </svg>
            </div>

            {/* Controls Overlay Badge */}
            <div className="absolute bottom-3 left-4 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              3D Real-time Render: {modelType.toUpperCase()} • Kerah: {collarType}
            </div>
          </div>

          {/* Configurator Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Model Pakaian</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'jersey', label: 'Jersey Custom' },
                  { id: 'jaket', label: 'Jaket Varsity' },
                  { id: 'kemeja', label: 'Kemeja PDH' },
                  { id: 'polo', label: 'Polo Shirt' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModelType(m.id as any)}
                    className={`p-2 rounded-xl font-medium border text-center transition-all ${
                      modelType === m.id
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Warna Utama (Badan)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="font-mono text-slate-300">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Warna Aksen / Kerah</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="font-mono text-slate-300">{secondaryColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nama Tim / Instansi</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nomor Sampel</label>
                <input
                  type="text"
                  value={playerNumber}
                  onChange={(e) => setPlayerNumber(e.target.value)}
                  maxLength={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tipe Kerah</label>
                <select
                  value={collarType}
                  onChange={(e) => setCollarType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                >
                  <option value="V-Neck Rajut">V-Neck Rajut</option>
                  <option value="O-Neck Polos">O-Neck Polos</option>
                  <option value="Kerah Polo">Kerah Polo Kancing</option>
                  <option value="Shanghai Mandarin">Kerah Shanghai</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ERPNEXT CONNECTOR (PRD Bab 19) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Integrasi ERPNext (PRD Bab 19)</h2>
              <p className="text-xs text-slate-400">
                Pemetaan struktur data lead & quotation ke REST API DocType ERPNext Syamanah Garment.
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncERP}
            disabled={isSyncing}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing ke ERPNext...' : 'Push Lead ke ERPNext'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Status Sinkronisasi Saat Ini:</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-emerald-400 font-bold">
                  {currentLead?.erpNextSync?.synced ? 'TERHUBUNG (SYNCED)' : 'READY TO SYNC'}
                </span>
                {currentLead?.erpNextSync?.erpLeadId && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    ID: {currentLead.erpNextSync.erpLeadId}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 space-y-1 leading-relaxed">
              <strong className="text-white block">Struktur Mapping DocType:</strong>
              <div>• <code>Lead</code>: Dibuat otomatis saat lead status = QUALIFIED</div>
              <div>• <code>Opportunity / Quotation</code>: Dibuat saat Handover Sales & Negosiasi Harga</div>
              <div>• Field sinkron: Nama, No WA, Channel, Produk, Bahan, Quantity, Sales Assignee</div>
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulasi Payload API JSON:</span>
            </div>
            <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 max-h-48 overflow-y-auto leading-tight">
              {erpResponse ||
                JSON.stringify(
                  {
                    doctype: 'Opportunity',
                    customer_name: currentLead?.customerName || 'Budi',
                    contact_mobile: currentLead?.customerPhone || '+62812...',
                    items: [
                      {
                        item_code: currentLead?.product || 'Jersey Custom',
                        qty: currentLead?.quantity || 30,
                        fabric: currentLead?.fabric || 'Dryfit Milano',
                      },
                    ],
                    sales_assigned: currentLead?.assignedSalesName || 'Rian Pratama',
                    status: 'Open',
                  },
                  null,
                  2
                )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
