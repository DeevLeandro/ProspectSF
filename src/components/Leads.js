import React, { useState, useMemo } from 'react';
import LeadCard from './LeadCard';
import { STAGES, getLeadType } from '../utils/stages';

function Leads({ leads, onSendMessage, onGenerateMessage, onExport, onUpdateNotes, onSetFollowUp, onUpdateStage, onDeleteLead, onOpenSimulator }) {
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const [filterType, setFilterType] = useState('all');   // all | imobiliaria | corretor
    const [filterStage, setFilterStage] = useState('all');
    const [sortBy, setSortBy] = useState('score');

    const categories = useMemo(() => [...new Set(leads.map(l => l.category).filter(Boolean))].sort(), [leads]);
    const cities = useMemo(() => [...new Set(leads.map(l => l.city).filter(Boolean))].sort(), [leads]);

    const overdueCount = leads.filter(l => l.followUpDate && new Date(l.followUpDate) <= new Date()).length;

    const filtered = useMemo(() => {
        let list = [...leads];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(l =>
                (l.name || '').toLowerCase().includes(q) ||
                (l.category || '').toLowerCase().includes(q) ||
                (l.city || '').toLowerCase().includes(q) ||
                (l.phone || '').includes(q)
            );
        }
        if (filterCategory) list = list.filter(l => l.category === filterCategory);
        if (filterCity) list = list.filter(l => l.city === filterCity);
        if (filterType !== 'all') list = list.filter(l => getLeadType(l) === filterType);
        if (filterStage !== 'all') list = list.filter(l => (l.stage || 'novo') === filterStage);

        list.sort((a, b) => {
            if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
            if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
            if (sortBy === 'date') return (b.savedTs || 0) - (a.savedTs || 0);
            if (sortBy === 'followup') {
                const af = a.followUpDate ? new Date(a.followUpDate).getTime() : Infinity;
                const bf = b.followUpDate ? new Date(b.followUpDate).getTime() : Infinity;
                return af - bf;
            }
            return 0;
        });
        return list;
    }, [leads, search, filterCategory, filterCity, filterType, filterStage, sortBy]);

    const clearFilters = () => {
        setSearch(''); setFilterCategory(''); setFilterCity('');
        setFilterType('all'); setFilterStage('all'); setSortBy('score');
    };

    const hasActiveFilters = search || filterCategory || filterCity || filterType !== 'all' || filterStage !== 'all' || sortBy !== 'score';

    if (leads.length === 0) {
        return (
            <div className="leads-container">
                <div className="empty-state">
                    <span className="material-icons" style={{ fontSize: 64, color: '#D1D5DB', marginBottom: 16 }}>people_outline</span>
                    <h3>Nenhum lead salvo ainda</h3>
                    <p>Busque imobiliárias e corretores no mapa e salve os mais promissores aqui.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="leads-container">
            <div className="leads-header">
                <div className="leads-header-top">
                    <div>
                        <h2>Leads Salvos</h2>
                        <p className="leads-count">
                            {filtered.length} de {leads.length} lead{leads.length !== 1 ? 's' : ''}
                            {overdueCount > 0 && (
                                <span className="overdue-badge-header">
                                    <span className="material-icons" style={{ fontSize: 14 }}>alarm</span>
                                    {overdueCount} follow-up vencido{overdueCount !== 1 ? 's' : ''}
                                </span>
                            )}
                        </p>
                    </div>
                    <button className="btn-export" onClick={onExport}>
                        <span className="material-icons">download</span>Exportar CSV
                    </button>
                </div>

                <div className="filter-bar">
                    <div className="filter-search-wrap">
                        <span className="material-icons filter-search-icon">search</span>
                        <input type="text" placeholder="Buscar por nome, categoria, cidade..." value={search}
                            onChange={e => setSearch(e.target.value)} className="filter-input filter-search" />
                        {search && (
                            <button className="filter-clear-input" onClick={() => setSearch('')}>
                                <span className="material-icons">close</span>
                            </button>
                        )}
                    </div>

                    <select value={filterType} onChange={e => setFilterType(e.target.value)} className="filter-select">
                        <option value="all">Tipo: todos</option>
                        <option value="imobiliaria">Imobiliárias</option>
                        <option value="corretor">Corretores</option>
                    </select>

                    <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="filter-select">
                        <option value="all">Etapa: todas</option>
                        {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>

                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="filter-select">
                        <option value="">Todas as categorias</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="filter-select">
                        <option value="">Todas as cidades</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="filter-select">
                        <option value="score">Ordenar: Score</option>
                        <option value="name">Ordenar: Nome</option>
                        <option value="date">Ordenar: Data</option>
                        <option value="followup">Ordenar: Follow-up</option>
                    </select>

                    {hasActiveFilters && (
                        <button className="filter-clear-all" onClick={clearFilters}>
                            <span className="material-icons">filter_alt_off</span>Limpar
                        </button>
                    )}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state" style={{ marginTop: 40 }}>
                    <span className="material-icons" style={{ fontSize: 48, color: '#D1D5DB', marginBottom: 12 }}>search_off</span>
                    <h3>Nenhum lead encontrado</h3>
                    <p>Tente ajustar os filtros.</p>
                </div>
            ) : (
                <div className="leads-grid">
                    {filtered.map(lead => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            onSendMessage={onSendMessage}
                            onGenerateMessage={onGenerateMessage}
                            onUpdateNotes={onUpdateNotes}
                            onSetFollowUp={onSetFollowUp}
                            onUpdateStage={onUpdateStage}
                            onDeleteLead={onDeleteLead}
                            onOpenSimulator={onOpenSimulator}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Leads;
