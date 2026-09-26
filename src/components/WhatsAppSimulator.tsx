import React, { useState, useRef, useEffect } from 'react';
import { useSyasa } from '../context/SyasaContext';
import { formatDisplayPhone, getRawWhatsAppNumber } from '../utils/formatters';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  Clock,
  Zap,
  Info,
  Layers,
  ChevronRight,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

export const WhatsAppSimulator: React.FC = () => {
  const {
    leads,
    activeLeadId,
    setActiveLeadId,
    sendChatMessage,
    isSendingChat,
    salesAgents,
    assignLeadToSales,
    autoRouteLead,
    updateLead,
    setActiveView,
  } = useSyasa();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active lead
  const currentLead = leads.find((l) => l.id === activeLeadId) || leads[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentLead?.messages, isSendingChat]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !currentLead || isSendingChat) return;

    const msg = inputMessage;
    setInputMessage('');
    await sendChatMessage(currentLead.id, msg);
  };

  const handleQuickPrompt = (text: string) => {
    setInputMessage(text);
  };

  const assignedSales = salesAgents.find((s) => s.id === currentLead?.assignedSalesId);

  // Pillar completion checks
  const hasProduct = currentLead?.product && currentLead.product !== 'Belum terisi';
  const hasQuantity = currentLead?.quantity && currentLead.quantity !== 'Belum terisi' && currentLead.quantity !== 'Belum pasti';
  const hasDesign = currentLead?.designStatus && currentLead.designStatus !== 'Belum terisi' && currentLead.designStatus !== 'Menunggu konfirmasi';
  const hasFabric = currentLead?.fabric && currentLead.fabric !== 'Belum terisi' && currentLead.fabric !== 'Belum ditentukan';
  const hasSpecs = currentLead?.specs && currentLead.specs !== 'Belum terisi' && currentLead.specs !== 'Belum lengkap';

  const pillarsCount = [hasProduct, hasQuantity, hasDesign, hasFabric, hasSpecs].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Overview Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              WhatsApp Omnichannel Live Simulator
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono font-normal">
                {currentLead?.channelNumber || 'Channel Utama'}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Uji respons otomatis AI SYASA, ekstraksi 5 pilar kualifikasi secara real-time, dan handover cerdas saat customer menanyakan harga.
            </p>
          </div>
        </div>

        {/* Lead Selector Pillbox */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 shrink-0">Pilih Percakapan:</span>
          {leads.slice(0, 5).map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLeadId(l.id)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all shrink-0 ${
                activeLeadId === l.id
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {l.customerName.split(' ')[0]} ({l.id})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: WhatsApp Chat Window (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl h-[720px]">
          {/* WhatsApp Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold">
                  {currentLead?.customerName?.charAt(0) || 'C'}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-900"></div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  {currentLead?.customerName}
                  {currentLead?.isHandover && (
                    <span className="bg-rose-500/20 text-rose-300 text-[10px] px-1.5 py-0.5 rounded font-medium border border-rose-500/30">
                      Handover Sales
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <span>{currentLead?.customerPhone}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400">Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-[11px] text-slate-400">Lead ID</div>
                <div className="text-xs font-mono font-bold text-slate-200">{currentLead?.id}</div>
              </div>
              <button
                onClick={() => setActiveView('leads')}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Buka di Lead Pipeline"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Meta Ads Inbound Payload Banner (If available) */}
          {currentLead?.metaAdSource && (
            <div className="bg-indigo-950/40 border-b border-indigo-900/40 px-4 py-2 flex items-center justify-between text-xs text-indigo-300">
              <div className="flex items-center gap-2 truncate">
                <span className="bg-indigo-600/30 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider text-indigo-200">
                  {currentLead.metaAdSource.sourcePlatform}
                </span>
                <span className="truncate">Kampanye: {currentLead.metaAdSource.campaignName}</span>
              </div>
              <span className="text-[11px] text-indigo-400 font-mono hidden sm:inline">
                {currentLead.metaAdSource.adCreative}
              </span>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950/80">
            {/* System Info Bubble */}
            <div className="flex justify-center my-2">
              <div className="bg-slate-900/80 border border-slate-800 text-slate-400 text-[11px] px-3 py-1 rounded-full shadow-sm">
                Percakapan dilindungi sistem AI SYASA (CV. Generasi Sugih Sejahtera)
              </div>
            </div>

            {currentLead?.messages.map((msg) => {
              const isCust = msg.sender === 'customer';
              const isAI = msg.sender === 'ai';
              const isSales = msg.sender === 'sales';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCust ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-md relative ${
                      isCust
                        ? 'bg-slate-800 border border-slate-700/80 text-slate-100 rounded-tl-sm'
                        : isSales
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-emerald-700 text-white rounded-tr-sm'
                    }`}
                  >
                    {/* Sender Tag */}
                    <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-80 font-medium">
                      <span>{msg.senderName}</span>
                      <span className="text-[10px] font-mono">{msg.timestamp}</span>
                    </div>

                    {/* Message Body */}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {/* Handover Notice Inside Bubble */}
                    {msg.meta?.isHandoverTrigger && (
                      <div className="mt-2 pt-2 border-t border-white/20 text-xs flex items-start gap-1.5 text-yellow-200">
                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <div>
                          <strong className="block font-semibold">Batas SOP AI Tercapai:</strong>
                          <span>{msg.meta.reason || 'Customer menanyakan harga/penawaran. Dialihkan ke Sales.'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isSendingChat && (
              <div className="flex items-start">
                <div className="bg-emerald-900/60 border border-emerald-700/40 text-emerald-200 rounded-2xl px-4 py-2 text-xs flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>SYASA AI sedang menganalisis & menyusun balasan...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Helper */}
          <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2 overflow-x-auto flex items-center gap-2 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-medium shrink-0">Uji Cepat:</span>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Bisa pesan jersey futsal 30 pcs bahan dryfit milano?')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              👕 Jersey Futsal 30 pcs
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Kalau pesan 30 pcs jersey full sublim itu total harganya berapa min? Ada diskon?')}
              className="text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              💰 Tanya Total Harga (Uji Handover)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Apa bedanya bahan kain Dryfit Milano sama Serena ya min?')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              🧵 Tanya Rekomendasi Bahan
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Syamanah bisa bantu bikinin desainnya sekalian ga kalau belum ada file?')}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
            >
              🎨 Tanya Fasilitas Desain
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="bg-slate-900 p-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ketik pesan sebagai customer (atau gunakan tombol uji cepat di atas)..."
              disabled={isSendingChat}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isSendingChat || !inputMessage.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-2.5 rounded-xl font-medium transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Live SYASA Qualification & Handover Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Handover Alert Card (When Triggered) */}
          {currentLead?.isHandover ? (
            <div className="bg-gradient-to-br from-rose-950/60 to-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 mt-0.5">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                      Status Handover Aktif
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{currentLead.handoverAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Customer Membutuhkan Sales / CS
                  </h3>
                  <p className="text-xs text-rose-200/90 mt-1">
                    {currentLead.handoverReason || 'Customer menanyakan harga/quotation/penawaran resmi.'}
                  </p>
                </div>
              </div>

              {/* Assigned Sales Specialist Info */}
              <div className="mt-4 pt-4 border-t border-rose-500/20 bg-slate-900/60 -mx-5 -mb-5 p-4 rounded-b-2xl">
                {assignedSales ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${assignedSales.avatarColor} text-white font-bold flex items-center justify-center text-xs`}>
                        {assignedSales.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{assignedSales.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{formatDisplayPhone(assignedSales.phone)} • Tim {assignedSales.category}</div>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${getRawWhatsAppNumber(assignedSales.phone)}?text=Halo%20${encodeURIComponent(assignedSales.name)},%20ada%20lead%20handover%20SYASA%20dari%20${encodeURIComponent(currentLead.customerName)}%20(${encodeURIComponent(currentLead.product)})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md transition-colors"
                    >
                      <span>Buka WA Sales</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-300">Belum diarahkan ke Sales</span>
                    <button
                      onClick={() => autoRouteLead(currentLead.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm"
                    >
                      Rute Otomatis Sekarang
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI SYASA Aktif Menangani</h4>
                  <p className="text-[11px] text-slate-400">Sedang mengeksplorasi kebutuhan & mengedukasi spek</p>
                </div>
              </div>
              <button
                onClick={() => {
                  updateLead(currentLead.id, {
                    isHandover: true,
                    status: 'HANDOVER',
                    handoverReason: 'Dialihkan manual oleh supervisor/admin.',
                    handoverAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                  });
                  if (!currentLead.assignedSalesId) autoRouteLead(currentLead.id);
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Alihkan ke Sales Manual
              </button>
            </div>
          )}

          {/* 5-Pillar Qualification Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Lead Qualification (5 Pilar)</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                {pillarsCount}/5 Pilar ({currentLead?.qualificationScore || pillarsCount * 20}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                style={{ width: `${currentLead?.qualificationScore || pillarsCount * 20}%` }}
              ></div>
            </div>

            {/* 5 Pillars Breakdown */}
            <div className="space-y-3">
              {/* 1. Produk */}
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-1 rounded-full ${hasProduct ? 'text-emerald-400 bg-emerald-950' : 'text-slate-500 bg-slate-800'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">1. Produk</div>
                    <div className="text-xs font-medium text-white">{currentLead?.product || 'Belum diketahui'}</div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${hasProduct ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {hasProduct ? 'Terisi' : 'Menunggu'}
                </span>
              </div>

              {/* 2. Quantity */}
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-1 rounded-full ${hasQuantity ? 'text-emerald-400 bg-emerald-950' : 'text-slate-500 bg-slate-800'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">2. Quantity (Jumlah)</div>
                    <div className="text-xs font-medium text-white">{currentLead?.quantity ? `${currentLead.quantity}` : 'Belum diketahui'}</div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${hasQuantity ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {hasQuantity ? 'Terisi' : 'Menunggu'}
                </span>
              </div>

              {/* 3. Desain */}
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-1 rounded-full ${hasDesign ? 'text-emerald-400 bg-emerald-950' : 'text-slate-500 bg-slate-800'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">3. Desain Mockup</div>
                    <div className="text-xs font-medium text-white">{currentLead?.designStatus || 'Belum diketahui'}</div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${hasDesign ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {hasDesign ? 'Terisi' : 'Menunggu'}
                </span>
              </div>

              {/* 4. Bahan */}
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-1 rounded-full ${hasFabric ? 'text-emerald-400 bg-emerald-950' : 'text-slate-500 bg-slate-800'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">4. Bahan / Kain</div>
                    <div className="text-xs font-medium text-white">{currentLead?.fabric || 'Belum diketahui'}</div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${hasFabric ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {hasFabric ? 'Terisi' : 'Menunggu'}
                </span>
              </div>

              {/* 5. Spesifikasi */}
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 p-1 rounded-full ${hasSpecs ? 'text-emerald-400 bg-emerald-950' : 'text-slate-500 bg-slate-800'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">5. Spesifikasi Detail</div>
                    <div className="text-xs font-medium text-white">{currentLead?.specs || 'Belum lengkap'}</div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${hasSpecs ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  {hasSpecs ? 'Terisi' : 'Menunggu'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Handover Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                AI Summary untuk Sales
              </h3>
              <button
                onClick={() => {
                  if (currentLead?.aiSummary) {
                    navigator.clipboard.writeText(currentLead.aiSummary);
                    alert('Ringkasan AI disalin ke clipboard!');
                  }
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Salin Ringkasan
              </button>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed font-sans">
              {currentLead?.aiSummary || 'Belum ada ringkasan. AI akan otomatis membuat resume setelah menerima informasi dari customer.'}
            </p>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status Lead: <strong className="text-emerald-400 font-mono">{currentLead?.status}</strong></span>
              <span>Diperbarui: <span className="font-mono text-slate-300">{currentLead?.updatedAt}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
