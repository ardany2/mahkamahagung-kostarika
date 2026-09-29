/**
 * Script untuk memperbaiki terjemahan "Organik" → "Organisasi" 
 * pada semua field _id (terjemahan Indonesia) di file JSON.
 * 
 * "Ley Orgánica" dalam konteks hukum Kosta Rika bermakna 
 * "Undang-Undang tentang Organisasi" (susunan, tata cara kerja),
 * bukan "organik" dalam arti harfiah KBBI.
 * 
 * Pemetaan terjemahan:
 * - "UNDANG-UNDANG ORGANIK KEKUASAAN KEHAKIMAN" → "UNDANG-UNDANG ORGANISASI KEKUASAAN KEHAKIMAN"
 * - "Undang-Undang Organik Kehakiman" → "Undang-Undang Organisasi Kekuasaan Kehakiman"
 * - "Undang-undang Organik Kehakiman" → "Undang-Undang Organisasi Kekuasaan Kehakiman"
 * - "Hukum Organik Kekuasaan Peradilan" → "Undang-Undang Organisasi Kekuasaan Kehakiman"
 * - "HUKUM ORGANIK KEKUASAAN PERADILAN" → "UNDANG-UNDANG ORGANISASI KEKUASAAN KEHAKIMAN"
 * - "Hukum Organik" (konteks UU lain) → "Undang-Undang Organisasi"
 * - "Undang-Undang Organik" (tanpa "Kehakiman") → "Undang-Undang Organisasi"
 * - "antarorganik" → "antarorganisasi"
 * - "transfer antarorganik" → "mutasi antarorganisasi"
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, 'leyorganicapoderjudicial_translated.json');
const OUTPUT_FILE = INPUT_FILE; // overwrite in place

console.log('Membaca file JSON...');
const raw = fs.readFileSync(INPUT_FILE, 'utf-8');
const data = JSON.parse(raw);

// Daftar penggantian — urutan penting (yang lebih spesifik duluan)
const replacements = [
  // === JUDUL UTAMA (huruf kapital semua) ===
  {
    from: /UNDANG-UNDANG ORGANIK KEKUASAAN KEHAKIMAN/g,
    to: 'UNDANG-UNDANG ORGANISASI KEKUASAAN KEHAKIMAN'
  },
  {
    from: /HUKUM ORGANIK KEKUASAAN PERADILAN/g,
    to: 'UNDANG-UNDANG ORGANISASI KEKUASAAN KEHAKIMAN'
  },
  {
    from: /HUKUM ORGANIK KEKUASAAN KEHAKIMAN/g,
    to: 'UNDANG-UNDANG ORGANISASI KEKUASAAN KEHAKIMAN'
  },

  // === Nama UU Kehakiman (campuran kapital) ===
  {
    from: /Undang-[Uu]ndang Organik Kekuasaan Kehakiman/g,
    to: 'Undang-Undang Organisasi Kekuasaan Kehakiman'
  },
  {
    from: /Undang-[Uu]ndang Organik Kehakiman/g,
    to: 'Undang-Undang Organisasi Kekuasaan Kehakiman'
  },
  {
    from: /Undang-[Uu]ndang Organik Kekuasaan Yudisial/g,
    to: 'Undang-Undang Organisasi Kekuasaan Kehakiman'
  },
  {
    from: /Undang-[Uu]ndang Organik Peradilan/g,
    to: 'Undang-Undang Organisasi Kekuasaan Kehakiman'
  },

  // === "Hukum Organik" (frasa yang salah) ===
  {
    from: /Hukum Organik Kekuasaan Peradilan/g,
    to: 'Undang-Undang Organisasi Kekuasaan Kehakiman'
  },
  {
    from: /Hukum Organik Kekuasaan Yudisial/g,
    to: 'Undang-Undang Organisasi Kekuasaan Kehakiman'
  },
  {
    from: /Hukum Organik Peradilan/g,
    to: 'Undang-Undang Organisasi Kekuasaan Kehakiman'
  },
  {
    from: /Hukum Organik Kehakiman/g,
    to: 'Undang-Undang Organisasi Kekuasaan Kehakiman'
  },
  // "Hukum Organik" yang merujuk ke UU lain (misal: Hukum Organik dari Asosiasi Pengacara)
  {
    from: /Hukum Organik dari /g,
    to: 'Undang-Undang Organisasi '
  },
  {
    from: /Hukum Organiknya/g,
    to: 'Undang-Undang Organisasinya'
  },
  {
    from: /Hukum Organik/g,
    to: 'Undang-Undang Organisasi'
  },

  // === Undang-Undang Organik (untuk UU lain, misalnya Notaris) ===
  {
    from: /Undang-[Uu]ndang Organik yang baru/g,
    to: 'Undang-Undang Organisasi yang baru'
  },
  {
    from: /Undang-[Uu]ndang Organik/g,
    to: 'Undang-Undang Organisasi'
  },

  // === Istilah "antarorganik" ===
  {
    from: /transfer antarorganik/gi,
    to: 'mutasi antarorganisasi'
  },
  {
    from: /antarorganik/gi,
    to: 'antarorganisasi'
  },

  // === Perbaikan tambahan: "Reformasinya" → "Perubahannya" ===
  {
    from: /dan Reformasinya/g,
    to: 'dan Perubahannya'
  },
];

let changeCount = 0;

/**
 * Melakukan penggantian pada string
 */
function fixTranslation(text) {
  if (typeof text !== 'string') return text;
  
  let result = text;
  for (const { from, to } of replacements) {
    const before = result;
    result = result.replace(from, to);
    if (before !== result) {
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

console.log('Memproses penggantian terjemahan...');
processNode(data);

console.log(`\nTotal penggantian: ${changeCount}`);

// Simpan
console.log('Menyimpan file...');
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
console.log('Selesai! File telah diperbarui.');
