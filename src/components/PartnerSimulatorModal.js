import React, { useState } from 'react';
import { NOX } from '../config/nox';

const brl = (n) => `R$ ${Math.round(n).toLocaleString('pt-BR')}`;

// ATENÇÃO: os valores iniciais são EXEMPLOS. Troque pelos números reais da Nox
// antes de enviar qualquer simulação a um lead.
function PartnerSimulatorModal({ lead, onClose, onSend }) {
    const [contracts, setContracts] = useState(10);   // locações fechadas/mês pelo lead
    const [pctFianca, setPctFianca] = useState(30);   // % que contrata seguro fiança
    const [avgRent, setAvgRent] = useState(2000);     // aluguel médio
    const [premiumPct, setPremiumPct] = useState(10); // prêmio anual (% do aluguel anual)
    const [commPct, setCommPct] = useState(20);       // comissão do parceiro (%)

    const policies = contracts * (pctFianca / 100);
    const premiumPerPolicy = avgRent * 12 * (premiumPct / 100);
    const monthly = policies * premiumPerPolicy * (commPct / 100);

    const buildMessage = () => `Olá! Fiz uma simulação rápida para a ${lead.name} (números ilustrativos, ajustamos aos seus reais):

• Locações fechadas por mês: ${contracts}
• Se ${pctFianca}% usassem seguro fiança: ~${policies.toFixed(1)} apólices/mês
• Potencial de comissão: ${brl(monthly)}/mês

Sem fiador na jogada, o cliente fecha mais rápido e vocês ainda ganham com isso. Quer que eu refaça com os seus números reais? Aqui é ${NOX.sellerName}, da ${NOX.company}.`;

    const field = (label, value, setter, suffix) => (
        <div className="sim-field">
            <label>{label}</label>
            <div className="sim-input">
                <input type="number" min="0" value={value} onChange={e => setter(Number(e.target.value))} />
                <span>{suffix}</span>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content price-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
                <button className="modal-close" onClick={onClose} aria-label="Fechar">
                    <span className="material-icons">close</span>
                </button>
                <span className="modal-eyebrow">Simulador de ganho do parceiro</span>
                <h2>{lead.name}</h2>
                <p className="modal-subtitle">Mostrar ao lead quanto ele deixa de ganhar é o argumento mais forte da parceria.</p>

                <div className="sim-warning">
                    <span className="material-icons">warning_amber</span>
                    Valores iniciais são exemplos. Use os números reais da Nox (prêmio e comissão) antes de enviar.
                </div>

                <div className="sim-grid">
                    {field('Locações/mês da imobiliária', contracts, setContracts, 'contratos')}
                    {field('% que contrata fiança', pctFianca, setPctFianca, '%')}
                    {field('Aluguel médio', avgRent, setAvgRent, 'R$')}
                    {field('Prêmio anual (% do aluguel anual)', premiumPct, setPremiumPct, '%')}
                    {field('Comissão do parceiro', commPct, setCommPct, '%')}
                </div>

                <div className="sim-total">
                    <div>
                        <div style={{ fontSize: 13, opacity: 0.8 }}>Comissão estimada</div>
                        <div className="sim-total-value">{brl(monthly)}<small> /mês</small></div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 13, opacity: 0.8 }}>
                        <div>{policies.toFixed(1)} apólices/mês</div>
                        <div>{brl(monthly * 12)} /ano</div>
                    </div>
                </div>

                <button className="sim-send" onClick={() => onSend(buildMessage(), lead.phone || '')}>
                    <span className="material-icons">send</span>
                    Enviar simulação via WhatsApp
                </button>
            </div>
        </div>
    );
}

export default PartnerSimulatorModal;
