# ShoppingLink
## Acessar o site

 **https://andrebarros-hue.github.io/HackaRun-Project-/**

Projeto acadêmico final: marketplace intermediador entre clientes, lojas e o Capim Dourado Shopping, em Palmas–TO.

## Rotas principais

- `/` — início
- `/busca` — catálogo e busca
- `/loja/acium` — vitrine da ACIUM
- `/produto/colar-acium` — detalhe do produto
- `/carrinho` — carrinho e checkout demonstrativo
- `/pedidos` — acompanhamento do pedido
- `/painel` — painel do lojista
- `/lojas` — diretório com as 182 lojas oficiais (filtros por categoria, piso e vitrine online)
- `/lojas?grupo=Gastronomia` — restaurantes, cafés e doces
- `/favoritos` — produtos salvos no navegador

Os dados iniciais funcionam em memória e ficam persistidos no `localStorage` do navegador. O manual completo está em `docs/GUIA-APRESENTACAO.md` e em `docs/ShoppingLink-Guia-Apresentacao.pdf`.

## Imagens e dados reais

- `app/directory.js` — diretório de lojas gerado a partir de https://www.capimdouradosc.com.br/lojas/ (consulta em 13/11/2026); logos em `public/lojas/`.
- `app/mall.js` — endereço, horários, serviços, fotos e créditos. Fotos do shopping em `public/shopping/`: vista aérea (CC BY-SA 4.0, Capim Dourado Shopping) e Cinemark (CC BY-SA 3.0, gugapalmas), ambas do Wikimedia Commons, além dos banners de divulgação Doce Natal e Imerso Mar do site oficial.
- Fotos de produtos: 8 são do Unsplash e estão marcadas como "foto ilustrativa"; os demais produtos usam ilustrações marcadas como "ilustração". Substitua por fotos enviadas pelas lojas em `public/produtos/`.
- Os créditos completos aparecem no site, em Rodapé → "Créditos das imagens".


LINK DO VIDEO DO NOSSO PROJETO 
https://youtube.com/shorts/DQrcrFdt3N8?is=DEeqyhtdlNRyJtLp