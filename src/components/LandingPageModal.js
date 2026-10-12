import React, { useState } from 'react';

function LandingPageModal({ company, files, generatedAt, onClose }) {
    const [activeTab, setActiveTab] = useState('preview');
    const [copied, setCopied] = useState(false);

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert('Não foi possível copiar. Selecione o texto manualmente.');
        }
    };

    const handleDownload = (content, filename) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleDownloadAll = () => {
        handleDownload(files.appJs, 'App.js');
        setTimeout(() => {
            handleDownload(files.indexCss, 'index.css');
        }, 500);
    };

    const renderPreview = () => {
        // Criar um iframe com a landing page
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${company.name} - Landing Page</title>
                    <style>${files.indexCss}</style>
                    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
                    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
                    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                </head>
                <body>
                    <div id="root"></div>
                    <script type="text/babel">
                        ${files.appJs}
                    </script>
                </body>
            </html>
        `;

        return (
            <iframe
                srcDoc={htmlContent}
                style={{
                    width: '100%',
                    height: '600px',
                    border: 'none',
                    borderRadius: '12px',
                    background: '#fff'
                }}
                title={`Preview - ${company.name}`}
            />
        );
    };

    const renderCode = (code, language) => {
        return (
            <div className="code-container">
                <div className="code-header">
                    <span className="code-language">{language}</span>
                    <button 
                        className="code-copy-btn"
                        onClick={() => handleCopy(code)}
                    >
                        <span className="material-icons">{copied ? 'check' : 'content_copy'}</span>
                        {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
                <pre className="code-block">
                    <code>{code}</code>
                </pre>
            </div>
        );
    };

    return (
        <div className="modal-overlay landing-page-modal" onClick={onClose}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <span className="modal-eyebrow">Landing Page Gerada</span>
                        <h2>{company.name}</h2>
                        <p className="modal-subtitle">
                            Gerado em: {generatedAt} | Categoria: {company.category || 'Não definida'}
                        </p>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Fechar">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <div className="modal-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        <span className="material-icons">visibility</span>
                        Preview
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'app' ? 'active' : ''}`}
                        onClick={() => setActiveTab('app')}
                    >
                        <span className="material-icons">code</span>
                        App.js
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'css' ? 'active' : ''}`}
                        onClick={() => setActiveTab('css')}
                    >
                        <span className="material-icons">style</span>
                        index.css
                    </button>
                </div>

                <div className="modal-body">
                    {activeTab === 'preview' && renderPreview()}
                    {activeTab === 'app' && renderCode(files.appJs, 'JavaScript (React)')}
                    {activeTab === 'css' && renderCode(files.indexCss, 'CSS')}
                </div>

                <div className="modal-footer">
                    <div className="download-actions">
                        <button 
                            className="btn-download"
                            onClick={() => handleDownload(files.appJs, 'App.js')}
                        >
                            <span className="material-icons">download</span>
                            App.js
                        </button>
                        <button 
                            className="btn-download"
                            onClick={() => handleDownload(files.indexCss, 'index.css')}
                        >
                            <span className="material-icons">download</span>
                            index.css
                        </button>
                        <button 
                            className="btn-download-all"
                            onClick={handleDownloadAll}
                        >
                            <span className="material-icons">file_download</span>
                            Baixar Tudo
                        </button>
                    </div>
                    <button className="btn-secondary" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LandingPageModal;