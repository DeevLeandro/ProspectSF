export const STAGES = [
    { id: 'novo',      label: 'Novo',       color: '#9CA3AF' },
    { id: 'contatado', label: 'Contatado',  color: '#F59E0B' },
    { id: 'respondeu', label: 'Respondeu',  color: '#38BDF8' },
    { id: 'reuniao',   label: 'Reunião',    color: '#8B5CF6' },
    { id: 'parceiro',  label: 'Parceiro ✓', color: '#16A34A' },
    { id: 'perdido',   label: 'Perdido',    color: '#EF4444' }
];

export const getStage = (id) => STAGES.find(s => s.id === id) || STAGES[0];

// 'imobiliaria' | 'corretor' | 'outro'
export const getLeadType = (lead) => {
    const cat = (lead.category || '').toLowerCase();
    const all = `${cat} ${(lead.name || '').toLowerCase()}`;
    if (/imobili|administradora|consultoria imob/.test(cat)) return 'imobiliaria';
    if (/corretor|corretora/.test(cat)) return 'corretor';
    if (/imobili/.test(all)) return 'imobiliaria';
    if (/corretor|corretora/.test(all)) return 'corretor';
    return 'outro';
};

export const TYPE_LABEL = { imobiliaria: 'Imobiliária', corretor: 'Corretor', outro: 'Outro' };
