# ShoppingLink — plano de implementação

**Contexto local:** Capim Dourado Shopping, Palmas–TO. O catálogo-demo usa lojas da operação local e o fluxo de retirada/entrega foi pensado para o público palmense.

## Escopo aprovado

Construir uma plataforma web de intermediação entre shopping, lojas e clientes, inspirada nas referências de comparação de preços do material anexado. A primeira entrega será um protótipo finalizável para apresentação acadêmica no contexto do Capim Dourado Shopping, em Palmas–TO, com navegação fluida, dados de demonstração realistas e persistência local no navegador. O cadastro de produtos, imagens, carrinho, usuário, pedidos e itens criados pelo lojista funcionarão sem banco externo; o próprio projeto deixará explícito o ponto de troca para um banco real.

## Abordagem de implementação

- Aplicação Next.js com App Router e JavaScript.
- Uma experiência SPA orientada a rotas amigáveis (`/`, `/busca`, `/loja/:id`, `/produto/:id`, `/carrinho`, `/pedidos`, `/painel`) usando History API para manter a demonstração fluida.
- Catálogo seed em memória com fotos remotas, lojas, descontos, avaliações e especificações.
- `localStorage` como camada de persistência de demonstração para carrinho, produtos cadastrados, usuário e pedidos.
- Ações completas de apresentação: busca e filtros, detalhe de produto, abertura da loja, adicionar/remover carrinho, login demo, checkout com Pix/cartão, acompanhamento de pedido e cadastro de produto no painel do lojista.
- CSS responsivo escrito no projeto, com foco em HTML5 semântico, acessibilidade básica, estados de hover/foco, feedback toast, modal de login e adaptação para mobile.
- PDF de documentação com instalação, arquitetura, roteiro de apresentação e migração para banco funcional.

## Direção visual

Três caminhos considerados: **varejo editorial premium** (0,08), **dashboard neon de marketplace** (0,06) e **minimalismo institucional** (0,04). Foi escolhido o primeiro.

### Design Movement

Varejo editorial premium com linguagem de shopping contemporâneo: base clara, tipografia forte, blocos de conteúdo assimétricos, grandes imagens de produto e acentos em coral energético.

### Core Principles

1. **Decisão rápida:** preço, desconto, disponibilidade e retirada aparecem antes da descrição longa.
2. **Confiança local:** a loja, sua reputação e o shopping são tratados como parte do produto.
3. **Ritmo editorial:** alternância de faixas, cards e painéis cria leitura mais humana que um grid genérico.
4. **Feedback contínuo:** cada ação confirma o próximo passo com estados visuais e microcopy clara.

### Color Philosophy

O azul noite ancora a marca em segurança e tecnologia. O coral vivo é a assinatura de oportunidade e ação, reservado para CTAs, preços promocionais e indicadores positivos. O creme aquecido evita a aparência fria de um e-commerce genérico e aproxima o produto da experiência física do shopping.

### Layout Paradigm

Composição em faixas editoriais: hero assimétrico, rail de categorias, produtos em mosaico e painéis laterais contextuais. A navegação sempre mantém um próximo passo visível, evitando telas centradas sem hierarquia.

### Signature Elements

- Marca “S” construída com um símbolo de dois chevrons, sugerindo shopping e deslocamento.
- Etiquetas coral de desconto com cantos suaves e microtexto monoespaçado.
- Barra de confiança com status de estoque, retirada e entrega exibidos junto do preço.

### Interaction Philosophy

A interface não esconde estado. Adicionar, reservar, iniciar login e confirmar pedido mudam imediatamente a tela e informam o que aconteceu. A navegação de apresentação é curta e reversível; ações importantes têm resumo antes da confirmação.

### Animation

Usar transições curtas de 180–260 ms, entrada vertical leve dos blocos e elevação sutil em cards. Evitar movimentos decorativos que prejudiquem a leitura. Toasts entram pela lateral, modais usam fade + scale e a timeline de pedidos usa preenchimento progressivo.

### Typography System

Usar Inter como família de interface via fallback de sistema (`Arial`, `Helvetica`, `sans-serif`), com títulos em peso 800, labels em caixa alta com espaçamento e números de preço em peso 800. O contraste entre display grande e microcopy compacta simula uma vitrine editorial.

### Brand Essence

ShoppingLink é a camada digital que conecta a intenção do cliente ao produto disponível no shopping, com curadoria local e jornada de compra transparente. Personalidade: **prático, confiável, próximo**.

### Brand Voice

Headlines são diretas e orientadas a benefício. CTAs usam verbos de ação. Exemplos: “Encontre no shopping, compre do seu jeito.” e “Reserve agora e retire sem fila.”

### Wordmark & Logo

Wordmark em caixa mista com o símbolo `S//` antes do nome. O símbolo representa duas trajetórias que se encontram: cliente e loja.

### Signature Brand Color

Coral ShoppingLink `#ff6b4a`.

## Estrutura do projeto

```text
shoppinglink/
├── app/
│   ├── globals.css       # Design system, layout e responsividade
│   ├── layout.js         # Metadados e shell da aplicação
│   └── page.js           # Rotas da demonstração e componentes de fluxo
├── public/
│   └── manus-routes.json # Manifesto de rotas da aplicação
├── docs/
│   └── GUIA-APRESENTACAO.md # Fonte do PDF de documentação
├── app.config.ts         # Identidade visual do projeto no ambiente Manus
├── next.config.mjs
├── package.json
├── TODO.md
└── plan.md
```

## Fluxo de construção e entrega

1. Criar a base Next.js e configurar diagnóstico JavaScript/CSS.
2. Implementar dados seed, shell, navegação e páginas do fluxo cliente.
3. Implementar carrinho, login demo, pedidos e timeline de acompanhamento.
4. Implementar painel do lojista com formulário funcional e persistência local.
5. Validar manifesto de rotas, build de produção e servidor de preview.
6. Gerar e revisar o PDF de documentação.
7. Salvar checkpoint no repositório canônico do projeto.
