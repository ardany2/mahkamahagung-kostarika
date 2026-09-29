const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'leyorganicapoderjudicial_translated.json');
const htmlPath = path.join(__dirname, 'viewer.html');

const data = fs.readFileSync(jsonPath, 'utf8');

const htmlTemplate = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hukum Organik Kekuasaan Peradilan (Ley Orgánica del Poder Judicial)</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@600&display=swap');

        :root {
            --bg-color: #f3f4f6;
            --text-main: #1f2937;
            --text-muted: #4b5563;
            --card-bg: rgba(255, 255, 255, 0.7);
            --card-border: rgba(255, 255, 255, 0.18);
            --accent-primary: #3b82f6;
            --accent-secondary: #10b981;
            --es-color: #6366f1;
            --id-color: #f59e0b;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            background-image: 
                radial-gradient(at 0% 0%, hsla(253,16%,7%,0.05) 0, transparent 50%), 
                radial-gradient(at 50% 0%, hsla(225,39%,30%,0.05) 0, transparent 50%), 
                radial-gradient(at 100% 0%, hsla(339,49%,30%,0.05) 0, transparent 50%);
            color: var(--text-main);
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            background: var(--card-bg);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 1rem;
            border: 1px solid var(--card-border);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        h1 {
            font-family: 'Playfair Display', serif;
            color: var(--text-main);
            margin: 0 0 1rem 0;
            font-size: 2.5rem;
        }

        h1 .subtitle {
            display: block;
            font-size: 1.2rem;
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            color: var(--text-muted);
            margin-top: 0.5rem;
        }

        .meta-info {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .level-titulo {
            margin-top: 3rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .level-titulo h2 {
            margin: 0;
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
        }

        .level-titulo .trans-text {
            color: #dbeafe;
            font-size: 1.2rem;
            margin-top: 0.5rem;
            font-weight: 300;
        }

        .level-capitulo {
            margin-top: 2rem;
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-left: 5px solid var(--accent-secondary);
            background: rgba(16, 185, 129, 0.05);
            border-radius: 0 0.5rem 0.5rem 0;
        }

        .level-capitulo h3 {
            margin: 0;
            color: #047857;
            font-size: 1.4rem;
        }
        
        .level-capitulo .trans-text {
            color: #065f46;
            font-size: 1.1rem;
            font-weight: 400;
        }

        .level-seccion {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            padding: 0.75rem;
            border-left: 4px solid var(--es-color);
            background: rgba(99, 102, 241, 0.05);
        }

        .level-seccion h4 {
            margin: 0;
            color: #4338ca;
            font-size: 1.2rem;
        }

        .article-card {
            background: var(--card-bg);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
            border: 1px solid var(--card-border);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin-bottom: 1.5rem;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .article-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .article-header {
            padding: 1rem 1.5rem;
            background: rgba(0, 0, 0, 0.03);
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .article-header h5 {
            margin: 0;
            font-size: 1.1rem;
            color: var(--text-main);
            display: flex;
            flex-direction: column;
        }

        .article-header h5 .id-title {
            color: var(--accent-primary);
            font-weight: 700;
        }

        .article-header h5 .es-title {
            color: var(--text-muted);
            font-weight: 400;
            font-size: 0.9rem;
            margin-top: 0.25rem;
        }

        .article-body {
            padding: 1.5rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }

        @media (max-width: 768px) {
            .article-body {
                grid-template-columns: 1fr;
            }
        }

        .text-block {
            padding: 1rem;
            border-radius: 0.5rem;
            font-size: 0.95rem;
            white-space: pre-wrap;
        }

        .text-id {
            background: rgba(59, 130, 246, 0.05);
            border-left: 3px solid var(--accent-primary);
        }

        .text-es {
            background: rgba(107, 114, 128, 0.05);
            border-left: 3px solid #9ca3af;
            color: var(--text-muted);
            font-style: italic;
        }
        
        .lang-badge {
            display: inline-block;
            padding: 0.2rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }
        
        .badge-id {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .badge-es {
            background: #f3f4f6;
            color: #4b5563;
        }

        /* Scroll to top button */
        #scrollTopBtn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--accent-primary);
            color: white;
            border: none;
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            display: none;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s;
        }
        
        #scrollTopBtn:hover {
            background: #2563eb;
        }
        
        /* Floating TOC */
        .toc-container {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--card-bg);
            border-radius: 1rem;
            border: 1px solid var(--card-border);
            max-height: 300px;
            overflow-y: auto;
        }
        
        .toc-container h3 {
            margin-top: 0;
            position: sticky;
            top: 0;
            background: inherit;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #eee;
        }
        
        .toc-link {
            display: block;
            padding: 0.25rem 0;
            color: var(--accent-primary);
            text-decoration: none;
        }
        
        .toc-link:hover {
            text-decoration: underline;
        }
        
    </style>
</head>
<body>
    <div class="container">
        <div id="content"></div>
    </div>
    
    <button id="scrollTopBtn" title="Go to top">↑</button>

    <script>
        // Injecting JSON data directly into the HTML file
        const docData = ${data};

        function renderMetadata(meta) {
            return \`
                <header>
                    <h1>
                        \${meta.titulo_id || meta.titulo}
                        <span class="subtitle">\${meta.titulo}</span>
                    </h1>
                    <div class="meta-info">
                        <div><strong>Ketetapan:</strong> \${meta.decreto_id || meta.decreto}</div>
                        <div><strong>Undang-Undang:</strong> \${meta.numero_ley_id || meta.numero_ley}</div>
                        <div><strong>Publikasi:</strong> \${meta.publicacion_id || meta.publicacion}</div>
                    </div>
                </header>
            \`;
        }
        
        function sanitizeId(str) {
            return str ? str.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : 'section';
        }

        function renderNode(node, index) {
            if (node.tipo === 'titulo') {
                const id = sanitizeId(node.numero);
                let html = \`
                    <div class="level-titulo" id="\${id}">
                        <h2>\${node.numero_id || node.numero}</h2>
                        \${node.nombre ? \`<div class="trans-text">\${node.nombre_id || node.nombre}<br><small style="opacity:0.7">\${node.nombre}</small></div>\` : ''}
                    </div>
                \`;
                if (node.contenido) {
                    html += node.contenido.map((c, i) => renderNode(c, i)).join('');
                }
                return html;
            } 
            else if (node.tipo === 'capitulo') {
                let html = \`
                    <div class="level-capitulo">
                        <h3>\${node.numero_id || node.numero}</h3>
                        \${node.nombre ? \`<div class="trans-text">\${node.nombre_id || node.nombre}<br><small style="opacity:0.7">\${node.nombre}</small></div>\` : ''}
                    </div>
                \`;
                if (node.contenido) {
                    html += node.contenido.map((c, i) => renderNode(c, i)).join('');
                }
                return html;
            }
            else if (node.tipo === 'seccion') {
                let html = \`
                    <div class="level-seccion">
                        <h4>\${node.numero_id || node.numero}</h4>
                        \${node.nombre ? \`<div class="trans-text">\${node.nombre_id || node.nombre} <small style="opacity:0.7">(\${node.nombre})</small></div>\` : ''}
                    </div>
                \`;
                if (node.contenido) {
                    html += node.contenido.map((c, i) => renderNode(c, i)).join('');
                }
                return html;
            }
            else if (node.tipo === 'articulo' || node.tipo === 'texto_libre') {
                // If it's just free text without number, treat it like an article but without header
                let hasHeader = node.numero ? true : false;
                
                return \`
                    <div class="article-card">
                        \${hasHeader ? \`
                        <div class="article-header">
                            <h5>
                                <span class="id-title">\${node.numero_id || node.numero}</span>
                                <span class="es-title">\${node.numero}</span>
                            </h5>
                        </div>
                        \` : ''}
                        <div class="article-body">
                            <div class="text-block text-id">
                                <span class="lang-badge badge-id">ID</span>
                                <div>\${node.texto_id || "Terjemahan tidak tersedia."}</div>
                            </div>
                            <div class="text-block text-es">
                                <span class="lang-badge badge-es">ES</span>
                                <div>\${node.texto || ""}</div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            return '';
        }
        
        function generateTOC(estructura) {
            let tocHTML = '<div class="toc-container"><h3>Daftar Isi (Daftar Judul)</h3>';
            estructura.forEach(node => {
                if (node.tipo === 'titulo') {
                    const id = sanitizeId(node.numero);
                    const label = (node.numero_id || node.numero) + (node.nombre_id ? ' - ' + node.nombre_id : '');
                    tocHTML += \`<a href="#\${id}" class="toc-link">\${label}</a>\`;
                }
            });
            tocHTML += '</div>';
            return tocHTML;
        }

        function render() {
            const contentDiv = document.getElementById('content');
            let html = renderMetadata(docData.metadata);
            
            // Add Table of Contents
            html += generateTOC(docData.estructura);
            
            // Render Content
            html += docData.estructura.map((node, i) => renderNode(node, i)).join('');
            
            contentDiv.innerHTML = html;
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', render);
        
        // Scroll to top functionality
        const scrollBtn = document.getElementById("scrollTopBtn");
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollBtn.style.display = "flex";
            } else {
                scrollBtn.style.display = "none";
            }
        };
        scrollBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

    </script>
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlTemplate, 'utf8');
console.log('HTML viewer created at:', htmlPath);
