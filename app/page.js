'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const IMG = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

const STORES = [
  {
    id: 'acium',
    name: 'ACIUM',
    category: 'Joias & acessórios',
    floor: 'Capim Dourado Shopping · Palmas/TO',
    rating: 4.9,
    reviews: 184,
    response: 'responde em até 8 min',
    accent: '#d5a84d',
    image: IMG('photo-1617038220319-276d3cfab638', 1200),
    description: 'Joias em aço e personalizações para expressar sua personalidade com atitude.',
    tags: ['Joias em aço', 'Personalização', 'Acessórios']
  },
  {
    id: 'adcos',
    name: 'ADCOS',
    category: 'Beleza & cuidado',
    floor: 'Capim Dourado Shopping · Palmas/TO',
    rating: 4.8,
    reviews: 126,
    response: 'responde em até 12 min',
    accent: '#d48862',
    image: IMG('photo-1556229010-6c3f2c9ca5f8', 1200),
    description: 'Dermocosméticos com tecnologia e cuidado para a pele de quem vive Palmas.',
    tags: ['Dermocosméticos', 'Proteção solar', 'Skincare']
  },
  {
    id: 'aleatory',
    name: 'Aleatory',
    category: 'Moda masculina',
    floor: 'Capim Dourado Shopping · Palmas/TO',
    rating: 4.7,
    reviews: 98,
    response: 'responde em até 15 min',
    accent: '#55a88a',
    image: IMG('photo-1529139574466-a303027c1d8b', 1200),
    description: 'Moda masculina casual para acompanhar a rotina, o clima e o estilo palmense.',
    tags: ['Casual', 'Polo', 'Lifestyle']
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'colar-acium', storeId: 'acium', name: 'Colar ACIUM Essencial', category: 'Joias & acessórios', price: 249.9, oldPrice: 349.9, discount: 29, rating: 4.9, reviews: 86, stock: 12, delivery: 'Retire em 1h', tag: 'Mais vendido', installment: '10x de R$ 24,99 sem juros', image: IMG('photo-1617038220319-276d3cfab638'), description: 'Design contemporâneo em aço, com acabamento marcante para usar todos os dias.', specs: ['Aço inoxidável', 'Resistente à água', 'Personalização disponível na loja', 'Garantia de 12 meses']
  },
  {
    id: 'pulseira-acium', storeId: 'acium', name: 'Pulseira ACIUM Urban', category: 'Joias & acessórios', price: 189.9, oldPrice: 259.9, discount: 27, rating: 4.8, reviews: 64, stock: 7, delivery: 'Retire em 1h', tag: 'Oferta do dia', installment: '8x de R$ 23,74 sem juros', image: IMG('photo-1611652022419-a9419f74343d'), description: 'Uma peça versátil em aço para combinar com diferentes momentos e estilos.', specs: ['Aço inoxidável', 'Fecho seguro', 'Acabamento polido', 'Embalagem para presente']
  },
  {
    id: 'anel-acium', storeId: 'acium', name: 'Anel ACIUM Sign', category: 'Joias & acessórios', price: 159.9, oldPrice: 219.9, discount: 27, rating: 4.7, reviews: 51, stock: 18, delivery: 'Hoje até 20h', tag: 'Preço especial', installment: '6x de R$ 26,65 sem juros', image: IMG('photo-1605100804763-247f67b3557e'), description: 'Minimalista, expressivo e pronto para fazer parte da sua assinatura.', specs: ['Aço cirúrgico', 'Numeração do 14 ao 24', 'Resistente à oxidação', 'Troca facilitada']
  },
  {
    id: 'filtro-adcos', storeId: 'adcos', name: 'Filtro Solar Adcos FPS 60', category: 'Beleza & cuidado', price: 139.9, oldPrice: 179.9, discount: 22, rating: 4.9, reviews: 37, stock: 14, delivery: 'Retire em 1h', tag: 'Cuidado diário', installment: '5x de R$ 27,98 sem juros', image: IMG('photo-1556228578-8c89e6adf883'), description: 'Proteção solar facial de alta performance para a rotina de quem vive sob o sol do Tocantins.', specs: ['FPS 60', 'Toque seco', 'Resistente à água', 'Indicado para pele brasileira']
  },
  {
    id: 'serum-adcos', storeId: 'adcos', name: 'Sérum Derma Complex', category: 'Beleza & cuidado', price: 219.9, oldPrice: 289.9, discount: 24, rating: 4.8, reviews: 42, stock: 11, delivery: 'Hoje até 20h', tag: 'Rotina de skincare', installment: '8x de R$ 27,49 sem juros', image: IMG('photo-1608248543803-ba4f8c70ae0b'), description: 'Textura leve e ativos que ajudam a devolver viço, hidratação e luminosidade à pele.', specs: ['Uso diário', 'Textura sérum', 'Dermatologicamente testado', 'Sem fragrância']
  },
  {
    id: 'kit-adcos', storeId: 'adcos', name: 'Kit Proteção & Hidratação', category: 'Beleza & cuidado', price: 289.9, oldPrice: 379.9, discount: 24, rating: 4.6, reviews: 29, stock: 8, delivery: 'Amanhã', tag: 'Kit especial', installment: '10x de R$ 28,99 sem juros', image: IMG('photo-1571781926291-c477ebfd024b'), description: 'Uma seleção completa para começar uma rotina prática de cuidado com a pele.', specs: ['Dois produtos em tamanho completo', 'Embalagem presenteável', 'Orientação na loja', 'Compra protegida']
  },
  {
    id: 'polo-aleatory', storeId: 'aleatory', name: 'Polo Aleatory Essential', category: 'Moda masculina', price: 229.9, oldPrice: 299.9, discount: 23, rating: 4.8, reviews: 73, stock: 9, delivery: 'Retire em 1h', tag: 'Mais vendido', installment: '8x de R$ 28,74 sem juros', image: IMG('photo-1521572163474-6864f9cf17ab'), description: 'Polo de algodão confortável para montar um visual casual com acabamento impecável.', specs: ['Algodão macio', 'Modelagem regular', 'Gola estruturada', 'Tamanhos do P ao GG']
  },
  {
    id: 'camisa-aleatory', storeId: 'aleatory', name: 'Camisa Resort Linho', category: 'Moda masculina', price: 279.9, oldPrice: 369.9, discount: 24, rating: 4.9, reviews: 45, stock: 21, delivery: 'Hoje até 20h', tag: 'Verão palmense', installment: '10x de R$ 27,99 sem juros', image: IMG('photo-1602810318383-e386cc2a3ccf'), description: 'Leve e fresca para os dias quentes, com caimento que transita entre passeio e jantar.', specs: ['Mistura de linho', 'Manga curta', 'Modelagem confortável', 'Lavagem delicada']
  }
];

const INITIAL_ORDERS = [
  { id: 'SL-2048', date: 'Hoje, 14:32', store: 'ACIUM', item: 'Colar ACIUM Essencial', total: 249.9, method: 'Pix', mode: 'Entrega em casa', step: 2, address: 'Quadra 204 Sul · Palmas/TO' }
];

const categories = [
  { name: 'Joias & acessórios', icon: 'spark', color: 'lilac' },
  { name: 'Beleza & cuidado', icon: 'smile', color: 'rose' },
  { name: 'Moda masculina', icon: 'shirt', color: 'blue' },
  { name: 'Gastronomia', icon: 'bag', color: 'peach' },
  { name: 'Serviços', icon: 'map', color: 'mint' }
];

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const readStoredJSON = (key, fallback = null) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
};
const getStore = (id) => STORES.find((store) => store.id === id) || STORES[0];

function Icon({ name, size = 18, className = '' }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', className };
  const shapes = {
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    cart: <><path d="M3.5 4h2l1.5 10.2a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 1.9-1.4L20 8H6" /><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>,
    user: <><circle cx="12" cy="8" r="3.3" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    store: <><path d="M4 10.5V21h16V10.5" /><path d="M3 10.5 5 4h14l2 6.5" /><path d="M3 10.5a3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 3 0" /><path d="M9 21v-5h6v5" /></>,
    heart: <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.4 4.4 0 0 1 12 6.5a4.4 4.4 0 0 1 8.8 2.3Z" />,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    check: <path d="m5 12 4.3 4.3L19 7" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
    spark: <><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    home: <><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
    activity: <><path d="M3 12h4l2-7 4 14 2-7h6" /></>,
    shirt: <><path d="m8 4 4 2 4-2 4 3-2 4-2-1v10H8V10l-2 1-2-4 4-3Z" /></>,
    smile: <><circle cx="12" cy="12" r="8" /><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" /><path d="M9 9h.01M15 9h.01" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15M15 6v15" /></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.2-.6L4 20l1.5-3.8A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>,
    truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    shield: <path d="M12 3 19 6v5c0 4.7-3 8.3-7 10-4-1.7-7-5.3-7-10V6l7-3Z" />,
    bag: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
    graph: <><path d="M4 19V5M4 19h17" /><path d="m7 15 3-3 3 2 5-6" /></>,
    edit: <><path d="m4 16-.8 4.8L8 20l10.8-10.8a2.1 2.1 0 0 0-3-3L4 16Z" /><path d="m14.5 7.5 2 2" /></>,
    logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" /></>,
    info: <><circle cx="12" cy="12" r="8" /><path d="M12 11v5M12 8h.01" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>,
    pix: <><path d="m8 4 4 4 4-4 4 4-4 4 4 4-4 4-4-4-4 4-4-4 4-4-4-4 4-4Z" /><path d="m9 9 6 6M15 9l-6 6" /></>
  };
  return <svg {...common}>{shapes[name] || shapes.spark}</svg>;
}

function Logo({ onClick }) {
  return <button className="brand" onClick={onClick} aria-label="Voltar para o início"><span className="brand-mark">S<span>//</span></span><span>shopping<span className="brand-accent">link</span></span></button>;
}

function Header({ path, searchValue, setSearchValue, onSearch, navigate, cartCount, user, onLogin }) {
  return <>
    <div className="topline"><div className="container top-line-inner"><span><Icon name="pin" size={13} /> Capim Dourado Shopping · Palmas–TO</span><span className="topline-right">Retire hoje em até 1h <span className="dot-separator">•</span> Entrega para toda a região</span></div></div>
    <header className="site-header">
      <div className="container header-inner">
        <Logo onClick={() => navigate('/')} />
        <form className="global-search" onSubmit={(event) => { event.preventDefault(); onSearch(searchValue); }}>
          <Icon name="search" size={19} />
          <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="O que você está procurando hoje?" aria-label="Buscar produtos e lojas" />
          <button type="submit">Buscar</button>
        </form>
        <div className="header-actions">
          <button className="header-action" onClick={() => user ? navigate('/pedidos') : onLogin()}><span className="action-icon"><Icon name="user" size={19} /></span><span className="action-copy"><small>{user ? `Olá, ${user.name.split(' ')[0]}` : 'Minha conta'}</small><strong>{user ? 'Meus pedidos' : 'Entrar ou cadastrar'}</strong></span></button>
          <button className="cart-button" onClick={() => navigate('/carrinho')} aria-label="Abrir carrinho"><Icon name="cart" size={21} /><span className="cart-label">Carrinho</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
        </div>
      </div>
      <nav className="main-nav"><div className="container nav-inner"><button className={path === '/' ? 'active' : ''} onClick={() => navigate('/')}>Início</button><button className={path.startsWith('/busca') ? 'active' : ''} onClick={() => navigate('/busca')}>Explorar produtos</button><button onClick={() => navigate('/loja/acium')}><Icon name="store" size={15} /> Lojas do shopping</button><button onClick={() => navigate('/pedidos')}><Icon name="truck" size={15} /> Acompanhar pedido</button><span className="nav-spacer" /><button className="seller-link" onClick={() => navigate('/painel')}><Icon name="store" size={15} /> Sou lojista</button></div></nav>
    </header>
  </>;
}

function SectionHeading({ eyebrow, title, description, action, onAction }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>{action && <button className="text-link" onClick={onAction}>{action}<Icon name="arrow" size={16} /></button>}</div>;
}

function ProductCard({ product, onProduct, onAdd, compact = false }) {
  const store = getStore(product.storeId);
  return <article className={`product-card ${compact ? 'compact' : ''}`}>
    <button className="product-image-wrap" onClick={() => onProduct(product.id)} aria-label={`Ver ${product.name}`}><img src={product.image} alt={product.name} /><span className="product-tag">{product.tag}</span><span className="heart-button"><Icon name="heart" size={17} /></span></button>
    <div className="product-card-body"><div className="product-store-line"><span>{store.name}</span><span className="rating"><span>★</span> {product.rating}</span></div><button className="product-name" onClick={() => onProduct(product.id)}>{product.name}</button><p className="product-description">{product.description}</p><div className="price-line"><span className="current-price">{formatCurrency(product.price)}</span><span className="discount-pill">-{product.discount}%</span></div><span className="old-price">de {formatCurrency(product.oldPrice)}</span><div className="product-footer"><span><Icon name="truck" size={14} /> {product.delivery}</span><button className="add-button" onClick={() => onAdd(product)}><Icon name="plus" size={16} /> adicionar</button></div></div>
  </article>;
}

function StoreMiniCard({ store, onStore }) {
  return <button className="store-mini-card" onClick={() => onStore(store.id)}><img src={store.image} alt="" /><span className="store-mini-overlay"><b>{store.name}</b><small>{store.category}</small><span className="store-rating">★ {store.rating} <em>({store.reviews})</em></span></span></button>;
}

function HomePage({ products, navigate, onAdd, searchValue, setSearchValue, onSearch }) {
  const featured = products.filter((product) => product.discount >= 23).slice(0, 4);
  return <>
    <main>
      <section className="hero"><div className="hero-glow" /><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow light">O shopping na palma da sua mão</span><h1>Encontre no shopping,<br /><span>compre do seu jeito.</span></h1><p>Compare preços, descubra lojas e escolha entre retirar rapidinho ou receber em casa.</p><form className="hero-search" onSubmit={(event) => { event.preventDefault(); onSearch(searchValue); }}><Icon name="search" size={20} /><input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Buscar produtos, lojas ou categorias" /><button type="submit">Encontrar</button></form><div className="hero-trust"><span><Icon name="shield" size={16} /> Compra segura</span><span><Icon name="clock" size={16} /> Retire em até 1h</span><span><Icon name="truck" size={16} /> Entrega local</span></div></div><div className="hero-art"><div className="hero-card hero-card-main"><span className="mini-label">Oferta destaque</span><img src={products[0]?.image} alt="Colar ACIUM Essencial" /><div className="hero-product-caption"><span>Colar ACIUM Essencial</span><strong>R$ 349,90</strong></div></div><div className="hero-card hero-card-float"><span>Hoje no shopping</span><b>−30%</b><small>selecionados para você</small></div><div className="hero-art-orbit orbit-one" /><div className="hero-art-orbit orbit-two" /></div></div></section>
      <section className="category-rail"><div className="container"><div className="rail-intro"><span className="eyebrow">Navegue por perto</span><strong>O que você quer encontrar?</strong></div><div className="category-list">{categories.map((category) => <button key={category.name} className="category-chip" onClick={() => onSearch(category.name)}><span className={`category-icon ${category.color}`}><Icon name={category.icon} size={20} /></span><span>{category.name}</span><Icon name="chevron" size={15} /></button>)}</div></div></section>
      <section className="content-section"><div className="container"><SectionHeading eyebrow="Seleção do dia" title="Descontos que valem a visita" description="Produtos selecionados pelas lojas do shopping para você aproveitar agora." action="Ver todas as ofertas" onAction={() => navigate('/busca?ofertas=1')} /><div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} onProduct={(id) => navigate(`/produto/${id}`)} onAdd={onAdd} />)}</div></div></section>
      <section className="experience-section"><div className="container experience-grid"><div className="experience-copy"><span className="eyebrow">ShoppingLink na prática</span><h2>Você escolhe.<br /><span>A gente aproxima.</span></h2><p>O produto está no Capim Dourado Shopping. A experiência acontece do seu jeito: pesquise online, reserve para retirar ou peça para receber onde estiver.</p><button className="button button-dark" onClick={() => navigate('/busca')}>Explorar o catálogo <Icon name="arrow" size={17} /></button></div><div className="steps-card"><div className="step-item"><span className="step-number">01</span><div><strong>Você encontra</strong><p>Compare produtos e preços de várias lojas.</p></div><Icon name="search" size={19} /></div><div className="step-item"><span className="step-number">02</span><div><strong>Você escolhe</strong><p>Reserve para retirar ou informe seu endereço.</p></div><Icon name="bag" size={19} /></div><div className="step-item"><span className="step-number">03</span><div><strong>A loja prepara</strong><p>O shopper confirma e leva até você.</p></div><Icon name="truck" size={19} /></div></div></div></section>
      <section className="content-section stores-section"><div className="container"><SectionHeading eyebrow="Lojas parceiras" title="Vitrine local, do seu jeito" description="Conheça quem está por trás dos produtos que você ama." action="Ver todas as lojas" onAction={() => navigate('/loja/acium')} /><div className="store-grid">{STORES.map((store) => <StoreMiniCard key={store.id} store={store} onStore={(id) => navigate(`/loja/${id}`)} />)}</div></div></section>
      <section className="seller-banner"><div className="container seller-banner-inner"><div><span className="eyebrow light">Para lojistas</span><h2>Seu produto merece<br /><span>ser encontrado.</span></h2><p>Cadastre sua vitrine, publique ofertas e acompanhe pedidos em um só lugar.</p></div><button className="button button-light" onClick={() => navigate('/painel')}>Abrir painel da loja <Icon name="arrow" size={17} /></button></div></section>
    </main>
    <footer className="footer"><div className="container footer-grid"><div><Logo onClick={() => navigate('/')} /><p>Uma nova forma de viver o shopping.</p></div><div><span className="footer-title">ShoppingLink</span><button onClick={() => navigate('/busca')}>Explorar produtos</button><button onClick={() => navigate('/pedidos')}>Acompanhar pedido</button></div><div><span className="footer-title">Para lojas</span><button onClick={() => navigate('/painel')}>Painel do lojista</button><button onClick={() => navigate('/loja/acium')}>Conheça as vitrines</button></div><div><span className="footer-title">Atendimento</span><p>Seg–Sáb · 9h às 21h</p><p>oi@shoppinglink.demo</p></div></div><div className="container footer-bottom"><span>© 2026 ShoppingLink · Projeto acadêmico demonstrativo para Palmas/TO</span><span>Feito para aproximar.</span></div></footer>
  </>;
}

function SearchPage({ products, navigate, onAdd, query }) {
  const [category, setCategory] = useState('Todos');
  const [sort, setSort] = useState('relevancia');
  const normalizedQuery = (query || '').toLowerCase();
  const filtered = products.filter((product) => {
    const matchesQuery = !normalizedQuery || `${product.name} ${product.category} ${getStore(product.storeId).name}`.toLowerCase().includes(normalizedQuery);
    const matchesCategory = category === 'Todos' || product.category === category;
    return matchesQuery && matchesCategory;
  }).sort((a, b) => sort === 'menor' ? a.price - b.price : sort === 'maior' ? b.price - a.price : b.discount - a.discount);
  return <main className="page-main"><div className="container"><div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><span>Explorar produtos</span></div><div className="page-title-row"><div><span className="eyebrow">Resultados para você</span><h1>{normalizedQuery ? <>Resultados para <span>“{query}”</span></> : 'Explore o catálogo'}</h1><p>{filtered.length} produtos encontrados em lojas do Capim Dourado Shopping.</p></div><button className="mobile-filter"><Icon name="filter" size={18} /> filtros</button></div><div className="search-layout"><aside className="filter-panel"><div className="filter-heading"><strong>Filtre por</strong><button onClick={() => setCategory('Todos')}>limpar</button></div><div className="filter-group"><span>Categoria</span>{['Todos', ...categories.slice(0, 3).map((item) => item.name)].map((item) => <button key={item} className={category === item ? 'filter-option selected' : 'filter-option'} onClick={() => setCategory(item)}><span className="filter-radio" />{item}<small>{item === 'Todos' ? products.length : products.filter((product) => product.category === item).length}</small></button>)}</div><div className="filter-note"><Icon name="shield" size={17} /><span><strong>Compra confiável</strong>Produtos verificados pelas lojas do Capim Dourado.</span></div></aside><div className="results-area"><div className="results-toolbar"><span>Mostrando <strong>{filtered.length}</strong> produtos</span><label>Ordenar por <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevancia">mais relevantes</option><option value="menor">menor preço</option><option value="maior">maior preço</option></select></label></div>{filtered.length ? <div className="product-grid results-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onProduct={(id) => navigate(`/produto/${id}`)} onAdd={onAdd} />)}</div> : <div className="empty-state"><span className="empty-icon"><Icon name="search" size={25} /></span><h3>Nenhum produto encontrado</h3><p>Tente buscar por outro termo ou limpar os filtros.</p><button className="button button-dark" onClick={() => { setCategory('Todos'); navigate('/busca'); }}>Ver catálogo completo</button></div>}</div></div></div></main>;
}

function StorePage({ store, products, navigate, onAdd }) {
  const storeProducts = products.filter((product) => product.storeId === store.id);
  return <main className="page-main"><div className="container"><div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><span>Lojas</span><Icon name="chevron" size={14} /><span>{store.name}</span></div><section className="store-cover" style={{ '--store-accent': store.accent }}><img src={store.image} alt="" /><div className="store-cover-shade" /><div className="store-cover-content"><div><span className="store-cover-kicker">Vitrine no Capim Dourado Shopping</span><h1>{store.name}</h1><p>{store.description}</p><div className="store-cover-meta"><span><Icon name="pin" size={15} /> {store.floor}</span><span><span className="rating-star">★</span> {store.rating} <em>({store.reviews} avaliações)</em></span></div></div><button className="button button-light"><Icon name="chat" size={16} /> Falar com a loja</button></div></section><div className="store-content-grid"><aside className="store-sidebar"><div className="store-side-card"><span className="eyebrow">Sobre a loja</span><h3>Compra local,<br />experiência próxima.</h3><p>Produtos disponíveis no estoque físico e atendimento feito por quem entende do assunto em Palmas.</p><div className="side-stat"><span><Icon name="clock" size={16} /> {store.response}</span><span><Icon name="shield" size={16} /> Compra protegida</span></div></div><div className="store-tags">{store.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></aside><section className="store-products"><SectionHeading eyebrow="Catálogo da loja" title="O que está em destaque" description={`${storeProducts.length} produtos disponíveis agora.`} /><div className="product-grid">{storeProducts.map((product) => <ProductCard key={product.id} product={product} onProduct={(id) => navigate(`/produto/${id}`)} onAdd={onAdd} />)}</div></section></div></div></main>;
}

function ProductPage({ product, navigate, onAdd }) {
  const store = getStore(product.storeId);
  const [deliveryMode, setDeliveryMode] = useState('pickup');
  return <main className="page-main"><div className="container"><div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><button onClick={() => navigate(`/loja/${store.id}`)}>{store.name}</button><Icon name="chevron" size={14} /><span>{product.name}</span></div><section className="product-detail"><div className="product-gallery"><div className="gallery-badge">-{product.discount}% hoje</div><img src={product.image} alt={product.name} /><div className="gallery-caption"><span><Icon name="shield" size={15} /> Compra protegida ShoppingLink</span><span><Icon name="map" size={15} /> Produto disponível na loja física</span></div></div><div className="product-detail-copy"><span className="eyebrow">{product.category} · {store.name}</span><h1>{product.name}</h1><div className="detail-rating"><span>★</span> {product.rating} <em>({product.reviews} avaliações)</em><button onClick={() => navigate(`/loja/${store.id}`)}>ver loja</button></div><p className="detail-description">{product.description}</p><div className="detail-price-box"><span className="detail-old-price">de {formatCurrency(product.oldPrice)}</span><div><strong>{formatCurrency(product.price)}</strong><span className="detail-discount">economize {formatCurrency(product.oldPrice - product.price)}</span></div><span className="installments">ou {product.installment}</span></div><div className="availability-row"><div><span className="availability-dot" /> <strong>{product.stock} unidades</strong> disponíveis na loja</div><span>Atualizado agora</span></div><div className="delivery-options"><button type="button" className={`delivery-option ${deliveryMode === 'pickup' ? 'selected' : ''}`} onClick={() => setDeliveryMode('pickup')}><span className="delivery-option-icon"><Icon name="map" size={19} /></span><span><strong>Retirar no shopping</strong><small>Pronto em até 1 hora · grátis</small></span>{deliveryMode === 'pickup' && <Icon name="check" size={18} />}</button><button type="button" className={`delivery-option ${deliveryMode === 'delivery' ? 'selected' : ''}`} onClick={() => setDeliveryMode('delivery')}><span className="delivery-option-icon"><Icon name="truck" size={19} /></span><span><strong>Receber em casa</strong><small>A partir de R$ 12,90 · hoje</small></span>{deliveryMode === 'delivery' && <Icon name="check" size={18} />}</button></div><button className="button button-coral button-large" onClick={() => onAdd(product, true, deliveryMode)}><Icon name="cart" size={19} /> Adicionar ao carrinho</button><div className="detail-note"><Icon name="info" size={15} /> Modalidade escolhida: {deliveryMode === 'pickup' ? 'retirar no shopping' : 'receber em casa'}.</div></div></section><section className="product-info-section"><div className="info-column"><span className="eyebrow">Detalhes</span><h2>Feito para entrar na sua rotina.</h2><p>{product.description} No ShoppingLink, você compra de uma loja de verdade e acompanha cada passo da entrega.</p></div><div className="specs-list">{product.specs.map((spec) => <div key={spec}><Icon name="check" size={17} /><span>{spec}</span></div>)}</div></section></div></main>;
}
function CartPage({ cart, products, navigate, onRemove, onChangeQuantity, user, onCheckout }) {
  const cartLines = cart.map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) })).filter((line) => line.product);
  const [deliveryMode, setDeliveryMode] = useState(cartLines[0]?.deliveryMode || 'delivery');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const subtotal = cartLines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const delivery = cartLines.length && deliveryMode === 'delivery' ? 12.9 : 0;
  return <main className="page-main"><div className="container narrow-container"><div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><span>Seu carrinho</span></div><div className="page-title-row cart-title"><div><span className="eyebrow">Quase lá</span><h1>Seu carrinho</h1><p>{cartLines.length ? `${cartLines.reduce((sum, line) => sum + line.quantity, 0)} itens selecionados para você.` : 'Seu próximo achado começa aqui.'}</p></div>{user && <span className="signed-user"><Icon name="user" size={15} /> {user.name}</span>}</div>{cartLines.length ? <div className="cart-layout"><section className="cart-items"><div className="cart-card"><div className="cart-card-head"><span>Produtos selecionados</span><span>Preço</span></div>{cartLines.map(({ product, quantity }) => <div className="cart-line" key={product.id}><img src={product.image} alt="" /><div className="cart-line-copy"><span className="product-store-line">{getStore(product.storeId).name}</span><h3>{product.name}</h3><small><Icon name="truck" size={13} /> {product.delivery}</small><button onClick={() => onRemove(product.id)}>Remover</button></div><div className="cart-line-price"><strong>{formatCurrency(product.price * quantity)}</strong><div className="quantity-control"><button onClick={() => onChangeQuantity(product.id, quantity - 1)}><Icon name="minus" size={14} /></button><span>{quantity}</span><button onClick={() => onChangeQuantity(product.id, quantity + 1)}><Icon name="plus" size={14} /></button></div></div></div>)}</div><div className="cart-benefit"><span className="benefit-icon"><Icon name="shield" size={18} /></span><span><strong>Você compra de uma loja do shopping.</strong><small>Pagamento seguro e suporte ShoppingLink do início ao fim.</small></span></div></section><aside className="summary-card"><span className="eyebrow">Resumo do pedido</span><h2>Confira tudo antes de confirmar.</h2><div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div><div className="summary-row"><span>Entrega estimada</span><strong>{delivery ? formatCurrency(delivery) : 'Grátis'}</strong></div><div className="summary-separator" /><div className="summary-row total"><span>Total</span><strong>{formatCurrency(subtotal + delivery)}</strong></div><div className="payment-choices"><span className="payment-label">Forma de recebimento</span><button type="button" className={`payment-choice ${deliveryMode === 'pickup' ? 'selected' : ''}`} onClick={() => setDeliveryMode('pickup')}><span><Icon name="map" size={18} /> Retirar no shopping</span><small>grátis · até 1 hora</small>{deliveryMode === 'pickup' && <Icon name="check" size={16} />}</button><button type="button" className={`payment-choice ${deliveryMode === 'delivery' ? 'selected' : ''}`} onClick={() => setDeliveryMode('delivery')}><span><Icon name="truck" size={18} /> Receber em casa</span><small>R$ 12,90 · hoje</small>{deliveryMode === 'delivery' && <Icon name="check" size={16} />}</button></div><div className="payment-choices"><span className="payment-label">Forma de pagamento</span><button type="button" className={`payment-choice ${paymentMethod === 'pix' ? 'selected' : ''}`} onClick={() => setPaymentMethod('pix')}><span><Icon name="pix" size={18} /> Pix</span><small>aprovação imediata</small>{paymentMethod === 'pix' && <Icon name="check" size={16} />}</button><button type="button" className={`payment-choice ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}><span><Icon name="card" size={18} /> Cartão</span><small>crédito ou débito</small>{paymentMethod === 'card' && <Icon name="check" size={16} />}</button></div><button className="button button-coral button-large" onClick={() => onCheckout({ paymentMethod, deliveryMode })}>{user ? 'Confirmar pedido' : 'Entrar e confirmar pedido'} <Icon name="arrow" size={17} /></button><small className="summary-footnote"><Icon name="lock" size={13} /> Seus dados ficam protegidos.</small></aside></div> : <div className="empty-state cart-empty"><span className="empty-icon"><Icon name="bag" size={26} /></span><h3>Seu carrinho está esperando boas escolhas.</h3><p>Explore as lojas do shopping e adicione algo que combine com você.</p><button className="button button-dark" onClick={() => navigate('/busca')}>Explorar produtos <Icon name="arrow" size={16} /></button></div>}</div></main>;
}
function OrdersPage({ orders, navigate }) {
  const order = orders[0] || INITIAL_ORDERS[0];
  const steps = [{ label: 'Pedido recebido', note: 'Seu pedido foi confirmado', icon: 'check' }, { label: 'Produto encontrado', note: 'A loja separou seu produto', icon: 'store' }, { label: 'Pedido confirmado', note: 'Tudo pronto para seguir', icon: 'bag' }, { label: 'Saiu para entrega', note: 'A caminho do endereço', icon: 'truck' }, { label: 'Entregue', note: 'Aproveite sua compra', icon: 'heart' }];
  return <main className="page-main"><div className="container narrow-container"><div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><span>Acompanhamento</span></div><div className="page-title-row"><div><span className="eyebrow">Visibilidade em cada etapa</span><h1>Acompanhe seu pedido.</h1><p>Você sabe onde sua compra está, sem precisar perguntar.</p></div><button className="button button-ghost" onClick={() => navigate('/busca')}>Continuar comprando</button></div><section className="order-card"><div className="order-card-head"><div><span className="eyebrow">Pedido {order.id}</span><h2>{order.item}</h2><p>{order.store} · {order.date}</p></div><span className="order-status"><span /> Em andamento</span></div><div className="order-progress"><div className="progress-line"><span style={{ width: `${(order.step / (steps.length - 1)) * 100}%` }} /></div>{steps.map((step, index) => <div key={step.label} className={`progress-step ${index <= order.step ? 'done' : ''} ${index === order.step ? 'current' : ''}`}><span className="progress-dot">{index < order.step ? <Icon name="check" size={13} /> : <Icon name={step.icon} size={14} />}</span><strong>{step.label}</strong><small>{index <= order.step ? step.note : 'Em breve'}</small></div>)}</div><div className="order-info-grid"><div><span className="info-label">Recebimento</span><strong>{order.mode}</strong><small>{order.address}</small></div><div><span className="info-label">Pagamento</span><strong>{formatCurrency(order.total)} · {order.method}</strong><small>Pagamento aprovado</small></div><div><span className="info-label">Precisa de ajuda?</span><strong>Fale com a gente</strong><small>Resposta em até 8 min <Icon name="arrow" size={13} /></small></div></div></section><div className="tracking-note"><span><Icon name="info" size={17} /></span><div><strong>Como funciona o pedido?</strong><p>O shopper ShoppingLink encontra o produto na loja, confirma a disponibilidade e encaminha para retirada ou entrega.</p></div></div></div></main>;
}

function PanelPage({ products, navigate, onCreateProduct, orders }) {
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState({ name: '', category: 'Joias & acessórios', price: '', oldPrice: '', stock: '', image: '', description: '', tag: 'Novo' });
  const store = STORES[0];
  const storeProducts = products.filter((product) => product.storeId === store.id);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => { event.preventDefault(); if (!form.name || !form.price || !form.image) return; onCreateProduct({ ...form, storeId: store.id, price: Number(form.price), oldPrice: Number(form.oldPrice || form.price), stock: Number(form.stock || 1), discount: Math.max(0, Math.round((1 - Number(form.price) / Number(form.oldPrice || form.price)) * 100)), rating: 5, reviews: 0, delivery: 'Retire em 1h', installment: `6x de ${formatCurrency(Number(form.price) / 6)} sem juros`, specs: ['Produto cadastrado pela loja', 'Disponibilidade sujeita ao estoque', 'Compra protegida ShoppingLink'] }); setForm({ name: '', category: 'Joias & acessórios', price: '', oldPrice: '', stock: '', image: '', description: '', tag: 'Novo' }); setTab('products'); };
  return <main className="panel-main"><div className="panel-shell"><aside className="panel-sidebar"><div className="panel-brand"><Logo onClick={() => navigate('/')} /><span className="panel-badge">Área do lojista</span></div><div className="panel-store-mini"><img src={store.image} alt="" /><span><strong>{store.name}</strong><small>Plano profissional</small></span><span className="online-dot" /></div><nav className="panel-nav"><button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}><Icon name="graph" size={17} /> Visão geral</button><button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}><Icon name="bag" size={17} /> Produtos <span>{storeProducts.length}</span></button><button className={tab === 'add' ? 'active' : ''} onClick={() => setTab('add')}><Icon name="plus" size={17} /> Cadastrar produto</button><button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}><Icon name="truck" size={17} /> Pedidos <span>3</span></button></nav><div className="panel-help"><Icon name="chat" size={18} /><strong>Precisa de ajuda?</strong><p>Fale com o suporte ShoppingLink.</p><button>Entrar em contato <Icon name="arrow" size={14} /></button></div><button className="panel-back" onClick={() => navigate('/')}><Icon name="arrow" size={15} /> Voltar para a vitrine</button></aside><section className="panel-content"><div className="panel-topbar"><div><span className="eyebrow">Painel de demonstração · Capim Dourado</span><h1>{tab === 'add' ? 'Cadastrar produto' : tab === 'products' ? 'Seus produtos' : tab === 'orders' ? 'Pedidos recebidos' : 'Bom dia, ACIUM.'}</h1></div><div className="panel-top-actions"><span className="panel-notification"><Icon name="chat" size={17} /><b>2</b></span><button className="avatar-button">AT</button></div></div>{tab === 'overview' && <><div className="dashboard-kpis"><div><span>Vendas no mês</span><strong>R$ 12.840,00</strong><small className="positive">↑ 18,4% <em>vs. mês anterior</em></small><span className="kpi-icon lilac"><Icon name="graph" size={19} /></span></div><div><span>Pedidos ativos</span><strong>24</strong><small className="positive">↑ 6 novos hoje</small><span className="kpi-icon peach"><Icon name="bag" size={19} /></span></div><div><span>Produtos publicados</span><strong>{storeProducts.length}</strong><small>2 aguardando reposição</small><span className="kpi-icon mint"><Icon name="store" size={19} /></span></div><div><span>Nota da loja</span><strong>4,9 <small>/ 5</small></strong><small className="positive">↑ 0,2 este mês</small><span className="kpi-icon yellow"><span>★</span></span></div></div><div className="dashboard-grid"><section className="panel-card chart-card"><div className="panel-card-heading"><div><span className="eyebrow">Desempenho</span><h2>Vendas por período</h2></div><select><option>Últimos 7 dias</option><option>Últimos 30 dias</option></select></div><div className="chart"><div className="chart-y"><span>6k</span><span>4k</span><span>2k</span><span>0</span></div><div className="chart-plot"><div className="chart-bars">{[38, 52, 43, 68, 55, 86, 72].map((height, index) => <div key={index} className="chart-bar-wrap"><span className="chart-value">{index === 5 ? '5.8k' : ''}</span><div className={`chart-bar ${index === 5 ? 'highlight' : ''}`} style={{ height: `${height}%` }} /><small>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][index]}</small></div>)}</div></div></div></section><section className="panel-card recent-card"><div className="panel-card-heading"><div><span className="eyebrow">Atenção</span><h2>Pedidos recentes</h2></div><button className="text-link" onClick={() => setTab('orders')}>ver todos <Icon name="arrow" size={14} /></button></div><div className="recent-list">{['SL-2048 · Colar ACIUM Essencial', 'SL-2047 · Pulseira ACIUM Urban', 'SL-2046 · Filtro Solar Adcos FPS 60'].map((item, index) => <div className="recent-item" key={item}><span className={`recent-avatar avatar-${index}`}>{['MC', 'JR', 'AL'][index]}</span><div><strong>{item}</strong><small>{['Aguardando separação', 'Pronto para retirada', 'Entregue ao cliente'][index]}</small></div><span className={`recent-status status-${index}`}>{['novo', 'pronto', 'finalizado'][index]}</span></div>)}</div></section></div><div className="panel-quick-actions"><button onClick={() => setTab('add')}><span className="quick-icon coral"><Icon name="plus" size={19} /></span><span><strong>Cadastrar produto</strong><small>Coloque uma novidade no ar.</small></span><Icon name="arrow" size={16} /></button><button onClick={() => navigate('/loja/acium')}><span className="quick-icon blue"><Icon name="store" size={19} /></span><span><strong>Ver minha vitrine</strong><small>Como os clientes enxergam.</small></span><Icon name="arrow" size={16} /></button></div></>}{tab === 'products' && <section className="panel-card products-panel"><div className="panel-card-heading"><div><span className="eyebrow">Catálogo</span><h2>{storeProducts.length} produtos publicados</h2></div><button className="button button-coral" onClick={() => setTab('add')}><Icon name="plus" size={16} /> Novo produto</button></div><div className="seller-product-list">{storeProducts.map((product) => <div className="seller-product-row" key={product.id}><img src={product.image} alt="" /><div><strong>{product.name}</strong><small>{product.category} · {product.stock} em estoque</small></div><span className="seller-price">{formatCurrency(product.price)}</span><span className="published-label"><i /> publicado</span><button className="icon-only"><Icon name="edit" size={16} /></button></div>)}</div></section>}{tab === 'add' && <section className="panel-card form-panel"><div className="panel-card-heading"><div><span className="eyebrow">Novo anúncio</span><h2>Conte para o shopping o que você vende.</h2><p>Preencha os dados principais. Você poderá editar depois.</p></div><span className="form-required">* campos obrigatórios</span></div><form className="product-form" onSubmit={submit}><div className="form-grid"><label><span>Nome do produto *</span><input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Ex.: Colar ACIUM Essencial" required /></label><label><span>Categoria *</span><select value={form.category} onChange={(event) => update('category', event.target.value)}><option>Joias & acessórios</option><option>Beleza & cuidado</option><option>Moda masculina</option><option>Gastronomia</option><option>Serviços</option></select></label><label><span>Preço atual *</span><div className="input-prefix"><b>R$</b><input type="number" step="0.01" value={form.price} onChange={(event) => update('price', event.target.value)} placeholder="0,00" required /></div></label><label><span>Preço anterior</span><div className="input-prefix"><b>R$</b><input type="number" step="0.01" value={form.oldPrice} onChange={(event) => update('oldPrice', event.target.value)} placeholder="0,00" /></div></label><label><span>Estoque disponível</span><input type="number" value={form.stock} onChange={(event) => update('stock', event.target.value)} placeholder="Ex.: 10" /></label><label><span>Etiqueta da vitrine</span><select value={form.tag} onChange={(event) => update('tag', event.target.value)}><option>Novo</option><option>Oferta do dia</option><option>Mais vendido</option><option>Preço especial</option></select></label></div><label><span>URL da foto do produto *</span><input value={form.image} onChange={(event) => update('image', event.target.value)} placeholder="https://..." required /><small className="field-help">Nesta versão demonstrativa, a imagem é armazenada junto aos dados em memória do navegador.</small></label><label><span>Descrição curta</span><textarea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Explique por que esse produto merece ser escolhido." rows="4" /></label><div className="form-actions"><button type="button" className="button button-ghost" onClick={() => setTab('products')}>Cancelar</button><button type="submit" className="button button-coral">Publicar produto <Icon name="arrow" size={16} /></button></div></form></section>}{tab === 'orders' && <section className="panel-card products-panel"><div className="panel-card-heading"><div><span className="eyebrow">Operação</span><h2>Pedidos que precisam de você</h2></div><span className="orders-filter">Todos os pedidos <Icon name="chevron" size={14} /></span></div><div className="seller-orders">{[...orders, { id: 'SL-2047', item: 'Pulseira ACIUM Urban', store: store.name, total: 189.9, step: 2, date: 'Hoje, 13:54', method: 'Cartão' }].map((order) => <div className="seller-order-card" key={order.id}><div className="seller-order-id"><span className="recent-avatar avatar-1">{order.id.slice(-2)}</span><div><strong>{order.id}</strong><small>{order.date} · {order.method}</small></div></div><div><strong>{order.item}</strong><small>Cliente ShoppingLink</small></div><span className="seller-price">{formatCurrency(order.total)}</span><span className="order-pill">separar produto</span><button className="button button-small button-ghost">abrir <Icon name="arrow" size={14} /></button></div>)}</div></section>}</section></div></main>;
}

function LoginModal({ onClose, onLogin }) {
  const [name, setName] = useState('Marina Costa');
  return <div className="modal-backdrop" role="presentation"><div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title"><button className="modal-close" onClick={onClose} aria-label="Fechar"><Icon name="close" size={18} /></button><div className="modal-mark">S<span>//</span></div><span className="eyebrow">A sua jornada continua</span><h2 id="login-title">Entre para finalizar<br /><span>do seu jeito.</span></h2><p>Crie uma conta demo em segundos para confirmar o pedido e acompanhar cada etapa.</p><label>Como podemos te chamar?<input value={name} onChange={(event) => setName(event.target.value)} /></label><button className="button button-coral button-large" onClick={() => onLogin(name || 'Cliente ShoppingLink')}>Entrar e continuar <Icon name="arrow" size={17} /></button><small>Ao continuar, você concorda com os termos de demonstração do projeto.</small></div></div>;
}

function Toast({ message, onClose }) {
  if (!message) return null;
  return <div className="toast"><span className="toast-check"><Icon name="check" size={14} /></span><span>{message}</span><button onClick={onClose}><Icon name="close" size={15} /></button></div>;
}

export default function ShoppingLinkApp() {
  const nextPathname = usePathname() || '/';
  const [path, setPath] = useState(nextPathname);
  const [searchValue, setSearchValue] = useState('');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setPath(`${window.location.pathname}${window.location.search}` || '/');
    const savedProducts = readStoredJSON('shoppinglink-products');
    const savedCart = readStoredJSON('shoppinglink-cart');
    const savedOrders = readStoredJSON('shoppinglink-orders');
    const savedUser = readStoredJSON('shoppinglink-user');
    if (savedProducts) setProducts(savedProducts);
    if (savedCart) setCart(savedCart);
    if (savedOrders) setOrders(savedOrders);
    if (savedUser) setUser(savedUser);
    const onPopState = () => setPath(`${window.location.pathname}${window.location.search}`);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => { window.localStorage.setItem('shoppinglink-products', JSON.stringify(products)); }, [products]);
  useEffect(() => { window.localStorage.setItem('shoppinglink-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { window.localStorage.setItem('shoppinglink-orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { if (user) window.localStorage.setItem('shoppinglink-user', JSON.stringify(user)); else window.localStorage.removeItem('shoppinglink-user'); }, [user]);
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(''), 3400); return () => window.clearTimeout(timer); }, [toast]);

  const navigate = (to) => { setPath(to); window.history.pushState({}, '', to); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const onSearch = (term) => navigate(term?.trim() ? `/busca?q=${encodeURIComponent(term.trim())}` : '/busca');
  const onAdd = (product, goToCart = false, deliveryMode = 'pickup') => { setCart((current) => { const found = current.find((line) => line.productId === product.id); return found ? current.map((line) => line.productId === product.id ? { ...line, quantity: line.quantity + 1, deliveryMode: line.deliveryMode || deliveryMode } : line) : [...current, { productId: product.id, quantity: 1, deliveryMode }]; }); setToast(`${product.name} foi adicionado ao carrinho.`); if (goToCart) navigate('/carrinho'); };
  const onRemove = (productId) => setCart((current) => current.filter((line) => line.productId !== productId));
  const onChangeQuantity = (productId, quantity) => { if (quantity <= 0) return onRemove(productId); setCart((current) => current.map((line) => line.productId === productId ? { ...line, quantity } : line)); };
  const finishOrder = ({ paymentMethod = 'pix', deliveryMode = 'delivery' } = {}) => { const first = cart[0]; const product = products.find((item) => item.id === first?.productId) || products[0]; const subtotal = cart.reduce((sum, line) => { const item = products.find((itemProduct) => itemProduct.id === line.productId); return sum + (item?.price || 0) * line.quantity; }, 0); const deliveryFee = deliveryMode === 'delivery' ? 12.9 : 0; const newOrder = { id: `SL-${Math.floor(2050 + Math.random() * 400)}`, date: 'Agora mesmo', store: getStore(product.storeId).name, item: cart.length > 1 ? `${product.name} e mais ${cart.length - 1}` : product.name, total: subtotal + deliveryFee, method: paymentMethod === 'card' ? 'Cartão' : 'Pix', mode: deliveryMode === 'pickup' ? 'Retirada no shopping' : 'Entrega em casa', step: 0, address: deliveryMode === 'pickup' ? 'Capim Dourado Shopping · Palmas/TO' : 'Av. Central, 840 · Apto 42' }; setOrders((current) => [newOrder, ...current]); setCart([]); setModal(null); setToast('Pedido confirmado. Acompanhe tudo por aqui.'); navigate('/pedidos'); };
  const onCheckout = (options) => { if (!user) { setModal('login'); setToast('Entre para confirmar seu pedido com segurança.'); return; } finishOrder(options); };
  const onLogin = (name) => { setUser({ name, email: 'cliente@shoppinglink.demo' }); setModal(null); setToast('Login realizado. Agora você pode continuar.'); };
  const onCreateProduct = (product) => { setProducts((current) => [{ ...product, id: `custom-${Date.now()}`, image: product.image || IMG('photo-1523275335684-37898b6baf30') }, ...current]); setToast('Produto publicado na vitrine da ACIUM.'); };
  const query = useMemo(() => { const queryString = path.includes('?') ? path.split('?')[1] : ''; return new URLSearchParams(queryString).get('q') || ''; }, [path]);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const pathParts = path.split('?')[0].split('/').filter(Boolean);
  const product = pathParts[0] === 'produto' ? products.find((item) => item.id === pathParts[1]) : null;
  const store = pathParts[0] === 'loja' ? getStore(pathParts[1]) : null;
  let content;
  if (path === '/' || path === '') content = <HomePage products={products} navigate={navigate} onAdd={onAdd} searchValue={searchValue} setSearchValue={setSearchValue} onSearch={onSearch} />;
  else if (path.startsWith('/busca')) content = <SearchPage products={products} navigate={navigate} onAdd={onAdd} query={query} />;
  else if (path.startsWith('/loja/')) content = <StorePage store={store || STORES[0]} products={products} navigate={navigate} onAdd={onAdd} />;
  else if (path.startsWith('/produto/')) content = product ? <ProductPage product={product} navigate={navigate} onAdd={onAdd} /> : <SearchPage products={products} navigate={navigate} onAdd={onAdd} query="" />;
  else if (path === '/carrinho') content = <CartPage cart={cart} products={products} navigate={navigate} onRemove={onRemove} onChangeQuantity={onChangeQuantity} user={user} onCheckout={onCheckout} />;
  else if (path === '/pedidos') content = <OrdersPage orders={orders} navigate={navigate} />;
  else if (path === '/painel') content = <PanelPage products={products} navigate={navigate} onCreateProduct={onCreateProduct} orders={orders} />;
  else content = <HomePage products={products} navigate={navigate} onAdd={onAdd} searchValue={searchValue} setSearchValue={setSearchValue} onSearch={onSearch} />;
  const isPanel = path === '/painel';
  return <div className="app-shell">{!isPanel && <Header path={path} searchValue={searchValue} setSearchValue={setSearchValue} onSearch={onSearch} navigate={navigate} cartCount={cartCount} user={user} onLogin={() => setModal('login')} />}{content}{modal === 'login' && <LoginModal onClose={() => setModal(null)} onLogin={onLogin} />}{toast && <Toast message={toast} onClose={() => setToast('')} />}</div>;
}
