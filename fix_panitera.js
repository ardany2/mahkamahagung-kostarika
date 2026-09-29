/**
 * Script untuk memperbaiki terjemahan istilah jabatan peradilan
 * sesuai konteks hukum Indonesia (KBBI + UU Kekuasaan Kehakiman RI):
 *
 * PEMETAAN ISTILAH SPANYOL → INDONESIA:
 * ══════════════════════════════════════════════════════════════
 * 
 * 1. SEKRETARIS / PANITERA (Secretario/a)
 *    ─────────────────────────────────────
 *    - "Sekretaris Jenderal Pengadilan/Mahkamah" → tetap "Sekretaris Jenderal Mahkamah Agung"
 *      (Secretario General de la Corte = jabatan setingkat Sekjen, bukan Panitera)
 *    - "sekretaris Dinas/Kantor" → "Panitera" (secretario del Despacho = clerk of court)
 *    - "sekretaris kantor" → "Panitera" (dalam konteks kantor peradilan)
 *    - "sekretaris Inspeksi" → "Panitera Inspeksi"
 *    - "sekretaris Dewan" → "Sekretaris Dewan" (tetap, karena bukan jabatan panitera)
 *    - "Sekretaris Pengadilan" (Secretarios de la Corte) → "Panitera Mahkamah"
 *    - "Sekretaris ... Kamar" (Secretarios de las Salas) → "Panitera Kamar"
 *    - "Sekretaris Kamar Mahkamah Konstitusi" → "Panitera Kamar Mahkamah Konstitusi"
 *
 * 2. KEPANITERAAN (Secretaría)
 *    ──────────────────────────
 *    - "Sekretariat Dewan" → "Kepaniteraan Dewan"
 *    - "Sekretariat Mahkamah Agung" → "Kepaniteraan Mahkamah Agung"
 *    - "Sekretariat" (konteks peradilan) → "Kepaniteraan"
 *
 * 3. APARATUR PERADILAN (Servidor judicial)
 *    ──────────────────────────────────────
 *    - "server" / "Server" → "aparatur" / "Aparatur" (dalam konteks servidor judicial)
 *    - "pelayan" → "aparatur" (dalam konteks servidor)
 *
 * 4. JURUSITA (Notificador) — sudah benar di beberapa tempat
 *    ─────────────────────
 *    - "pemberitahu" → "jurusita" (dalam konteks pemberitahuan putusan pengadilan)
 *
 * 5. PERBAIKAN ISTILAH UMUM LAINNYA
 *    ───────────────────────────────
 *    - "Cabang Yudisial" → "Kekuasaan Kehakiman"
 *    - "Kekuasaan Peradilan" → "Kekuasaan Kehakiman"  
 *    - "pengadilan perguruan tinggi" → "pengadilan tinggi" (tribunales colegiados/superiores)
 *    - "Dinas" (Despacho) → "Kantor" (ketika merujuk kantor pengadilan)
 *    - "Sidang Pleno/Paripurna" → "Rapat Pleno" (Corte Plena)
 *    - "Hakim" (Magistrado) → "Hakim Agung" (untuk Magistrado MA)
 *    - "rezim disipliner" → "tata tertib disiplin"
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, 'leyorganicapoderjudicial_translated.json');

console.log('Membaca file JSON...');
const raw = fs.readFileSync(INPUT_FILE, 'utf-8');
const data = JSON.parse(raw);

// Daftar penggantian — urutan penting (spesifik duluan)
const replacements = [
  // ═══════════════════════════════════════════════════
  // 1. SEKRETARIAT → KEPANITERAAN (konteks peradilan)
  // ═══════════════════════════════════════════════════
  { from: /Sekretariat Mahkamah Agung/g, to: 'Kepaniteraan Mahkamah Agung' },
  { from: /Sekretariat Dewan/g, to: 'Kepaniteraan Dewan' },
  { from: /Sekretariat dan Manajemen Eksekutif/g, to: 'Kepaniteraan dan Direktorat Eksekutif' },
  // Pola "melalui Sekretariat" (melalui Secretaría)
  { from: /melalui Sekretariat/g, to: 'melalui Kepaniteraan' },
  // "Sekretariat" berdiri sendiri (merujuk organ Secretaría)
  { from: /pekerjaan Sekretariat/g, to: 'pekerjaan Kepaniteraan' },
  { from: /dengan Sekretariat/g, to: 'dengan Kepaniteraan' },
  { from: /ke Sekretariat/g, to: 'ke Kepaniteraan' },
  { from: /Sekretariat Pengadilan/g, to: 'Kepaniteraan Pengadilan' },

  // ═══════════════════════════════════════════════════
  // 2. SEKRETARIS → PANITERA (konteks peradilan)
  // ═══════════════════════════════════════════════════
  
  // 2a. Sekretaris Jenderal — TETAP sebagai Sekretaris Jenderal (jabatan setingkat Sekjen)
  // (tidak perlu diganti)

  // 2b. "Sekretaris Pengadilan" → "Panitera Mahkamah"
  { from: /Sekretaris Pengadilan(?! Tinggi)/g, to: 'Panitera Mahkamah' },

  // 2c. "sekretaris Dinas" / "sekretaris kantor" → "Panitera"
  { from: /sekretaris Dinas/g, to: 'Panitera' },
  { from: /sekretaris kantor/g, to: 'panitera kantor' },

  // 2d. "Sekretaris Kamar Mahkamah Konstitusi" → "Panitera Kamar Mahkamah Konstitusi"
  { from: /Sekretaris Kamar Mahkamah Konstitusi/g, to: 'Panitera Kamar Mahkamah Konstitusi' },
  { from: /Sekretaris Kamar/g, to: 'Panitera Kamar' },

  // 2e. "sekretaris Inspeksi" → "Panitera Inspeksi"
  { from: /sekretaris Inspeksi/g, to: 'Panitera Inspeksi' },
  { from: /sekretaris inspeksi/g, to: 'panitera inspeksi' },

  // 2f. "Sekretaris ... Kamar" (Secretarios de las Salas)
  // → "Panitera Kamar"
  { from: /Sekretaris(.{0,20}?)Kamar harus menjadi Sekretaris Pengadilan/g, to: 'Panitera$1Kamar harus merupakan' },

  // 2g. "sekretaris" konteks kantor peradilan yang dikunjungi
  { from: /sekretaris kantor yang dikunjunginya/g, to: 'panitera kantor yang dikunjunginya' },
  { from: /sekretaris dari kantor/g, to: 'panitera dari kantor' },

  // 2h. "surat keterangan yang diterbitkan oleh sekretaris" → oleh Panitera
  { from: /sekretaris Dinas yang mengenakan/g, to: 'Panitera kantor yang menjatuhkan' },

  // 2i. Pola generik "sekretaris" di konteks kantor masing-masing (inspeksi)
  { from: /kepala dan sekretaris kantor masing-masing/g, to: 'kepala dan panitera kantor masing-masing' },
  { from: /kepala dan sekretaris dari kantor/g, to: 'kepala dan panitera dari kantor' },

  // ═══════════════════════════════════════════════════
  // 3. SERVER / PELAYAN → APARATUR (servidor judicial)
  // ═══════════════════════════════════════════════════

  // "server" (kata berdiri sendiri, bukan bagian kata lain)
  { from: /\bserver\b/gi, to: 'aparatur' },
  // "\"server\"" → "\"aparatur\""
  { from: /"server"/g, to: '"aparatur"' },

  // "para pegawai" yang merujuk servidores judiciales — tidak diganti (sudah cukup pas)
  // "pelayan" dalam konteks servidor
  { from: /Pelayan yang berjasa/g, to: 'Aparatur yang berjasa' },
  { from: /pelayan yang/g, to: 'aparatur yang' },

  // ═══════════════════════════════════════════════════
  // 4. PERBAIKAN ISTILAH PERADILAN LAINNYA
  // ═══════════════════════════════════════════════════

  // Cabang Yudisial → Kekuasaan Kehakiman
  { from: /Cabang Yudisial/g, to: 'Kekuasaan Kehakiman' },
  { from: /Cabang Eksekutif/g, to: 'Kekuasaan Eksekutif' },

  // Kekuasaan Peradilan (jika masih ada)
  { from: /Kekuasaan Peradilan/g, to: 'Kekuasaan Kehakiman' },

  // pengadilan perguruan tinggi → majelis hakim / pengadilan kolegial
  { from: /pengadilan perguruan tinggi/g, to: 'majelis hakim' },
  { from: /Pengadilan perguruan tinggi/g, to: 'Majelis hakim' },

  // rezim disipliner → tata tertib disiplin
  { from: /rezim disipliner/g, to: 'tata tertib disiplin' },
  { from: /rezim disiplin/g, to: 'tata tertib disiplin' },

  // Badan Penyidik Peradilan → Organisasi Penyidikan Kehakiman
  { from: /Badan Penyidik Peradilan/g, to: 'Organisasi Penyidikan Kehakiman' },
  { from: /Organisasi Penelitian Yudikatif/g, to: 'Organisasi Penyidikan Kehakiman' },
  { from: /Organisasi Penelitian Peradilan/g, to: 'Organisasi Penyidikan Kehakiman' },
  { from: /Organisasi Penelitian Yudisial/g, to: 'Organisasi Penyidikan Kehakiman' },
  { from: /Organisasi Investigasi Yudisial/g, to: 'Organisasi Penyidikan Kehakiman' },

  // Sidang Pleno → Rapat Pleno / Mahkamah Pleno
  { from: /Sidang Pleno/g, to: 'Rapat Pleno' },
  { from: /Sidang Paripurna/g, to: 'Rapat Pleno' },
  { from: /Mahkamah Paripurna/g, to: 'Mahkamah Pleno' },

  // Dewan Legislatif / Dewan Perwakilan Rakyat → Majelis Legislatif
  { from: /Dewan Legislatif/g, to: 'Majelis Legislatif' },
  { from: /Dewan Perwakilan Rakyat/g, to: 'Majelis Legislatif' },

  // La Gaceta → Lembaran Negara La Gaceta (opsional, hanya di konteks)
  { from: /La Gazette/g, to: 'La Gaceta' },

  // "Buletin Yudisial" → "Buletin Kehakiman"
  { from: /Buletin Yudisial/g, to: 'Buletin Kehakiman' },
  { from: /Buletin Peradilan/g, to: 'Buletin Kehakiman' },

  // "Berita Acara Peradilan" → "Buletin Kehakiman" (Boletín Judicial)
  { from: /Berita Acara Peradilan/g, to: 'Buletin Kehakiman' },

  // "Jaksa Umum" / "Jaksa Agung" → "Jaksa Agung Republik"
  { from: /Jaksa Umum/g, to: 'Jaksa Agung' },

  // Dewan Tinggi Kehakiman (sudah benar — Consejo Superior del Poder Judicial)
  // Dewan Tinggi Kekuasaan Kehakiman → Dewan Tinggi Kehakiman (singkat)
  { from: /Dewan Tinggi Kekuasaan Kehakiman/g, to: 'Dewan Tinggi Kehakiman' },
  { from: /Dewan Tinggi Kekuasaan Peradilan/g, to: 'Dewan Tinggi Kehakiman' },
  { from: /Dewan Pemimpin Kekuasaan Kehakiman/g, to: 'Dewan Tinggi Kehakiman' },
  { from: /Dewan Pemimpin Kehakiman/g, to: 'Dewan Tinggi Kehakiman' },
  { from: /Dewan Atasan Kehakiman/g, to: 'Dewan Tinggi Kehakiman' },

  // "Dewan Yudisial" → "Dewan Kehakiman"
  { from: /Dewan Yudisial/g, to: 'Dewan Kehakiman' },

  // "Ruang Lingkup" (Alcance) → "Suplemen"
  { from: /Ruang Lingkup No\./g, to: 'Suplemen No.' },
  { from: /Ruang Lingkup no\./g, to: 'Suplemen no.' },

  // "Berita Resmi La Gaceta" → "Lembaran Negara La Gaceta"
  { from: /Berita Resmi La Gaceta/g, to: 'Lembaran Negara La Gaceta' },
  { from: /Berita Resmi/g, to: 'Lembaran Negara' },

  // Perbaikan: "Lembaran Negara" yang sudah digunakan
  { from: /Lembaran Negara Nomor/g, to: 'La Gaceta Nomor' },

  // "Kode Perburuhan" → "Undang-Undang Ketenagakerjaan"
  { from: /Kode Perburuhan/g, to: 'Undang-Undang Ketenagakerjaan' },

  // "Statuta Pelayanan Kehakiman" → "Statuta Kepegawaian Kehakiman"
  { from: /Statuta Pelayanan Kehakiman/g, to: 'Statuta Kepegawaian Kehakiman' },

  // "Pembela Umum" → "Pembela Publik" (Defensa Pública)
  { from: /Pembela Umum/g, to: 'Lembaga Bantuan Hukum' },

  // Perbaikan "Badan Pertahanan Umum" → "Lembaga Bantuan Hukum" (Defensa Pública)
  { from: /Badan Pertahanan Umum/g, to: 'Lembaga Bantuan Hukum' },
  { from: /Bidang Pertahanan Umum/g, to: 'Lembaga Bantuan Hukum' },

  // "pembela umum" (huruf kecil)
  { from: /pembela umum/g, to: 'pembela publik' },

  // Perbaikan nama bab: "STAF BANTU" → "APARATUR PENUNJANG"
  { from: /STAF BANTU/g, to: 'APARATUR PENUNJANG' },

  // "pegawai junior" → "aparatur bawahan" / "staf bawahan"
  { from: /pegawai junior/g, to: 'aparatur bawahan' },
  { from: /personel bawahan/g, to: 'aparatur bawahan' },

  // "Kejaksaan Agung" sudah benar (Procuraduría General)
  // "Kementerian Umum" → "Kejaksaan" (Ministerio Público)
  { from: /Kementerian Umum/g, to: 'Kejaksaan' },

  // pemberitahu → jurusita (dalam konteks notificador)
  { from: /pemberitahu/g, to: 'jurusita' },
];

let changeCount = 0;
let changeDetails = {};

/**
 * Melakukan penggantian pada string dan tracking perubahan
 */
function fixTranslation(text) {
  if (typeof text !== 'string') return text;
  
  let result = text;
  for (const { from, to } of replacements) {
    const before = result;
    result = result.replace(from, to);
    if (before !== result) {
      const key = `${from} → ${to}`;
      changeDetails[key] = (changeDetails[key] || 0) + 1;
      changeCount++;
    }
  }
  return result;
}

/**
 * Rekursif: proses semua field yang berakhiran _id
 */
function processNode(node) {
  if (Array.isArray(node)) {
    node.forEach(item => processNode(item));
  } else if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (key.endsWith('_id') && typeof node[key] === 'string') {
        node[key] = fixTranslation(node[key]);
      } else if (typeof node[key] === 'object') {
        processNode(node[key]);
      }
    }
  }
}

console.log('Memproses perbaikan terjemahan istilah peradilan...\n');
processNode(data);

console.log('=== RINGKASAN PERUBAHAN ===');
console.log(`Total penggantian: ${changeCount}\n`);

// Urutkan berdasarkan jumlah perubahan (terbanyak dulu)
const sorted = Object.entries(changeDetails).sort((a, b) => b[1] - a[1]);
for (const [pattern, count] of sorted) {
  console.log(`  [${count}x] ${pattern}`);
}

// Simpan
console.log('\nMenyimpan file...');
fs.writeFileSync(INPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
console.log('Selesai! File telah diperbarui.');
