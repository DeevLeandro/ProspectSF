import React from 'react';
import { exportBackup, importBackup } from '../utils/backup';
import { STAGES, getLeadType } from '../utils/stages';

function Dashboard({ leads, messagesSent, promptsGenerated }) {
    const count = (id) => leads.filter(l => (l.stage || 'novo') === id).length;
    const imobiliarias = leads.filter(l => getLeadType(l) === 'imobiliaria').length;
    const contacted = leads.length - count('novo');
    const responded = count('respondeu') + count('reuniao') + count('parceiro');
    const partners = count('parceiro');
    const replyRate = contacted > 0 ? Math.round((responded / contacted) * 100) : 0;
    const closeRate = contacted > 0 ? Math.round((partners / contacted) * 100) : 0;
    const hot = leads.filter(l => (l.score || 0) >= 75 && (l.stage || 'novo') === 'novo').length;

    const stats = [
        { id: 1, icon: 'groups', label: 'Leads na base', value: leads.length, ramp: 'blue' },
        { id: 2, icon: 'apartment', label: 'Imobiliárias', value: imobiliarias, ramp: 'coral' },
        { id: 3, icon: 'send', label: 'Mensagens enviadas', value: messagesSent, ramp: 'teal' },
        { id: 4, icon: 'handshake', label: 'Parceiros fechados', value: partners, ramp: 'purple' }
    ];

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        importBackup(
            file,
            () => { alert('Backup restaurado. A página será recarregada.'); window.location.reload(); },
            (err) => alert(`Erro ao restaurar: ${err}`)
        );
        e.target.value = '';
    };

    return (
        <div className="dashboard">
            <div className="page-heading">
                <div>
                    <h2>Visão geral</h2>
                    <p className="page-heading-sub">Seu funil de parcerias Nox em números</p>
                </div>
                <div className="backup-controls">
                    <button className="btn-ghost" onClick={exportBackup}>
                        <span className="material-icons">download</span>
                        Exportar backup
                    </button>
                    <label className="btn-ghost btn-file">
                        <span className="material-icons">upload</span>
                        Restaurar backup
                        <input type="file" accept="application/json" onChange={handleImport} hidden />
                    </label>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map(stat => (
                    <div key={stat.id} className={`stat-card stat-${stat.ramp}`}>
                        <div className="stat-icon"><span className="material-icons">{stat.icon}</span></div>
                        <div className="stat-info">
                            <p className="stat-value">{stat.value}</p>
                            <h3>{stat.label}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {leads.length > 0 && (
                <div className="insight-banner">
                    <span className="material-icons">insights</span>
                    <span>
                        {contacted === 0
                            ? <>Você ainda não contatou nenhum lead. {hot > 0 && <><strong>{hot} leads quentes</strong> esperando primeira mensagem.</>}</>
                            : <>Taxa de resposta: <strong>{replyRate}%</strong> · Fechamento: <strong>{closeRate}%</strong> dos contatados. {hot > 0 && <><strong>{hot} leads quentes</strong> ainda sem contato.</>}</>}
                        {' '}Mensagens geradas com IA: <strong>{promptsGenerated}</strong>.
                    </span>
                </div>
            )}

            {leads.length > 0 && (
                <div className="recent-section" style={{ marginBottom: 20 }}>
                    <h2>Funil</h2>
                    <div className="funnel">
                        {STAGES.map(s => (
                            <div key={s.id} className="funnel-item" style={{ borderTopColor: s.color }}>
                                <strong>{count(s.id)}</strong>
                                <span>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="recent-section">
                <h2>Últimos leads capturados</h2>
                {leads.length === 0 ? (
                    <div className="empty-state">
                        <span className="material-icons">radar</span>
                        <p>Nenhum lead salvo ainda</p>
                        <p className="empty-sub">Vá em Prospectar e busque imobiliárias e corretores no Google Maps</p>
                    </div>
                ) : (
                    <ul className="lead-list">
                        {leads.slice(-6).reverse().map(lead => (
                            <li key={lead.id} className="lead-item">
                                <div className="lead-info">
                                    <strong>{lead.name}</strong>
                                    <span>{lead.category}</span>
                                    <span className="lead-city">{lead.city}</span>
                                </div>
                                <span className="lead-date">{lead.savedAt}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
