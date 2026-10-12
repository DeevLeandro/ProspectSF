// src/utils/leadTracker.js

const LEAD_STORAGE_KEY = 'frontay_leads_tracking';

export const MESSAGE_STAGES = {
    INITIAL: 'initial',          // Mensagem 1 enviada
    RESPONDED: 'responded',      // Cliente respondeu
    DEMO_SENT: 'demo_sent',      // Demo enviada
    CONVERTED: 'converted',      // Fechou negócio
    LOST: 'lost'                 // Perdeu
};

export const getLeads = () => {
    try {
        const data = localStorage.getItem(LEAD_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

export const saveLead = (lead) => {
    try {
        const leads = getLeads();
        const existingIndex = leads.findIndex(l => l.id === lead.id);
        
        if (existingIndex >= 0) {
            leads[existingIndex] = { ...leads[existingIndex], ...lead, updatedAt: new Date().toISOString() };
        } else {
            lead.createdAt = new Date().toISOString();
            lead.updatedAt = new Date().toISOString();
            lead.stage = MESSAGE_STAGES.INITIAL;
            lead.messageHistory = [];
            leads.push(lead);
        }
        
        localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(leads));
        return leads;
    } catch (e) {
        console.error('Erro ao salvar lead:', e);
        return [];
    }
};

export const updateLeadStage = (leadId, stage, messageSent = null) => {
    try {
        const leads = getLeads();
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
            lead.stage = stage;
            lead.updatedAt = new Date().toISOString();
            if (messageSent) {
                if (!lead.messageHistory) lead.messageHistory = [];
                lead.messageHistory.push({
                    stage,
                    message: messageSent,
                    sentAt: new Date().toISOString()
                });
            }
            localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(leads));
        }
        return leads;
    } catch (e) {
        console.error('Erro ao atualizar lead:', e);
        return [];
    }
};

export const getLeadStats = () => {
    const leads = getLeads();
    return {
        total: leads.length,
        initial: leads.filter(l => l.stage === MESSAGE_STAGES.INITIAL).length,
        responded: leads.filter(l => l.stage === MESSAGE_STAGES.RESPONDED).length,
        demoSent: leads.filter(l => l.stage === MESSAGE_STAGES.DEMO_SENT).length,
        converted: leads.filter(l => l.stage === MESSAGE_STAGES.CONVERTED).length,
        lost: leads.filter(l => l.stage === MESSAGE_STAGES.LOST).length
    };
};

export const generateMessage = (lead, stage) => {
    const companyName = lead.name || 'sua empresa';
    const contactName = lead.contactName || 'cliente';
    
    const messages = {
        [MESSAGE_STAGES.INITIAL]: `Olá ${contactName}, tudo bem? 👋

Aqui é [SEU_NOME] da Frontay Technologia.

Analisei a presença digital da ${companyName} e notei que:
✅ Você não tem um site profissional (ou seu site não está convertendo)
📉 Sua concorrência está ganhando espaço no digital
💰 Seu negócio poderia estar faturando 40% mais com uma landing page bem estruturada

Já ajudamos mais de 200 empresas a terem uma presença digital que realmente vende. E o melhor: fizemos isso sem complicação e com resultados rápidos.

Posso te mostrar como isso funciona na prática? São apenas 3 minutos do seu tempo.

Aguardo seu retorno! 🚀`,

        [MESSAGE_STAGES.RESPONDED]: `Que bom que você topou conversar, ${contactName}! 🎉

Tomei a liberdade de criar um esboço visual do que seria o site da ${companyName}. Quero que você veja com os próprios olhos como sua empresa pode ficar incrível na internet.

📲 Veja o protótipo que criei especialmente para você:
${lead.demoLink || '[LINK_DO_SITE_DEMO]'}

Perceba como ficou:
✨ Design moderno e profissional
📱 100% responsivo (funciona no celular)
⚡ Carregamento rápido
🎯 Focado em converter visitantes em clientes

Isso é apenas uma prévia do que podemos fazer juntos. O que você achou?

Posso te explicar como podemos lançar isso em até 7 dias úteis.

Aguardo seu feedback! 🙌`,

        [MESSAGE_STAGES.DEMO_SENT]: `{NOME_DO_CLIENTE}, o que achou do protótipo que enviei? 

A Frontay Technologia já tem mais de 3 anos de mercado e sabemos exatamente o que faz um site vender de verdade.

Podemos agendar uma call rápida de 15 minutos para:
✅ Alinhar os detalhes do seu projeto
✅ Definir o melhor design para seu negócio
✅ Fechar um cronograma de entrega

Quer marcar?

💬 WhatsApp: [SEU_NUMERO]`,

        [MESSAGE_STAGES.CONVERTED]: `🎉 Fechamos! Parabéns pela decisão, ${contactName}!

Agora vamos começar o desenvolvimento do site da ${companyName} hoje mesmo.

Próximos passos:
1️⃣ Enviarei o contrato para assinatura
2️⃣ Iniciamos o design em 24h
3️⃣ Entrega em até 7 dias úteis

Seu negócio vai decolar! 🚀`
    };

    return messages[stage] || messages[MESSAGE_STAGES.INITIAL];
};