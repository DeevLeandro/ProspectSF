// Apenas IAs de chat (geram texto). Lovable/Bolt/Replit saíram: eram para gerar sites.
export const aiProviders = [
    { id: 'claude', name: 'Claude', color: '#D97757', supportsUrlPrefill: false, url: 'https://claude.ai/new', note: 'Prompt copiado — cole com Ctrl+V' },
    { id: 'chatgpt', name: 'ChatGPT', color: '#10A37F', supportsUrlPrefill: true, buildUrl: (p) => `https://chatgpt.com/?q=${encodeURIComponent(p)}`, note: 'Abre já com o prompt' },
    { id: 'gemini', name: 'Gemini', color: '#4285F4', supportsUrlPrefill: false, url: 'https://gemini.google.com/app', note: 'Prompt copiado — cole com Ctrl+V' },
    { id: 'deepseek', name: 'DeepSeek', color: '#4D6BFE', supportsUrlPrefill: false, url: 'https://chat.deepseek.com', note: 'Prompt copiado — cole com Ctrl+V' },
    { id: 'grok', name: 'Grok', color: '#1DA1F2', supportsUrlPrefill: false, url: 'https://grok.com', note: 'Prompt copiado — cole com Ctrl+V' },
    { id: 'perplexity', name: 'Perplexity', color: '#20808D', supportsUrlPrefill: true, buildUrl: (p) => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}`, note: 'Abre já com o prompt' },
    { id: 'mistral', name: 'Mistral', color: '#FF7000', supportsUrlPrefill: false, url: 'https://chat.mistral.ai', note: 'Prompt copiado — cole com Ctrl+V' }
];

export async function sendPromptToAI(provider, prompt) {
    try { await navigator.clipboard.writeText(prompt); } catch (e) {}
    const targetUrl = provider.supportsUrlPrefill ? provider.buildUrl(prompt) : provider.url;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
}
