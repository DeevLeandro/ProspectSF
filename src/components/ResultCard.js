import React from 'react';
import { getLeadType, TYPE_LABEL } from '../utils/stages';

function ResultCard({ company, onSaveLead, onSendMessage, onGenerateMessage }) {
    const type = getLeadType(company);

    return (
        <div className="result-card">
            {company.photoUrl && (
                <div className="card-image"><img src={company.photoUrl} alt={company.name} /></div>
            )}
            <div className="card-content">
                <div className="card-header">
                    <h3>{company.name}</h3>
                    <div className="header-badges">
                        <span className={`type-badge type-${type}`}>{TYPE_LABEL[type]}</span>
                    </div>
                </div>

                <div className="card-body">
                    <p className="category"><span className="material-icons">label</span>{company.category}</p>
                    <p className="location"><span className="material-icons">location_on</span>{company.city || company.address}</p>
                    <p className="phone"><span className="material-icons">phone</span>{company.phone}</p>
                    {company.rating > 0 && (
                        <p className="rating"><span className="material-icons">star</span>{Number(company.rating).toFixed(1)}</p>
                    )}
                    {company.website && (
                        <p className="website">
                            <span className="material-icons">link</span>
                            <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
                        </p>
                    )}
                </div>

                <div className="card-actions">
                    <button className="btn-message" onClick={() => onSendMessage(company)} title="Abrir WhatsApp com mensagem inicial">
                        <span className="material-icons">send</span>Mensagem
                    </button>
                    <button className="btn-website" onClick={() => onGenerateMessage(company)} title="Gerar mensagens com IA">
                        <span className="material-icons">auto_awesome</span>Gerar com IA
                    </button>
                    <button className="btn-lead" onClick={() => onSaveLead(company)} title="Salvar como lead">
                        <span className="material-icons">bookmark</span>Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResultCard;
