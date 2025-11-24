## Objetivo
- Criar uma landing page em PT-BR apresentando a iniciativa No More Lies (NML), sua missão contra desinformação, uso de fontes independentes, neutralidade e um bloco de apoio com chave PIX.
- Usar MCP shadcn com a biblioteca React Bits para compor Hero, Background, Features, CTA, FAQ e Footer.

## Conteúdo e Estrutura
1. Hero (acima da dobra)
- Título forte: "No More Lies — Checagem independente, neutra e em tempo real"
- Subtítulo: missão resumida (combate à desinformação e fake news)
- CTA primário: "Começar a verificar" (anchor para a app atual) e CTA secundário: "Apoiar a iniciativa"
- Background visual (gradiente, matriz, noise) e badge "Projeto independente"

2. Sobre a Iniciativa
- Texto curto explicando: NML é independente, neutro e imparcial; foco em fontes sem viés político; contexto da alta desinformação política (PT-BR); como funciona (captura da fala, análise, fontes).
- Destaques em cards (3–4): "Independência", "Neutralidade", "Fontes Imparciais", "Transparência".

3. Como Funciona
- Passos simples (3–4): "Fale ou cole o trecho", "Análise automática", "Fontes independentes", "Compartilhe a verificação".

4. Apoie via PIX
- Texto: projeto 100% independente; por que apoiar; transparência.
- Exibir chave PIX (configurável) e botão "Copiar chave" + opcional QR Code.

5. FAQ
- Perguntas: "Como escolhem as fontes?", "O que significa ‘impreciso’?", "Posso sugerir fontes?", "Privacidade de dados?", "Funciona no celular?".

6. Footer
- Links essenciais: Política/Privacidade (placeholder), Contato (placeholder), GitHub (se aplicável).

## Componentes (React Bits + shadcn)
- Hero: `@react-bits/hero` ou equivalente
- Background: `@react-bits/background-gradient` ou `@react-bits/grid-pattern`
- Badge: `@react-bits/badge`
- Features grid: `@react-bits/features`
- Steps/Timeline: `@react-bits/steps`
- CTA section: `@react-bits/cta`
- FAQ Accordion: `@react-bits/faq`
- Footer: `@react-bits/footer`
- Ícones: `lucide-react` (já instalado)

## Integração MCP shadcn (React Bits)
1. Configurar registry React Bits
- Adicionar ao `components.json` (se não presente):
  - `"registries": { "@react-bits": "https://reactbits.dev/r/{name}.json" }`

2. Descobrir e instalar componentes
- Usar MCP shadcn para:
  - Listar/search itens do `@react-bits` (hero, background, features, steps, faq, cta, footer)
  - Gerar os `add` commands para instalar os componentes necessários

3. Auditoria
- Rodar checklist do MCP shadcn para confirmar imports, estilos e dependências dos componentes

## Implementação Técnica
- Criar `src/pages/Landing.tsx` com a composição dos blocos acima; textos em PT-BR.
- Roteamento simples: adicionar link no header atual para `/#/landing` ou `/landing` (o projeto Vite atual pode usar `react-router-dom` se desejarmos; caso não, usar âncoras/condicional simples).
- Estilização: aproveitar Tailwind (já presente via CDN), mantendo visual Dark (zinc) coerente com a app.
- PIX: ler chave via env `NML_PIX_KEY` e opcional `NML_PIX_QR_URL`.
- Acessibilidade: headings hierárquicos, `aria-label` nos CTAs, contraste.
- Desempenho: imagens/gradientes leves; evitar libs extras.

## Textos (PT-BR)
- Hero título: "No More Lies — checagem independente e neutra"
- Hero subtítulo: "Uma iniciativa 100% independente para combater desinformação e fake news com fontes imparciais"
- Sobre: "Vivemos um período de alta desinformação, especialmente política. O NML busca trazer luz aos fatos, usando fontes independentes e verificações neutras."
- Apoie: "Se você acredita em informação limpa e imparcial, apoie o NML. Sua contribuição mantém o projeto independente e transparente."
- FAQ exemplos: "Como escolhem as fontes? Priorizamos verificadores independentes, ONGs e academia; fontes governamentais e com viés são filtradas."

## Entregáveis
- Nova página `Landing.tsx` com blocos: Hero, Sobre, Como funciona, Apoie (PIX), FAQ, Footer.
- Integração dos componentes React Bits via MCP shadcn.
- Variáveis de ambiente para PIX: `NML_PIX_KEY`, `NML_PIX_QR_URL`.

## Próximos Passos (após aprovação)
1. Configurar registry `@react-bits` no `components.json`.
2. Usar MCP shadcn para adicionar os componentes listados.
3. Implementar `Landing.tsx` e integrar navegação.
4. Definir textos finais e a chave PIX no `.env`.
5. Validar visual no preview e ajustar responsividade.
