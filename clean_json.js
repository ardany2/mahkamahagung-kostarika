const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'leyorganicapoderjudicial_translated.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

function cleanText(text) {
    if (typeof text !== 'string') return text;
    // Replace newlines with space, then replace multiple spaces with a single space
    // Optionally preserve double newlines if they were paragraphs, but in our parsed OCR it's just single newlines mostly
    // Let's replace single newlines with space, and normalize multiple spaces.
    // Also, remove isolated page numbers that sometimes got mixed in like "\n106\n" -> " 106 " -> " "
    
    // First, let's remove any isolated numbers that might be page numbers (like \n106\n)
    let cleaned = text.replace(/\n\s*\d+\s*\n/g, '\n');
    
    // Replace all newlines with a space
    cleaned = cleaned.replace(/\n/g, ' ');
    
    // Replace multiple spaces with a single space
    cleaned = cleaned.replace(/\s{2,}/g, ' ');
    
    return cleaned.trim();
}

function traverseAndClean(node) {
    for (const key in node) {
        if (typeof node[key] === 'string') {
            node[key] = cleanText(node[key]);
        } else if (typeof node[key] === 'object' && node[key] !== null) {
            traverseAndClean(node[key]);
        }
    }
}

traverseAndClean(data);

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('JSON cleaned successfully!');
