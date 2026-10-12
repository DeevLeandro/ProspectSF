import React, { useState, useMemo } from 'react';
import { aiProviders, sendPromptToAI } from '../utils/aiLinks';
import { OBJECTIVES, buildAIPrompt } from '../utils/messageGenerator';

function Modal({ company, onClose }) {
    const [objective, setObjective] = useState('first_contact');
    const [copied, setCopied] = useState(false);
    const [sentTo, setSentTo] = useState(null);

    const prompt = useMemo(() => buildAIPrompt(company, objective), [company, objective]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert('Não foi possível copiar automaticamente. Selecione o texto manualmente.');
        }
    };

    const handleSendToAI = async (provider) => {
        await sendPromptToAI(provider, prompt);
        setSentTo(provider.id);
        setTimeout(() => setSentTo(null), 3000);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Fechar">
                    <span className="material-icons">close</span>
                </button>

                <span className="modal-eyebrow">Mensagens persuasivas</span>
                <h2>{company.name}</h2>
                <p className="modal-subtitle">Escolha o objetivo, envie para uma IA e receba 3 variações prontas para o WhatsApp.</p>

                <div className="objective-grid">
                    {OBJECTIVES.map(o => (
                        <button
                            key={o.id}
                            className={`objective-chip ${objective === o.id ? 'objective-chip-active' : ''}`}
                            onClick={() => setObjective(o.id)}
                        >
                            <span className="material-icons">{o.icon}</span>
                            {o.label}
                        </button>
                    ))}
                </div>

                <div className="ai-grid">
                    {aiProviders.map(provider => (
                        <button
                            key={provider.id}
                            className={`ai-chip ${sentTo === provider.id ? 'ai-chip-sent' : ''}`}
                            style={{ '--ai-color': provider.color }}
                            onClick={() => handleSendToAI(provider)}
                        >
                            <span className="ai-chip-dot" />
                            <span className="ai-chip-name">{provider.name}</span>
                            {sentTo === provider.id ? (
                                <span className="ai-chip-status"><span className="material-icons">check</span>Enviado</span>
                            ) : (
                                <span className="ai-chip-status ai-chip-hint">{provider.note}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="prompt-box-wrapper">
                    <div className="prompt-box-header">
                        <span>Prompt — {OBJECTIVES.find(o => o.id === objective)?.label}</span>
                        <button className="copy-btn-inline" onClick={handleCopy}>
                            <span className="material-icons">{copied ? 'check' : 'content_copy'}</span>
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                    <div className="prompt-box">{prompt}</div>
                </div>

                <p className="modal-tip">
                    <span className="material-icons">info</span>
                    Revise sempre antes de enviar. Os dados da Nox (comissão, prazos) vêm de <code>src/config/nox.js</code>; se estiver vazio, a IA não cita números.
                </p>
            </div>
        </div>
    );
}

export default Modal;
