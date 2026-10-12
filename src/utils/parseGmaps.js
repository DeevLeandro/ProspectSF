// src/utils/parseGmaps.js
// -----------------------------------------------------------------------------
// Extrai dados de um bloco de texto copiado do Google Maps.
// Lê telefone em qualquer formato — (47) 99984-0876, tel:047..., +55 47... —
// e ainda puxa nome, categoria, endereço, cidade, estado, site e avaliação.
// -----------------------------------------------------------------------------

function normalizePhone(p) {
  let d = (p || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('55') && d.length >= 12) d = d.slice(2); // tira código do país
  d = d.replace(/^0+/, '');                                 // tira 0 do DDD (047 -> 47)
  return d;
}

export function parseGmapsPaste(text, fallbackCategory = '') {
  const raw = (text || '').replace(/\r/g, '');
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);

  // --- TELEFONE ---------------------------------------------------------------
  let phone = '';
  const tel = raw.match(/tel:\+?(\d{10,13})/i);            // 1) link tel: (mais confiável)
  if (tel) {
    phone = tel[1];
  } else {
    // 2) padrão BR: (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX, com espaços/hífen/ponto opcionais
    const m = raw.match(/\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}/);
    if (m) phone = m[0];
  }
  phone = normalizePhone(phone);

  // --- SITE -------------------------------------------------------------------
  let website = '';
  const url = raw.match(/https?:\/\/[^\s)\]]+/i);          // URL completa
  if (url && !/google\.|\/maps\/|gstatic/i.test(url[0])) {
    website = url[0];
  } else {
    const dom = raw.match(/\b(?:[a-z0-9-]+\.)+(?:com\.br|com|app|net|br|site|dev|io|org)\b(?:\/\S*)?/i);
    if (dom && !/google|gstatic/i.test(dom[0])) website = dom[0];
  }
  website = website.replace(/[)\].,]+$/, '');

  // --- ENDEREÇO + CIDADE + ESTADO --------------------------------------------
  let address = '', city = '', state = '';
  const addrLine =
    lines.find((l) => /\d{5}-?\d{3}/.test(l)) ||            // linha com CEP
    lines.find((l) => /^(R\.|Rua|Av\.|Avenida|Al\.|Trav|Pça|Praça|Rod|Estr)/i.test(l));
  if (addrLine) {
    address = addrLine;
    const cityUf = addrLine.match(/,\s*([^,]+?)\s*-\s*([A-Z]{2})\b/); // "..., Camboriú - SC,"
    if (cityUf) { city = cityUf[1].trim(); state = cityUf[2]; }
  }
  if (!city) {                                             // fallback: qualquer "Cidade - UF"
    const any = raw.match(/([A-Za-zÀ-ÿ.\s]+?)\s*-\s*([A-Z]{2})\b/);
    if (any) { city = any[1].split(/,|\s{2,}/).pop().trim(); state = any[2]; }
  }

  // --- CATEGORIA (linha terminada em ·) --------------------------------------
  let category = fallbackCategory;
  const catLine = lines.find((l) => /·\s*$/.test(l));
  if (catLine) category = catLine.replace(/·\s*$/, '').trim();

  // --- AVALIAÇÃO (4,8(42)) ----------------------------------------------------
  let rating = 0;
  const rat = raw.match(/(\d[.,]\d)\s*\(\d+\)/);
  if (rat) rating = parseFloat(rat[1].replace(',', '.'));

  // --- NOME (primeira linha "real") ------------------------------------------
  const noise = /^\d|avaliaç|estrela|aberto|fechado|abre|fecha|visão geral|avaliações|^sobre$|rotas|^salvar$|próximo|enviar|compartilhar|seu histórico|adicionar marcador/i;
  let name = lines.find((l) =>
    /[A-Za-zÀ-ÿ]/.test(l) &&
    !noise.test(l) &&
    !/^\(?\d{2}\)?[\s.-]?\d/.test(l) &&   // não é linha de telefone
    !/\d{5}-?\d{3}/.test(l) &&            // não é o endereço/CEP
    !/·\s*$/.test(l) &&                   // não é a categoria
    l !== website
  ) || lines[0] || '';
  name = name.replace(/\s*·\s*$/, '').trim();

  return { name, category, phone, address, city, state, website, hasWebsite: !!website, rating };
}