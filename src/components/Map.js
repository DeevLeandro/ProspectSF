import React, { useState, useEffect } from 'react';
import ResultCard from './ResultCard';
import { businessCategories } from '../data/cities';
import { brazilStates, getCitiesByState } from '../data/brazilData';
import { parseGmapsPaste } from '../utils/parseGmaps';

const EMPTY_LEAD = {
    name: '', category: '', phone: '', address: '', website: '',
    hasWebsite: false, city: '', state: '', googleMapsUrl: '', rating: 0
};

const QUICK_FILL = [
    { key: 'imobiliária', label: 'Imobiliária', name: 'Imobiliária ' },
    { key: 'imobiliária de aluguel', label: 'Aluguel/Locação', name: 'Imobiliária ' },
    { key: 'administradora de imóveis', label: 'Administradora', name: 'Administradora ' },
    { key: 'corretor de imóveis', label: 'Corretor', name: '' }
];

function Map({ onSaveLead, onSendMessage, onGenerateMessage }) {
    const [manualLeads, setManualLeads] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [showManualForm, setShowManualForm] = useState(false);
    const [newLead, setNewLead] = useState(EMPTY_LEAD);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [importUrl, setImportUrl] = useState('');
    const [pasteMode, setPasteMode] = useState(false);
    const [pasteText, setPasteText] = useState('');

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [availableCities, setAvailableCities] = useState([]);
    const [businessType, setBusinessType] = useState('imobiliária');
    const [searchMode, setSearchMode] = useState('simple');

    useEffect(() => {
        try { const s = localStorage.getItem('manual_leads'); if (s) setManualLeads(JSON.parse(s)); } catch (e) {}
        try { const h = localStorage.getItem('search_history'); if (h) setSearchHistory(JSON.parse(h)); } catch (e) {}
    }, []);

    useEffect(() => { localStorage.setItem('manual_leads', JSON.stringify(manualLeads)); }, [manualLeads]);
    useEffect(() => { localStorage.setItem('search_history', JSON.stringify(searchHistory)); }, [searchHistory]);

    useEffect(() => {
        setAvailableCities(selectedState ? getCitiesByState(selectedState) : []);
    }, [selectedState]);

    const stateLabelOf = (uf) => brazilStates.find(s => s.value === uf)?.label || uf;

    // Aceita parâmetros para não depender de state ainda não atualizado (bug do reuseSearch antigo)
    const runSearch = (type, city, state) => {
        if (!type.trim()) { alert('Digite o tipo de negócio (ex: Imobiliária, Corretor de Imóveis)'); return; }

        let term = type.trim();
        if (city && state) term += ` em ${city} - ${state}`;
        else if (city) term += ` em ${city}`;
        else if (state) term += ` em ${stateLabelOf(state)}`;

        const item = { query: term, date: new Date().toLocaleString('pt-BR'), id: Date.now(), type, city, state };
        setSearchHistory(prev => [item, ...prev].slice(0, 20));
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(term)}`, '_blank');
    };

    const handleSimpleSearch = () => runSearch(businessType, selectedCity, selectedState);

    const reuseSearch = (h) => {
        setBusinessType(h.type || '');
        setSelectedState(h.state || '');
        setSelectedCity(h.city || '');
        runSearch(h.type || h.query.split(' em ')[0] || '', h.city || '', h.state || '');
    };

    const resetForm = () => { setNewLead(EMPTY_LEAD); setShowManualForm(false); };

    const addManualLead = () => {
        if (!newLead.name || !newLead.phone) { alert('Preencha pelo menos Nome e Telefone'); return false; }
        const lead = {
            id: Date.now().toString(),
            ...newLead,
            hasWebsite: !!newLead.website,
            savedAt: new Date().toLocaleString('pt-BR'),
            source: 'manual',
            phone: newLead.phone.replace(/\D/g, '')
        };
        setManualLeads(prev => [...prev, lead]);
        onSaveLead(lead);
        return true;
    };

    const handleSave = () => { if (addManualLead()) resetForm(); };

    // Salva e mantém a busca, pronto para o próximo lead da mesma pesquisa
    const handleSaveAndContinue = () => {
        if (addManualLead()) setNewLead({ ...EMPTY_LEAD, category: newLead.category, city: newLead.city, state: newLead.state });
    };

    const quickFill = (t) => setNewLead(prev => ({ ...prev, category: t.label === 'Aluguel/Locação' ? 'Imobiliária de Aluguel' : t.label, name: t.name }));

    const captureFromLink = () => {
        if (!importUrl) { alert('Cole o link do Google Maps primeiro'); return; }
        window.open(importUrl, '_blank');
        setNewLead(prev => ({ ...prev, googleMapsUrl: importUrl }));
        setShowManualForm(true);
        setImportUrl('');
    };

    const handleParse = () => {
        const data = parseGmapsPaste(pasteText, businessType);
        if (!data.name && !data.phone) { alert('Não consegui identificar os dados. Confira o texto colado.'); return; }
        setNewLead(prev => ({
            ...prev,
            name: data.name || prev.name,
            category: data.category || prev.category,
            phone: data.phone || prev.phone,
            address: data.address || prev.address,
            city: data.city || prev.city,
            state: data.state || prev.state,
            website: data.website || prev.website,
            hasWebsite: data.hasWebsite,
            rating: data.rating || prev.rating
        }));
        setShowManualForm(true);
        setPasteMode(false);
        setPasteText('');
    };

    const onBusinessChange = (value) => {
        setBusinessType(value);
        if (value.length > 0) {
            const q = value.toLowerCase();
            setSuggestions(businessCategories.filter(c => c.label.toLowerCase().includes(q) || c.value.toLowerCase().includes(q)));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const setField = (field) => (e) => setNewLead(prev => ({ ...prev, [field]: e.target.value }));

    return (
        <div className="map-container">
            <div className="search-section">
                <h2>Buscar no Google Maps</h2>
                <p className="search-subtitle">
                    {searchMode === 'simple'
                        ? 'Digite o tipo (imobiliária, corretor...) e selecione estado/cidade'
                        : 'Cole o link do Google Maps para capturar os dados'}
                </p>

                <div className="mode-toggle">
                    <button className={`mode-btn ${searchMode === 'simple' ? 'active' : ''}`} onClick={() => setSearchMode('simple')}>
                        <span className="material-icons">search</span>Busca simples
                    </button>
                    <button className={`mode-btn ${searchMode === 'advanced' ? 'active' : ''}`} onClick={() => setSearchMode('advanced')}>
                        <span className="material-icons">link</span>Importar link
                    </button>
                    <button className={`mode-btn ${pasteMode ? 'active' : ''}`} onClick={() => setPasteMode(!pasteMode)}>
                        <span className="material-icons">content_paste</span>Colar dados
                    </button>
                </div>

                {searchMode === 'simple' ? (
                    <div className="search-filters-simple">
                        <div className="filter-row">
                            <div className="filter-group">
                                <label>Tipo de negócio *</label>
                                <div className="business-input-wrapper">
                                    <input
                                        type="text"
                                        value={businessType}
                                        onChange={(e) => onBusinessChange(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { setShowSuggestions(false); handleSimpleSearch(); } }}
                                        placeholder="Ex: Imobiliária, Corretor de Imóveis..."
                                        className="filter-input"
                                        autoFocus
                                    />
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="suggestions-dropdown">
                                            {suggestions.slice(0, 10).map(cat => (
                                                <div key={cat.value} className="suggestion-item"
                                                    onClick={() => { setBusinessType(cat.label); setShowSuggestions(false); }}>
                                                    <span className="material-icons">search</span>{cat.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="filter-row">
                            <div className="filter-group">
                                <label>Estado</label>
                                <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); }} className="filter-select">
                                    <option value="">Selecione o estado</option>
                                    {brazilStates.map(s => <option key={s.value} value={s.value}>{s.label} ({s.value})</option>)}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Cidade</label>
                                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="filter-select" disabled={!selectedState}>
                                    <option value="">Selecione a cidade</option>
                                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="search-actions">
                            <button onClick={handleSimpleSearch} className="btn-primary btn-large">
                                <span className="material-icons">search</span>Buscar no Google Maps
                            </button>
                            {businessType && (
                                <button
                                    onClick={() => {
                                        setNewLead(prev => ({
                                            ...prev,
                                            category: businessType,
                                            city: selectedCity,
                                            state: selectedState,
                                            address: selectedCity && selectedState ? `${selectedCity}, ${stateLabelOf(selectedState)}` : ''
                                        }));
                                        setShowManualForm(true);
                                    }}
                                    className="btn-secondary"
                                >
                                    <span className="material-icons">add</span>Adicionar lead manual
                                </button>
                            )}
                        </div>

                        {businessType && (selectedCity || selectedState) && (
                            <div className="search-preview">
                                <span className="material-icons">info</span>
                                <span>
                                    Buscando: <strong>{businessType}</strong>
                                    {selectedCity ? ` em ${selectedCity}` : selectedState ? ` em ${stateLabelOf(selectedState)}` : ''}
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="import-section">
                        <div className="import-input-group">
                            <input type="url" value={importUrl} onChange={(e) => setImportUrl(e.target.value)}
                                placeholder="Cole o link do Google Maps..." className="filter-input import-input" />
                            <button onClick={captureFromLink} className="btn-import">
                                <span className="material-icons">open_in_new</span>Abrir e capturar
                            </button>
                        </div>
                        <div className="import-hint">
                            <span className="material-icons">info</span>
                            <span>O link será aberto para você copiar os dados manualmente</span>
                        </div>
                    </div>
                )}

                {pasteMode && (
                    <div className="paste-section">
                        <div className="paste-input-group">
                            <textarea
                                value={pasteText}
                                onChange={(e) => setPasteText(e.target.value)}
                                placeholder={`Cole aqui as informações copiadas do Google Maps:\n\nExemplo:\nImobiliária Horizonte\nAv. Brasil, 456 - Centro\n(47) 98888-7777\nimobiliariahorizonte.com.br`}
                                className="paste-textarea"
                                rows={5}
                            />
                            <div className="paste-actions">
                                <button onClick={handleParse} className="btn-parse" disabled={!pasteText.trim()}>
                                    <span className="material-icons">auto_awesome</span>Extrair dados
                                </button>
                                <button onClick={() => { setPasteText(''); setPasteMode(false); }} className="btn-secondary">Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                {showManualForm && (
                    <div className="manual-lead-form">
                        <div className="form-header">
                            <h3>Dados do lead</h3>
                            <button onClick={() => setShowManualForm(false)} className="btn-close-form" aria-label="Fechar">
                                <span className="material-icons">close</span>
                            </button>
                        </div>

                        <div className="quick-fill">
                            <span>Preencher rápido:</span>
                            {QUICK_FILL.map(t => (
                                <button key={t.key} onClick={() => quickFill(t)} className="btn-tag">{t.label}</button>
                            ))}
                        </div>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Nome *</label>
                                <input type="text" value={newLead.name} onChange={setField('name')} placeholder="Ex: Imobiliária Horizonte" className="filter-input" />
                            </div>
                            <div className="form-group">
                                <label>Categoria</label>
                                <input type="text" value={newLead.category} onChange={setField('category')} placeholder="Ex: Imobiliária" className="filter-input" />
                            </div>
                            <div className="form-group">
                                <label>Telefone / WhatsApp *</label>
                                <input type="text" value={newLead.phone} onChange={setField('phone')} placeholder="Ex: 47999999999" className="filter-input" />
                            </div>
                            <div className="form-group">
                                <label>Cidade</label>
                                <input type="text" value={newLead.city} onChange={setField('city')} placeholder="Ex: Balneário Camboriú" className="filter-input" />
                            </div>
                            <div className="form-group">
                                <label>Estado</label>
                                <input type="text" value={newLead.state} onChange={setField('state')} placeholder="Ex: SC" className="filter-input" maxLength="2" style={{ textTransform: 'uppercase' }} />
                            </div>
                            <div className="form-group full-width">
                                <label>Endereço</label>
                                <input type="text" value={newLead.address} onChange={setField('address')} placeholder="Ex: Av. Brasil, 123 - Centro" className="filter-input" />
                            </div>
                            <div className="form-group full-width">
                                <label>Website</label>
                                <input type="text" value={newLead.website} onChange={setField('website')} placeholder="Ex: https://imobiliaria.com.br" className="filter-input" />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button onClick={handleSave} className="btn-primary">
                                <span className="material-icons">save</span>Salvar lead
                            </button>
                            <button onClick={handleSaveAndContinue} className="btn-success">
                                <span className="material-icons">add</span>Salvar e continuar
                            </button>
                            <button onClick={() => setShowManualForm(false)} className="btn-secondary">Cancelar</button>
                        </div>
                    </div>
                )}
            </div>

            {searchHistory.length > 0 && (
                <div className="history-section">
                    <h4>Buscas recentes</h4>
                    <div className="history-tags">
                        {searchHistory.slice(0, 10).map(item => (
                            <button key={item.id} className="history-tag" onClick={() => reuseSearch(item)}>{item.query}</button>
                        ))}
                    </div>
                </div>
            )}

            {manualLeads.length > 0 && (
                <div className="manual-leads-section">
                    <div className="section-header">
                        <h3>Leads capturados ({manualLeads.length})</h3>
                        <button
                            onClick={() => {
                                if (window.confirm('Limpar esta lista? (Os leads já salvos na aba Leads não são apagados)')) {
                                    setManualLeads([]);
                                    localStorage.removeItem('manual_leads');
                                }
                            }}
                            className="btn-danger"
                        >
                            <span className="material-icons">delete</span>Limpar lista
                        </button>
                    </div>
                    <div className="results-grid">
                        {manualLeads.map(lead => (
                            <ResultCard
                                key={lead.id}
                                company={lead}
                                onSaveLead={onSaveLead}
                                onSendMessage={onSendMessage}
                                onGenerateMessage={onGenerateMessage}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="tips-section">
                <h4>Como usar</h4>
                <div className="steps">
                    <div className="step"><span className="step-number">1</span><div><strong>Busque o nicho</strong><p>Ex: Imobiliária de aluguel, Corretor de imóveis</p></div></div>
                    <div className="step"><span className="step-number">2</span><div><strong>Escolha estado e cidade</strong><p>Comece por cidades médias, com menos concorrência de seguradoras</p></div></div>
                    <div className="step"><span className="step-number">3</span><div><strong>Copie os dados do Maps</strong><p>Use "Colar dados" para extrair nome, telefone e avaliação</p></div></div>
                    <div className="step"><span className="step-number">4</span><div><strong>Gere a mensagem</strong><p>Use "Gerar com IA" e depois acompanhe a etapa na aba Leads</p></div></div>
                </div>
            </div>
        </div>
    );
}

export default Map;
