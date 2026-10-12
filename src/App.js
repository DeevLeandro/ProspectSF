import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Map from './components/Map';
import Leads from './components/Leads';
import Modal from './components/Modal';
import Notification from './components/Notification';
import PartnerSimulatorModal from './components/PartnerSimulatorModal';
import { buildFirstContactText } from './utils/messageGenerator';
import { getLeadType } from './utils/stages';
import './styles.css';
import './theme-nox.css';

// Chave mantida para não perder dados do ProspectMaster antigo.
// Leads antigos sem "stage" caem em 'novo' automaticamente.
const STORAGE_KEY = 'prospectmaster_data';

function App() {
    const [currentPage, setCurrentPage] = useState('map');
    const [database, setDatabase] = useState({ leads: [], messagesSent: 0, promptsGenerated: 0 });
    const [loaded, setLoaded] = useState(false);
    const [modalLead, setModalLead] = useState(null);
    const [simulatorLead, setSimulatorLead] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setDatabase({
                    leads: data.leads || [],
                    messagesSent: data.messagesSent || 0,
                    promptsGenerated: data.promptsGenerated ?? data.proposalsGenerated ?? 0
                });
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
            }
        }
        setLoaded(true);
    }, []);

    // "loaded" evita sobrescrever os dados salvos com o estado vazio na primeira renderização
    useEffect(() => {
        if (!loaded) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    }, [database, loaded]);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    // Score de potencial de PARCERIA (não mais "sem site")
    const calcScore = (lead) => {
        let score = 0;
        if (lead.phone) score += 25;
        if (lead.category) score += 10;
        if (lead.city) score += 10;
        const type = getLeadType(lead);
        if (type === 'imobiliaria') score += 25;     // tem volume de locação
        else if (type === 'corretor') score += 10;
        if (lead.rating >= 4) score += 15;           // reputação
        if (lead.totalRatings >= 50) score += 10;    // carteira grande
        if (lead.hasWebsite) score += 5;             // operação estruturada
        return Math.min(score, 100);
    };

    const updateLead = (leadId, patch) => {
        setDatabase(prev => ({
            ...prev,
            leads: prev.leads.map(l => l.id === leadId ? { ...l, ...patch } : l)
        }));
    };

    const handleSaveLead = (company) => {
        const leadId = company.id || Date.now().toString();
        if (database.leads.some(l => l.id === leadId)) {
            showNotification('Lead já está salvo!');
            return;
        }
        const newLead = {
            ...company,
            id: leadId,
            savedAt: new Date().toLocaleString('pt-BR'),
            savedTs: Date.now(),
            notes: '',
            followUpDate: null,
            stage: 'novo',
            score: calcScore(company)
        };
        setDatabase(prev => ({ ...prev, leads: [...prev.leads, newLead] }));
        showNotification('Lead salvo com sucesso!');
    };

    const handleUpdateNotes = (id, notes) => updateLead(id, { notes });
    const handleUpdateStage = (id, stage) => { updateLead(id, { stage }); showNotification('Etapa atualizada'); };
    const handleSetFollowUp = (id, date) => { updateLead(id, { followUpDate: date }); showNotification('Follow-up atualizado!'); };

    const handleDeleteLead = (id) => {
        setDatabase(prev => ({ ...prev, leads: prev.leads.filter(l => l.id !== id) }));
        showNotification('Lead removido.');
    };

    const handleSendMessage = (company) => {
        const phoneNumber = company.phone ? company.phone.replace(/\D/g, '') : '';
        if (!phoneNumber) { showNotification('Telefone não disponível!'); return; }

        const message = buildFirstContactText(company);
        window.open(`https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');

        setDatabase(prev => ({
            ...prev,
            messagesSent: prev.messagesSent + 1,
            leads: prev.leads.map(l =>
                l.id === company.id && (l.stage || 'novo') === 'novo' ? { ...l, stage: 'contatado' } : l
            )
        }));
        showNotification(`Mensagem preparada para ${company.name}`);
    };

    const handleGenerateMessage = (company) => {
        setDatabase(prev => ({ ...prev, promptsGenerated: prev.promptsGenerated + 1 }));
        setModalLead(company);
    };

    const handleExportLeads = () => {
        if (database.leads.length === 0) { showNotification('Nenhum lead para exportar!'); return; }
        const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const csv = [
            ['Nome', 'Categoria', 'Tipo', 'Cidade', 'Telefone', 'Website', 'Etapa', 'Score', 'Follow-up', 'Anotações', 'Salvo Em'],
            ...database.leads.map(l => [
                l.name, l.category, getLeadType(l), l.city || l.address, l.phone, l.website,
                l.stage || 'novo', l.score || 0, l.followUpDate, l.notes, l.savedAt
            ])
        ].map(row => row.map(esc).join(',')).join('\n');

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `leads_nox_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        showNotification('Leads exportados com sucesso!');
    };

    const followUpCount = database.leads.filter(l => l.followUpDate && new Date(l.followUpDate) <= new Date()).length;

    return (
        <div className="app">
            <Header
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                leadCount={database.leads.length}
                followUpCount={followUpCount}
            />

            <main className="main-content">
                {currentPage === 'dashboard' && (
                    <Dashboard
                        leads={database.leads}
                        messagesSent={database.messagesSent}
                        promptsGenerated={database.promptsGenerated}
                    />
                )}
                {currentPage === 'map' && (
                    <Map
                        onSaveLead={handleSaveLead}
                        onSendMessage={handleSendMessage}
                        onGenerateMessage={handleGenerateMessage}
                    />
                )}
                {currentPage === 'leads' && (
                    <Leads
                        leads={database.leads}
                        onSendMessage={handleSendMessage}
                        onGenerateMessage={handleGenerateMessage}
                        onExport={handleExportLeads}
                        onUpdateNotes={handleUpdateNotes}
                        onSetFollowUp={handleSetFollowUp}
                        onUpdateStage={handleUpdateStage}
                        onDeleteLead={handleDeleteLead}
                        onOpenSimulator={setSimulatorLead}
                    />
                )}
            </main>

            {modalLead && <Modal company={modalLead} onClose={() => setModalLead(null)} />}

            {simulatorLead && (
                <PartnerSimulatorModal
                    lead={simulatorLead}
                    onClose={() => setSimulatorLead(null)}
                    onSend={(msg, phone) => {
                        const digits = phone.replace(/\D/g, '');
                        if (!digits) { showNotification('Telefone não disponível!'); return; }
                        window.open(`https://wa.me/55${digits}?text=${encodeURIComponent(msg)}`, '_blank');
                        setSimulatorLead(null);
                        showNotification('Simulação preparada no WhatsApp!');
                    }}
                />
            )}

            {notification && <Notification message={notification} />}
        </div>
    );
}

export default App;
