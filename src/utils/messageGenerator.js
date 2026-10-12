import { NOX } from '../config/nox';
import { getLeadType } from './stages';

export const OBJECTIVES = [
    { id: 'first_contact', label: 'Primeiro contato', icon: 'waving_hand' },
    { id: 'followup',      label: 'Follow-up (sem resposta)', icon: 'update' },
    { id: 'pitch',         label: 'Pitch da parceria', icon: 'handshake' },
    { id: 'objection',     label: 'Quebrar objeções', icon: 'psychology' },
    { id: 'meeting',       label: 'Agendar reunião', icon: 'event' }
];

const objectiveBrief = {
    first_contact: 'Primeira mensagem fria. Objetivo ÚNICO: despertar curiosidade e obter uma resposta curta. NÃO explique o produto inteiro, NÃO peça reunião ainda.',
    followup: 'O lead não respondeu à primeira mensagem. Escreva 3 follow-ups em sequência (D+2, D+5, D+10), cada um com ângulo DIFERENTE (valor, curiosidade, despedida educada). Nunca cobre ("vi que não respondeu").',
    pitch: 'O lead respondeu com interesse. Explique a parceria em poucas linhas: o que ele faz, o que ele ganha, o que NÃO precisa fazer (burocracia, risco). Termine pedindo permissão para enviar detalhes ou marcar 15 min.',
    objection: 'Escreva respostas curtas e honestas para as 5 objeções mais prováveis: "já trabalho com outra seguradora/fiança", "meus clientes preferem fiador", "não tenho tempo", "fica caro para o inquilino", "não conheço a Nox". Sem pressão, sem mentir.',
    meeting: 'O lead está morno. Proponha uma conversa de 15 minutos com 2 opções de horário e deixe claro o que será resolvido nela.'
};

const partnershipFacts = () => {
    const p = NOX.partnership;
    const lines = [p.commissionText, p.onboardingText, p.supportText].filter(Boolean);
    return lines.length
        ? lines.map(l => `• ${l}`).join('\n')
        : '• (nenhuma condição numérica informada — NÃO cite comissão, valores ou prazos)';
};

export const buildAIPrompt = (lead, objectiveId = 'first_contact') => {
    const type = getLeadType(lead);
    const name = lead.name || 'a empresa';
    const city = lead.city || 'sua região';
    const audience = type === 'corretor'
        ? 'corretor de imóveis autônomo (decide sozinho; valoriza renda extra sem burocracia e sem risco)'
        : 'imobiliária (decisor é sócio/gerente de locação; valoriza fechar mais contratos, menos desistência por falta de fiador e carteira de locação saudável)';

    return `Você é um redator comercial B2B sênior, especialista em vendas consultivas no mercado imobiliário brasileiro.

CONTEXTO
Empresa que prospecta: ${NOX.company} (seguro fiança locatício).
Quem assina: ${NOX.sellerName}.
Lead: ${name} — ${lead.category || 'mercado imobiliário'} em ${city}${lead.state ? '/' + lead.state : ''}.
Perfil do lead: ${audience}.
${lead.rating ? `Avaliação no Google: ${lead.rating}.` : ''}
${lead.notes ? `Anotações sobre o lead: ${lead.notes}` : ''}

OFERTA
Convidamos o lead a ser PARCEIRO da ${NOX.company}: ele oferece o seguro fiança aos locatários dele e recebe pela venda.
Benefícios do produto:
${NOX.productBenefits.map(b => `• ${b}`).join('\n')}
Condições da parceria:
${partnershipFacts()}

TAREFA
${objectiveBrief[objectiveId]}

REGRAS OBRIGATÓRIAS
1. Português do Brasil, tom humano e profissional de WhatsApp. Nada de "Prezado"; no máximo 1 emoji.
2. Cada mensagem com no máximo 500 caracteres. Curta, sem blocos de texto.
3. Personalize com nome/cidade do lead de forma natural. Nunca finja ter feito análise que não fez.
4. NUNCA invente números, percentuais, cases, prazos ou coberturas. Use só os dados acima. Se faltar dado, escreva sem ele.
5. Termine SEMPRE com UMA pergunta fácil de responder (sim/não ou curta).
6. Sem urgência falsa, sem promessa de ganho garantido, sem caixa alta.
7. Em todo primeiro contato, inclua uma saída gentil (ex: "se não fizer sentido, me diga que não insisto").

FORMATO DA RESPOSTA
Entregue 3 variações numeradas (A: direta, B: consultiva, C: curiosidade). Depois, em 2 linhas, diga qual usar e por quê.`;
};

// Texto pronto (sem IA) para abrir direto no WhatsApp. Curto de propósito.
export const buildFirstContactText = (lead) => {
    const name = lead.name || 'sua imobiliária';
    const city = lead.city ? ` em ${lead.city}` : '';
    const hook = getLeadType(lead) === 'corretor'
        ? 'Você já oferece seguro fiança para os locatários que atende?'
        : `A ${name} hoje oferece seguro fiança como alternativa a fiador e caução nas locações?`;

    return `Olá! Aqui é ${NOX.sellerName}, da ${NOX.company}. Vi o trabalho de vocês${city}.

Estamos montando uma rede de parceiros para o nosso seguro fiança: o parceiro oferece aos locatários e recebe pela venda.

${hook}

Se não fizer sentido, é só me dizer que não insisto.`;
};
