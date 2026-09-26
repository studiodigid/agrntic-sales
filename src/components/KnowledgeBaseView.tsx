import React, { useState } from 'react';
import { useSyasa } from '../context/SyasaContext';
import { KnowledgeItem } from '../types/syasa';
import {
  Database,
  Search,
  Plus,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Tag,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowRight,
  Send,
  X,
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { knowledge, addKnowledgeItem } = useSyasa();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Live tester
  const [testQuery, setTestQuery] = useState('');
  const [testAnswer, setTestAnswer] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Form for new item
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeItem['category']>('product');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMoq, setNewMoq] = useState('');
  const [newLeadTime, setNewLeadTime] = useState('');
  const [newTags, setNewTags] = useState('');

  const filteredItems = knowledge.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  const handleTestKnowledge = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testQuery.trim() || isTesting) return;

    setIsTesting(true);
    setTestAnswer(null);

    try {
      const res = await fetch('/api/knowledge/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery }),
      });
      const data = await res.json();
      setTestAnswer(data.answer || 'Tidak ada respons.');
    } catch (err) {
      console.error(err);
      setTestAnswer('Gagal mengakses knowledge base.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newItem: KnowledgeItem = {
      id: `kb-custom-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      summary: newSummary || newTitle,
      content: newContent,
      moq: newMoq || undefined,
      leadTime: newLeadTime || undefined,
      tags: newTags ? newTags.split(',').map((t) => t.trim()) : ['syamanah'],
    };

    addKnowledgeItem(newItem);
    setIsAddingNew(false);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewMoq('');
    setNewLeadTime('');
    setNewTags('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Syamanah AI Knowledge Base
              <span className="text-xs bg-slate-800 text-emerald-400 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                PRD Bab 8
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Kamus kebenaran produk, bahan, spesifikasi, dan SOP. SYASA tidak boleh mengarang informasi yang tidak tercantum di sini.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Dokumen Knowledge</span>
        </button>
      </div>

      {/* Interactive AI Knowledge Query Tester */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">Interactive Knowledge Query Tester</h2>
        </div>
        <p className="text-xs text-slate-300 mb-3">
          Uji langsung bagaimana SYASA menjawab pertanyaan customer berdasarkan basis data Syamanah Garment.
        </p>

        <form onSubmit={handleTestKnowledge} className="flex gap-2">
          <input
            type="text"
            placeholder="Contoh: 'Berapa minimal order jersey futsal dan bahan apa yang paling adem?'..."
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isTesting || !testQuery.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
          >
            {isTesting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Tanya AI</span>
          </button>
        </form>

        {testAnswer && (
          <div className="mt-4 p-4 bg-slate-950/90 rounded-xl border border-emerald-500/40 animate-fadeIn">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Jawaban Terverifikasi Knowledge Syamanah:
            </div>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{testAnswer}</p>
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Semua Kategori' },
            { id: 'product', label: 'Katalog Produk' },
            { id: 'fabric', label: 'Kain & Bahan' },
            { id: 'company', label: 'Profil & Legalitas' },
            { id: 'sop', label: 'SOP & Batasan AI' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari kata kunci, kain, spesifikasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Knowledge Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700 font-mono">
                  {item.category.toUpperCase()}
                </span>
                {item.moq && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    MOQ: <strong className="text-white">{item.moq}</strong>
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-400 mb-3">{item.summary}</p>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-sans">
                {item.content}
              </div>

              {item.keySpecs && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.keySpecs.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md"
                    >
                      ✓ {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1 overflow-x-auto text-[10px] text-slate-500 font-mono">
                {item.tags.map((t, idx) => (
                  <span key={idx}>#{t}</span>
                ))}
              </div>

              {item.leadTime && (
                <span className="text-[10px] text-cyan-400 font-mono">Estimasi: {item.leadTime}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Knowledge Item */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white">Tambah Dokumen Knowledge Syamanah</h2>
              <button
                onClick={() => setIsAddingNew(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Judul Dokumen / Topik</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Spesifikasi Jaket Bomber Taslan Waterproof"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="product">Katalog Produk</option>
                    <option value="fabric">Bahan / Kain</option>
                    <option value="company">Profil Perusahaan</option>
                    <option value="sop">SOP & Batasan AI</option>
                    <option value="addon">Add-on & Aksesoris</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">MOQ (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Misal: 24 pcs"
                    value={newMoq}
                    onChange={(e) => setNewMoq(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Ringkasan Singkat</label>
                <input
                  type="text"
                  placeholder="Deskripsi 1 kalimat untuk indeks pencarian cepat..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Isi Konten Lengkap (Knowledge)</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tuliskan detail spesifikasi teknis, fitur, keunggulan, petunjuk kain, atau aturan SOP pelayanan di sini..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tags (Pisahkan koma)</label>
                <input
                  type="text"
                  placeholder="taslan, jaket, anti air, waterproof"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md"
                >
                  Simpan ke Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
