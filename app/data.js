// ============================================================
//  DADOS DO SHOPPINGLINK  (lojas, categorias e produtos)
//  Este é o arquivo que você edita para mudar o conteúdo do site.
//  Os preços, estoques e avaliações são DE DEMONSTRAÇÃO.
// ============================================================

import { DIRECTORY } from './directory';

// Fotos de produtos: use o endereço de uma foto que você colocou na pasta
// public/produtos/, por exemplo  image: '/produtos/camiseta-hering.jpg'
// Use somente fotos enviadas/autorizadas pela loja. Sem foto, o site mostra uma
// ilustração do tipo de produto marcada como "ilustração" (nada quebra).
// As 8 fotos do Unsplash abaixo são ILUSTRATIVAS (não são o produto real da loja).
const IMG = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

// Logos das lojas: vêm do diretório oficial do shopping (app/directory.js),
// salvos em public/lojas/. Algumas lojas usam outro id no diretório (DIR_ALIAS).
// Sem logo, o site mostra as iniciais da loja.
export const DIR_ALIAS = { '2mari-closet': '2-mari-closet', hering: 'hering-store', bibi: 'bibi-calcados', inovar: 'inovar-cosmeticos' };
const DIR_BY_ID = Object.fromEntries(DIRECTORY.map((entry) => [entry.id, entry]));
export const directoryEntry = (storeId) => DIR_BY_ID[DIR_ALIAS[storeId] || storeId];
export const LOGOS = Object.fromEntries(DIRECTORY.filter((entry) => entry.logo).map((entry) => [entry.id, entry.logo]));

// Categorias principais (aparecem nos filtros e na página de lojas)
export const CATEGORIES = [
  { name: 'Moda', icon: 'shirt', color: 'blue' },
  { name: 'Calçados', icon: 'shoe', color: 'peach' },
  { name: 'Acessórios', icon: 'spark', color: 'lilac' },
  { name: 'Beleza & cosméticos', icon: 'smile', color: 'rose' },
  { name: 'Farmácia', icon: 'pill', color: 'mint' },
  { name: 'Eletrônicos', icon: 'phone', color: 'blue' }
];

// Lojas que aparecem na página inicial (ids da lista abaixo)
export const FEATURED_STORES = ['c-and-a', 'hering', 'havaianas', 'clube-melissa', 'drogaria-economica', 'adcos', 'acium', 'casa-do-celular'];
// Lojas do quadro do topo da página inicial
export const HERO_STORES = ['c-and-a', 'hering', 'havaianas', 'claro', 'inovar', 'aramis'];

const FLOOR = 'Térreo · Capim Dourado Shopping';

// id, nome, categoria, segmento, cor, descrição, tags
const S = (id, name, category, segment, accent, description, tags) => {
  const entry = directoryEntry(id);
  return { id, name, category, segment, floor: entry?.floor ? `${entry.floor} · Capim Dourado Shopping` : FLOOR, accent, description, tags, logo: entry?.logo || '', official: entry?.official || '', url: entry?.url || '', dirId: entry?.id || id };
};

export const STORES = [
  S('acium', 'ACIUM', 'Acessórios', 'Joias e acessórios', '#b8893a', 'Joias em aço e personalizações para expressar sua personalidade com atitude.', ['Joias em aço', 'Personalização', 'Acessórios']),
  S('adcos', 'ADCOS', 'Beleza & cosméticos', 'Dermocosméticos', '#c0507a', 'Dermocosméticos para o cuidado diário com a pele.', ['Dermocosméticos', 'Proteção solar', 'Skincare']),
  S('aleatory', 'Aleatory', 'Moda', 'Moda masculina', '#2f7d66', 'Moda masculina casual para o dia a dia.', ['Casual', 'Polo', 'Camisas']),
  S('2mari-closet', '2 Mari Closet', 'Moda', 'Moda feminina', '#b8788f', 'Moda feminina para montar looks do dia a dia.', ['Moda feminina', 'Vestidos', 'Blusas']),
  S('aramis', 'Aramis', 'Moda', 'Moda masculina', '#33415c', 'Moda masculina social e casual.', ['Camisaria', 'Social', 'Casual']),
  S('avatim', 'Avatim', 'Beleza & cosméticos', 'Cosméticos e aromas', '#2f5d50', 'Cosméticos, hidratantes e fragrâncias para o corpo e a casa.', ['Body splash', 'Hidratantes', 'Aromas']),
  S('babi-modas', 'Babi Modas', 'Moda', 'Moda fitness e praia', '#8e7cc3', 'Roupas para treinar e para a praia.', ['Fitness', 'Praia', 'Moda feminina']),
  S('brooksfield', 'Brooksfield', 'Moda', 'Moda masculina', '#1f4d3a', 'Camisas, polos e peças de alfaiataria masculina.', ['Camisas', 'Polos', 'Social']),
  S('c-and-a', 'C&A', 'Moda', 'Moda para toda a família', '#c8102e', 'Roupas femininas, masculinas e infantis em um só lugar.', ['Feminino', 'Masculino', 'Infantil']),
  S('camisaria-fmw', 'Camisaria FMW', 'Moda', 'Camisaria', '#3a3a3a', 'Camisas sociais e casuais.', ['Camisas', 'Social']),
  S('carters', "Carter's", 'Moda', 'Moda infantil e bebê', '#1aa0e8', 'Roupas para bebês e crianças.', ['Bebê', 'Infantil']),
  S('clube-morena-rosa', 'Clube Morena Rosa', 'Moda', 'Moda feminina', '#b98d72', 'Moda feminina com peças para o trabalho e para o passeio.', ['Moda feminina', 'Vestidos', 'Alfaiataria']),
  S('colcci', 'Colcci', 'Moda', 'Jeans e moda casual', '#262626', 'Jeans e moda casual.', ['Jeans', 'Casual']),
  S('damyller', 'Damyller', 'Moda', 'Moda feminina', '#4a4a4a', 'Moda feminina com peças versáteis.', ['Moda feminina', 'Tricô', 'Saias']),
  S('dudalina', 'Dudalina', 'Moda', 'Camisaria e moda masculina', '#44403c', 'Camisaria e moda masculina.', ['Camisas', 'Polos']),
  S('ellus', 'Ellus', 'Moda', 'Moda masculina e feminina', '#1c1c1c', 'Peças básicas e jaquetas em estilo urbano.', ['Básicos', 'Jaquetas']),
  S('hering', 'Hering Store', 'Moda', 'Moda básica', '#1d4e89', 'Camisetas e peças básicas de malha.', ['Camisetas', 'Malha', 'Básicos']),
  S('hope', 'Hope', 'Moda', 'Moda íntima e praia', '#b5495b', 'Lingerie e moda praia.', ['Lingerie', 'Moda praia']),
  S('centauro', 'Centauro', 'Moda', 'Esporte e fitness', '#c8102e', 'Roupas e tênis para treinar e correr.', ['Esporte', 'Tênis', 'Treino']),
  S('authentic-feet', 'Authentic Feet', 'Calçados', 'Calçados', '#2b2b2b', 'Tênis e sandálias para o dia a dia.', ['Tênis', 'Sandálias']),
  S('bibi', 'Bibi Calçados', 'Calçados', 'Calçados infantis', '#e8731a', 'Calçados infantis.', ['Infantil', 'Tênis', 'Sandálias']),
  S('clube-melissa', 'Clube Melissa', 'Calçados', 'Calçados', '#d6007a', 'Sandálias e sapatilhas de plástico.', ['Sandálias', 'Sapatilhas']),
  S('usaflex', 'Usaflex', 'Calçados', 'Calçados confortáveis', '#6a8a2f', 'Calçados femininos e masculinos com foco em conforto.', ['Conforto', 'Sapatilhas', 'Tênis']),
  S('artwalk', 'Artwalk', 'Calçados', 'Tênis e streetwear', '#2b2b2b', 'Tênis e sneakers para o dia a dia.', ['Tênis', 'Sneakers']),
  S('havaianas', 'Havaianas', 'Calçados', 'Chinelos e sandálias', '#c8161d', 'Chinelos e sandálias.', ['Chinelos', 'Sandálias']),
  S('anacapri', 'Anacapri', 'Calçados', 'Calçados e bolsas', '#c0233f', 'Calçados e bolsas femininos.', ['Sandálias', 'Bolsas']),
  S('isa-acessorios', 'ISA Acessórios', 'Acessórios', 'Bijuterias e acessórios', '#a8566f', 'Brincos, colares e pulseiras.', ['Brincos', 'Colares', 'Pulseiras']),
  S('bagaggio', 'Bagaggio', 'Acessórios', 'Bolsas e malas', '#0e6b4f', 'Bolsas, mochilas e malas de viagem.', ['Bolsas', 'Mochilas', 'Malas']),
  S('amandas-make', 'Amandas Make', 'Beleza & cosméticos', 'Maquiagem', '#e0799a', 'Maquiagem para o dia e para a noite.', ['Maquiagem', 'Batom']),
  S('gold-spell', 'Gold Spell', 'Beleza & cosméticos', 'Cosméticos e perfumaria', '#5b2a86', 'Perfumes e cosméticos.', ['Perfumes', 'Cosméticos']),
  S('inovar', 'Inovar Cosméticos', 'Beleza & cosméticos', 'Cosméticos', '#b9737d', 'Cosméticos para cabelo e pele.', ['Cabelo', 'Pele']),
  S('drogaria-economica', 'Drogaria Econômica', 'Farmácia', 'Farmácia', '#1ea24a', 'Medicamentos de venda livre, higiene e cuidados com a saúde.', ['Venda livre', 'Higiene', 'Saúde']),
  S('casa-do-celular', 'Casa do Celular', 'Eletrônicos', 'Celulares e acessórios', '#d9a300', 'Acessórios para celular e pequenos eletrônicos.', ['Capas', 'Carregadores', 'Fones']),
  S('claro', 'Claro', 'Eletrônicos', 'Telefonia e celulares', '#da291c', 'Celulares e acessórios da operadora.', ['Celulares', 'Telefonia'])
];

// ---------------- PRODUTOS ----------------
const money = (value) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const slug = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const hash = (text) => [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);

const SPECS = {
  'Moda': 'Tamanhos conforme o estoque da loja',
  'Calçados': 'Numeração conforme o estoque da loja',
  'Acessórios': 'Disponibilidade conforme o estoque da loja',
  'Beleza & cosméticos': 'Confira a validade na retirada',
  'Farmácia': 'Leia a bula ou a embalagem antes de usar',
  'Eletrônicos': 'Garantia conforme a política da loja'
};
// Tipo do produto: define a ilustração usada quando não há foto real.
const KINDS = [
  [/vestido/, 'dress'], [/camiseta|baby look|blusa|dry fit|top e legging/, 'tshirt'], [/camisa|polo/, 'shirt'],
  [/perfume|body splash/, 'perfume'], [/jaqueta|moletom/, 'jacket'], [/bodies|bebê/, 'baby'], [/bermuda|short/, 'shorts'], [/saia/, 'skirt'],
  [/calça|legging/, 'pants'], [/biquíni|maiô|lingerie/, 'swim'], [/tênis/, 'sneaker'], [/chinelo|slide/, 'flipflop'],
  [/sandália|rasteira|sapatilha/, 'sandal'], [/sapato|clog/, 'shoe'], [/mochila/, 'backpack'], [/mala/, 'suitcase'],
  [/bolsa/, 'handbag'], [/colar|pulseira|anel|brinco|choker/, 'jewel'], [/batom|paleta|sombra/, 'makeup'],
  [/perfume|body splash/, 'perfume'], [/paracetamol|vitamina/, 'pill'], [/termômetro/, 'thermo'],
  [/smartphone|capa/, 'phone'], [/fone/, 'headphones'], [/portátil|mah/, 'battery'], [/carregador/, 'charger'],
  [/creme|hidratante|shampoo|máscara|sérum|serum|kit|filtro|protetor|repelente|soro/, 'bottle']
];
export const kindOf = (name) => (KINDS.find(([pattern]) => pattern.test(String(name).toLowerCase())) || [null, 'bag'])[1];

const DELIVERY = ['Retire em 1h', 'Hoje até 20h', 'Retire em 1h', 'Amanhã'];
const TAGS_SALE = ['Oferta do dia', 'Mais vendido', 'Preço especial'];
const TAGS_FULL = ['Novidade', 'Na loja'];

// loja, categoria do produto, [nome, preço, preço anterior (ou null), descrição]
const P = (storeId, category, items) => items.map(([name, price, oldPrice, description], index) => {
  const id = `${storeId}-${slug(name)}`;
  const h = hash(id);
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;
  const times = price >= 300 ? 10 : price >= 150 ? 6 : price >= 60 ? 3 : 1;
  return {
    id, storeId, name, category, price, oldPrice: oldPrice || price, discount,
    rating: Number((4.4 + (h % 6) / 10).toFixed(1)), reviews: 8 + ((h * 7) % 90), stock: 3 + ((h * 5) % 22),
    delivery: DELIVERY[(h + index) % DELIVERY.length],
    tag: discount ? TAGS_SALE[(h + index) % TAGS_SALE.length] : TAGS_FULL[(h + index) % TAGS_FULL.length],
    installment: times > 1 ? `${times}x de R$ ${money(price / times)} sem juros` : '1x no cartão sem juros',
    image: '', kind: kindOf(name), description,
    specs: [SPECS[category], 'Retirada no Capim Dourado Shopping', 'Preço e estoque de demonstração']
  };
});

// Os 8 primeiros já existiam e usam foto (Unsplash)
const ORIGINAL = [
  { id: 'colar-acium', storeId: 'acium', name: 'Colar ACIUM Essencial', category: 'Acessórios', price: 249.9, oldPrice: 349.9, discount: 29, rating: 4.9, reviews: 86, stock: 12, delivery: 'Retire em 1h', tag: 'Mais vendido', installment: '10x de R$ 24,99 sem juros', image: IMG('photo-1617038220319-276d3cfab638'), photoCredit: 'Unsplash', description: 'Colar em aço com acabamento marcante para usar todos os dias.', specs: ['Aço inoxidável', 'Personalização disponível na loja', 'Retirada no Capim Dourado Shopping'] },
  { id: 'pulseira-acium', storeId: 'acium', name: 'Pulseira ACIUM Urban', category: 'Acessórios', price: 189.9, oldPrice: 259.9, discount: 27, rating: 4.8, reviews: 64, stock: 7, delivery: 'Retire em 1h', tag: 'Oferta do dia', installment: '8x de R$ 23,74 sem juros', image: IMG('photo-1611652022419-a9419f74343d'), photoCredit: 'Unsplash', description: 'Pulseira em aço, versátil para combinar com diferentes estilos.', specs: ['Aço inoxidável', 'Fecho seguro', 'Embalagem para presente'] },
  { id: 'anel-acium', storeId: 'acium', name: 'Anel ACIUM Sign', category: 'Acessórios', price: 159.9, oldPrice: 219.9, discount: 27, rating: 4.7, reviews: 51, stock: 18, delivery: 'Hoje até 20h', tag: 'Preço especial', installment: '6x de R$ 26,65 sem juros', image: IMG('photo-1605100804763-247f67b3557e'), photoCredit: 'Unsplash', description: 'Anel minimalista em aço.', specs: ['Aço cirúrgico', 'Numeração do 14 ao 24', 'Troca facilitada'] },
  { id: 'filtro-adcos', storeId: 'adcos', name: 'Filtro Solar Adcos FPS 60', category: 'Beleza & cosméticos', price: 139.9, oldPrice: 179.9, discount: 22, rating: 4.9, reviews: 37, stock: 14, delivery: 'Retire em 1h', tag: 'Cuidado diário', installment: '5x de R$ 27,98 sem juros', image: IMG('photo-1556228578-8c89e6adf883'), photoCredit: 'Unsplash', description: 'Protetor solar facial de alta proteção para o sol do Tocantins.', specs: ['FPS 60', 'Toque seco', 'Resistente à água'] },
  { id: 'serum-adcos', storeId: 'adcos', name: 'Sérum Derma Complex', category: 'Beleza & cosméticos', price: 219.9, oldPrice: 289.9, discount: 24, rating: 4.8, reviews: 42, stock: 11, delivery: 'Hoje até 20h', tag: 'Skincare', installment: '8x de R$ 27,49 sem juros', image: IMG('photo-1608248543803-ba4f8c70ae0b'), photoCredit: 'Unsplash', description: 'Sérum leve para hidratação e viço da pele.', specs: ['Uso diário', 'Textura sérum', 'Sem fragrância'] },
  { id: 'kit-adcos', storeId: 'adcos', name: 'Kit Proteção & Hidratação', category: 'Beleza & cosméticos', price: 289.9, oldPrice: 379.9, discount: 24, rating: 4.6, reviews: 29, stock: 8, delivery: 'Amanhã', tag: 'Kit especial', installment: '10x de R$ 28,99 sem juros', image: IMG('photo-1571781926291-c477ebfd024b'), photoCredit: 'Unsplash', description: 'Kit com protetor e hidratante para começar uma rotina de cuidado com a pele.', specs: ['Dois produtos em tamanho completo', 'Embalagem para presente', 'Orientação na loja'] },
  { id: 'polo-aleatory', storeId: 'aleatory', name: 'Polo Aleatory Essential', category: 'Moda', price: 229.9, oldPrice: 299.9, discount: 23, rating: 4.8, reviews: 73, stock: 9, delivery: 'Retire em 1h', tag: 'Mais vendido', installment: '8x de R$ 28,74 sem juros', image: IMG('photo-1521572163474-6864f9cf17ab'), photoCredit: 'Unsplash', description: 'Polo de algodão para um visual casual.', specs: ['Algodão', 'Modelagem regular', 'Tamanhos do P ao GG'] },
  { id: 'camisa-aleatory', storeId: 'aleatory', name: 'Camisa Resort Linho', category: 'Moda', price: 279.9, oldPrice: 369.9, discount: 24, rating: 4.9, reviews: 45, stock: 21, delivery: 'Hoje até 20h', tag: 'Verão', installment: '10x de R$ 27,99 sem juros', image: IMG('photo-1602810318383-e386cc2a3ccf'), photoCredit: 'Unsplash', description: 'Camisa leve, boa para os dias quentes de Palmas.', specs: ['Mistura de linho', 'Manga curta', 'Lavagem delicada'] }
];

export const INITIAL_PRODUCTS = [
  ...ORIGINAL.map((product) => ({ ...product, kind: kindOf(product.name) })),
  // ---------- MODA ----------
  ...P('2mari-closet', 'Moda', [['Vestido midi floral', 189.9, 239.9, 'Vestido midi estampado, leve para o calor.'], ['Blusa de alça em viscose', 89.9, null, 'Blusa fluida de alça, fácil de combinar.']]),
  ...P('aramis', 'Moda', [['Camisa social slim', 299.9, 379.9, 'Camisa social de modelagem slim.'], ['Calça de sarja casual', 349.9, null, 'Calça de sarja de corte reto.']]),
  ...P('babi-modas', 'Moda', [['Conjunto top e legging', 149.9, 189.9, 'Conjunto fitness de top e legging.'], ['Biquíni cortininha', 119.9, null, 'Biquíni cortininha com regulagem.']]),
  ...P('brooksfield', 'Moda', [['Camisa de manga longa', 289.9, 349.9, 'Camisa de algodão para o trabalho.'], ['Polo piquet', 199.9, null, 'Polo em malha piquet.']]),
  ...P('c-and-a', 'Moda', [['Camiseta básica de algodão', 39.9, 49.9, 'Camiseta básica de algodão.'], ['Calça jeans skinny feminina', 139.9, 179.9, 'Calça jeans skinny com elastano.'], ['Jaqueta jeans', 229.9, null, 'Jaqueta jeans clássica.']]),
  ...P('camisaria-fmw', 'Moda', [['Camisa social lisa', 169.9, null, 'Camisa social lisa de manga longa.'], ['Camisa estampada manga curta', 149.9, 189.9, 'Camisa estampada de manga curta.']]),
  ...P('carters', 'Moda', [['Kit com 3 bodies de bebê', 129.9, 159.9, 'Kit de bodies de algodão para bebê.'], ['Conjunto infantil de moletom', 159.9, null, 'Conjunto de moletom para crianças.']]),
  ...P('clube-morena-rosa', 'Moda', [['Vestido tubinho', 259.9, 319.9, 'Vestido tubinho para o trabalho.'], ['Calça de alfaiataria', 289.9, null, 'Calça de alfaiataria de cintura alta.']]),
  ...P('colcci', 'Moda', [['Calça jeans reta', 359.9, 449.9, 'Calça jeans de corte reto.'], ['Camiseta com logo', 149.9, null, 'Camiseta de malha com logo.']]),
  ...P('damyller', 'Moda', [['Blusa de tricô', 179.9, 229.9, 'Blusa de tricô de manga curta.'], ['Saia midi plissada', 219.9, null, 'Saia midi plissada.']]),
  ...P('dudalina', 'Moda', [['Camisa social de algodão', 399.9, null, 'Camisa social de algodão.'], ['Camisa polo', 299.9, 369.9, 'Camisa polo de malha.']]),
  ...P('ellus', 'Moda', [['Camiseta básica premium', 169.9, null, 'Camiseta de algodão, modelagem reta.'], ['Jaqueta de sarja', 499.9, 629.9, 'Jaqueta de sarja forrada.']]),
  ...P('hering', 'Moda', [['Camiseta básica de algodão', 59.9, 69.9, 'Camiseta básica de malha de algodão.'], ['Camiseta feminina baby look', 49.9, null, 'Camiseta baby look de malha.'], ['Bermuda de moletom', 99.9, 129.9, 'Bermuda de moletom com bolsos.']]),
  ...P('hope', 'Moda', [['Conjunto de lingerie', 129.9, 159.9, 'Conjunto de sutiã e calcinha.'], ['Maiô com bojo', 189.9, null, 'Maiô com bojo removível.']]),
  ...P('centauro', 'Moda', [['Camiseta esportiva dry fit', 89.9, 119.9, 'Camiseta esportiva de secagem rápida.'], ['Bermuda de treino', 109.9, null, 'Bermuda leve para treinar.']]),
  // ---------- CALÇADOS ----------
  ...P('centauro', 'Calçados', [['Tênis de corrida', 399.9, 499.9, 'Tênis de corrida com amortecimento.']]),
  ...P('authentic-feet', 'Calçados', [['Tênis casual branco', 299.9, 369.9, 'Tênis casual para o dia a dia.'], ['Sandália slide', 129.9, null, 'Sandália slide confortável.']]),
  ...P('bibi', 'Calçados', [['Tênis infantil com velcro', 179.9, 219.9, 'Tênis infantil com fecho de velcro.'], ['Sandália infantil', 139.9, null, 'Sandália infantil com tiras ajustáveis.']]),
  ...P('clube-melissa', 'Calçados', [['Sandália flat de plástico', 199.9, null, 'Sandália rasteira de plástico.'], ['Sandália de salto bloco', 289.9, 349.9, 'Sandália de salto bloco.']]),
  ...P('usaflex', 'Calçados', [['Sapatilha conforto', 229.9, 279.9, 'Sapatilha com palmilha macia para o dia todo.'], ['Sapato social de couro', 349.9, null, 'Sapato social de couro com solado confortável.']]),
  ...P('artwalk', 'Calçados', [['Tênis casual masculino', 329.9, 399.9, 'Tênis casual de cano baixo.'], ['Tênis de cano alto', 449.9, null, 'Tênis de cano alto em estilo streetwear.']]),
  ...P('havaianas', 'Calçados', [['Chinelo tradicional', 44.9, 54.9, 'Chinelo de borracha.'], ['Chinelo slim feminino', 59.9, null, 'Chinelo de tiras finas.'], ['Chinelo flatform', 99.9, 119.9, 'Chinelo de solado alto.']]),
  ...P('anacapri', 'Calçados', [['Sandália rasteira', 189.9, 239.9, 'Sandália rasteira feminina.']]),
  // ---------- ACESSÓRIOS ----------
  ...P('anacapri', 'Acessórios', [['Bolsa tiracolo', 299.9, null, 'Bolsa tiracolo de tamanho médio.']]),
  ...P('isa-acessorios', 'Acessórios', [['Brinco argola dourada', 49.9, 69.9, 'Brinco argola com banho dourado.'], ['Colar choker', 59.9, null, 'Colar curto tipo choker.'], ['Pulseira de pérolas', 69.9, 89.9, 'Pulseira com pérolas.']]),
  ...P('bagaggio', 'Acessórios', [['Bolsa tote grande', 349.9, 429.9, 'Bolsa tote com espaço para notebook.'], ['Mochila urbana', 299.9, null, 'Mochila urbana com compartimentos.'], ['Mala de bordo', 599.9, 749.9, 'Mala de bordo com rodinhas.']]),
  // ---------- BELEZA ----------
  ...P('amandas-make', 'Beleza & cosméticos', [['Batom líquido matte', 39.9, null, 'Batom líquido de acabamento matte.'], ['Paleta de sombras', 89.9, 119.9, 'Paleta de sombras em tons neutros.']]),
  ...P('avatim', 'Beleza & cosméticos', [['Body splash 200 ml', 79.9, 99.9, 'Body splash de fragrância leve para o dia a dia.'], ['Hidratante corporal 250 ml', 69.9, null, 'Loção hidratante de rápida absorção.']]),
  ...P('gold-spell', 'Beleza & cosméticos', [['Perfume feminino 100 ml', 189.9, null, 'Perfume feminino de 100 ml.'], ['Creme hidratante corporal', 69.9, 89.9, 'Creme hidratante para o corpo.']]),
  ...P('inovar', 'Beleza & cosméticos', [['Kit shampoo e condicionador', 99.9, 129.9, 'Kit para cabelos secos.'], ['Máscara capilar de hidratação', 79.9, null, 'Máscara de hidratação para os fios.']]),
  // ---------- FARMÁCIA ----------
  ...P('drogaria-economica', 'Farmácia', [['Protetor solar FPS 50', 54.9, 69.9, 'Protetor solar para rosto e corpo.'], ['Repelente em spray', 24.9, null, 'Repelente de insetos em spray.'], ['Paracetamol 750 mg, 20 comprimidos', 14.9, null, 'Medicamento de venda livre. Leia a bula e, em caso de dúvida, procure um profissional de saúde.'], ['Soro fisiológico 500 ml', 9.9, null, 'Solução de cloreto de sódio a 0,9%.'], ['Vitamina C efervescente', 19.9, 24.9, 'Suplemento de vitamina C em comprimidos efervescentes.'], ['Termômetro digital', 29.9, 39.9, 'Termômetro digital de uso clínico.']]),
  // ---------- ELETRÔNICOS ----------
  ...P('casa-do-celular', 'Eletrônicos', [['Capa de silicone para celular', 29.9, null, 'Capa de silicone. Informe o modelo na loja.'], ['Carregador turbo USB-C', 69.9, 89.9, 'Carregador de parede com saída USB-C.'], ['Fone de ouvido bluetooth', 129.9, 169.9, 'Fone sem fio com estojo de carga.']]),
  ...P('claro', 'Eletrônicos', [['Smartphone 128 GB', 1399, 1599, 'Smartphone com 128 GB de armazenamento.'], ['Fone de ouvido bluetooth', 149.9, null, 'Fone sem fio.'], ['Carregador portátil 10.000 mAh', 119.9, 149.9, 'Bateria externa para celular.']])
].filter((product) => Boolean(product.image));
