import React, { useState } from 'react';
import { STAGES, getStage, getLeadType, TYPE_LABEL } from '../utils/stages';

function ScoreBadge({ score }) {
    const color = score >= 75 ? '#16A34A' : score >= 50 ? '#D97706' : '#6B7280';
    const label = score >= 75 ? 'Quente' : score >= 50 ? 'Morno' : 'Frio';
    return (
        <div className="score-badge" style={{ '--score-color': color }}>
            <svg viewBox="0 0 36 36" width="42" height="42">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
                    strokeDasharray={`${score} 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                <text x="18" y="22" textAnchor="middle" fontSize="10" fontWeight="800" fill={color} fontFamily="Poppins,sans-serif">{score}</text>
            </svg>
            <span className="score-label" style={{ color }}>{label}</span>
        </div>
    );
}

function LeadCard({ lead, onSendMessage, onGenerateMessage, onUpdateNotes, onSetFollowUp, onUpdateStage, onDeleteLead, onOpenSimulator }) {
    const [expanded, setExpanded] = useState(false);
    const [notes, setNotes] = useState(lead.notes || '');
    const [followUp, setFollowUp] = useState(lead.followUpDate || '');
    const [notesDirty, setNotesDirty] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const stage = getStage(lead.stage);
    const type = getLeadType(lead);
    const isOverdue = followUp && new Date(followUp) <= new Date();

    const handleSaveNotes = () => { onUpdateNotes(lead.id, notes); setNotesDirty(false); };
    const handleFollowUpChange = (e) => { setFollowUp(e.target.value); onSetFollowUp(lead.id, e.target.value); };
    const handleDelete = () => {
        if (confirmDelete) onDeleteLead(lead.id);
        else { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); }
    };

    return (
        <div className={`lead-card ${isOverdue ? 'lead-card-overdue' : ''}`}>
            <div className="lead-card-top">
                <ScoreBadge score={lead.score || 0} />
                <div className="lead-card-meta">
                    <h3 className="lead-name">{lead.name}</h3>
                    <div className="lead-tags">
                        <span className={`type-badge type-${type}`}>{TYPE_LABEL[type]}</span>
                        {lead.city && <span className="lead-tag lead-tag-city">{lead.city}</span>}
                        {lead.rating > 0 && <span className="lead-tag lead-tag-rating">⭐ {lead.rating}</span>}
                    </div>
                    {lead.phone && (
                        <p className="lead-phone">
                            <span className="material-icons" style={{ fontSize: 14 }}>phone</span>{lead.phone}
                        </p>
                    )}
                </div>
            </div>

            <div className="stage-row" style={{ borderLeftColor: stage.color }}>
                <label>Etapa</label>
                <select value={lead.stage || 'novo'} onChange={e => onUpdateStage(lead.id, e.target.value)} className="stage-select">
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
            </div>

            <div className={`followup-row ${isOverdue ? 'followup-overdue' : ''}`}>
                <label className="followup-label">
                    <span className="material-icons">{isOverdue ? 'alarm' : 'event'}</span>
                    {isOverdue ? 'Follow-up VENCIDO' : 'Próximo follow-up'}
                </label>
                <input type="date" value={followUp} onChange={handleFollowUpChange} className="followup-input" />
                {followUp && (
                    <button className="followup-clear" onClick={() => { setFollowUp(''); onSetFollowUp(lead.id, ''); }} title="Remover follow-up">
                        <span className="material-icons">close</span>
                    </button>
                )}
            </div>

            <div className="lead-actions">
                <button className="lead-btn lead-btn-whatsapp" onClick={() => onSendMessage(lead)} title="Abrir WhatsApp">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp
                </button>
                <button className="lead-btn lead-btn-site" onClick={() => onGenerateMessage(lead)} title="Gerar mensagens com IA">
                    <span className="material-icons" style={{ fontSize: 16 }}>auto_awesome</span>Mensagens IA
                </button>
                <button className="lead-btn lead-btn-price" onClick={() => onOpenSimulator(lead)} title="Simular ganho do parceiro">
                    <span className="material-icons" style={{ fontSize: 16 }}>calculate</span>Simulador
                </button>
            </div>

            <button className={`notes-toggle ${expanded ? 'notes-toggle-open' : ''}`} onClick={() => setExpanded(v => !v)}>
                <span className="material-icons" style={{ fontSize: 16 }}>{expanded ? 'expand_less' : 'expand_more'}</span>
                {notes ? 'Ver anotações' : 'Adicionar anotação'}
                {notes && <span className="notes-dot" />}
            </button>

            {expanded && (
                <div className="notes-area">
                    <textarea
                        className="notes-textarea"
                        placeholder="Quem é o decisor, quantas locações/mês, objeções, seguradora atual..."
                        value={notes}
                        onChange={e => { setNotes(e.target.value); setNotesDirty(true); }}
                        rows={4}
                    />
                    {notesDirty && (
                        <button className="notes-save-btn" onClick={handleSaveNotes}>
                            <span className="material-icons" style={{ fontSize: 16 }}>save</span>Salvar
                        </button>
                    )}
                </div>
            )}

            <div className="lead-card-footer">
                <span className="lead-saved-at">Salvo em {lead.savedAt}</span>
                <button className={`lead-delete-btn ${confirmDelete ? 'lead-delete-confirm' : ''}`} onClick={handleDelete}
                    title={confirmDelete ? 'Clique novamente para confirmar' : 'Remover lead'}>
                    <span className="material-icons" style={{ fontSize: 16 }}>{confirmDelete ? 'warning' : 'delete_outline'}</span>
                    {confirmDelete ? 'Confirmar?' : ''}
                </button>
            </div>
        </div>
    );
}

export default LeadCard;
