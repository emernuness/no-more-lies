export const getList = (raw: string | undefined, fallback: string[]) => {
  if (!raw) return fallback;
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
};

export const getNumber = (raw: string | undefined, fallback: number) => {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const FACT_PROMPT_SYSTEM = process.env.NML_PROMPT_FACT_SYSTEM;
export const SOURCES_PROMPT_SYSTEM = process.env.NML_PROMPT_SOURCES_SYSTEM;

export const WHITELIST = getList(process.env.NML_WHITELIST, []);
export const BLACKLIST = getList(process.env.NML_BLACKLIST, []);
export const GOV_PATTERNS = getList(process.env.NML_GOV_PATTERNS, ['.gov', '.gob.', '.gouv.', 'gov.cn', 'kremlin.ru', 'planalto.gov.br', 'secom.gov.br']);
export const HINT_DOMAINS = getList(process.env.NML_HINT_DOMAINS, []);
export const SOURCES_MAX = getNumber(process.env.NML_SOURCES_MAX, 6);