const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'leyorganicapoderjudicial.json');
const outputPath = path.join(__dirname, 'leyorganicapoderjudicial_translated.json');

const rawData = fs.readFileSync(inputPath, 'utf8');
const data = JSON.parse(rawData);

async function translateText(text) {
    if (!text || text.trim() === '') return text;
    try {
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=id&dt=t&q=' + encodeURIComponent(text);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // Result is an array of arrays, we need to join all translated parts
        let translated = '';
        if (result && result[0]) {
            for (let part of result[0]) {
                if (part[0]) {
                    translated += part[0];
                }
            }
        }
        return translated;
    } catch (e) {
        console.error('Translation error for text:', text.substring(0, 30), e);
        return text; // Return original if error
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Translate an array of tasks with limited concurrency
async function processQueue(tasks, limit) {
    const results = [];
    const executing = [];
    for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);
        
        if (limit <= tasks.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= limit) {
                await Promise.race(executing);
            }
        }
    }
    return Promise.all(results);
}

// Queue to hold all translation tasks
const translationTasks = [];

// Helper to push a task to the queue
function addTranslationTask(obj, sourceField, destField) {
    if (obj[sourceField]) {
        translationTasks.push(async () => {
            const translated = await translateText(obj[sourceField]);
            obj[destField] = translated;
            await delay(50); // small delay to prevent spamming too aggressively
        });
    }
}

// Metadata
addTranslationTask(data.metadata, 'titulo', 'titulo_id');
addTranslationTask(data.metadata, 'numero_ley', 'numero_ley_id');
addTranslationTask(data.metadata, 'publicacion', 'publicacion_id');
addTranslationTask(data.metadata, 'decreto', 'decreto_id');

// Recursive function to traverse structure
function traverseEstructura(node) {
    if (node.nombre !== undefined) {
        addTranslationTask(node, 'nombre', 'nombre_id');
    }
    if (node.texto !== undefined) {
        addTranslationTask(node, 'texto', 'texto_id');
    }
    // We can also translate 'numero' if it's like 'Artículo 1.-'
    if (node.numero !== undefined) {
        addTranslationTask(node, 'numero', 'numero_id');
    }

    if (node.contenido && Array.isArray(node.contenido)) {
        node.contenido.forEach(traverseEstructura);
    }
}

data.estructura.forEach(traverseEstructura);

console.log(`Starting translation for ${translationTasks.length} items...`);

processQueue(translationTasks, 5) // Limit concurrency to 5 requests at a time
    .then(() => {
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Translation completed. Saved to ${outputPath}`);
    })
    .catch(err => {
        console.error('Error processing queue:', err);
        // Save whatever we got so far
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    });
