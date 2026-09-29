const fs = require('fs');
const path = require('path');

const pdfTextPath = path.join(__dirname, 'regulasi', 'ley_text.txt');
const rawContent = fs.readFileSync(pdfTextPath, 'utf8');
const rawLines = rawContent.split(/\r?\n/);

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
    
    // Ignore empty lines
    if (line.trim() === '') {
        i++;
        continue;
    }

    cleanLines.push(line.trim());
    i++;
}

// console.log('Clean lines count:', cleanLines.length);

const data = {
    metadata: {
        titulo: "LEY ORGÁNICA DEL PODER JUDICIAL",
        numero_ley: "Ley n. º 7333 y sus reformas",
        publicacion: "Publicada en el Alcance n.°24 a La Gaceta n.°124 del 1 de julio de 1993",
        decreto: "LA ASAMBLEA LEGISLATIVA DE LA REPÚBLICA DE COSTA RICA DECRETA:"
    },
    estructura: []
};

let currentTitle = null;
let currentChapter = null;
let currentSection = null;
let currentArticle = null;

const titleRegex = /^TÍTULO\s+[IVXLCDM\d]+/i;
const chapterRegex = /^CAPÍTULO\s+[IVXLCDM\d\w]+/i;
const sectionRegex = /^SECCIÓN\s+[IVXLCDM\d\w]+/i;
const articleRegex = /^(Artículo|Art\.|Transitorio)\s+([0-9]+(?:[\.\-\s]+bis)?|[IVXLCDM]+)(?:\.\s*|\s*\.-\s*|\s*-\s*|\s*|\:)?/i;

// Initial state, before any titles
let rootLevel = data.estructura;

for (let j = 0; j < cleanLines.length; j++) {
    const line = cleanLines[j];
    
    // Skip some known metadata at the top if it appears again
    if (line === 'LEY ORGÁNICA DEL PODER JUDICIAL' || 
        line.startsWith('Ley n.') || 
        line.startsWith('Publicada en') ||
        line === 'LA ASAMBLEA LEGISLATIVA DE LA REPÚBLICA DE COSTA RICA' ||
        line === 'DECRETA:') {
        continue;
    }

    if (titleRegex.test(line)) {
        currentTitle = { tipo: 'titulo', numero: line, nombre: '', contenido: [] };
        data.estructura.push(currentTitle);
        currentChapter = null;
        currentSection = null;
        currentArticle = null;
        
        // Next line might be the title's name
        if (j + 1 < cleanLines.length) {
            const nextLine = cleanLines[j+1];
            if (!chapterRegex.test(nextLine) && !articleRegex.test(nextLine)) {
                currentTitle.nombre = nextLine;
                j++; // skip the name line
            }
        }
        continue;
    }

    if (chapterRegex.test(line)) {
        currentChapter = { tipo: 'capitulo', numero: line, nombre: '', contenido: [] };
        if (currentTitle) {
            currentTitle.contenido.push(currentChapter);
        } else {
            data.estructura.push(currentChapter);
        }
        currentSection = null;
        currentArticle = null;
        
        // Next line might be the chapter's name
        if (j + 1 < cleanLines.length) {
            const nextLine = cleanLines[j+1];
            if (!sectionRegex.test(nextLine) && !articleRegex.test(nextLine) && !titleRegex.test(nextLine)) {
                currentChapter.nombre = nextLine;
                j++;
            }
        }
        continue;
    }

    if (sectionRegex.test(line)) {
        currentSection = { tipo: 'seccion', numero: line, nombre: '', contenido: [] };
        if (currentChapter) {
            currentChapter.contenido.push(currentSection);
        } else if (currentTitle) {
            currentTitle.contenido.push(currentSection);
        } else {
            data.estructura.push(currentSection);
        }
        currentArticle = null;
        
        // Next line might be the section's name
        if (j + 1 < cleanLines.length) {
            const nextLine = cleanLines[j+1];
            if (!articleRegex.test(nextLine)) {
                currentSection.nombre = nextLine;
                j++;
            }
        }
        continue;
    }

    const artMatch = line.match(articleRegex);
    if (artMatch) {
        currentArticle = { tipo: 'articulo', numero: line, texto: "" };
        let targetContainer = currentSection ? currentSection.contenido : 
                              (currentChapter ? currentChapter.contenido : 
                              (currentTitle ? currentTitle.contenido : data.estructura));
        targetContainer.push(currentArticle);
        
        // Check if there is text on the same line after the article number (e.g., "Artículo 4.Ningún tribunal...")
        const numPart = artMatch[0];
        const restOfLine = line.substring(numPart.length).trim();
        if (restOfLine) {
            currentArticle.texto = restOfLine + "\n";
        }
        continue;
    }

    // It's text belonging to the current article, or dangling text
    if (currentArticle) {
        currentArticle.texto += line + "\n";
    } else {
        // Text outside of any article (could happen at the very beginning)
        // Let's just push it to the current container or root as a text block
        let targetContainer = currentSection ? currentSection.contenido : 
                              (currentChapter ? currentChapter.contenido : 
                              (currentTitle ? currentTitle.contenido : data.estructura));
        
        if (targetContainer.length > 0 && targetContainer[targetContainer.length - 1].tipo === 'texto_libre') {
            targetContainer[targetContainer.length - 1].texto += line + "\n";
        } else {
            targetContainer.push({ tipo: 'texto_libre', texto: line + "\n" });
        }
    }
}

// Clean up trailing newlines
function trimTexts(node) {
    if (node.texto !== undefined) {
        node.texto = node.texto.trim();
    }
    if (node.contenido) {
        node.contenido.forEach(trimTexts);
    }
}
data.estructura.forEach(trimTexts);

const outputPath = path.join(__dirname, 'leyorganicapoderjudicial.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
console.log('JSON written to', outputPath);
