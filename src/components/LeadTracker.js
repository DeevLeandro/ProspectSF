// src/components/LeadTracker.js
import React, { useState, useEffect } from 'react';
import { getLeads, saveLead, updateLeadStage, generateMessage, MESSAGE_STAGES, getLeadStats } from '../utils/leadTracker';

function LeadTracker({ leads: externalLeads, onSendMessage }) {
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedLead, setSelectedLead] = useState(null);
    const [showTracker, setShowTracker] = useState(false);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = () => {
        const storedLeads = getLeads();
        setLeads(storedLeads);
        setStats(getLeadStats());
    };

    const handleSendInitialMessage = (lead) => {
        const message = generateMessage(lead, MESSAGE_STAGES.INITIAL);
        
        // Envia via WhatsApp
        if (onSendMessage) {
            onSendMessage({ ...lead, message });
        }
        
        // Atualiza status
        updateLeadStage(lead.id, MESSAGE_STAGES.INITIAL, message);
        loadLeads();
    };

    const handleClientResponded = (lead) => {
        // Marca que o cliente respondeu
        updateLeadStage(lead.id, MESSAGE_STAGES.RESPONDED);
        loadLeads();
        
        // Gera e envia a segunda mensagem (com demo)
        const demoMessage = generateMessage(lead, MESSAGE_STAGES.RESPONDED);
        
        if (onSendMessage) {
            onSendMessage({ ...lead, message: demoMessage });
        }
        
        // Atualiza com a mensagem enviada
        updateLeadStage(lead.id, MESSAGE_STAGES.RESPONDED, demoMessage);
        loadLeads();
    };

    const handleSendDemo = (lead) => {
        const demoMessage = generateMessage(lead, MESSAGE_STAGES.DEMO_SENT);
        
        if (onSendMessage) {
            onSendMessage({ ...lead, message: demoMessage });
        }
        
        updateLeadStage(lead.id, MESSAGE_STAGES.DEMO_SENT, demoMessage);
        loadLeads();
    };

    const handleConvert = (lead) => {
        updateLeadStage(lead.id, MESSAGE_STAGES.CONVERTED);
        loadLeads();
        
        // Mensagem de confirmação
        const confirmMessage = generateMessage(lead, MESSAGE_STAGES.CONVERTED);
        if (onSendMessage) {
            onSendMessage({ ...lead, message: confirmMessage });
        }
    };

    const getStageLabel = (stage) => {
        const labels = {
            [MESSAGE_STAGES.INITIAL]: '📨 Mensagem Inicial',
            [MESSAGE_STAGES.RESPONDED]: '✅ Cliente Respondeu',
            [MESSAGE_STAGES.DEMO_SENT]: '🎨 Demo Enviada',
            [MESSAGE_STAGES.CONVERTED]: '🎉 Convertido',
            [MESSAGE_STAGES.LOST]: '❌ Perdido'
        };
        return labels[stage] || stage;
    };

    const getStageColor = (stage) => {
        const colors = {
            [MESSAGE_STAGES.INITIAL]: '#FFB74D',
            [MESSAGE_STAGES.RESPONDED]: '#4FC3F7',
            [MESSAGE_STAGES.DEMO_SENT]: '#81C784',
            [MESSAGE_STAGES.CONVERTED]: '#4CAF50',
            [MESSAGE_STAGES.LOST]: '#EF5350'
        };
        return colors[stage] || '#999';
    };

    return (
        <div className="lead-tracker">
            <div className="tracker-header">
                <button 
                    className="btn-toggle-tracker"
                    onClick={() => setShowTracker(!showTracker)}
                >
                    <span className="material-icons">track_changes</span>
                    Acompanhamento de Leads ({stats.total || 0})
                </button>
                
                {showTracker && (
                    <div className="tracker-stats">
                        <div className="stat-item">
                            <span className="stat-dot" style={{ background: '#FFB74D' }}></span>
                            <span>Iniciais: {stats.initial || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-dot" style={{ background: '#4FC3F7' }}></span>
                            <span>Responderam: {stats.responded || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-dot" style={{ background: '#81C784' }}></span>
                            <span>Demo Enviada: {stats.demoSent || 0}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-dot" style={{ background: '#4CAF50' }}></span>
                            <span>✅ Convertidos: {stats.converted || 0}</span>
                        </div>
                    </div>
                )}
            </div>

            {showTracker && (
                <div className="tracker-list">
                    {leads.length === 0 ? (
                        <p className="empty-tracker">Nenhum lead em acompanhamento</p>
                    ) : (
                        leads.map(lead => (
                            <div key={lead.id} className="tracker-item">
                                <div className="tracker-item-header">
                                    <div className="lead-info">
                                        <strong>{lead.name}</strong>
                                        <span className="lead-stage" style={{ 
                                            background: getStageColor(lead.stage),
                                            color: '#fff',
                                            padding: '2px 10px',
                                            borderRadius: '12px',
                                            fontSize: '11px'
                                        }}>
                                            {getStageLabel(lead.stage)}
                                        </span>
                                    </div>
                                    <div className="tracker-actions">
                                        {lead.stage === MESSAGE_STAGES.INITIAL && (
                                            <button 
                                                className="btn-responded"
                                                onClick={() => handleClientResponded(lead)}
                                                title="Cliente respondeu"
                                            >
                                                ✅ Responder
                                            </button>
                                        )}
                                        {lead.stage === MESSAGE_STAGES.RESPONDED && (
                                            <button 
                                                className="btn-demo"
                                                onClick={() => handleSendDemo(lead)}
                                                title="Enviar demo do site"
                                            >
                                                🎨 Enviar Demo
                                            </button>
                                        )}
                                        {lead.stage === MESSAGE_STAGES.DEMO_SENT && (
                                            <button 
                                                className="btn-convert"
                                                onClick={() => handleConvert(lead)}
                                                title="Fechar negócio"
                                            >
                                                🎉 Fechar
                                            </button>
                                        )}
                                        {lead.stage === MESSAGE_STAGES.CONVERTED && (
                                            <span className="badge-converted">🎉 Cliente Convertido</span>
                                        )}
                                        <button 
                                            className="btn-message"
                                            onClick={() => handleSendInitialMessage(lead)}
                                            title="Reenviar mensagem"
                                        >
                                            <span className="material-icons">send</span>
                                        </button>
                                    </div>
                                </div>
                                {lead.messageHistory && lead.messageHistory.length > 0 && (
                                    <div className="message-history">
                                        <small>Última mensagem: {lead.messageHistory[lead.messageHistory.length - 1]?.sentAt}</small>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default LeadTracker;