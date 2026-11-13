# ShoppingLink
## Guia de rodagem, apresentação e evolução

**Projeto final — Capim Dourado Shopping · Palmas, Tocantins**  
**Stack:** Next.js, JavaScript, React, HTML5 e CSS  
**Versão da entrega:** protótipo funcional com dados em memória e persistência local

---

## 1. O que é o projeto

O ShoppingLink é uma camada digital de intermediação entre o cliente e as lojas do Capim Dourado Shopping, em Palmas–TO. A ideia é permitir que a pessoa pesquise um produto sem precisar atravessar o shopping para descobrir se ele está disponível. Ela compara ofertas, abre a vitrine da loja, escolhe retirar no shopping ou receber em casa, confirma o pedido e acompanha o andamento.

A experiência foi construída a partir das propostas do material fornecido: uma tela inicial com busca e descontos do dia, resultados de pesquisa, página da loja, página do produto, carrinho/pedido, acompanhamento e painel do lojista. A primeira versão não depende de servidor de dados externo. O catálogo começa com informações de demonstração em memória e as ações feitas durante a apresentação são salvas no `localStorage` do navegador.

A identidade local foi aplicada em toda a experiência. O cabeçalho exibe “Capim Dourado Shopping · Palmas–TO”, o fluxo usa retirada local e o catálogo-demo foi organizado com marcas presentes na listagem do shopping, como ACIUM, ADCOS e Aleatory. Os nomes, fotos, preços, descontos e estoques dos produtos são dados ilustrativos para a banca e devem ser confirmados com as lojas antes de um uso comercial.

O site oficial informa o endereço do shopping como Q. 107 Norte, Avenida NS 5, s/n, Plano Diretor Norte, CEP 77001-098, Palmas/TO. A página oficial informa horário de lojas e quiosques de segunda a sábado, das 10h às 22h, e aos domingos, das 14h às 20h. A própria página também organiza o empreendimento por categorias de moda, beleza, eletrônicos, alimentação, serviços e outras frentes.[1]

---

## 2. Resultado entregue

A aplicação possui sete entradas de navegação. A home funciona como vitrine do shopping e concentra busca, descontos, categorias, lojas parceiras e o fluxo explicado em três passos. A busca filtra por termo, categoria e permite ordenar por relevância, menor preço ou maior preço. A página da loja exibe capa, descrição, reputação, localização contextual e catálogo. O detalhe do produto apresenta foto, desconto, estoque, especificações, retirada e entrega.

O carrinho permite alterar quantidade, remover itens, visualizar subtotal e entrega, escolher Pix ou cartão e confirmar o pedido. O login é demonstrativo: o usuário informa o nome e a sessão é salva localmente. Após a confirmação, o pedido aparece no acompanhamento com uma timeline de cinco etapas: pedido recebido, produto encontrado, pedido confirmado, saiu para entrega e entregue.

A área do lojista tem painel com indicadores, gráfico demonstrativo, pedidos recentes, catálogo publicado e formulário de cadastro. O formulário aceita nome, categoria, preço atual, preço anterior, estoque, etiqueta, URL da imagem e descrição. Ao publicar, o novo produto aparece imediatamente na vitrine da ACIUM e fica persistido no navegador.

---

## 3. Pré-requisitos

Instale o Node.js 20.9 ou superior. A versão usada no ambiente de validação foi Node 22.23.4, com Next.js 16.4.6 e React 19.3.1. Também é necessário ter npm disponível no terminal.

O projeto pode ser executado em Windows, macOS ou Linux. Para a apresentação, recomenda-se usar uma janela de navegador com pelo menos 1280 × 720 pixels e limpar dados antigos do site antes de iniciar uma demonstração limpa.

---

## 4. Instalação do zero

Abra o terminal e entre na pasta do projeto:

```bash
cd shoppinglink
```

Instale as dependências fixadas no `package.json`:

```bash
npm install
```

Inicie o modo de desenvolvimento:

```bash
npm run dev
```

Acesse no navegador:

```text
http://localhost:3000
```

O ambiente gerenciado do projeto usa a porta 3000 e escuta em `0.0.0.0`, então o mesmo comando também funciona no Preview do projeto. Não altere a porta sem atualizar a configuração do ambiente.

Para encerrar o desenvolvimento, use `Ctrl + C` no terminal.

---

## 5. Comandos de produção

O build de produção é feito com:

```bash
npm run build
```

A execução do build local é feita com:

```bash
npm start
```

A validação desta entrega foi concluída com sucesso. O build identificou as rotas da página inicial, do fallback de 404 e da rota dinâmica catch-all usada para carregar as telas internas.

Também foram verificados os seguintes endereços, todos retornando HTTP 200:

```text
/
/busca
/loja/acium
/produto/colar-acium
/carrinho
/pedidos
/painel
```

O arquivo `public/manus-routes.json` declara as sete rotas de apresentação:

```json
{
  "routes": [
    { "path": "/", "title": "Início — ShoppingLink" },
    { "path": "/busca", "title": "Busca — ShoppingLink" },
    { "path": "/loja/:id", "title": "Loja — ShoppingLink" },
    { "path": "/produto/:id", "title": "Produto — ShoppingLink" },
    { "path": "/carrinho", "title": "Carrinho — ShoppingLink" },
    { "path": "/pedidos", "title": "Acompanhamento — ShoppingLink" },
    { "path": "/painel", "title": "Painel do lojista — ShoppingLink" }
  ]
}
```

---

## 6. Roteiro de apresentação para a banca

### Abertura

Comece explicando o problema: o cliente muitas vezes sabe o que quer comprar, mas não sabe em qual loja do shopping existe o produto, qual é o preço ou se há estoque. O ShoppingLink cria uma vitrine digital do Capim Dourado e aproxima a intenção de compra da loja física.

### Demonstração recomendada

1. Abra a home em `/` e mostre a identificação do Capim Dourado Shopping em Palmas–TO.
2. No campo principal, digite `ACIUM` ou `colar` e clique em **Encontrar**.
3. Na busca, mostre o filtro por categoria, o ordenamento e os cards com preço, desconto, loja e retirada.
4. Abra **Colar ACIUM Essencial** em `/produto/colar-acium`.
5. Mostre preço promocional, estoque, retirada no shopping, entrega em casa e botão de adicionar ao carrinho.
6. Vá ao carrinho, altere a quantidade e clique em **Entrar e confirmar pedido**.
7. No modal, informe um nome, por exemplo `Marina Costa`, e prossiga.
8. Confirme o pedido e mostre a timeline em `/pedidos`.
9. Volte à home e acesse **Sou lojista** ou `/painel`.
10. No painel, abra **Cadastrar produto**, preencha os campos e use uma imagem pública autorizada para a demonstração.
11. Publique o produto, abra **Seus produtos** e depois **Ver minha vitrine** para provar que o item entrou na experiência do cliente.

### Fala de encerramento

Finalize dizendo que o protótipo já prova a jornada principal de descoberta, compra, operação da loja e acompanhamento. A camada de dados foi isolada para que a próxima etapa substitua a persistência do navegador por API e banco sem reescrever a experiência visual.

---

## 7. Como cadastrar um produto na apresentação

Acesse `/painel` e clique em **Cadastrar produto**. Preencha o nome do produto, selecione uma categoria e informe o preço atual. O preço anterior é opcional; quando preenchido, o sistema calcula o percentual de desconto automaticamente.

Informe o estoque, escolha uma etiqueta e cole a URL de uma foto pública autorizada. Nesta entrega, a foto é tratada como um endereço dentro do objeto do produto e armazenada junto aos dados locais. Em uma versão real, a foto deverá ser enviada para um serviço de armazenamento e o banco deverá guardar apenas a URL segura do arquivo.

A descrição curta aparece no card e no detalhe do produto. Ao clicar em **Publicar produto**, o cadastro é inserido no catálogo da loja-demo ACIUM, recebe um identificador local e fica salvo em `localStorage`.

Para fazer uma apresentação com o navegador zerado, abra as ferramentas de desenvolvedor e execute:

```js
localStorage.removeItem('shoppinglink-products');
localStorage.removeItem('shoppinglink-cart');
localStorage.removeItem('shoppinglink-orders');
localStorage.removeItem('shoppinglink-user');
location.reload();
```

---

## 8. Arquitetura da primeira versão

A aplicação está concentrada em uma experiência client-side com componentes React e navegação orientada a rotas. O Next.js entrega a página, a rota catch-all permite o carregamento direto das URLs internas e a History API evita recarregamentos durante a apresentação.

```text
Navegador
   │
   ├── Next.js App Router
   │      ├── app/layout.js       metadados e shell HTML
   │      ├── app/page.js         componentes e fluxo da aplicação
   │      ├── app/[...slug]/      entrada das URLs internas
   │      └── app/globals.css     design system responsivo
   │
   ├── Estado React
   │      ├── produtos
   │      ├── carrinho
   │      ├── usuário demo
   │      └── pedidos
   │
   └── localStorage
          ├── shoppinglink-products
          ├── shoppinglink-cart
          ├── shoppinglink-orders
          └── shoppinglink-user
```

O catálogo inicial está nos constantes `STORES`, `INITIAL_PRODUCTS` e `INITIAL_ORDERS` do arquivo `app/page.js`. As ações de persistência estão no componente `ShoppingLinkApp`. A função `onCreateProduct` é o ponto mais simples para trocar o cadastro local por uma chamada HTTP quando a API real existir.

---

## 9. Estrutura de arquivos

```text
shoppinglink/
├── app/
│   ├── [...slug]/page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── docs/
│   ├── assets/
│   └── GUIA-APRESENTACAO.md
├── public/
│   └── manus-routes.json
├── app.config.ts
├── next.config.mjs
├── package.json
├── package-lock.json
├── plan.md
└── TODO.md
```

O `plan.md` registra a direção visual e as decisões de implementação. O `TODO.md` organiza os critérios de aceite e marca o que já foi entregue. O PDF final é gerado a partir deste arquivo Markdown.

---

## 10. Dados em memória e limitações conscientes

Os produtos iniciais são dados seed e não representam um inventário oficial em tempo real. Eles foram criados para permitir a apresentação sem exigir login real, API de estoque ou banco. O `localStorage` melhora a demonstração porque preserva o produto cadastrado e o pedido mesmo depois de atualizar a tela, mas continua sendo uma persistência exclusiva do navegador.

Não existe pagamento real nesta versão. Pix e cartão são opções visuais de fluxo. O login é apenas demonstrativo. A entrega é simulada. Os preços, descontos, fotos, avaliações e estoques devem ser tratados como conteúdo de protótipo até que cada loja autorize e atualize os dados.

As fotos usadas no seed são imagens externas para demonstrar composição visual. Antes de publicar para clientes, substitua-as por fotos autorizadas pelas lojas, preferencialmente enviadas para um armazenamento controlado pelo projeto.

---

## 11. Integração com banco funcional — passo a passo

### 11.1 Escolha de infraestrutura

Para a próxima etapa, habilite um servidor e um banco gerenciado no ambiente do projeto. O frontend atual pode continuar em Next.js. Uma API no próprio Next pode usar Route Handlers em `app/api`, ou uma API separada pode ser criada caso a banca exija uma divisão explícita entre frontend e backend.

O caminho recomendado é usar PostgreSQL ou MySQL com Prisma. O objetivo é preservar os mesmos objetos que hoje vivem em memória: loja, produto, usuário, pedido e item do pedido.

### 11.2 Instalação do ORM

No projeto, instale o Prisma:

```bash
npm install prisma @prisma/client
npx prisma init
```

Configure a variável `DATABASE_URL` em um arquivo `.env` local, sem enviar credenciais para o Git:

```env
DATABASE_URL="mysql://usuario:senha@host:3306/shoppinglink"
```

### 11.3 Modelo mínimo de dados

Um modelo inicial pode ser organizado assim:

```prisma
model Store {
  id          String    @id @default(cuid())
  name        String
  category    String
  description String?
  imageUrl    String?
  products    Product[]
  orders      Order[]
  createdAt   DateTime  @default(now())
}

model Product {
  id          String      @id @default(cuid())
  storeId     String
  name        String
  category    String
  description String?
  imageUrl    String
  price       Decimal     @db.Decimal(10, 2)
  oldPrice    Decimal?    @db.Decimal(10, 2)
  stock       Int         @default(0)
  published   Boolean     @default(true)
  store       Store       @relation(fields: [storeId], references: [id])
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
}

model Order {
  id         String      @id @default(cuid())
  userId     String?
  storeId    String
  status     String      @default("RECEIVED")
  total      Decimal     @db.Decimal(10, 2)
  method     String
  address    String?
  store      Store       @relation(fields: [storeId], references: [id])
  items      OrderItem[]
  createdAt  DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  unitPrice Decimal @db.Decimal(10, 2)
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}
```

Depois do schema, execute:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 11.4 Criar endpoints

Crie endpoints para substituir o estado local:

```text
GET    /api/products
POST   /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
GET    /api/stores/:id
POST   /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id/status
```

O cadastro do painel deve trocar `onCreateProduct` por `fetch('/api/products', { method: 'POST', body: JSON.stringify(payload) })`. A home, busca, loja e detalhe devem carregar produtos da API. O carrinho pode continuar temporariamente no navegador, mas o pedido confirmado deve ser salvo no banco.

### 11.5 Upload real de imagens

Não grave imagens grandes em campos de texto do banco. Crie um endpoint de upload ou use um serviço de armazenamento compatível com S3. O fluxo deve ser: selecionar foto, enviar arquivo, receber URL pública ou assinada, salvar a URL no registro `Product` e mostrar preview antes da publicação.

Também será necessário validar tipo e tamanho do arquivo, gerar miniaturas e proteger o endpoint para que cada lojista só altere os produtos da própria loja.

### 11.6 Autenticação real

Substitua o modal demo por autenticação com sessão. Os papéis mínimos são `CUSTOMER`, `STORE_MANAGER` e `ADMIN`. O cliente pode criar pedidos e acompanhar os próprios pedidos. O lojista pode editar a própria vitrine, cadastrar produtos e atualizar status de pedidos. O administrador do shopping pode revisar lojas, produtos e conteúdo.

Em produção, não use `localStorage` para guardar tokens sensíveis. Prefira cookie de sessão seguro, com `HttpOnly`, `Secure` e política `SameSite` compatível com o domínio do preview/publicação.

### 11.7 Pagamentos e entrega

O projeto deve manter o pedido como “recebido” até que o pagamento seja confirmado por um provedor. Pix e cartão exigem integração real com um gateway, webhook de aprovação e tratamento de falhas. A taxa de entrega precisa vir de uma regra configurável ou de um parceiro logístico.

A timeline atual pode continuar com os mesmos cinco estados. A diferença é que cada mudança passa a ser registrada no banco e, se necessário, enviada por e-mail, WhatsApp ou notificação do navegador.

### 11.8 Testes e publicação

Depois da integração, crie testes para cadastro de produto, busca, estoque, criação de pedido, duplicidade de pagamento, atualização de status e permissões de lojista. Faça carga de dados de teste em uma base separada.

Antes de publicar, revise as fotos autorizadas, o nome real das lojas, horários, endereço e políticas. A lista de lojistas do Capim Dourado pode mudar, portanto o catálogo deve ser administrável e não depender de texto fixo no código.[1]

---

## 12. Troubleshooting

### A porta 3000 está ocupada

Encerre o processo que está usando a porta ou altere a porta do script de desenvolvimento e da configuração do ambiente de execução. Para a entrega gerenciada atual, mantenha 3000.

### O produto cadastrado não aparece

Verifique se o formulário recebeu nome, preço e URL de imagem. Depois, confirme no console do navegador se o `localStorage` contém a chave `shoppinglink-products`. Se quiser recomeçar, limpe as chaves listadas na seção de apresentação.

### A imagem não carrega

A URL precisa ser pública e aceitar carregamento pelo navegador. Use uma URL HTTPS direta para uma imagem. Em produção, prefira armazenamento próprio com política de acesso e URLs estáveis.

### A rota interna abre a home

A versão final possui `app/[...slug]/page.js` para resolver URLs diretas. Se esse arquivo for removido, o navegador ainda pode navegar via History API, mas o recarregamento de uma tela interna volta a falhar.

### O build falha depois de alterar o código

Execute `node --check app/page.js` para verificar sintaxe JavaScript e depois rode `npm run build`. Se o problema estiver em CSS, confira chaves abertas e seletores incompletos em `app/globals.css`.

---

## 13. Critérios de aceite da entrega

A entrega está pronta para apresentação quando a banca consegue acessar a home, buscar um produto, abrir uma loja, abrir um detalhe, adicionar ao carrinho, fazer login demo, confirmar um pedido, acompanhar a timeline e entrar no painel do lojista para publicar um produto.

Também deve ser possível rodar o projeto com apenas `npm install` e `npm run dev`, sem banco ou chave externa. O build precisa passar com `npm run build`. As rotas precisam responder diretamente. O conteúdo deve apresentar o Capim Dourado Shopping em Palmas–TO, e a documentação deve explicar claramente o que é demo, o que funciona em memória e o que ainda depende de integração externa.

---

## Referências

1. [Lojas — Capim Dourado Shopping, Palmas](https://www.capimdouradosc.com.br/lojas/). Fonte consultada para endereço, horários, categorias e relação pública de lojistas.
2. [Capim Dourado Shopping — site oficial](https://www.capimdouradosc.com.br/). Fonte institucional para localização, vitrine online, gastronomia, cinema e serviços.
