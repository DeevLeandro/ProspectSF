// src/utils/landingPageGenerator.js

// ============================================================
// FUNÇÕES EXISTENTES (mantidas)
// ============================================================

export const generateLandingPagePrompt = (company) => {
    const companyName = company.name || 'Sua Empresa';
    const category = company.category || 'empresa';
    const address = company.address || company.city || 'sua região';
    const phone = company.phone || 'seu telefone';
    const city = company.city || 'sua cidade';
    const state = company.state || 'SE';
    const website = company.website || 'seusite.com.br';

    const businessType = category.toLowerCase();
    const isService = ['barbearia', 'salão', 'academia', 'clínica', 'oficina', 'lavanderia'].some(t => businessType.includes(t));
    const isFood = ['pizzaria', 'restaurante', 'cafeteria', 'hamburgueria', 'sorveteria', 'açai', 'padaria'].some(t => businessType.includes(t));
    const isRetail = ['loja', 'mercado', 'farmácia', 'pet shop'].some(t => businessType.includes(t));

    let heroTitle = '';
    let heroSubtitle = '';
    let aboutText = '';
    let servicesList = [];

    if (isService) {
        heroTitle = `Transforme sua experiência com a melhor ${category} de ${city}`;
        heroSubtitle = 'Qualidade, confiança e resultado que fazem a diferença no seu dia a dia';
        aboutText = `A ${companyName} é referência em ${category} na região de ${city}. Com anos de experiência e uma equipe altamente qualificada, oferecemos serviços de excelência que superam as expectativas dos nossos clientes. Nossa missão é proporcionar a melhor experiência, com atendimento personalizado e resultados impecáveis.`;
        servicesList = [
            `${category} de alta qualidade`,
            'Atendimento personalizado',
            'Agendamento flexível',
            'Preços competitivos'
        ];
    } else if (isFood) {
        heroTitle = `Descubra os sabores incríveis da melhor ${category} de ${city}`;
        heroSubtitle = 'Ingredientes frescos, receitas exclusivas e um ambiente acolhedor para você e sua família';
        aboutText = `A ${companyName} nasceu da paixão pela culinária e do desejo de oferecer experiências gastronômicas memoráveis. Utilizamos ingredientes selecionados e receitas que combinam tradição e inovação para criar pratos que encantam todos os paladares.`;
        servicesList = [
            'Cardápio diversificado',
            'Ingredientes frescos e selecionados',
            'Ambiente acolhedor',
            'Delivery e retirada'
        ];
    } else if (isRetail) {
        heroTitle = `Encontre tudo o que você precisa na melhor ${category} de ${city}`;
        heroSubtitle = 'Variedade, qualidade e preços especiais para você e sua família';
        aboutText = `A ${companyName} é referência em ${category} na região de ${city}. Oferecemos uma ampla variedade de produtos de qualidade, com atendimento especializado e preços competitivos. Trabalhamos para proporcionar a melhor experiência de compra para nossos clientes.`;
        servicesList = [
            'Ampla variedade de produtos',
            'Qualidade garantida',
            'Preços especiais',
            'Atendimento personalizado'
        ];
    } else {
        heroTitle = `Conheça a ${companyName} - Excelência em ${category} em ${city}`;
        heroSubtitle = 'Qualidade, confiança e compromisso com a satisfação dos nossos clientes';
        aboutText = `A ${companyName} é uma empresa dedicada a oferecer serviços de alta qualidade em ${category}. Localizada em ${address}, nossa equipe está comprometida em superar as expectativas dos clientes, oferecendo soluções personalizadas e eficientes.`;
        servicesList = [
            'Serviços de alta qualidade',
            'Equipe especializada',
            'Atendimento personalizado',
            'Soluções sob medida'
        ];
    }

    const servicesFormatted = servicesList.map(service => `• ${service}`).join('\n     ');

    const prompt = `Crie uma landing page COMPLETA e PROFISSIONAL para ${companyName}, uma ${category} localizada em ${address}.

📋 INFORMAÇÕES DA EMPRESA:
• Nome: ${companyName}
• Categoria: ${category}
• Endereço: ${address}
• Cidade: ${city} - ${state}
• Telefone/WhatsApp: ${phone}
• Website: ${website || 'não possui'}

🎯 OBJETIVO DA PÁGINA:
Converter visitantes em clientes, gerando leads e agendamentos via WhatsApp.

📄 ESTRUTURA COMPLETA DA PÁGINA:

1. 🔹 HEADER (Topo)
   - Logo da empresa
   - Menu de navegação: Início, Serviços, Sobre, Depoimentos, Contato
   - Botão WhatsApp com número: ${phone}
   - Botão de agendamento

2. 🔹 HERO SECTION (Destaque Principal)
   - Título impactante: "${heroTitle}"
   - Subtítulo: "${heroSubtitle}"
   - Imagem de fundo de alta qualidade relacionada ao negócio
   - Botão principal: "Fale Conosco pelo WhatsApp" (link para ${phone})
   - Botão secundário: "Conheça Nossos Serviços"
   - Selos de confiança (ex: "Atendimento 5⭐", "Mais de 100 clientes satisfeitos")

3. 🔹 SERVIÇOS/PRODUTOS
   Título: "Nossos Serviços"
   - Lista de serviços com ícones e descrições:
     ${servicesFormatted}
   - Cards com imagem, título, descrição e preço
   - Botão "Solicitar Orçamento"

4. 🔹 DIFERENCIAIS
   Título: "Por que escolher a ${companyName}?"
   - 4 diferenciais com ícones:
     • ✅ Qualidade Garantida
     • ✅ Atendimento Personalizado
     • ✅ Equipe Especializada
     • ✅ Preços Competitivos

5. 🔹 SOBRE NÓS
   Título: "Conheça nossa história"
   - Texto: "${aboutText}"
   - Imagem da equipe ou do estabelecimento
   - Missão, Visão e Valores

6. 🔹 DEPOIMENTOS
   Título: "O que nossos clientes dizem"
   - 3 depoimentos com:
     • Nome do cliente
     • Foto (placehold)
     • Texto do depoimento
     • Avaliação (⭐ 5)
   - Carrossel ou grid de depoimentos

7. 🔹 GALERIA
   Título: "Nossos trabalhos"
   - Grid de 6 imagens relacionadas ao negócio
   - Fotos do estabelecimento, produtos ou serviços

8. 🔹 CONTATO E LOCALIZAÇÃO
   Título: "Entre em contato"
   - Endereço completo: ${address}
   - Telefone: ${phone}
   - WhatsApp: ${phone} (com botão de link direto)
   - E-mail: ${category}@${companyName.toLowerCase().replace(/[^a-z]/g, '')}.com
   - Horário de funcionamento
   - Mapa do Google Maps (embutido)
   - Formulário de contato (Nome, Email, Telefone, Mensagem)

9. 🔹 BOTÃO FLUTUANTE WHATSAPP
   - Ícone do WhatsApp fixo no canto inferior direito
   - Link direto para: https://wa.me/55${phone.replace(/\D/g, '')}
   - Animação de pulso para chamar atenção

10. 🔹 RODAPÉ (Footer)
    - Logo
    - Links rápidos (Serviços, Sobre, Contato)
    - Redes sociais (Instagram, Facebook)
    - Copyright: © 2024 ${companyName} - Todos os direitos reservados
    - Desenvolvido por [Seu Nome]

🎨 DESIGN E ESTILO:
• Paleta de cores harmoniosa e profissional
• Tipografia moderna e legível
• Design responsivo (mobile-first)
• Animações suaves
• Espaçamento generoso
• Botões com hover effects
• Cards com sombras
• Gradientes sutis

🛠 TECNOLOGIAS:
• HTML5 semântico
• CSS3 com animações
• JavaScript para interações
• Font Awesome ou Material Icons
• Google Fonts
• Design System consistente

🎯 COPYWRITING PERSONALIZADO:

Títulos sugeridos:
- "${heroTitle}"
- "Transforme sua experiência com a ${companyName}"
- "A qualidade que você merece em ${city}"

Frases de impacto:
- "Sua satisfação é nossa prioridade"
- "Qualidade que vai além das expectativas"
- "O melhor de ${city} em um só lugar"
- "Venha conhecer a diferença"

Call-to-Action:
- "Fale Conosco pelo WhatsApp"
- "Agende seu horário agora"
- "Solicite seu orçamento"
- "Visite nossa loja"

📱 INTEGRAÇÕES:
• Link direto para WhatsApp: https://wa.me/55${phone.replace(/\D/g, '')}
• Link para Google Maps: https://www.google.com/maps/search/${encodeURIComponent(address)}
• Link para Instagram (se disponível)
• Link para Facebook (se disponível)

⚠️ OBSERVAÇÕES IMPORTANTES:
1. Todos os botões de WhatsApp devem usar o número: ${phone}
2. A página deve carregar rapidamente
3. SEO básico implementado
4. Meta tags para compartilhamento
5. Código limpo e comentado
6. Totalmente responsivo

📦 GERAR HTML + CSS COMPLETO (um único arquivo):`;

    return prompt;
};

export const generateReactLandingPagePrompt = (company) => {
    const basePrompt = generateLandingPagePrompt(company);
    
    const reactConstraint = `

⚠️ REGRA DE ENTREGA — OBRIGATÓRIA, NÃO NEGOCIÁVEL:
Entregue o código em EXATAMENTE 2 arquivos, nada além disso:
1. App.js — componente React puro (function components + hooks), incluindo TODAS as seções da página num único arquivo (sem separar em outros componentes/arquivos)
2. index.css — todo o CSS da página

REQUISITOS TÉCNICOS DESSA ENTREGA:
• Não crie package.json, não crie estrutura de pastas, não use imports de outros arquivos .js locais
• Não use Next.js, Vite config, Webpack ou qualquer ferramenta de build — o código deve rodar como React puro via Babel standalone (CDN)
• App.js deve terminar renderizando com: ReactDOM.createRoot(document.getElementById('root')).render(<App />)
• Pode usar useState e useEffect (via React.useState / React.useEffect)
• Ícones: use SVG inline ou emoji — nunca bibliotecas de ícone que dependam de npm install
• Sem TypeScript — CSS 100% no index.css usando classNames
• Lembre-se: SOMENTE App.js e index.css — não crie nenhum outro arquivo

📦 Reescreva a entrega seguindo ESTRITAMENTE esses 2 arquivos: App.js (React puro, componente único) e index.css.`;

    return basePrompt + reactConstraint;
};

export const buildPromptForProvider = (providerId, company) => {
    const REACT_CONSTRAINED_AI_IDS = ['deepseek', 'chatgpt', 'claude', 'gemini', 'perplexity', 'copilot'];
    
    if (REACT_CONSTRAINED_AI_IDS.includes(providerId)) {
        return generateReactLandingPagePrompt(company);
    }
    return generateLandingPagePrompt(company);
};

export const generateSalesMessage = (company, stage) => {
    const companyName = company.name || 'sua empresa';
    const contactName = company.contactName || 'cliente';
    const phone = company.phone || 'seu telefone';

    const messages = {
        initial: `Olá ${contactName}, tudo bem? 👋

Aqui é [SEU_NOME] da Frontay Technologia.

Analisei a presença digital da ${companyName} e notei que seu negócio poderia estar faturando muito mais com uma presença online profissional.

Já ajudamos mais de 200 empresas a terem sites que realmente vendem. E o melhor: entregamos em até 7 dias úteis.

Posso te mostrar como funciona na prática? São apenas 3 minutos.

Aguardo seu retorno! 🚀`,

        responded: `Que bom que você topou conversar, ${contactName}! 🎉

Tomei a liberdade de criar um esboço visual do site da ${companyName}. Quero que você veja como sua empresa pode ficar incrível na internet.

📲 Veja o protótipo que criei:
[LINK_DO_SITE_DEMO]

✨ Design moderno e profissional
📱 100% responsivo
🎯 Focado em converter visitantes em clientes

Isso é apenas uma prévia do que podemos fazer. O que você achou?

Posso te explicar como lançamos isso em até 7 dias úteis.

Aguardo seu feedback! 🙌`,

        demo_sent: `${contactName}, o que achou do protótipo?

A Frontay Technologia tem mais de 3 anos de mercado e sabemos exatamente o que faz um site vender.

Podemos agendar uma call rápida de 15 minutos para alinhar os detalhes do seu projeto.

Quer marcar?

💬 WhatsApp: [SEU_NUMERO]`,

        converted: `🎉 Fechamos! Parabéns pela decisão, ${contactName}!

Agora vamos começar o desenvolvimento do site da ${companyName} hoje mesmo.

Próximos passos:
1️⃣ Enviarei o contrato para assinatura
2️⃣ Iniciamos o design em 24h
3️⃣ Entrega em até 7 dias úteis

Seu negócio vai decolar! 🚀`
    };

    return messages[stage] || messages.initial;
};

export const generateDemoLink = (company) => {
    const slug = company.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    return `https://frontay.com.br/demo/${slug}`;
};

// ============================================================
// NOVAS FUNÇÕES ADICIONADAS (para o App.js)
// ============================================================

// Chave para salvar as landing pages no localStorage
const LANDING_PAGES_KEY = 'frontay_landing_pages';

// Função para salvar uma landing page gerada
export const saveLandingPage = (companyId, files) => {
    try {
        const saved = localStorage.getItem(LANDING_PAGES_KEY);
        const pages = saved ? JSON.parse(saved) : {};
        
        pages[companyId] = {
            companyId,
            files,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(LANDING_PAGES_KEY, JSON.stringify(pages));
        return pages[companyId];
    } catch (e) {
        console.error('Erro ao salvar landing page:', e);
        return null;
    }
};

// Função para buscar uma landing page salva
export const getLandingPage = (companyId) => {
    try {
        const saved = localStorage.getItem(LANDING_PAGES_KEY);
        if (!saved) return null;
        
        const pages = JSON.parse(saved);
        return pages[companyId] || null;
    } catch (e) {
        console.error('Erro ao buscar landing page:', e);
        return null;
    }
};

// Função para buscar todas as landing pages
export const getAllLandingPages = () => {
    try {
        const saved = localStorage.getItem(LANDING_PAGES_KEY);
        if (!saved) return {};
        return JSON.parse(saved);
    } catch (e) {
        console.error('Erro ao buscar landing pages:', e);
        return {};
    }
};

// Função para gerar os arquivos da landing page (simulação)
export const generateLandingPageFiles = (company, files) => {
    // Esta função gera os arquivos para download
    // files pode ser { appJs: '...', indexCss: '...' } ou { indexHtml: '...' }
    
    const companyName = company.name || 'empresa';
    const slug = companyName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const zipName = `landing-page-${slug}-${timestamp}`;
    
    // Se for React (App.js + index.css)
    if (files?.appJs) {
        return {
            name: zipName,
            files: [
                { name: 'App.js', content: files.appJs },
                { name: 'index.css', content: files.indexCss || '/* CSS da landing page */' }
            ],
            type: 'react'
        };
    }
    
    // Se for HTML único
    if (files?.indexHtml) {
        return {
            name: zipName,
            files: [
                { name: 'index.html', content: files.indexHtml }
            ],
            type: 'html'
        };
    }
    
    // Fallback: prompt
    return {
        name: zipName,
        files: [
            { name: 'prompt.txt', content: generateLandingPagePrompt(company) }
        ],
        type: 'prompt'
    };
};

// Função para deletar uma landing page
export const deleteLandingPage = (companyId) => {
    try {
        const saved = localStorage.getItem(LANDING_PAGES_KEY);
        if (!saved) return;
        
        const pages = JSON.parse(saved);
        delete pages[companyId];
        localStorage.setItem(LANDING_PAGES_KEY, JSON.stringify(pages));
    } catch (e) {
        console.error('Erro ao deletar landing page:', e);
    }
};

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
    generateLandingPagePrompt,
    generateReactLandingPagePrompt,
    buildPromptForProvider,
    generateSalesMessage,
    generateDemoLink,
    saveLandingPage,
    getLandingPage,
    getAllLandingPages,
    generateLandingPageFiles,
    deleteLandingPage
};