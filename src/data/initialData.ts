import { Lead, SalesAgent, KnowledgeItem, RoutingRule } from '../types/syasa';

export const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'prod-jersey',
    category: 'product',
    title: 'Jersey Custom Sublimasi (Printing Full Color)',
    summary: 'Jersey olahraga dan komunitas dengan teknologi sublimasi Epson full print HD tahan luntur.',
    content: `Syamanah Garment memproduksi jersey custom kualitas pro untuk olahraga (Futsal, Sepakbola, Badminton, Basket, Sepeda/Gowes, Running, E-Sport, dll).
Fitur Unggulan:
- Teknologi Cetak: Full Sublimation Digital Printing mesin Epson original (warna tajam, anti-luntur, menyatu dengan serat kain).
- Pilihan Kerah: Kerah O-neck biasa, V-neck, Polo/Berkerah, Shanghai collar, atau Rib variasi rajut.
- Gratis Tambah: Logo klub unlimited, nama pemain/nomor punggung, sponsor dada/lengan.
- Pilihan Potongan: Regular Fit, Slim Fit, atau Pola Khusus Wanita berhijab (tangan panjang + bawahan menutup pinggul).
- MOQ: Minimal order 12 pcs (bisa beda ukuran S, M, L, XL, XXL).
- Estimasi Pengerjaan: 10 - 14 hari kerja setelah approval sample/mockup desain.`,
    tags: ['jersey', 'olahraga', 'futsal', 'sublimasi', 'sepeda', 'esport'],
    moq: '12 pcs',
    leadTime: '10 - 14 Hari Kerja',
    keySpecs: ['Full print sublimasi', 'Bebas pasang nama/nomor', 'Pilihan kerah variasi', 'Jahitan rantai/overdeck kuat'],
    priceGuidelineNote: 'Kisaran mulai 85k-145k tergantung variasi kain & kerah, Sales wajib menghitung quotation resmi.'
  },
  {
    id: 'prod-jaket',
    category: 'product',
    title: 'Jaket Varsity, Bomber, Coach, & Windbreaker',
    summary: 'Jaket custom untuk komunitas, angkatan kampus, organisasi, dan instansi.',
    content: `Lini produksi jaket Syamanah Garment meliputi berbagai model tren anak muda hingga semi-formal perusahaan:
1. Jaket Varsity: Badan Fleece Cotton tebal 300gsm + Lengan Kulit Sintetis Oscar / Kalep impor, kancing snap metal, bordir laken/handuk/komputer.
2. Jaket Bomber: Bahan Taslan Milky / Parasut Mayer anti-angin tahan cipratan air (water repellent) + furing dakron/quilting hangat.
3. Coach Jacket: Bahan Taslan JN / Parasut Taslan waterproof tipis adem, bukaan kancing depan snap button, sablon plastisol / DTF high res.
4. Hoodie / Zipper: Cotton Fleece 280-330gsm ultra soft, sablon discharge/DTF, tali hoodie bulat rajut tebal.
- MOQ: Minimal 24 pcs per model.
- Pengerjaan: 14 - 18 hari kerja.`,
    tags: ['jaket', 'varsity', 'bomber', 'coach', 'hoodie', 'outerwear'],
    moq: '24 pcs',
    leadTime: '14 - 18 Hari Kerja',
    keySpecs: ['Bahan windproof/water-repellent', 'Bordir komputer 3D / Handuk', 'Furing quilting dakron', 'Resleting YKK original'],
    priceGuidelineNote: 'Handover ke Sales Jaket untuk cek spek furing dan detail bordir.'
  },
  {
    id: 'prod-pdh',
    category: 'product',
    title: 'Kemeja PDH / PDL / Korsa & Seragam Kerja',
    summary: 'Seragam kerja kantor, PDH mahasiswa, instansi pemerintah, dan seragam lapangan tahan banting.',
    content: `Kemeja seragam resmi Syamanah Garment terkenal dengan kerapian jahitan stik dobel (double needle) dan bordir komputer presisi:
- Pilihan Lengan: Pendek, Panjang, atau Panjang dengan kancing skoder (tali pengait gulungan lengan).
- Fitur Lapangan: Ventilasi jaring belakang (air-flow mesh), saku dada model tempel/tutup berkancing, saku pena di lengan kiri.
- Rekomendasi Kain: American Drill 1919 (standard kokoh), Japan Drill Nagata (lebih tebal & adem), Tropical Castillo (halus & elegan).
- MOQ: Minimal 18 pcs.
- Pengerjaan: 12 - 16 hari kerja.`,
    tags: ['kemeja', 'pdh', 'pdl', 'seragam', 'korsa', 'kantor'],
    moq: '18 pcs',
    leadTime: '12 - 16 Hari Kerja',
    keySpecs: ['Kain Drill original grade A', 'Bordir komputer tajima', 'Jahitan stik 2 jarum', 'Kancing berlogo gravir (opsional)'],
    priceGuidelineNote: 'Kalkulasi harga dihitung berdasarkan banyaknya titik bordir dan bahan kemeja.'
  },
  {
    id: 'prod-kaos',
    category: 'product',
    title: 'Kaos Event & Polo Shirt Bordir Premium',
    summary: 'Kaos promosi, gathering, merchandise komunitas & Polo Shirt Lacoste CVC elegan.',
    content: `1. Kaos Oblong (T-Shirt):
- Bahan: 100% Cotton Combed 24s (sedang mantap) & 30s (adem ringan standar distro). Pewarnaan reaktif tidak mudah luntur dan aman untuk kulit sensitif.
- Sablon: Plastisol karet elastis, DTF High-Def digital, atau Discharge (cabut warna).
- MOQ: 24 pcs.
2. Polo Shirt (Wangki):
- Bahan: Lacoste CVC 24s (campuran katun sejuk tidak menyusut) atau Lacoste Cotton Pique.
- Kerah & Manset: Rajut katun elastis rapi, belahan samping bawah (side slit).
- Aplikasi: Bordir komputer dada, lengan, atau punggung.
- MOQ: 24 pcs.`,
    tags: ['kaos', 'polo', 'tshirt', 'combed', 'lacoste', 'gathering'],
    moq: '24 pcs',
    leadTime: '10 - 14 Hari Kerja',
    keySpecs: ['100% Cotton combed reaktif', 'Lacoste CVC anti-pudar', 'Jahitan pundak rantai', 'Sablon plastisol / DTF'],
    priceGuidelineNote: 'Sales Kaos/Polo akan menginfokan grade gramasi dan simulasi harga diskon kuantiti besar.'
  },
  {
    id: 'prod-rompi',
    category: 'product',
    title: 'Rompi Safety K3, Tactical, & Komunitas',
    summary: 'Rompi proyek safety reflektif dan rompi tactical multifungsi saku banyak.',
    content: `Pilihan rompi kerja dan lapangan:
- Rompi Safety: Dilengkapi pita reflektor / Scotlight 3M menyala terang saat terkena sorot lampu malam hari, resleting depan vislon.
- Rompi Tactical / Relawan: Bahan Ripstop kotak anti robek atau Drill, banyak saku zipper tempel, ring D-metal, furing jala aerodinamis.
- MOQ: 20 pcs.
- Pengerjaan: 12 - 15 hari kerja.`,
    tags: ['rompi', 'safety', 'k3', 'tactical', 'lapangan'],
    moq: '20 pcs',
    leadTime: '12 - 15 Hari Kerja',
    keySpecs: ['Scotlight 3M high visibility', 'Bahan Ripstop water repellent', 'Banyak kantong fungsional'],
    priceGuidelineNote: 'Hubungkan ke Sales Rompi untuk detail penempatan pita scotlight dan bordir logo K3.'
  },
  {
    id: 'fabric-guide',
    category: 'fabric',
    title: 'Katalog & Panduan Bahan Kain Syamanah Garment',
    summary: 'Karakteristik kain Jersey, Drill kemeja, Taslan jaket, dan Cotton combed kaos.',
    content: `Kain Jersey Sublim:
1. Dryfit Milano: Pola rajutan zig-zag rapat, serat halus, ketebalan pas (170-180gsm), menyerap keringat sangat cepat, paling populer untuk futsal & lari.
2. Dryfit Bintik (Pique): Tekstur bintik jarum halus berpori mikro, sangat sirkulatif & ringan.
3. Dryfit Serena: Permukaan licin mengkilap, elastis dan jatuh, warna cetak sublimasi sangat cerah keluar.
4. Dryfit Brazil / Waffle: Tekstur kotak bergelombang, premium dan lentur (sering dipakai tim liga pro).

Kain Seragam & Kemeja:
1. American Drill 1919 (Original): Serat benang sedang miring diagonal, bahan kokoh tidak mudah kusut, awet bertahun-tahun.
2. Japan Drill Nagata: Serat lebih rapat, kandungan katun lebih banyak sehingga lebih dingin di kulit, pilihan favorit PDH eksekutif.
3. Ripstop: Motif kotak-kotak penahan robekan, tahan gesekan, water repellent ringan, cocok untuk PDL survival / rompi.

Kain Jaket:
1. Taslan Milky / JN: Anti-air (water-repellent) dan penahan angin 100%, bagian dalam dilapisi coating tipis putih seperti susu.
2. Fleece Cotton: Lembut bagian luar dan berserat kapas hangat di bagian dalam, nyaman dipakai seharian di ruangan AC atau malam hari.`,
    tags: ['bahan', 'kain', 'dryfit', 'milano', 'drill', 'taslan', 'fleece', 'nagata'],
    keySpecs: ['Kain 100% Grade A Original Pabrik', 'Tidak berbulu setelah dicuci', 'Garansi warna tidak belang'],
  },
  {
    id: 'company-profile',
    category: 'company',
    title: 'Profil Perusahaan — CV. Generasi Sugih Sejahtera (Syamanah Garment)',
    summary: 'Legalitas resmi, workshop pusat di Bandung, kapasitas 50.000+ pcs/bulan.',
    content: `CV. Generasi Sugih Sejahtera (Syamanah Garment):
- Alamat Workshop Pusat: Kawasan Industri Tekstil & Konveksi Terpadu, Jl. Terusan Pasirkoja No. 188, Bandung, Jawa Barat 40222.
- Legalitas: CV resmi dengan NIB, NPWP Perusahaan, SK Menkumham, SIUP. Menerima pengadaan instansi BUMN, Pemda, Swasta, dan Komunitas seluruh Indonesia.
- Rekening Resmi Pembayaran: Hanya atas nama CV. GENERASI SUGIH SEJAHTERA (BCA / Mandiri / BNI). Tidak pernah menggunakan rekening perorangan pribadi.
- Kapasitas Produksi: >50.000 pcs per bulan dengan 60+ mesin jahit modern, 4 mesin cetak sublimasi Epson F-series industri, dan 2 mesin bordir komputer 12 kepala.
- Pengiriman: Bekerjasama dengan kargo JNE Trucking, Dakota Cargo, Indah Cargo, Lion Parcel, dan ekspedisi udara ke seluruh pelosok Indonesia (bisa door-to-door).`,
    tags: ['profil', 'legalitas', 'alamat', 'rekening', 'workshop', 'bandung', 'garment'],
    keySpecs: ['Legalitas CV Terdaftar', 'Rekening Perusahaan Resmi', 'Garansi Retur 100% Cacat Pabrik']
  },
  {
    id: 'sop-syasa',
    category: 'sop',
    title: 'SOP Pelayanan & Boundary Ketat SYASA AI',
    summary: 'Aturan peran AI: Menyapa, edukasi, qualification, lalu handover ke human sales untuk harga.',
    content: `ATURAN UTAMA SYASA:
1. Peran SYASA adalah: Menerima → Memahami → Memberikan Informasi → Mengedukasi → Melakukan Kualifikasi (Produk, Qty, Desain, Bahan, Spek) → Merapikan Data → Meneruskan (Handover) ke Sales Human yang tepat.
2. SYASA BUKAN PENGGANTI SALES.
3. KETIKA CUSTOMER BERTANYA TENTANG HARGA, TOTAL BIAYA, DISKON, QUOTATION, ATAU NEGOSIASI:
   - AI DILARANG memberikan angka harga final yang mengikat atau membuat penawaran sendiri.
   - AI dengan sopan menjelaskan: "Untuk perhitungan harga terbaik dan penawaran resmi (quotation) yang paling hemat sesuai jumlah dan spek kakak, saya langsung sambungkan dengan Sales Specialist kami ya kak..."
   - AI mentrigger HANDOVER ENGINE.
4. AI bertugas memvalidasi kelengkapan 5 item kualifikasi:
   - Produk (e.g. Jersey, Jaket, Kemeja, Kaos)
   - Quantity (Jumlah pesanan / estimasi pcs)
   - Desain (Sudah ada file / butuh dibantu desainkan)
   - Bahan (Pilihan kain yang diinginkan / rekomendasi)
   - Spesifikasi (Model kerah, lengan, jenis sablon/bordir, deadline bila ada)
5. Bila customer belum tahu bahan/desain, AI membantu mengedukasi pilihan terbaik tanpa membebani customer.`,
    tags: ['sop', 'aturan', 'boundary', 'handover', 'qualification', 'sales'],
  }
];

export const INITIAL_SALES_AGENTS: SalesAgent[] = [
  {
    id: 'sales-01',
    name: 'Tri Purwojianto',
    phone: '+62 889-7364-1682',
    email: 'tri.demo@syamanah.com',
    category: 'Jersey',
    dailyLeadQuota: 20,
    currentDailyLeads: 14,
    status: 'online',
    conversionRate: 38.5,
    totalDealsWon: 142,
    avgResponseMinutes: 3.2,
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'sales-02',
    name: 'Tri Purwojianto',
    phone: '+62 881-8210-415',
    email: 'tri.demo@syamanah.com',
    category: 'Jersey',
    dailyLeadQuota: 20,
    currentDailyLeads: 16,
    status: 'online',
    conversionRate: 41.2,
    totalDealsWon: 168,
    avgResponseMinutes: 2.8,
    avatarColor: 'bg-teal-600'
  },
  {
    id: 'sales-03',
    name: 'Dimas Setiawan',
    phone: '+62 812-8822-1003',
    email: 'dimas.sales@syamanah.com',
    category: 'Jersey',
    dailyLeadQuota: 20,
    currentDailyLeads: 12,
    status: 'online',
    conversionRate: 35.0,
    totalDealsWon: 119,
    avgResponseMinutes: 4.1,
    avatarColor: 'bg-cyan-600'
  },
  {
    id: 'sales-04',
    name: 'Siti Nurhaliza',
    phone: '+62 812-8822-1004',
    email: 'siti.sales@syamanah.com',
    category: 'Jersey',
    dailyLeadQuota: 20,
    currentDailyLeads: 18,
    status: 'busy',
    conversionRate: 44.0,
    totalDealsWon: 195,
    avgResponseMinutes: 2.5,
    avatarColor: 'bg-blue-600'
  },
  {
    id: 'sales-05',
    name: 'Bayu Saputra',
    phone: '+62 812-8822-1005',
    email: 'bayu.sales@syamanah.com',
    category: 'Jersey',
    dailyLeadQuota: 20,
    currentDailyLeads: 9,
    status: 'online',
    conversionRate: 32.8,
    totalDealsWon: 98,
    avgResponseMinutes: 3.9,
    avatarColor: 'bg-indigo-600'
  },
  {
    id: 'sales-06',
    name: 'Fajar Nugroho',
    phone: '+62 812-8822-1006',
    email: 'fajar.sales@syamanah.com',
    category: 'Jaket',
    dailyLeadQuota: 20,
    currentDailyLeads: 15,
    status: 'online',
    conversionRate: 36.4,
    totalDealsWon: 133,
    avgResponseMinutes: 3.5,
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'sales-07',
    name: 'Dewi Lestari',
    phone: '+62 812-8822-1007',
    email: 'dewi.sales@syamanah.com',
    category: 'Jaket',
    dailyLeadQuota: 20,
    currentDailyLeads: 17,
    status: 'online',
    conversionRate: 39.8,
    totalDealsWon: 154,
    avgResponseMinutes: 2.9,
    avatarColor: 'bg-orange-600'
  },
  {
    id: 'sales-08',
    name: 'Hendra Gunawan',
    phone: '+62 812-8822-1008',
    email: 'hendra.sales@syamanah.com',
    category: 'Jaket',
    dailyLeadQuota: 20,
    currentDailyLeads: 11,
    status: 'online',
    conversionRate: 34.1,
    totalDealsWon: 112,
    avgResponseMinutes: 4.0,
    avatarColor: 'bg-rose-600'
  },
  {
    id: 'sales-09',
    name: 'Putri Ayu',
    phone: '+62 812-8822-1009',
    email: 'putri.sales@syamanah.com',
    category: 'Jaket',
    dailyLeadQuota: 20,
    currentDailyLeads: 13,
    status: 'online',
    conversionRate: 37.5,
    totalDealsWon: 128,
    avgResponseMinutes: 3.3,
    avatarColor: 'bg-pink-600'
  },
  {
    id: 'sales-10',
    name: 'Rizky Maulana',
    phone: '+62 812-8822-1010',
    email: 'rizky.sales@syamanah.com',
    category: 'Kemeja_PDH',
    dailyLeadQuota: 20,
    currentDailyLeads: 16,
    status: 'online',
    conversionRate: 42.1,
    totalDealsWon: 177,
    avgResponseMinutes: 2.7,
    avatarColor: 'bg-purple-600'
  },
  {
    id: 'sales-11',
    name: 'Tania Maharani',
    phone: '+62 812-8822-1011',
    email: 'tania.sales@syamanah.com',
    category: 'Kemeja_PDH',
    dailyLeadQuota: 20,
    currentDailyLeads: 14,
    status: 'online',
    conversionRate: 40.0,
    totalDealsWon: 161,
    avgResponseMinutes: 3.1,
    avatarColor: 'bg-violet-600'
  },
  {
    id: 'sales-12',
    name: 'Galih Firmansyah',
    phone: '+62 812-8822-1012',
    email: 'galih.sales@syamanah.com',
    category: 'Kemeja_PDH',
    dailyLeadQuota: 20,
    currentDailyLeads: 10,
    status: 'online',
    conversionRate: 33.9,
    totalDealsWon: 105,
    avgResponseMinutes: 4.2,
    avatarColor: 'bg-sky-600'
  },
  {
    id: 'sales-13',
    name: 'Nadia Safitri',
    phone: '+62 812-8822-1013',
    email: 'nadia.sales@syamanah.com',
    category: 'Kemeja_PDH',
    dailyLeadQuota: 20,
    currentDailyLeads: 19,
    status: 'busy',
    conversionRate: 43.6,
    totalDealsWon: 189,
    avgResponseMinutes: 2.4,
    avatarColor: 'bg-lime-600'
  },
  {
    id: 'sales-14',
    name: 'Agus Santoso',
    phone: '+62 812-8822-1014',
    email: 'agus.sales@syamanah.com',
    category: 'Kaos_Polo',
    dailyLeadQuota: 20,
    currentDailyLeads: 15,
    status: 'online',
    conversionRate: 36.8,
    totalDealsWon: 139,
    avgResponseMinutes: 3.4,
    avatarColor: 'bg-yellow-600'
  },
  {
    id: 'sales-15',
    name: 'Maya Indah',
    phone: '+62 812-8822-1015',
    email: 'maya.sales@syamanah.com',
    category: 'Kaos_Polo',
    dailyLeadQuota: 20,
    currentDailyLeads: 13,
    status: 'online',
    conversionRate: 38.0,
    totalDealsWon: 145,
    avgResponseMinutes: 3.0,
    avatarColor: 'bg-emerald-700'
  },
  {
    id: 'sales-16',
    name: 'Eko Prasetyo',
    phone: '+62 812-8822-1016',
    email: 'eko.sales@syamanah.com',
    category: 'Kaos_Polo',
    dailyLeadQuota: 20,
    currentDailyLeads: 8,
    status: 'online',
    conversionRate: 31.5,
    totalDealsWon: 89,
    avgResponseMinutes: 4.5,
    avatarColor: 'bg-teal-700'
  },
  {
    id: 'sales-17',
    name: 'Cindy Claudia',
    phone: '+62 812-8822-1017',
    email: 'cindy.sales@syamanah.com',
    category: 'Kaos_Polo',
    dailyLeadQuota: 20,
    currentDailyLeads: 17,
    status: 'online',
    conversionRate: 41.0,
    totalDealsWon: 172,
    avgResponseMinutes: 2.6,
    avatarColor: 'bg-cyan-700'
  },
  {
    id: 'sales-18',
    name: 'Wahyu Ramadhan',
    phone: '+62 812-8822-1018',
    email: 'wahyu.sales@syamanah.com',
    category: 'Rompi',
    dailyLeadQuota: 20,
    currentDailyLeads: 12,
    status: 'online',
    conversionRate: 35.7,
    totalDealsWon: 118,
    avgResponseMinutes: 3.8,
    avatarColor: 'bg-indigo-700'
  },
  {
    id: 'sales-19',
    name: 'Laras Wulandari',
    phone: '+62 812-8822-1019',
    email: 'laras.sales@syamanah.com',
    category: 'Rompi',
    dailyLeadQuota: 20,
    currentDailyLeads: 14,
    status: 'online',
    conversionRate: 37.2,
    totalDealsWon: 126,
    avgResponseMinutes: 3.2,
    avatarColor: 'bg-purple-700'
  },
  {
    id: 'sales-20',
    name: 'Doni Kurniawan',
    phone: '+62 812-8822-1020',
    email: 'doni.sales@syamanah.com',
    category: 'All_Rounder',
    dailyLeadQuota: 20,
    currentDailyLeads: 16,
    status: 'online',
    conversionRate: 40.5,
    totalDealsWon: 180,
    avgResponseMinutes: 2.9,
    avatarColor: 'bg-slate-700'
  },
  {
    id: 'sales-21',
    name: 'Vina Panduwinata',
    phone: '+62 812-8822-1021',
    email: 'vina.sales@syamanah.com',
    category: 'All_Rounder',
    dailyLeadQuota: 20,
    currentDailyLeads: 11,
    status: 'online',
    conversionRate: 36.0,
    totalDealsWon: 122,
    avgResponseMinutes: 3.6,
    avatarColor: 'bg-rose-700'
  },
  {
    id: 'sales-22',
    name: 'Farhan Alamsyah',
    phone: '+62 812-8822-1022',
    email: 'farhan.sales@syamanah.com',
    category: 'All_Rounder',
    dailyLeadQuota: 20,
    currentDailyLeads: 7,
    status: 'offline',
    conversionRate: 33.0,
    totalDealsWon: 94,
    avgResponseMinutes: 4.8,
    avatarColor: 'bg-zinc-700'
  }
];

export const INITIAL_ROUTING_RULES: RoutingRule[] = [
  {
    id: 'rule-jersey',
    name: 'Rute Otomatis Jersey & Apparel Olahraga',
    productKeyword: 'jersey|futsal|badminton|sepeda|esport|sepakbola',
    assignedCategory: 'Jersey',
    maxDailyLeadsPerSales: 20,
    routingMode: 'round_robin',
    enabled: true
  },
  {
    id: 'rule-jaket',
    name: 'Rute Otomatis Jaket & Outerwear',
    productKeyword: 'jaket|varsity|bomber|coach|windbreaker|hoodie|zipper',
    assignedCategory: 'Jaket',
    maxDailyLeadsPerSales: 20,
    routingMode: 'lowest_workload',
    enabled: true
  },
  {
    id: 'rule-pdh',
    name: 'Rute Otomatis Seragam PDH, PDL & Kemeja Kantor',
    productKeyword: 'kemeja|pdh|pdl|korsa|seragam|drill|kantor',
    assignedCategory: 'Kemeja_PDH',
    maxDailyLeadsPerSales: 20,
    routingMode: 'highest_conversion',
    enabled: true
  },
  {
    id: 'rule-kaos',
    name: 'Rute Otomatis Kaos Combed & Polo Shirt',
    productKeyword: 'kaos|polo|tshirt|wangki|lacoste|combed',
    assignedCategory: 'Kaos_Polo',
    maxDailyLeadsPerSales: 20,
    routingMode: 'round_robin',
    enabled: true
  },
  {
    id: 'rule-rompi',
    name: 'Rute Otomatis Rompi Safety K3 & Tactical',
    productKeyword: 'rompi|vest|safety|k3|tactical|scotlight',
    assignedCategory: 'Rompi',
    maxDailyLeadsPerSales: 20,
    routingMode: 'lowest_workload',
    enabled: true
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'SYASA-00001',
    customerName: 'Budi Wicaksono',
    customerPhone: '+62 813-2940-1122',
    channelNumber: '+62 821-4455-6677 (WA Center 1 - Meta Ads Jersey)',
    metaAdSource: {
      campaignName: 'ID_Meta_Jersey_Futsal_Q3_Broad',
      adCreative: 'Video_Bikin_Jersey_Anti_Luntur_10Hari',
      sourcePlatform: 'Meta Ads'
    },
    product: 'Jersey Futsal Full Sublim',
    quantity: 30,
    designStatus: 'Sudah ada sketsa coreldraw',
    fabric: 'Dryfit Milano 180gsm',
    specs: 'Lengan pendek, kerah V-neck rajut, sablon nomor punggung & nama pemain',
    deadline: '2026-10-15',
    estimatedBudget: 'Rp 3.000.000 - Rp 4.500.000',
    status: 'HANDOVER',
    assignedSalesId: 'sales-01',
    assignedSalesName: 'Tri Purwojianto',
    assignedSalesPhone: '+62 889-7364-1682',
    qualificationScore: 100,
    isHandover: true,
    handoverReason: 'Customer menanyakan estimasi total harga dan potongan diskon untuk 30 pcs.',
    handoverAt: '2026-09-25 10:14 WIB',
    aiSummary: 'Customer Budi butuh 30 pcs jersey futsal untuk turnamen internal kantor. Bahan yang dipilih Dryfit Milano dengan kerah V-neck. File desain sketsa sudah siap di Corel. Customer minta penawaran harga total dan diskon quantity.',
    createdAt: '2026-09-25 09:45 WIB',
    updatedAt: '2026-09-25 10:14 WIB',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Budi Wicaksono',
        text: 'Halo min, Syamanah bisa bikin jersey custom untuk tim futsal kantor?',
        timestamp: '09:45 WIB'
      },
      {
        id: 'msg-2',
        sender: 'ai',
        senderName: 'SYASA AI',
        text: 'Halo Kak Budi! Salam hangat dari Syamanah Garment (CV. Generasi Sugih Sejahtera). Tentu bisa banget kak! Kami spesialis memproduksi jersey custom olahraga menggunakan teknologi cetak Full Sublimation Epson original anti-luntur. Boleh tahu rencananya butuh sekitar berapa pcs dan sudah ada gambaran model desainnya kak?',
        timestamp: '09:46 WIB',
        meta: { intent: 'greeting_and_qualify_qty_design' }
      },
      {
        id: 'msg-3',
        sender: 'customer',
        senderName: 'Budi Wicaksono',
        text: 'Rencana buat 30 pcs kak, desainnya kita udah ada file sketsa di CorelDraw. Rekomendasi kain yang adem buat futsal apa ya?',
        timestamp: '09:49 WIB'
      },
      {
        id: 'msg-4',
        sender: 'ai',
        senderName: 'SYASA AI',
        text: 'Mantap kak, 30 pcs pas banget untuk kuota turnamen! Untuk futsal indoor/outdoor, bahan paling favorit dan kami rekomendasikan adalah Dryfit Milano (gramasi 175-180gsm). Karakter kainnya menyerap keringat sangat cepat, tekstur zig-zag halus, ringan dan tidak lengket saat lari. Pilihan kerahnya kakak lebih suka model kerah O-neck biasa, V-neck, atau berkerah kancing?',
        timestamp: '09:50 WIB',
        meta: {
          intent: 'fabric_education_and_qualify_specs',
          extractedFields: { quantity: 30, fabric: 'Dryfit Milano', designStatus: 'Sudah ada sketsa coreldraw' }
        }
      },
      {
        id: 'msg-5',
        sender: 'customer',
        senderName: 'Budi Wicaksono',
        text: 'Keren tuh Dryfit Milano, kita mau yang kerah V-neck. Nah kalau total 30 pcs sekalian nama pemain + nomor, total biayanya kena berapa ya kak? Ada diskon ga?',
        timestamp: '10:14 WIB'
      },
      {
        id: 'msg-6',
        sender: 'ai',
        senderName: 'SYASA AI',
        text: 'Siap Kak Budi, speknya sudah tercatat rapi: 30 pcs Jersey Futsal, bahan Dryfit Milano, kerah V-neck dengan full nama & nomor pemain. Untuk hitungan harga spesial partai 30 pcs serta rincian quotation resmi dan draft mock up, sekarang langsung saya sambungkan ke Mas Tri Purwojianto (Sales Specialist Jersey kami) yang akan kirimkan rincian penawaran terbaiknya ya kak!',
        timestamp: '10:14 WIB',
        meta: {
          isHandoverTrigger: true,
          reason: 'Customer asking for price calculation and quotation discount'
        }
      }
    ],
    digid3DConfig: {
      modelType: 'jersey',
      primaryColor: '#059669',
      secondaryColor: '#f59e0b',
      pattern: 'geometric_hex',
      teamName: 'GARUDA FC',
      collarType: 'v_neck'
    },
    erpNextSync: {
      synced: true,
      docType: 'Opportunity',
      erpLeadId: 'CRM-OPP-2026-0041',
      lastSyncedAt: '2026-09-25 10:15 WIB',
      status: 'SYNCED'
    }
  },
  {
    id: 'SYASA-00002',
    customerName: 'Sdr. Hendra Kencana',
    customerPhone: '+62 857-1922-3844',
    channelNumber: '+62 821-4455-6678 (WA Center 2 - Meta Ads Jaket)',
    metaAdSource: {
      campaignName: 'ID_Meta_Jaket_Varsity_Campus_Hype',
      adCreative: 'Carousel_Varsity_Bordir_Laken_Unpad',
      sourcePlatform: 'Instagram'
    },
    product: 'Jaket Varsity Angkatan Kampus',
    quantity: 65,
    designStatus: 'Minta dibantu tim desain Syamanah',
    fabric: 'Badan Cotton Fleece 300gsm + Lengan Oscar Kalep',
    specs: 'Bordir laken handuk dada kiri, bordir punggung nama angkatan 2026, kancing snap',
    deadline: '2026-11-01',
    status: 'SALES_HANDLING',
    assignedSalesId: 'sales-07',
    assignedSalesName: 'Dewi Lestari',
    assignedSalesPhone: '+62 812-8822-1007',
    qualificationScore: 100,
    isHandover: true,
    handoverReason: 'Handover berhasil diteruskan. Sales Dewi sedang negosiasi draft surat penawaran.',
    handoverAt: '2026-09-25 08:30 WIB',
    aiSummary: 'Pesanan jaket varsity angkatan kampus 65 pcs. Butuh bantuan desainer Syamanah untuk visualisasi font bordir laken. Handover ke Sales Dewi untuk penerbitan SPK & negosiasi termin DP.',
    createdAt: '2026-09-25 08:12 WIB',
    updatedAt: '2026-09-25 08:30 WIB',
    messages: [
      {
        id: 'msg-21',
        sender: 'customer',
        senderName: 'Sdr. Hendra Kencana',
        text: 'Pagi kak, lihat di IG Syamanah bikin jaket varsity untuk kampus. Kalau mau pesan 65 pcs bisa bantu bikinin desainnya sekalian?',
        timestamp: '08:12 WIB'
      },
      {
        id: 'msg-22',
        sender: 'ai',
        senderName: 'SYASA AI',
        text: 'Selamat pagi Kak Hendra! Tentu bisa sekali. Di Syamanah Garment, setiap pemesanan di atas MOQ kami berikan fasilitas Free Desain & Mockup 2D/3D oleh tim desainer profesional kami sampai disetujui. Untuk bahan jaketnya, biasanya kampus banyak memilih kombinasi Badan Fleece Katun 300gsm tebal lembut dengan lengan Kulit Oscar impor, atau kakak punya preferensi kain lain?',
        timestamp: '08:13 WIB'
      },
      {
        id: 'msg-23',
        sender: 'customer',
        senderName: 'Sdr. Hendra Kencana',
        text: 'Iya betul kombinasi itu kak. Kena berapa ya per pcs-nya untuk 65 orang? Terus bisa kirim ke Malang kan?',
        timestamp: '08:29 WIB'
      },
      {
        id: 'msg-24',
        sender: 'ai',
        senderName: 'SYASA AI',
        text: 'Pengiriman ke Malang aman banget kak, kami rutin kirim pakai kargo door-to-door dengan garansi sampai aman. Mengenai rincian penawaran harga per pcs dan diskon kuota 65 jaket, langsung saya hubungkan ke Mbak Dewi Lestari (Sales Spesialis Jaket) ya kak!',
        timestamp: '08:30 WIB'
      }
    ],
    digid3DConfig: {
      modelType: 'jaket',
      primaryColor: '#1e293b',
      secondaryColor: '#f1f5f9',
      pattern: 'varsity_classic',
      teamName: 'TEKNIK 2026',
      collarType: 'rib_stripe'
    },
    erpNextSync: {
      synced: true,
      docType: 'Quotation',
      erpLeadId: 'SAL-QTN-2026-0089',
      lastSyncedAt: '2026-09-25 08:35 WIB',
      status: 'SYNCED'
    }
  },
  {
    id: 'SYASA-00003',
    customerName: 'Ibu Ratna Kumalasari',
    customerPhone: '+62 822-7711-9003',
    channelNumber: '+62 821-4455-6679 (WA Center 3 - Seragam B2B)',
    metaAdSource: {
      campaignName: 'ID_Meta_PDH_Instansi_Corporate_Q3',
      adCreative: 'Feed_Seragam_Bordir_Presisi_PT_BUMN',
      sourcePlatform: 'Meta Ads'
    },
    product: 'Kemeja PDH Seragam Kantor',
    quantity: 45,
    designStatus: 'Ada panduan brand book perusahaan',
    fabric: 'American Drill 1919 Grade A',
    specs: 'Lengan panjang ada skoder gulungan, saku tutup berkancing, 2 titik bordir komputer (dada kiri & punggung)',
    deadline: '2026-10-25',
    status: 'QUALIFYING',
    assignedSalesId: 'sales-10',
    assignedSalesName: 'Rizky Maulana',
    assignedSalesPhone: '+62 812-8822-1010',
    qualificationScore: 80,
    isHandover: false,
    aiSummary: 'Ibu Ratna dari PT Mulia Abadi sedang memvalidasi spesifikasi kemeja PDH 45 pcs bahan American Drill. Masih menunggu konfirmasi apakah perlu tambahan kancing gravir nama perusahaan.',
    createdAt: '2026-09-25 10:20 WIB',
    updatedAt: '2026-09-25 10:28 WIB',
    messages: [
      {
        id: 'msg-31',
        sender: 'customer',
        senderName: 'Ibu Ratna Kumalasari',
        text: 'Selamat siang Syamanah Garment. Perusahaan kami butuh pengadaan seragam kemeja kantor sekitar 45 pcs. Bahannya yang kokoh dan tidak gerah apa ya?',
        timestamp: '10:20 WIB'
      },
      {
        id: 'msg-32',
        sender: 'ai',
        senderName: 'SYASA AI',
        text: 'Selamat siang Ibu Ratna! Terima kasih telah menghubungi Syamanah Garment (CV. Generasi Sugih Sejahtera). Kami telah dipercaya ratusan instansi dan perusahaan untuk pengadaan seragam PDH/PDL. Untuk kemeja kantor yang kokoh namun tetap sejuk, kami sangat merekomendasikan American Drill 1919 Original atau Japan Drill Nagata. Keduanya memiliki tenunan kuat dan tidak mudah kusut saat dipakai seharian. Rencananya kemeja ini model lengan pendek atau lengan panjang Bu Ratna?',
        timestamp: '10:22 WIB'
      },
      {
        id: 'msg-33',
        sender: 'customer',
        senderName: 'Ibu Ratna Kumalasari',
        text: 'Model lengan panjang ya, ada tali kancing buat gulung lengan. Bahannya American Drill saja. Ada bordir logo di dada dan nama PT di punggung.',
        timestamp: '10:28 WIB'
      }
    ]
  },
  {
    id: 'SYASA-00004',
    customerName: 'Rahmat Hidayat',
    customerPhone: '+62 818-0922-4551',
    channelNumber: '+62 821-4455-6677 (WA Center 1 - Meta Ads Jersey)',
    metaAdSource: {
      campaignName: 'ID_Meta_Jersey_Futsal_Q3_Broad',
      adCreative: 'Video_Bikin_Jersey_Anti_Luntur_10Hari',
      sourcePlatform: 'Meta Ads'
    },
    product: 'Jersey Badminton Komunitas',
    quantity: 'Belum pasti (~15 pcs)',
    designStatus: 'Belum ada',
    fabric: 'Belum ditentukan',
    specs: 'Lengan pendek, motif gradasi biru',
    status: 'AI_HANDLING',
    assignedSalesId: null,
    assignedSalesName: null,
    assignedSalesPhone: null,
    qualificationScore: 40,
    isHandover: false,
    aiSummary: 'Customer baru menanyakan minimal order untuk jersey badminton dan menanyakan contoh foto portofolio.',
    createdAt: '2026-09-25 10:35 WIB',
    updatedAt: '2026-09-25 10:36 WIB',
    messages: [
      {
        id: 'msg-41',
        sender: 'customer',
        senderName: 'Rahmat Hidayat',
        text: 'Min, jersey badminton minimal order berapa pcs ya? Ada contoh hasil jadinya?',
        timestamp: '10:35 WIB'
      },
      {
        id: 'msg-42',
        sender: 'ai',
        senderName: 'SYASA AI',
        text: 'Halo Kak Rahmat! Minimal order jersey badminton di Syamanah Garment sangat terjangkau, yaitu hanya 12 pcs saja kak, dan ukuran per anggota bebas campur (S, M, L, XL, XXL). Hasil cetaknya full printing sublimasi Epson original sehingga gradasi warna tajam dan tidak luntur. Mau buat untuk klub atau turnamen kak? Kami bisa kirimkan katalog portofolio jersey badminton kami!',
        timestamp: '10:36 WIB'
      }
    ]
  },
  {
    id: 'SYASA-00005',
    customerName: 'Yosep Pratama (CV Berkah Teknik)',
    customerPhone: '+62 812-4411-9988',
    channelNumber: '+62 821-4455-6680 (WA Center 4 - Lapangan & Rompi)',
    metaAdSource: {
      campaignName: 'ID_Meta_Rompi_Safety_K3',
      adCreative: 'Rompi_Scotlight_Proyek_Tahan_Air',
      sourcePlatform: 'Meta Ads'
    },
    product: 'Rompi Safety K3 Proyek Tambang',
    quantity: 120,
    designStatus: 'Logo vector sudah ada',
    fabric: 'Ripstop Water Repellent + Scotlight 3M',
    specs: 'Warna oranye terang, 4 kantong saku, scotlight pita 5cm standar K3, logo bordir dada',
    deadline: '2026-10-10',
    status: 'CLOSED',
    assignedSalesId: 'sales-18',
    assignedSalesName: 'Wahyu Ramadhan',
    assignedSalesPhone: '+62 812-8822-1018',
    qualificationScore: 100,
    isHandover: true,
    handoverReason: 'Deal closing won! PO dan invoice DP 50% sudah diterbitkan.',
    handoverAt: '2026-09-24 14:00 WIB',
    aiSummary: 'Lead berhasil closing (Closed Won) order 120 pcs Rompi Safety Proyek K3. Produksi sedang berjalan di workshop pusat Syamanah Garment Bandung.',
    createdAt: '2026-09-24 11:20 WIB',
    updatedAt: '2026-09-24 16:45 WIB',
    messages: [
      {
        id: 'msg-51',
        sender: 'customer',
        senderName: 'Yosep Pratama',
        text: 'Butuh rompi safety K3 scotlight 3M 120 pcs untuk proyek tambang, apakah bisa selesai 2 minggu?',
        timestamp: '11:20 WIB'
      },
      {
        id: 'msg-52',
        sender: 'ai',
        senderName: 'SYASA AI',
        text: 'Halo Pak Yosep! Bisa sekali Pak, dengan kapasitas 50.000 pcs/bulan, Syamanah Garment siap mengakomodasi order 120 pcs rompi safety dengan pita reflektor 3M original. Saya segera alihkan ke Sales Specialist Rompi Lapangan kami untuk approval sample kilat dan jadwal produksi.',
        timestamp: '11:22 WIB'
      }
    ],
    erpNextSync: {
      synced: true,
      docType: 'Quotation',
      erpLeadId: 'SAL-ORD-2026-0312',
      lastSyncedAt: '2026-09-24 16:50 WIB',
      status: 'SYNCED'
    }
  }
];
