# TODO — ShoppingLink

## Aplicação e identidade visual

- [x] Entregar uma aplicação Next.js com JavaScript, HTML5 semântico e CSS próprio, responsiva para desktop e mobile, com identidade visual premium e navegação fluida.
- [x] Exibir a marca ShoppingLink com símbolo `S//`, shopping como contexto da compra, navegação principal, busca global e carrinho sempre acessível.

## Jornada do cliente

- [x] Tela inicial com hero contextual do shopping, pesquisa, categorias, produtos com desconto do dia, lojas em destaque e explicação do fluxo.
- [x] Tela de busca/resultados com consulta, filtros por categoria, ordenação, melhores preços, promoções, fotos, descrição e loja.
- [x] Tela de loja com foto, descrição, reputação, localização, contato simulado e catálogo separado por loja, destacando descontos e melhores preços.
- [x] Tela de produto com foto, galeria visual, descrição, especificações, preço, desconto, estoque, retirada no shopping e entrega em casa.
- [x] Tela de carrinho/pedidos com resumo do produto, foto, quantidade, preço, cálculo de subtotal e entrega, seleção de Pix ou cartão e confirmação após login demo.
- [x] Tela de acompanhamento com timeline para recebido, produto encontrado, confirmado, saiu para entrega e entregue.

## Jornada do lojista

- [x] Painel do lojista com resumo de pedidos, vendas demo, estoque e atalhos de gestão.
- [x] Cadastro de produto com nome, categoria, preço, preço anterior, estoque, imagem, descrição, tags e opção de publicação; produto criado aparece imediatamente no catálogo e persiste no navegador.

## Base técnica e documentação

- [x] Manter dados seed em memória e persistir alterações de apresentação em `localStorage`, sem exigir banco externo para rodar a primeira versão.
- [x] Disponibilizar manifesto `public/manus-routes.json` com todas as rotas de demonstração.
- [x] Entregar PDF completo com pré-requisitos, instalação, execução, arquitetura, mapa de telas, roteiro de apresentação, estrutura de dados, troubleshooting e plano de migração para banco real.
- [x] Validar instalação, build de produção, manifesto de rotas e servidor na porta configurada.

## Evolução futura documentada

- [x] Explicar a troca da camada `localStorage` por API/ORM e banco funcional, upload de imagens, autenticação real, pagamentos e notificações sem quebrar o fluxo de interface.
