# ShoppingLink

Projeto acadêmico final: marketplace intermediador entre clientes, lojas e o Capim Dourado Shopping, em Palmas–TO.

## Rodar no VS Code

Abra esta pasta no VS Code e execute no terminal:

```bash
npm install
npm run dev
```

Depois acesse http://localhost:3000.

## Build de produção

```bash
npm run build
npm start
```

## Rotas principais

- `/` — início
- `/busca` — catálogo e busca
- `/loja/acium` — vitrine da ACIUM
- `/produto/colar-acium` — detalhe do produto
- `/carrinho` — carrinho e checkout demonstrativo
- `/pedidos` — acompanhamento do pedido
- `/painel` — painel do lojista

Os dados iniciais funcionam em memória e ficam persistidos no `localStorage` do navegador. O manual completo está em `docs/GUIA-APRESENTACAO.md` e em `docs/ShoppingLink-Guia-Apresentacao.pdf`.
