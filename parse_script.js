const fs = require('fs');
const path = require('path');

const pdfTextPath = path.join(__dirname, 'regulasi', 'ley_text.txt');
const rawContent = fs.readFileSync(pdfTextPath, 'utf8');
const rawLines = rawContent.split(/\r?\n/);

// Filter out page headers, page footers, and page numbers
const cleanLines = [];
let i = 0;
while (i < rawLines.length) {
    let line = rawLines[i];
    const tr = line.trim();
    
    // Page header lines
    if (tr === 'Tribunal Supremo de Elecciones' || tr === 'Normativa' || tr === 'www.tse.go.cr') {
        i++;
        continue;
    }
    // Divider lines
    if (/^_{5,}$/.test(tr)) {
        i++;
        continue;
    }
    // Page footer title & page number
    if (tr === 'LEY ORGÁNICA DEL PODER JUDICIAL') {
        let next = (rawLines[i + 1] || '').trim();
        if (/^\d+$/.test(next)) {
            i += 2;
            continue;
        }
    }
    if (/^\d+$/.test(tr) && i > 0 && (rawLines[i - 1] || '').includes('LEY ORGÁNICA DEL PODER JUDICIAL')) {
        i++;
        continue;
    }
    // Remove form feed character \x0c
    line = line.replace(/\x0c/g, '');
    
    cleanLines.push(line);
    i++;
}

console.log('Clean lines count:', cleanLines.length);

// Analyze title, chapter, section, and article structure
const structure = [];
let currentTitle = null;
let currentChapter = null;
let currentSection = null;
let currentArticle = null;

const articleMatchRegex = /^(Artículo|Transitorio)\s+([0-9]+(?:\s+bis)?|[IVXLCDM]+)(?:\.\s*|\s*\.-\s*|\s*-\s*|\s*|\:)?/i;

const foundArticles = [];

cleanLines.forEach((line, index) => {
    const tr = line.trim();
    if (/^(Artículo|Transitorio)\b/i.test(tr)) {
        foundArticles.push({ index, text: tr });
    }
});

console.log('Found articles/transitorios:', foundArticles.length);
foundArticles.forEach((art, i) => {
    console.log(`${i+1}. Line ${art.index}: ${art.text.substring(0, 70)}`);
});
