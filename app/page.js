'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { STORES, INITIAL_PRODUCTS, CATEGORIES, FEATURED_STORES, kindOf } from './data';
import { DIRECTORY } from './directory';
import { MALL, SERVICES, GALLERY, EVENTS, IMAGE_CREDITS, openStatus } from './mall';
import { Icon, KIND_ICON, GROUP_ICON } from './icons';

const categories = CATEGORIES;
const DIRECTORY_GROUPS = ['Moda', 'Calçados', 'Acessórios', 'Beleza & cosméticos', 'Farmácia', 'Eletrônicos', 'Gastronomia', 'Casa & presentes', 'Lazer & serviços'];
const STORE_BY_DIR = Object.fromEntries(STORES.map((store) => [store.dirId, store]));
const DIR_BY_ID = Object.fromEntries(DIRECTORY.map((entry) => [entry.id, entry]));
const LIGHTBOX_ITEMS = [...GALLERY, ...EVENTS.map((event) => ({ ...event, src: event.wide || event.src, credit: event.credit, creditUrl: event.url }))];
const POPULAR_SEARCHES = ['Tênis', 'Camiseta', 'Protetor solar', 'Fone bluetooth', 'Bolsa', 'Chinelo'];

const INITIAL_ORDERS = [
  { id: 'SL-2048', date: 'Hoje, 14:32', store: 'ACIUM', item: 'Colar ACIUM Essencial', total: 249.9, method: 'Pix', mode: 'Entrega em casa', step: 2, address: 'Quadra 204 Sul · Palmas/TO' }
];

// ---------------- utilidades ----------------
const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const readStoredJSON = (key, fallback = null) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    try { window.localStorage.removeItem(key); } catch { /* armazenamento bloqueado */ }
    return fallback;
  }
};
const writeStoredJSON = (key, value) => {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* armazenamento bloqueado */ }
};
const norm = (text) => String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const getStore = (id) => STORES.find((store) => store.id === id) || STORES[0];
const queryParams = (path) => new URLSearchParams(path.includes('?') ? path.split('?')[1] : '');
const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function Highlight({ text, query }) {
  const q = norm(query).trim();
  if (!q) return text;
  const index = norm(text).indexOf(q);
  if (index < 0) return text;
  return <>{text.slice(0, index)}<mark>{text.slice(index, index + q.length)}</mark>{text.slice(index + q.length)}</>;
}

// Mostra um esqueleto por alguns milissegundos quando os filtros mudam.
function useBriefLoading(key, ms = 280) {
  const [loading, setLoading] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(timer);
  }, [key, ms]);
  return loading;
}

function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}

// ---------------- peças visuais ----------------
function Logo({ onClick }) {
  return <button className="brand" onClick={onClick} aria-label="Voltar para o início"><span className="brand-mark">S<span>//</span></span><span>shopping<span className="brand-accent">link</span></span></button>;
}

function ProductVisual({ product, showNote = true }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const store = getStore(product.storeId);
  if (!product.image || failed) {
    return (
      <span className="product-illustration" role="img" aria-label={`Ilustração: ${product.name}`} style={{ '--tint': store.accent }}>
        <span className="illustration-icon"><Icon name={KIND_ICON[product.kind || kindOf(product.name)] || 'bag'} size={46} strokeWidth={1.4} /></span>
        {store.logo ? <img className="illustration-logo" src={store.logo} alt="" loading="lazy" /> : <small className="illustration-store">{store.name}</small>}
        {showNote && <span className="photo-note">ilustração</span>}
      </span>
    );
  }
  return (
    <span className={`product-photo ${loaded ? 'is-loaded' : ''}`}>
      <img src={product.image} alt={product.name} loading="lazy" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      {showNote && product.photoCredit && <span className="photo-note">foto ilustrativa</span>}
    </span>
  );
}

function StoreLogo({ store, size = 'md' }) {
  const [failed, setFailed] = useState(false);
  const name = store.name;
  const words = name.replace(/[^A-Za-zÀ-ÿ0-9& ]/g, '').split(' ').filter(Boolean);
  const initials = (name.length <= 3 ? name : words.length > 1 ? words.map((word) => word[0]).join('').slice(0, 2) : name.replace(/[^A-Za-zÀ-ÿ0-9]/g, '').slice(0, 2)).toUpperCase();
  if (store.logo && !failed) return <img className={`store-logo logo-${size}`} src={store.logo} alt={name} loading="lazy" onError={() => setFailed(true)} />;
  return <span className={`store-monogram logo-${size}`} style={{ '--tint': store.accent || '#a8742a' }} aria-hidden="true">{initials}</span>;
}

function SectionHeading({ eyebrow, title, description, action, onAction, children }) {
  return <div className="section-heading" data-reveal><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>{children}{action && <button className="text-link" onClick={onAction}>{action}<Icon name="arrow" size={16} /></button>}</div>;
}

function SkeletonGrid({ count = 6, className = 'product-grid', variant = 'product' }) {
  return <div className={className} aria-busy="true" aria-label="Carregando">{Array.from({ length: count }, (_, index) => <div key={index} className={`skeleton-card skeleton-${variant}`}><span className="skeleton-media" /><span className="skeleton-line" /><span className="skeleton-line short" /></div>)}</div>;
}

// ---------------- modal genérico ----------------
function Modal({ onClose, labelledBy, className = '', children, wide = false }) {
  const panelRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-open');
    window.setTimeout(() => panelRef.current?.querySelector('[data-autofocus], button')?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-open');
      previous?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={panelRef} className={`modal-panel ${wide ? 'modal-wide' : ''} ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar"><Icon name="close" size={18} /></button>
        {children}
      </div>
    </div>
  );
}

// ---------------- busca dinâmica ----------------
function LiveSearch({ value, setValue, onSearch, navigate, products, recent, onOpenStore, variant = 'header' }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);
  const listId = `search-list-${variant}`;
  const q = norm(value).trim();

  const items = useMemo(() => {
    if (!q) return [
      ...recent.map((term) => ({ type: 'recent', key: `r-${term}`, label: term, run: () => onSearch(term) })),
      ...POPULAR_SEARCHES.filter((term) => !recent.includes(term)).map((term) => ({ type: 'popular', key: `p-${term}`, label: term, run: () => onSearch(term) }))
    ];
    const score = (text) => { const n = norm(text); return n.startsWith(q) ? 0 : n.includes(` ${q}`) ? 1 : n.includes(q) ? 2 : 9; };
    const productHits = products
      .map((product) => ({ product, s: Math.min(score(product.name), score(getStore(product.storeId).name) + 1, score(product.category) + 2) }))
      .filter((hit) => hit.s < 9).sort((a, b) => a.s - b.s || b.product.discount - a.product.discount).slice(0, 5)
      .map(({ product }) => ({ type: 'product', key: `pr-${product.id}`, product, label: product.name, run: () => navigate(`/produto/${product.id}`) }));
    const storeHits = DIRECTORY
      .map((entry) => ({ entry, s: Math.min(score(entry.name), q.length >= 3 && (norm(entry.official).startsWith(q) || norm(entry.official).includes(` ${q}`)) ? 3 : 9) }))
      .filter((hit) => hit.s < 9).sort((a, b) => a.s - b.s).slice(0, 4)
      .map(({ entry }) => ({ type: 'store', key: `st-${entry.id}`, entry, label: entry.name, run: () => onOpenStore(entry.id) }));
    const categoryHits = categories.filter((category) => norm(category.name).includes(q)).slice(0, 2)
      .map((category) => ({ type: 'category', key: `c-${category.name}`, label: category.name, run: () => navigate(`/busca?categoria=${encodeURIComponent(category.name)}`) }));
    return [...productHits, ...storeHits, ...categoryHits];
  }, [q, products, recent, navigate, onSearch, onOpenStore]);

  useEffect(() => { setActive(-1); }, [q]);
  useEffect(() => {
    const onDown = (event) => { if (!wrapRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const choose = (item) => { setOpen(false); item.run(); };
  const onKeyDown = (event) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) { setOpen(true); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((index) => Math.min(items.length - 1, index + 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => Math.max(-1, index - 1)); }
    else if (event.key === 'Escape') { setOpen(false); }
    else if (event.key === 'Enter' && active >= 0 && items[active]) { event.preventDefault(); choose(items[active]); }
  };

  const groups = [
    { type: 'recent', title: 'Buscas recentes', icon: 'clock' },
    { type: 'popular', title: 'Mais buscados', icon: 'spark' },
    { type: 'product', title: 'Produtos', icon: 'bag' },
    { type: 'store', title: 'Lojas do shopping', icon: 'store' },
    { type: 'category', title: 'Categorias', icon: 'grid' }
  ];
  const formClass = variant === 'hero' ? 'hero-search' : 'global-search';
  return (
    <div className={`live-search live-search-${variant}`} ref={wrapRef}>
      <form className={formClass} role="search" onSubmit={(event) => { event.preventDefault(); setOpen(false); onSearch(value); }}>
        <Icon name="search" size={variant === 'hero' ? 20 : 19} />
        <input
          value={value}
          onChange={(event) => { setValue(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={variant === 'hero' ? 'Buscar produtos, lojas ou categorias' : 'O que você está procurando hoje?'}
          aria-label="Buscar produtos e lojas"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 && items[active] ? `${listId}-${items[active].key}` : undefined}
          autoComplete="off"
        />
        {value && <button type="button" className="search-clear" onClick={() => { setValue(''); setOpen(true); }} aria-label="Limpar busca"><Icon name="close" size={14} /></button>}
        <button type="submit" className="search-submit">{variant === 'hero' ? 'Encontrar' : 'Buscar'}</button>
      </form>
      {open && (
        <div className="search-panel" id={listId} role="listbox">
          {items.length === 0 && <div className="search-empty"><Icon name="search" size={18} /><span>Nada encontrado para “{value}”. Tente outro termo.</span></div>}
          {groups.map((group) => {
            const groupItems = items.filter((item) => item.type === group.type);
            if (!groupItems.length) return null;
            const chips = group.type === 'recent' || group.type === 'popular';
            return (
              <div className="search-group" key={group.type}>
                <span className="search-group-title"><Icon name={group.icon} size={13} /> {group.title}</span>
                <div className={chips ? 'search-chips' : 'search-rows'}>
                  {groupItems.map((item) => {
                    const index = items.indexOf(item);
                    const isActive = index === active;
                    const common = { id: `${listId}-${item.key}`, role: 'option', 'aria-selected': isActive, onMouseEnter: () => setActive(index), onClick: () => choose(item) };
                    if (chips) return <button key={item.key} type="button" className={`search-chip ${isActive ? 'active' : ''}`} {...common}>{item.label}</button>;
                    if (item.type === 'product') return <button key={item.key} type="button" className={`search-row ${isActive ? 'active' : ''}`} {...common}><span className="search-thumb"><ProductVisual product={item.product} showNote={false} /></span><span className="search-row-copy"><strong><Highlight text={item.product.name} query={value} /></strong><small>{getStore(item.product.storeId).name} · {formatCurrency(item.product.price)}</small></span>{item.product.discount > 0 && <span className="discount-pill">-{item.product.discount}%</span>}</button>;
                    if (item.type === 'store') return <button key={item.key} type="button" className={`search-row ${isActive ? 'active' : ''}`} {...common}><span className="search-thumb logo-thumb"><StoreLogo store={item.entry} size="sm" /></span><span className="search-row-copy"><strong><Highlight text={item.entry.name} query={value} /></strong><small>{item.entry.official || item.entry.group} · {item.entry.floor}</small></span><Icon name="chevron" size={14} /></button>;
                    return <button key={item.key} type="button" className={`search-row ${isActive ? 'active' : ''}`} {...common}><span className="search-thumb icon-thumb"><Icon name="grid" size={16} /></span><span className="search-row-copy"><strong><Highlight text={item.label} query={value} /></strong><small>Ver categoria</small></span><Icon name="chevron" size={14} /></button>;
                  })}
                </div>
              </div>
            );
          })}
          {q && <button type="button" className="search-see-all" onClick={() => { setOpen(false); onSearch(value); }}>Ver todos os resultados para “{value}” <Icon name="arrow" size={14} /></button>}
        </div>
      )}
    </div>
  );
}

// ---------------- cabeçalho ----------------
function Header({ path, searchProps, navigate, cartCount, favoritesCount, user, onLogin }) {
  const [bump, setBump] = useState(false);
  const previous = useRef(cartCount);
  useEffect(() => {
    if (cartCount > previous.current) { setBump(true); const timer = window.setTimeout(() => setBump(false), 450); previous.current = cartCount; return () => window.clearTimeout(timer); }
    previous.current = cartCount;
    return undefined;
  }, [cartCount]);
  const now = useNow();
  const status = now ? openStatus('stores', now) : null;
  return <>
    <div className="topline"><div className="container top-line-inner"><span><Icon name="pin" size={13} /> {MALL.name} · {MALL.city}</span>{status && <span className={`topline-status ${status.isOpen ? 'open' : 'closed'}`}><i /> {status.text}</span>}<span className="topline-right">Retire hoje em até 1h <span className="dot-separator">•</span> Entrega para toda a região</span></div></div>
    <header className="site-header">
      <div className="container header-inner">
        <Logo onClick={() => navigate('/')} />
        <LiveSearch {...searchProps} variant="header" />
        <div className="header-actions">
          <button className="header-icon-button" onClick={() => navigate('/favoritos')} aria-label={`Favoritos (${favoritesCount})`}><Icon name="heart" size={19} />{favoritesCount > 0 && <b>{favoritesCount}</b>}</button>
          <button className="header-action" onClick={() => user ? navigate('/pedidos') : onLogin()}><span className="action-icon"><Icon name="user" size={19} /></span><span className="action-copy"><small>{user ? `Olá, ${user.name.split(' ')[0]}` : 'Minha conta'}</small><strong>{user ? 'Meus pedidos' : 'Entrar ou cadastrar'}</strong></span></button>
          <button className={`cart-button ${bump ? 'bump' : ''}`} onClick={() => navigate('/carrinho')} aria-label={`Abrir carrinho (${cartCount} itens)`}><Icon name="cart" size={21} /><span className="cart-label">Carrinho</span>{cartCount > 0 && <b key={cartCount}>{cartCount}</b>}</button>
        </div>
      </div>
      <nav className="main-nav" aria-label="Navegação principal"><div className="container nav-inner"><button className={path === '/' ? 'active' : ''} onClick={() => navigate('/')}>Início</button><button className={path.startsWith('/busca') ? 'active' : ''} onClick={() => navigate('/busca')}>Explorar produtos</button><button className={path.startsWith('/loja') && !path.includes('Gastronomia') ? 'active' : ''} onClick={() => navigate('/lojas')}><Icon name="store" size={15} /> Lojas do shopping</button><button className={path.startsWith('/lojas?grupo=Gastronomia') ? 'active' : ''} onClick={() => navigate('/lojas?grupo=Gastronomia')}><Icon name="food" size={15} /> Gastronomia</button><button className={path.startsWith('/pedidos') ? 'active' : ''} onClick={() => navigate('/pedidos')}><Icon name="truck" size={15} /> Acompanhar pedido</button><span className="nav-spacer" /><button className="seller-link" onClick={() => navigate('/painel')}><Icon name="store" size={15} /> Sou lojista</button></div></nav>
    </header>
  </>;
}

// ---------------- cartões ----------------
function ProductCard({ product, onProduct, onAdd, onQuickView, isFavorite: favoriteCheck, onToggleFavorite, index = 0 }) {
  const store = getStore(product.storeId);
  const isFavorite = typeof favoriteCheck === 'function' ? favoriteCheck(product.id) : Boolean(favoriteCheck);
  const [added, setAdded] = useState(false);
  useEffect(() => { if (!added) return undefined; const timer = window.setTimeout(() => setAdded(false), 1400); return () => window.clearTimeout(timer); }, [added]);
  return (
    <article className="product-card" data-reveal style={{ '--d': `${Math.min(index, 8) * 55}ms` }}>
      <div className="product-image-wrap">
        <button className="product-image-button" onClick={() => onProduct(product.id)} aria-label={`Ver ${product.name}`}><ProductVisual product={product} /></button>
        <span className="product-tag">{product.tag}</span>
        <button className={`heart-button ${isFavorite ? 'active' : ''}`} onClick={() => onToggleFavorite(product)} aria-pressed={isFavorite} aria-label={isFavorite ? `Remover ${product.name} dos favoritos` : `Favoritar ${product.name}`}><Icon name="heart" size={17} /></button>
        <button className="quick-view-button" onClick={() => onQuickView(product.id)}><Icon name="eye" size={15} /> Espiar</button>
      </div>
      <div className="product-card-body">
        <div className="product-store-line"><span>{store.name}</span><span className="rating"><span>★</span> {product.rating}</span></div>
        <button className="product-name" onClick={() => onProduct(product.id)}>{product.name}</button>
        <p className="product-description">{product.description}</p>
        <div className="price-line"><span className="current-price">{formatCurrency(product.price)}</span>{product.discount > 0 && <span className="discount-pill">-{product.discount}%</span>}</div>
        <span className={product.discount > 0 ? 'old-price' : 'old-price spacer'}>{product.discount > 0 ? `de ${formatCurrency(product.oldPrice)}` : ' '}</span>
        <div className="product-footer"><span><Icon name="truck" size={14} /> {product.delivery}</span><button className={`add-button ${added ? 'added' : ''}`} onClick={() => { onAdd(product); setAdded(true); }} aria-live="polite">{added ? <><Icon name="check" size={16} /> adicionado</> : <><Icon name="plus" size={16} /> adicionar</>}</button></div>
      </div>
    </article>
  );
}

function StoreCard({ entry, onOpen, index = 0 }) {
  const store = STORE_BY_DIR[entry.id];
  return (
    <button className="store-card" onClick={() => onOpen(entry.id)} data-reveal style={{ '--d': `${Math.min(index, 11) * 35}ms` }}>
      <span className="store-card-logo"><StoreLogo store={{ ...entry, accent: store?.accent }} /></span>
      <span className="store-card-info">
        <b>{entry.name}</b>
        <small>{entry.official || entry.group}</small>
        <span className="store-card-meta"><span><Icon name="pin" size={12} /> {entry.floor}</span>{entry.soon ? <em className="badge-soon">Em breve</em> : store ? <em className="badge-online">Vitrine online</em> : null}</span>
      </span>
    </button>
  );
}

function ScrollRow({ children, label, className = '' }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);
  useEffect(() => { update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, [update]);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  return (
    <div className={`scroll-row ${className}`}>
      <button className="scroll-arrow left" onClick={() => scroll(-1)} disabled={edges.start} aria-label={`${label}: anterior`}><Icon name="chevronLeft" size={18} /></button>
      <div className="scroll-track" ref={ref} onScroll={update} role="list" aria-label={label}>{children}</div>
      <button className="scroll-arrow right" onClick={() => scroll(1)} disabled={edges.end} aria-label={`${label}: próximo`}><Icon name="chevron" size={18} /></button>
    </div>
  );
}

// ---------------- carrossel do topo ----------------
function HeroCarousel({ onOpenLightbox }) {
  const slides = useMemo(() => [
    { ...GALLERY[0], kicker: 'O shopping', cta: 'Ver foto ampliada', lightbox: 0 },
    { ...EVENTS[0], cta: 'Ver campanha', lightbox: 2 },
    { ...GALLERY[1], kicker: 'Lazer', cta: 'Ver foto ampliada', lightbox: 1 },
    { ...EVENTS[1], cta: 'Ver campanha', lightbox: 3 }
  ], []);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef(null);
  const go = useCallback((next) => setIndex((current) => (next + slides.length) % slides.length), [slides.length]);
  useEffect(() => {
    if (paused || prefersReducedMotion()) return undefined;
    const timer = window.setTimeout(() => go(index + 1), 6000);
    return () => window.clearTimeout(timer);
  }, [index, paused, go]);
  const slide = slides[index];
  return (
    <div
      className={`hero-carousel ${paused ? 'paused' : ''}`}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onPointerDown={(event) => { drag.current = event.clientX; }}
      onPointerUp={(event) => { if (drag.current === null) return; const dx = event.clientX - drag.current; drag.current = null; if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1)); }}
      onKeyDown={(event) => { if (event.key === 'ArrowRight') go(index + 1); if (event.key === 'ArrowLeft') go(index - 1); }}
      role="region" aria-roledescription="carrossel" aria-label="Destaques do Capim Dourado Shopping"
    >
      <div className="hero-slides">
        {slides.map((item, i) => (
          <figure key={item.id} className={`hero-slide ${i === index ? 'active' : ''}`} aria-hidden={i !== index} aria-roledescription="slide" aria-label={`${i + 1} de ${slides.length}`}>
            <img src={item.src} alt={item.title} draggable="false" loading={i === 0 ? 'eager' : 'lazy'} />
          </figure>
        ))}
      </div>
      <div className="hero-slide-caption" key={slide.id} aria-live={paused ? 'polite' : 'off'}>
        <span className="hero-art-label">{slide.kicker}</span>
        <strong>{slide.title}</strong>
        <p>{slide.text}</p>
        <div className="hero-caption-row"><button className="button button-light button-small" onClick={() => onOpenLightbox(slide.lightbox)}><Icon name="image" size={14} /> {slide.cta}</button><small>{slide.credit}</small></div>
      </div>
      <button className="carousel-arrow left" onClick={() => go(index - 1)} aria-label="Slide anterior"><Icon name="chevronLeft" size={18} /></button>
      <button className="carousel-arrow right" onClick={() => go(index + 1)} aria-label="Próximo slide"><Icon name="chevron" size={18} /></button>
      <div className="carousel-dots" role="tablist" aria-label="Escolher slide">
        {slides.map((item, i) => <button key={item.id} role="tab" aria-selected={i === index} aria-label={`Slide ${i + 1}: ${item.title}`} className={i === index ? 'active' : ''} onClick={() => go(i)}><span style={i === index ? { animationPlayState: paused ? 'paused' : 'running' } : undefined} /></button>)}
      </div>
    </div>
  );
}

function LogoMarquee({ onOpenStore }) {
  const entries = useMemo(() => DIRECTORY.filter((entry) => entry.logo && !entry.soon && entry.group !== 'Lazer & serviços').filter((_, i) => i % 2 === 0).slice(0, 30), []);
  return (
    <section className="logo-marquee" aria-label="Algumas lojas do shopping">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
            {entries.map((entry) => <button key={`${copy}-${entry.id}`} className="marquee-item" tabIndex={copy === 1 ? -1 : 0} onClick={() => onOpenStore(entry.id)} title={entry.name}><StoreLogo store={entry} size="sm" /></button>)}
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------- páginas ----------------
function HomePage({ products, navigate, cardProps, searchProps, onOpenStore, onOpenLightbox }) {
  const [offerTab, setOfferTab] = useState('Todas');
  const offerTabs = ['Todas', ...categories.map((c) => c.name).filter((name) => products.some((p) => p.category === name && p.discount > 0))];
  const offers = useMemo(() => {
    const seen = new Set();
    return [...products].filter((p) => p.discount > 0 && (offerTab === 'Todas' || p.category === offerTab)).sort((a, b) => b.discount - a.discount)
      .filter((p) => offerTab !== 'Todas' || (!seen.has(p.storeId) && seen.add(p.storeId))).slice(0, 8);
  }, [products, offerTab]);
  const loadingOffers = useBriefLoading(offerTab, 260);
  const featuredStores = FEATURED_STORES.map((id) => DIR_BY_ID[getStore(id).dirId]).filter(Boolean);
  const food = useMemo(() => DIRECTORY.filter((entry) => entry.group === 'Gastronomia' && entry.logo && !entry.soon), []);
  const mosaicStores = useMemo(() => DIRECTORY.filter((entry) => entry.logo && ['Moda', 'Calçados', 'Acessórios'].includes(entry.group)).slice(0, 6), []);
  const now = useNow();
  const storeStatus = now ? openStatus('stores', now) : null;
  const foodStatus = now ? openStatus('food', now) : null;
  const countByCategory = (name) => products.filter((p) => p.category === name).length;
  return <>
    <main>
      <section className="hero"><div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow light">{MALL.name} · {MALL.city}</span>
          <h1>Veja o que tem no shopping<br /><span>antes de sair de casa.</span></h1>
          <p>Moda, calçados, acessórios, cosméticos, farmácia e eletrônicos das lojas do Capim Dourado. Veja o preço e escolha: retirar no shopping ou receber em casa.</p>
          <LiveSearch {...searchProps} variant="hero" />
          <div className="hero-trust"><span><Icon name="store" size={16} /> {DIRECTORY.length} lojas no diretório</span><span><Icon name="clock" size={16} /> Retire em até 1h</span><span><Icon name="truck" size={16} /> Entrega local</span></div>
        </div>
        <HeroCarousel onOpenLightbox={onOpenLightbox} />
      </div></section>
      <LogoMarquee onOpenStore={onOpenStore} />

      <section className="category-rail"><div className="container"><div className="rail-intro"><span className="eyebrow">Navegue por perto</span><strong>O que você quer encontrar?</strong></div><div className="category-list">{categories.map((category, index) => <button key={category.name} className="category-chip" data-reveal style={{ '--d': `${index * 50}ms` }} onClick={() => navigate(`/busca?categoria=${encodeURIComponent(category.name)}`)}><span className={`category-icon ${category.color}`}><Icon name={category.icon} size={20} /></span><span className="category-chip-copy"><span>{category.name}</span><small>{countByCategory(category.name)} produtos</small></span><Icon name="chevron" size={15} /></button>)}</div></div></section>

      <section className="content-section"><div className="container">
        <SectionHeading eyebrow="Ofertas" title="Ofertas de hoje" description="Preços de demonstração de produtos das lojas do shopping." action="Ver todos os produtos" onAction={() => navigate('/busca?ofertas=1')} />
        <div className="chip-row tabs-row" role="tablist" aria-label="Filtrar ofertas por categoria" data-reveal>{offerTabs.map((tab) => <button key={tab} role="tab" aria-selected={offerTab === tab} className={offerTab === tab ? 'chip selected' : 'chip'} onClick={() => setOfferTab(tab)}>{tab}</button>)}</div>
        {loadingOffers ? <SkeletonGrid count={Math.max(4, Math.min(offers.length, 8))} /> : <div className="product-grid">{offers.map((product, index) => <ProductCard key={product.id} product={product} index={index} {...cardProps} />)}</div>}
      </div></section>

      <section className="explore-section"><div className="container">
        <SectionHeading eyebrow="Conheça o espaço" title="Explore o Capim Dourado" description="Fotos reais do shopping e as campanhas do momento. Toque para ampliar." />
        <div className="bento">
          <button className="bento-tile bento-main" data-reveal onClick={() => onOpenLightbox(0)}><img src={GALLERY[0].src} alt={GALLERY[0].title} loading="lazy" /><span className="bento-caption"><strong>Fachada e estacionamento</strong><small>{GALLERY[0].credit}</small></span><span className="bento-zoom"><Icon name="image" size={16} /></span></button>
          <button className="bento-tile" data-reveal style={{ '--d': '60ms' }} onClick={() => onOpenLightbox(1)}><img src={GALLERY[1].src} alt={GALLERY[1].title} loading="lazy" /><span className="bento-caption"><strong>Cinemark e convivência</strong><small>{GALLERY[1].credit}</small></span><span className="bento-zoom"><Icon name="image" size={16} /></span></button>
          <button className="bento-tile" data-reveal style={{ '--d': '120ms' }} onClick={() => onOpenLightbox(2)}><img src={EVENTS[0].src} alt={EVENTS[0].title} loading="lazy" /><span className="bento-caption"><strong>{EVENTS[0].title}</strong><small>{EVENTS[0].credit}</small></span><span className="bento-zoom"><Icon name="image" size={16} /></span></button>
          <button className="bento-tile bento-placeholder" data-reveal style={{ '--d': '180ms' }} onClick={() => navigate('/lojas?grupo=Gastronomia')}><span className="placeholder-mosaic">{food.slice(0, 6).map((entry) => <span key={entry.id}><StoreLogo store={entry} size="sm" /></span>)}</span><span className="bento-caption dark"><strong>Praça de alimentação</strong><small>{food.length} opções de gastronomia · foto do ambiente em breve</small></span><span className="bento-zoom"><Icon name="arrow" size={16} /></span></button>
          <button className="bento-tile bento-placeholder" data-reveal style={{ '--d': '240ms' }} onClick={() => navigate('/lojas')}><span className="placeholder-mosaic">{mosaicStores.map((entry) => <span key={entry.id}><StoreLogo store={entry} size="sm" /></span>)}</span><span className="bento-caption dark"><strong>Corredores e vitrines</strong><small>Conheça as {DIRECTORY.length} lojas · foto do ambiente em breve</small></span><span className="bento-zoom"><Icon name="arrow" size={16} /></span></button>
        </div>
      </div></section>

      <section className="content-section food-section"><div className="container">
        <SectionHeading eyebrow="Gastronomia" title="Restaurantes, cafés e doces" description="Da praça de alimentação às cafeterias: toque em uma marca para ver categoria, localização e horário." action="Ver toda a gastronomia" onAction={() => navigate('/lojas?grupo=Gastronomia')} />
        <ScrollRow label="Restaurantes e cafés">{food.map((entry) => <button key={entry.id} role="listitem" className="food-card" onClick={() => onOpenStore(entry.id)}><span className="food-card-logo"><StoreLogo store={entry} /></span><b>{entry.name}</b><small>{entry.official}</small><span className="food-floor"><Icon name="pin" size={11} /> {entry.floor}</span></button>)}</ScrollRow>
      </div></section>

      <section className="experience-section"><div className="container experience-grid"><div className="experience-copy" data-reveal><span className="eyebrow">Como funciona</span><h2>Do celular<br /><span>até a loja.</span></h2><p>O produto continua na loja do Capim Dourado Shopping. Você pesquisa por aqui, reserva para retirar ou pede para receber em casa.</p><button className="button button-dark" onClick={() => navigate('/busca')}>Explorar o catálogo <Icon name="arrow" size={17} /></button></div><div className="steps-card">{[['01', 'Pesquise', 'Veja produtos e preços de várias lojas em um só lugar.', 'search'], ['02', 'Reserve', 'Escolha retirar no shopping ou informe o endereço de entrega.', 'bag'], ['03', 'Retire ou receba', 'A loja separa o produto e avisa quando estiver pronto.', 'truck']].map(([n, title, text, icon], index) => <div className="step-item" key={n} data-reveal style={{ '--d': `${index * 90}ms` }}><span className="step-number">{n}</span><div><strong>{title}</strong><p>{text}</p></div><Icon name={icon} size={19} /></div>)}</div></div></section>

      <section className="content-section stores-section"><div className="container">
        <SectionHeading eyebrow="Lojas" title="Lojas do shopping" description="Logos e localização conforme o diretório oficial do Capim Dourado Shopping." action={`Ver todas as ${DIRECTORY.length} lojas`} onAction={() => navigate('/lojas')} />
        <div className="store-grid">{featuredStores.map((entry, index) => <StoreCard key={entry.id} entry={entry} index={index} onOpen={onOpenStore} />)}</div>
      </div></section>

      <section className="visit-section"><div className="container visit-grid">
        <div className="visit-card" data-reveal>
          <span className="eyebrow">Planeje sua visita</span>
          <h2>Horários e endereço</h2>
          <div className="hours-list">
            <div><span>{MALL.hours.stores.label}</span><strong>Seg. a sáb. 10h–22h · Dom. 14h–20h</strong>{storeStatus && <em className={storeStatus.isOpen ? 'open' : 'closed'}><i /> {storeStatus.text}</em>}</div>
            <div><span>{MALL.hours.food.label}</span><strong>Seg. a sáb. 11h–22h · Dom. 11h–20h</strong>{foodStatus && <em className={foodStatus.isOpen ? 'open' : 'closed'}><i /> {foodStatus.text}</em>}</div>
          </div>
          <p className="visit-address"><Icon name="pin" size={16} /> {MALL.address}</p>
          <div className="visit-actions"><a className="button button-dark" href={MALL.mapUrl} target="_blank" rel="noopener noreferrer"><Icon name="map" size={16} /> Como chegar</a><a className="button button-ghost" href={MALL.site} target="_blank" rel="noopener noreferrer">Site oficial <Icon name="external" size={14} /></a></div>
          <small className="source-note">Fonte: site oficial do shopping, consultado em 13/11/2026.</small>
        </div>
        <div className="services-grid">{SERVICES.map((service, index) => <div className="service-item" key={service.name} data-reveal style={{ '--d': `${index * 45}ms` }} tabIndex={0}><span className="service-icon"><Icon name={service.icon} size={19} /></span><strong>{service.name}</strong><small>{service.note}</small></div>)}</div>
      </div></section>

      <section className="seller-banner"><div className="container seller-banner-inner" data-reveal><div><span className="eyebrow light">Para lojistas</span><h2>Tem loja no shopping?<br /><span>Cadastre seus produtos.</span></h2><p>Publique produtos e ofertas e acompanhe os pedidos em um só lugar.</p></div><button className="button button-light" onClick={() => navigate('/painel')}>Abrir painel da loja <Icon name="arrow" size={17} /></button></div></section>
    </main>
  </>;
}

function Footer({ navigate, onCredits }) {
  return <footer className="footer"><div className="container footer-grid"><div><Logo onClick={() => navigate('/')} /><p>Projeto acadêmico · Palmas–TO</p></div><div><span className="footer-title">ShoppingLink</span><button onClick={() => navigate('/busca')}>Explorar produtos</button><button onClick={() => navigate('/favoritos')}>Meus favoritos</button><button onClick={() => navigate('/pedidos')}>Acompanhar pedido</button></div><div><span className="footer-title">Shopping</span><button onClick={() => navigate('/lojas')}>Diretório de lojas</button><button onClick={() => navigate('/lojas?grupo=Gastronomia')}>Gastronomia</button><a href={MALL.site} target="_blank" rel="noopener noreferrer">Site oficial <Icon name="external" size={11} /></a></div><div><span className="footer-title">Informações</span><button onClick={() => navigate('/painel')}>Painel do lojista</button><button onClick={onCredits}>Créditos das imagens</button><p>{MALL.phone} (shopping)</p></div></div><div className="container footer-bottom"><span>© 2026 ShoppingLink · Projeto acadêmico demonstrativo para Palmas/TO</span><span>Preços e estoques de demonstração · Lojas conforme o diretório oficial</span></div></footer>;
}

function FilterPanel({ products, filters, setFilters, storesWithProducts, onClear, priceCeiling }) {
  const set = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return <>
    <div className="filter-heading"><strong>Filtre por</strong><button onClick={onClear}>limpar tudo</button></div>
    <div className="filter-group"><span>Categoria</span>{['Todos', ...categories.map((item) => item.name)].map((item) => <button key={item} className={filters.category === item ? 'filter-option selected' : 'filter-option'} onClick={() => set('category', item)} aria-pressed={filters.category === item}><span className="filter-radio" />{item}<small>{item === 'Todos' ? products.length : products.filter((product) => product.category === item).length}</small></button>)}</div>
    <div className="filter-group"><span>Loja</span><select className="filter-select" value={filters.store} onChange={(event) => set('store', event.target.value)} aria-label="Filtrar por loja"><option value="">Todas as lojas</option>{storesWithProducts.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}</select></div>
    <div className="filter-group"><span>Preço até <b className="range-value">{formatCurrency(filters.maxPrice)}</b></span><input className="range-input" type="range" min="10" max={priceCeiling} step="10" value={filters.maxPrice} onChange={(event) => set('maxPrice', Number(event.target.value))} aria-label="Preço máximo" style={{ '--fill': `${(filters.maxPrice / priceCeiling) * 100}%` }} /><div className="range-scale"><small>R$ 10</small><small>{formatCurrency(priceCeiling)}</small></div></div>
    <div className="filter-group"><label className="toggle"><input type="checkbox" checked={filters.onlyOffers} onChange={(event) => set('onlyOffers', event.target.checked)} /><span className="toggle-track" /><span>Só ofertas</span></label><label className="toggle"><input type="checkbox" checked={filters.onlyFavorites} onChange={(event) => set('onlyFavorites', event.target.checked)} /><span className="toggle-track" /><span>Só favoritos</span></label></div>
    <div className="filter-note"><Icon name="shield" size={17} /><span><strong>Lojas reais do shopping</strong>Preços e estoques são de demonstração.</span></div>
  </>;
}

function SearchPage({ products, navigate, cardProps, query, path, favorites }) {
  const params = queryParams(path);
  const priceCeiling = useMemo(() => Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100, [products]);
  const initial = useMemo(() => ({ category: params.get('categoria') || 'Todos', store: params.get('loja') || '', maxPrice: priceCeiling, onlyOffers: params.get('ofertas') === '1', onlyFavorites: false }), [path, priceCeiling]); // eslint-disable-line react-hooks/exhaustive-deps
  const [filters, setFilters] = useState(initial);
  const [sort, setSort] = useState('relevancia');
  const [drawer, setDrawer] = useState(false);
  useEffect(() => { setFilters(initial); }, [initial]);
  const normalizedQuery = norm(query);
  const storesWithProducts = useMemo(() => STORES.filter((store) => products.some((p) => p.storeId === store.id)).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')), [products]);
  const filtered = products.filter((product) => {
    const store = getStore(product.storeId);
    const matchesQuery = !normalizedQuery || norm(`${product.name} ${product.category} ${store.name} ${store.segment} ${product.description}`).includes(normalizedQuery);
    return matchesQuery && (filters.category === 'Todos' || product.category === filters.category) && (!filters.store || product.storeId === filters.store) && product.price <= filters.maxPrice && (!filters.onlyOffers || product.discount > 0) && (!filters.onlyFavorites || favorites.includes(product.id));
  }).sort((a, b) => sort === 'menor' ? a.price - b.price : sort === 'maior' ? b.price - a.price : sort === 'avaliacao' ? b.rating - a.rating : b.discount - a.discount);
  const loading = useBriefLoading(JSON.stringify([filters, sort, query]));
  const clear = () => { setFilters({ category: 'Todos', store: '', maxPrice: priceCeiling, onlyOffers: false, onlyFavorites: false }); };
  const chips = [
    filters.category !== 'Todos' && { key: 'category', label: filters.category, clear: () => setFilters((f) => ({ ...f, category: 'Todos' })) },
    filters.store && { key: 'store', label: getStore(filters.store).name, clear: () => setFilters((f) => ({ ...f, store: '' })) },
    filters.maxPrice < priceCeiling && { key: 'price', label: `até ${formatCurrency(filters.maxPrice)}`, clear: () => setFilters((f) => ({ ...f, maxPrice: priceCeiling })) },
    filters.onlyOffers && { key: 'offers', label: 'Só ofertas', clear: () => setFilters((f) => ({ ...f, onlyOffers: false })) },
    filters.onlyFavorites && { key: 'fav', label: 'Só favoritos', clear: () => setFilters((f) => ({ ...f, onlyFavorites: false })) },
    query && { key: 'q', label: `“${query}”`, clear: () => navigate('/busca') }
  ].filter(Boolean);
  const panel = <FilterPanel products={products} filters={filters} setFilters={setFilters} storesWithProducts={storesWithProducts} onClear={clear} priceCeiling={priceCeiling} />;
  return <main className="page-main"><div className="container">
    <div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><span>Explorar produtos</span></div>
    <div className="page-title-row"><div><span className="eyebrow">Catálogo</span><h1>{normalizedQuery ? <>Resultados para <span>“{query}”</span></> : 'Explore o catálogo'}</h1><p>{filtered.length} produtos encontrados em lojas do Capim Dourado Shopping.</p></div><button className="mobile-filter" onClick={() => setDrawer(true)}><Icon name="filter" size={18} /> filtros{chips.length > 0 && <b>{chips.length}</b>}</button></div>
    <div className="search-layout">
      <aside className="filter-panel">{panel}</aside>
      <div className="results-area">
        <div className="results-toolbar"><span>Mostrando <strong>{filtered.length}</strong> produtos</span><label>Ordenar por <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevancia">maiores descontos</option><option value="menor">menor preço</option><option value="maior">maior preço</option><option value="avaliacao">melhor avaliação</option></select></label></div>
        {chips.length > 0 && <div className="active-filters">{chips.map((chip) => <button key={chip.key} className="active-chip" onClick={chip.clear}>{chip.label}<Icon name="close" size={12} /></button>)}<button className="text-link small" onClick={() => { clear(); if (query) navigate('/busca'); }}>limpar</button></div>}
        {loading ? <SkeletonGrid count={6} className="product-grid results-grid" /> : filtered.length ? <div className="product-grid results-grid">{filtered.map((product, index) => <ProductCard key={product.id} product={product} index={index} {...cardProps} />)}</div> : <div className="empty-state"><span className="empty-icon"><Icon name="search" size={25} /></span><h3>Nenhum produto encontrado</h3><p>Tente buscar por outro termo ou limpar os filtros.</p><button className="button button-dark" onClick={() => { clear(); navigate('/busca'); }}>Ver catálogo completo</button></div>}
      </div>
    </div>
  </div>
  {drawer && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawer(false); }}><aside className="filter-drawer" role="dialog" aria-modal="true" aria-label="Filtros"><div className="drawer-head"><strong>Filtros</strong><button onClick={() => setDrawer(false)} aria-label="Fechar filtros"><Icon name="close" size={18} /></button></div><div className="drawer-body">{panel}</div><button className="button button-coral button-large" onClick={() => setDrawer(false)}>Ver {filtered.length} produtos</button></aside></div>}
  </main>;
}

function StoresPage({ navigate, path, products, onOpenStore }) {
  const params = queryParams(path);
  const [group, setGroup] = useState(params.get('grupo') || 'Todas');
  const [term, setTerm] = useState('');
  const [floor, setFloor] = useState('Todos');
  const [onlyShowcase, setOnlyShowcase] = useState(false);
  useEffect(() => { setGroup(queryParams(path).get('grupo') || 'Todas'); }, [path]);
  const floors = ['Todos', 'Térreo', 'Praça de Alimentação', 'Outros'];
  const hasShowcase = (entry) => Boolean(STORE_BY_DIR[entry.id]) && products.some((p) => p.storeId === STORE_BY_DIR[entry.id].id);
  const list = DIRECTORY.filter((entry) => (group === 'Todas' || entry.group === group)
    && norm(`${entry.name} ${entry.official} ${entry.group}`).includes(norm(term))
    && (floor === 'Todos' || (floor === 'Outros' ? !['Térreo', 'Praça de Alimentação'].includes(entry.floor) : entry.floor === floor))
    && (!onlyShowcase || hasShowcase(entry))).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const loading = useBriefLoading(JSON.stringify([group, term, floor, onlyShowcase]), 240);
  return <main className="page-main"><div className="container">
    <div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><span>{group === 'Gastronomia' ? 'Gastronomia' : 'Lojas'}</span></div>
    <div className="page-title-row"><div><span className="eyebrow">{MALL.name}</span><h1>{group === 'Gastronomia' ? 'Gastronomia' : 'Diretório de lojas'}</h1><p>{list.length} de {DIRECTORY.length} lojas e serviços, conforme o diretório oficial do shopping.</p></div><label className="store-search"><Icon name="search" size={16} /><input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Buscar loja ou categoria" aria-label="Buscar loja" />{term && <button onClick={() => setTerm('')} aria-label="Limpar"><Icon name="close" size={13} /></button>}</label></div>
    <div className="chip-row group-chips" role="tablist" aria-label="Categorias de lojas">{['Todas', ...DIRECTORY_GROUPS].map((item) => <button key={item} role="tab" aria-selected={group === item} className={group === item ? 'chip selected' : 'chip'} onClick={() => { setGroup(item); window.history.replaceState({}, '', item === 'Todas' ? '/lojas' : `/lojas?grupo=${encodeURIComponent(item)}`); }}>{item !== 'Todas' && <Icon name={GROUP_ICON[item]} size={14} />}{item}<small>{item === 'Todas' ? DIRECTORY.length : DIRECTORY.filter((entry) => entry.group === item).length}</small></button>)}</div>
    <div className="directory-toolbar"><div className="segmented" role="radiogroup" aria-label="Localização">{floors.map((item) => <button key={item} role="radio" aria-checked={floor === item} className={floor === item ? 'active' : ''} onClick={() => setFloor(item)}>{item}</button>)}</div><label className="toggle"><input type="checkbox" checked={onlyShowcase} onChange={(event) => setOnlyShowcase(event.target.checked)} /><span className="toggle-track" /><span>Só com vitrine online</span></label></div>
    {loading ? <SkeletonGrid count={8} className="store-grid" variant="store" /> : list.length ? <div className="store-grid">{list.map((entry, index) => <StoreCard key={entry.id} entry={entry} index={index} onOpen={onOpenStore} />)}</div> : <div className="empty-state"><span className="empty-icon"><Icon name="store" size={25} /></span><h3>Nenhuma loja encontrada</h3><p>Tente outro nome, outra categoria ou outra localização.</p><button className="button button-dark" onClick={() => { setTerm(''); setGroup('Todas'); setFloor('Todos'); setOnlyShowcase(false); }}>Limpar filtros</button></div>}
    <p className="source-note center">Fonte: <a href="https://www.capimdouradosc.com.br/lojas/" target="_blank" rel="noopener noreferrer">diretório oficial do Capim Dourado Shopping</a> (consulta em 13/11/2026). A relação de lojas pode mudar.</p>
  </div></main>;
}

function StorePage({ store, products, navigate, cardProps, onToast }) {
  const storeProducts = products.filter((product) => product.storeId === store.id);
  const storeCategories = [...new Set(storeProducts.map((p) => p.category))];
  const [cat, setCat] = useState('Todos');
  const [term, setTerm] = useState('');
  const [sort, setSort] = useState('desconto');
  const visible = storeProducts.filter((p) => (cat === 'Todos' || p.category === cat) && norm(p.name).includes(norm(term))).sort((a, b) => sort === 'menor' ? a.price - b.price : sort === 'maior' ? b.price - a.price : b.discount - a.discount);
  const loading = useBriefLoading(JSON.stringify([cat, term, sort]), 220);
  const entry = DIR_BY_ID[store.dirId];
  const now = useNow();
  const status = now ? openStatus(entry?.group === 'Gastronomia' ? 'food' : 'stores', now) : null;
  return <main className="page-main"><div className="container">
    <div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><button onClick={() => navigate('/lojas')}>Lojas</button><Icon name="chevron" size={14} /><span>{store.name}</span></div>
    <section className="store-cover" style={{ '--store-accent': store.accent }}>
      <img className="store-cover-photo" src={GALLERY[0].src} alt="" aria-hidden="true" />
      <div className="store-cover-bg" /><div className="store-cover-shade" />
      <div className="store-cover-content">
        <div className="store-cover-main"><span className="store-cover-logo"><StoreLogo store={store} size="lg" /></span><div><span className="store-cover-kicker">{store.official || store.segment} · Capim Dourado Shopping</span><h1>{store.name}</h1><p>{store.description}</p><div className="store-cover-meta"><span><Icon name="pin" size={15} /> {store.floor}</span>{status && <span className={`status-pill ${status.isOpen ? 'open' : 'closed'}`}><i /> {status.text}</span>}<span><Icon name="clock" size={15} /> Retire em até 1 hora</span></div></div></div>
        <button className="button button-light" onClick={() => onToast('Atendimento da loja é demonstrativo nesta versão.', 'info')}><Icon name="chat" size={16} /> Falar com a loja</button>
      </div>
      <span className="cover-credit">{GALLERY[0].credit}</span>
    </section>
    <div className="store-content-grid">
      <aside className="store-sidebar"><div className="store-side-card" data-reveal><span className="eyebrow">Sobre a loja</span><h3>Loja do shopping.</h3><p>Os produtos saem do estoque da própria loja, no Capim Dourado Shopping.</p><div className="side-stat"><span><Icon name="map" size={16} /> {store.floor}</span>{store.official && <span><Icon name="grid" size={16} /> Categoria oficial: {store.official}</span>}<span><Icon name="shield" size={16} /> Compra protegida</span></div>{store.url && <a className="text-link side-link" href={store.url} target="_blank" rel="noopener noreferrer">Página da loja no site do shopping <Icon name="external" size={13} /></a>}</div><div className="store-tags" data-reveal>{store.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></aside>
      <section className="store-products">
        <SectionHeading eyebrow="Catálogo da loja" title="O que está em destaque" description={`${storeProducts.length} produtos disponíveis agora.`} />
        <div className="store-toolbar"><label className="store-search small"><Icon name="search" size={15} /><input value={term} onChange={(event) => setTerm(event.target.value)} placeholder={`Buscar em ${store.name}`} aria-label={`Buscar em ${store.name}`} /></label>{storeCategories.length > 1 && <div className="chip-row compact">{['Todos', ...storeCategories].map((c) => <button key={c} className={cat === c ? 'chip selected' : 'chip'} onClick={() => setCat(c)}>{c}</button>)}</div>}<select className="filter-select inline" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar"><option value="desconto">maiores descontos</option><option value="menor">menor preço</option><option value="maior">maior preço</option></select></div>
        {loading ? <SkeletonGrid count={Math.max(2, visible.length)} /> : visible.length ? <div className="product-grid">{visible.map((product, index) => <ProductCard key={product.id} product={product} index={index} {...cardProps} />)}</div> : <div className="empty-state"><h3>Nada por aqui</h3><p>Nenhum produto corresponde à busca.</p></div>}
      </section>
    </div>
  </div></main>;
}

function ProductGallery({ product }) {
  const store = getStore(product.storeId);
  const [view, setView] = useState(0);
  useEffect(() => { setView(0); }, [product.id]);
  const views = [
    { key: 'produto', label: 'Produto', node: <ProductVisual product={product} /> },
    { key: 'loja', label: 'Loja', node: <span className="gallery-store-view" style={{ '--tint': store.accent }}><StoreLogo store={store} size="xl" /><strong>{store.name}</strong><small>{store.floor}</small></span> },
    { key: 'shopping', label: 'Shopping', node: <span className="gallery-mall-view"><img src={GALLERY[0].src} alt={GALLERY[0].title} /><small>{GALLERY[0].credit}</small></span> }
  ];
  return <div className="product-gallery-wrap">
    <div className="product-gallery">{product.discount > 0 && <div className="gallery-badge">-{product.discount}% hoje</div>}<div className="gallery-stage" key={views[view].key}>{views[view].node}</div><div className="gallery-caption"><span><Icon name="shield" size={15} /> Compra protegida ShoppingLink</span><span><Icon name="map" size={15} /> Produto disponível na loja física</span></div></div>
    <div className="gallery-thumbs" role="tablist" aria-label="Imagens">{views.map((item, i) => <button key={item.key} role="tab" aria-selected={view === i} className={view === i ? 'active' : ''} onClick={() => setView(i)}><span className="thumb-media">{i === 0 ? <ProductVisual product={product} showNote={false} /> : i === 1 ? <StoreLogo store={store} size="sm" /> : <img src={GALLERY[0].src} alt="" />}</span><small>{item.label}</small></button>)}</div>
  </div>;
}

function QuantityStepper({ value, onChange, max = 99 }) {
  return <div className="quantity-control large"><button onClick={() => onChange(Math.max(1, value - 1))} aria-label="Diminuir quantidade" disabled={value <= 1}><Icon name="minus" size={14} /></button><span aria-live="polite">{value}</span><button onClick={() => onChange(Math.min(max, value + 1))} aria-label="Aumentar quantidade" disabled={value >= max}><Icon name="plus" size={14} /></button></div>;
}

function ProductPage({ product, products, navigate, onAdd, cardProps, onToast }) {
  const store = getStore(product.storeId);
  const [deliveryMode, setDeliveryMode] = useState('pickup');
  const [quantity, setQuantity] = useState(1);
  useEffect(() => { setQuantity(1); }, [product.id]);
  const related = useMemo(() => [...products.filter((p) => p.id !== product.id && p.storeId === product.storeId), ...products.filter((p) => p.id !== product.id && p.storeId !== product.storeId && p.category === product.category).sort((a, b) => b.discount - a.discount)].slice(0, 10), [products, product]);
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); onToast('Link do produto copiado.'); } catch { onToast('Não foi possível copiar o link.', 'info'); }
  };
  return <main className="page-main"><div className="container">
    <div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><button onClick={() => navigate(`/loja/${store.id}`)}>{store.name}</button><Icon name="chevron" size={14} /><span>{product.name}</span></div>
    <section className="product-detail">
      <ProductGallery product={product} />
      <div className="product-detail-copy">
        <span className="eyebrow">{product.category} · {store.name}</span>
        <h1>{product.name}</h1>
        <div className="detail-rating"><span>★</span> {product.rating} <em>({product.reviews} avaliações)</em><button onClick={() => navigate(`/loja/${store.id}`)}>ver loja</button></div>
        <p className="detail-description">{product.description}</p>
        <div className="detail-price-box">{product.discount > 0 && <span className="detail-old-price">de {formatCurrency(product.oldPrice)}</span>}<div><strong>{formatCurrency(product.price)}</strong>{product.discount > 0 && <span className="detail-discount">economize {formatCurrency(product.oldPrice - product.price)}</span>}</div><span className="installments">ou {product.installment}</span><span className="demo-price-note"><Icon name="info" size={12} /> Preço de demonstração — confirme na loja.</span></div>
        <div className="availability-row"><div><span className="availability-dot" /> <strong>{product.stock} unidades</strong> disponíveis na loja</div><span>Atualizado agora</span></div>
        <div className="delivery-options"><button type="button" className={`delivery-option ${deliveryMode === 'pickup' ? 'selected' : ''}`} onClick={() => setDeliveryMode('pickup')} aria-pressed={deliveryMode === 'pickup'}><span className="delivery-option-icon"><Icon name="map" size={19} /></span><span><strong>Retirar no shopping</strong><small>Pronto em até 1 hora · grátis</small></span>{deliveryMode === 'pickup' && <Icon name="check" size={18} />}</button><button type="button" className={`delivery-option ${deliveryMode === 'delivery' ? 'selected' : ''}`} onClick={() => setDeliveryMode('delivery')} aria-pressed={deliveryMode === 'delivery'}><span className="delivery-option-icon"><Icon name="truck" size={19} /></span><span><strong>Receber em casa</strong><small>A partir de R$ 12,90 · hoje</small></span>{deliveryMode === 'delivery' && <Icon name="check" size={18} />}</button></div>
        <div className="buy-row"><QuantityStepper value={quantity} onChange={setQuantity} max={product.stock} /><button className="button button-coral button-large" onClick={() => onAdd(product, true, deliveryMode, quantity)}><Icon name="cart" size={19} /> Adicionar ao carrinho</button></div>
        <div className="detail-secondary"><button className={`ghost-pill ${cardProps.isFavorite(product.id) ? 'active' : ''}`} onClick={() => cardProps.onToggleFavorite(product)}><Icon name="heart" size={15} /> {cardProps.isFavorite(product.id) ? 'Nos favoritos' : 'Favoritar'}</button><button className="ghost-pill" onClick={share}><Icon name="external" size={14} /> Copiar link</button></div>
        <div className="detail-note"><Icon name="info" size={15} /> Modalidade escolhida: {deliveryMode === 'pickup' ? 'retirar no shopping' : 'receber em casa'}.</div>
      </div>
    </section>
    <section className="product-info-section"><div className="info-column" data-reveal><span className="eyebrow">Detalhes</span><h2>Sobre o produto</h2><p>{product.description} A loja confirma a disponibilidade antes de liberar a retirada ou a entrega.</p></div><div className="specs-list">{product.specs.map((spec, index) => <div key={spec} data-reveal style={{ '--d': `${index * 60}ms` }}><Icon name="check" size={17} /><span>{spec}</span></div>)}</div></section>
    {related.length > 0 && <section className="related-section"><SectionHeading eyebrow="Continue explorando" title="Você também pode gostar" /><ScrollRow label="Produtos relacionados" className="product-row">{related.map((item, index) => <div className="row-item" role="listitem" key={item.id}><ProductCard product={item} index={index} {...cardProps} /></div>)}</ScrollRow></section>}
  </div></main>;
}

function FavoritesPage({ products, favorites, navigate, cardProps }) {
  const list = favorites.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  return <main className="page-main"><div className="container">
    <div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><span>Favoritos</span></div>
    <div className="page-title-row"><div><span className="eyebrow">Sua lista</span><h1>Favoritos</h1><p>{list.length ? `${list.length} produtos salvos neste navegador.` : 'Toque no coração de um produto para salvar aqui.'}</p></div>{list.length > 0 && <button className="button button-ghost" onClick={() => navigate('/busca')}>Continuar explorando</button>}</div>
    {list.length ? <div className="product-grid">{list.map((product, index) => <ProductCard key={product.id} product={product} index={index} {...cardProps} />)}</div> : <div className="empty-state cart-empty"><span className="empty-icon"><Icon name="heart" size={26} /></span><h3>Nenhum favorito ainda</h3><p>Salve os produtos que chamaram sua atenção para comparar depois.</p><button className="button button-dark" onClick={() => navigate('/busca')}>Explorar produtos <Icon name="arrow" size={16} /></button></div>}
  </div></main>;
}

function CartPage({ cart, products, navigate, onRemove, onChangeQuantity, user, onCheckout }) {
  const cartLines = cart.map((line) => ({ ...line, product: products.find((product) => product.id === line.productId) })).filter((line) => line.product);
  const [deliveryMode, setDeliveryMode] = useState(cartLines[0]?.deliveryMode || 'delivery');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [processing, setProcessing] = useState(false);
  const subtotal = cartLines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const delivery = cartLines.length && deliveryMode === 'delivery' ? 12.9 : 0;
  const confirm = () => { if (!user) { onCheckout({ paymentMethod, deliveryMode }); return; } setProcessing(true); window.setTimeout(() => { setProcessing(false); onCheckout({ paymentMethod, deliveryMode }); }, 1100); };
  return <main className="page-main"><div className="container narrow-container"><div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><span>Seu carrinho</span></div><div className="page-title-row cart-title"><div><span className="eyebrow">Quase lá</span><h1>Seu carrinho</h1><p>{cartLines.length ? `${cartLines.reduce((sum, line) => sum + line.quantity, 0)} itens selecionados para você.` : 'Seu carrinho está vazio.'}</p></div>{user && <span className="signed-user"><Icon name="user" size={15} /> {user.name}</span>}</div>{cartLines.length ? <div className="cart-layout"><section className="cart-items"><div className="cart-card"><div className="cart-card-head"><span>Produtos selecionados</span><span>Preço</span></div>{cartLines.map(({ product, quantity }) => <div className="cart-line" key={product.id}><span className="cart-thumb"><ProductVisual product={product} showNote={false} /></span><div className="cart-line-copy"><span className="product-store-line">{getStore(product.storeId).name}</span><h3>{product.name}</h3><small><Icon name="truck" size={13} /> {product.delivery}</small><button onClick={() => onRemove(product.id)}>Remover</button></div><div className="cart-line-price"><strong key={quantity} className="price-flash">{formatCurrency(product.price * quantity)}</strong><div className="quantity-control"><button onClick={() => onChangeQuantity(product.id, quantity - 1)} aria-label="Diminuir"><Icon name="minus" size={14} /></button><span>{quantity}</span><button onClick={() => onChangeQuantity(product.id, quantity + 1)} aria-label="Aumentar"><Icon name="plus" size={14} /></button></div></div></div>)}</div><div className="cart-benefit"><span className="benefit-icon"><Icon name="shield" size={18} /></span><span><strong>Você compra de uma loja do shopping.</strong><small>Pagamento seguro e suporte ShoppingLink do início ao fim.</small></span></div></section><aside className="summary-card"><span className="eyebrow">Resumo do pedido</span><h2>Confira tudo antes de confirmar.</h2><div className="summary-row"><span>Subtotal</span><strong key={subtotal} className="price-flash">{formatCurrency(subtotal)}</strong></div><div className="summary-row"><span>Entrega estimada</span><strong>{delivery ? formatCurrency(delivery) : 'Grátis'}</strong></div><div className="summary-separator" /><div className="summary-row total"><span>Total</span><strong key={subtotal + delivery} className="price-flash">{formatCurrency(subtotal + delivery)}</strong></div><div className="payment-choices"><span className="payment-label">Forma de recebimento</span><button type="button" className={`payment-choice ${deliveryMode === 'pickup' ? 'selected' : ''}`} onClick={() => setDeliveryMode('pickup')}><span><Icon name="map" size={18} /> Retirar no shopping</span><small>grátis · até 1 hora</small>{deliveryMode === 'pickup' && <Icon name="check" size={16} />}</button><button type="button" className={`payment-choice ${deliveryMode === 'delivery' ? 'selected' : ''}`} onClick={() => setDeliveryMode('delivery')}><span><Icon name="truck" size={18} /> Receber em casa</span><small>R$ 12,90 · hoje</small>{deliveryMode === 'delivery' && <Icon name="check" size={16} />}</button></div><div className="payment-choices"><span className="payment-label">Forma de pagamento</span><button type="button" className={`payment-choice ${paymentMethod === 'pix' ? 'selected' : ''}`} onClick={() => setPaymentMethod('pix')}><span><Icon name="pix" size={18} /> Pix</span><small>aprovação imediata</small>{paymentMethod === 'pix' && <Icon name="check" size={16} />}</button><button type="button" className={`payment-choice ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}><span><Icon name="card" size={18} /> Cartão</span><small>crédito ou débito</small>{paymentMethod === 'card' && <Icon name="check" size={16} />}</button></div><button className={`button button-coral button-large ${processing ? 'is-loading' : ''}`} onClick={confirm} disabled={processing}>{processing ? <><span className="spinner" /> Confirmando pedido…</> : <>{user ? 'Confirmar pedido' : 'Entrar e confirmar pedido'} <Icon name="arrow" size={17} /></>}</button><small className="summary-footnote"><Icon name="lock" size={13} /> Seus dados ficam protegidos.</small></aside></div> : <div className="empty-state cart-empty"><span className="empty-icon"><Icon name="bag" size={26} /></span><h3>Seu carrinho está esperando boas escolhas.</h3><p>Explore as lojas do shopping e adicione algo que combine com você.</p><button className="button button-dark" onClick={() => navigate('/busca')}>Explorar produtos <Icon name="arrow" size={16} /></button></div>}</div></main>;
}

function OrdersPage({ orders, navigate }) {
  const order = orders[0] || INITIAL_ORDERS[0];
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setDrawn(true), 120); return () => window.clearTimeout(timer); }, []);
  const steps = [{ label: 'Pedido recebido', note: 'Seu pedido foi confirmado', icon: 'check' }, { label: 'Produto encontrado', note: 'A loja separou seu produto', icon: 'store' }, { label: 'Pedido confirmado', note: 'Tudo pronto para seguir', icon: 'bag' }, { label: 'Saiu para entrega', note: 'A caminho do endereço', icon: 'truck' }, { label: 'Entregue', note: 'Aproveite sua compra', icon: 'heart' }];
  return <main className="page-main"><div className="container narrow-container"><div className="breadcrumb"><button onClick={() => navigate('/')}>Início</button><Icon name="chevron" size={14} /><span>Acompanhamento</span></div><div className="page-title-row"><div><span className="eyebrow">Visibilidade em cada etapa</span><h1>Acompanhe seu pedido.</h1><p>Você sabe onde sua compra está, sem precisar perguntar.</p></div><button className="button button-ghost" onClick={() => navigate('/busca')}>Continuar comprando</button></div><section className="order-card" data-reveal><div className="order-card-head"><div><span className="eyebrow">Pedido {order.id}</span><h2>{order.item}</h2><p>{order.store} · {order.date}</p></div><span className="order-status"><span /> Em andamento</span></div><div className="order-progress"><div className="progress-line"><span style={{ width: drawn ? `${(order.step / (steps.length - 1)) * 100}%` : '0%' }} /></div>{steps.map((step, index) => <div key={step.label} className={`progress-step ${index <= order.step ? 'done' : ''} ${index === order.step ? 'current' : ''}`} style={{ '--d': `${index * 120}ms` }}><span className="progress-dot">{index < order.step ? <Icon name="check" size={13} /> : <Icon name={step.icon} size={14} />}</span><strong>{step.label}</strong><small>{index <= order.step ? step.note : 'Em breve'}</small></div>)}</div><div className="order-info-grid"><div><span className="info-label">Recebimento</span><strong>{order.mode}</strong><small>{order.address}</small></div><div><span className="info-label">Pagamento</span><strong>{formatCurrency(order.total)} · {order.method}</strong><small>Pagamento aprovado</small></div><div><span className="info-label">Precisa de ajuda?</span><strong>Fale com a gente</strong><small>Resposta em até 8 min <Icon name="arrow" size={13} /></small></div></div></section><div className="tracking-note" data-reveal><span><Icon name="info" size={17} /></span><div><strong>Como funciona o pedido?</strong><p>O shopper ShoppingLink encontra o produto na loja, confirma a disponibilidade e encaminha para retirada ou entrega.</p></div></div></div></main>;
}

function PanelPage({ products, navigate, onCreateProduct, orders }) {
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState({ name: '', category: 'Acessórios', price: '', oldPrice: '', stock: '', image: '', description: '', tag: 'Novo' });
  const [errors, setErrors] = useState({});
  const store = STORES[0];
  const storeProducts = products.filter((product) => product.storeId === store.id);
  const update = (key, value) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Informe o nome do produto.';
    if (!form.price || Number(form.price) <= 0) nextErrors.price = 'Informe um preço válido.';
    if (form.oldPrice && Number(form.oldPrice) < Number(form.price)) nextErrors.oldPrice = 'O preço anterior deve ser maior que o atual.';
    if (form.image && !/^https?:\/\/|^\//.test(form.image)) nextErrors.image = 'Use um endereço que comece com https:// ou /.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onCreateProduct({ ...form, storeId: store.id, price: Number(form.price), oldPrice: Number(form.oldPrice || form.price), stock: Number(form.stock || 1), discount: Math.max(0, Math.round((1 - Number(form.price) / Number(form.oldPrice || form.price)) * 100)), rating: 5, reviews: 0, delivery: 'Retire em 1h', installment: `6x de ${formatCurrency(Number(form.price) / 6)} sem juros`, specs: ['Produto cadastrado pela loja', 'Disponibilidade sujeita ao estoque', 'Compra protegida ShoppingLink'] });
    setForm({ name: '', category: 'Acessórios', price: '', oldPrice: '', stock: '', image: '', description: '', tag: 'Novo' });
    setTab('products');
  };
  const preview = { id: 'preview', storeId: store.id, name: form.name || 'Nome do produto', category: form.category, image: form.image, kind: undefined };
  const field = (key) => errors[key] && <small className="field-error" role="alert">{errors[key]}</small>;
  return <main className="panel-main"><div className="panel-shell"><aside className="panel-sidebar"><div className="panel-brand"><Logo onClick={() => navigate('/')} /><span className="panel-badge">Área do lojista</span></div><div className="panel-store-mini"><StoreLogo store={store} size="sm" /><span><strong>{store.name}</strong><small>Plano profissional</small></span><span className="online-dot" /></div><nav className="panel-nav"><button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}><Icon name="graph" size={17} /> Visão geral</button><button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}><Icon name="bag" size={17} /> Produtos <span>{storeProducts.length}</span></button><button className={tab === 'add' ? 'active' : ''} onClick={() => setTab('add')}><Icon name="plus" size={17} /> Cadastrar produto</button><button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}><Icon name="truck" size={17} /> Pedidos <span>3</span></button></nav><div className="panel-help"><Icon name="chat" size={18} /><strong>Precisa de ajuda?</strong><p>Fale com o suporte ShoppingLink.</p><button>Entrar em contato <Icon name="arrow" size={14} /></button></div><button className="panel-back" onClick={() => navigate('/')}><Icon name="arrow" size={15} /> Voltar para a vitrine</button></aside><section className="panel-content" key={tab}><div className="panel-topbar"><div><span className="eyebrow">Painel de demonstração · Capim Dourado</span><h1>{tab === 'add' ? 'Cadastrar produto' : tab === 'products' ? 'Seus produtos' : tab === 'orders' ? 'Pedidos recebidos' : 'Bom dia, ACIUM.'}</h1></div><div className="panel-top-actions"><span className="panel-notification"><Icon name="chat" size={17} /><b>2</b></span><button className="avatar-button">AT</button></div></div>{tab === 'overview' && <><div className="dashboard-kpis"><div><span>Vendas no mês</span><strong>R$ 12.840,00</strong><small className="positive">↑ 18,4% <em>vs. mês anterior</em></small><span className="kpi-icon lilac"><Icon name="graph" size={19} /></span></div><div><span>Pedidos ativos</span><strong>24</strong><small className="positive">↑ 6 novos hoje</small><span className="kpi-icon peach"><Icon name="bag" size={19} /></span></div><div><span>Produtos publicados</span><strong>{storeProducts.length}</strong><small>2 aguardando reposição</small><span className="kpi-icon mint"><Icon name="store" size={19} /></span></div><div><span>Nota da loja</span><strong>4,9 <small>/ 5</small></strong><small className="positive">↑ 0,2 este mês</small><span className="kpi-icon yellow"><span>★</span></span></div></div><div className="dashboard-grid"><section className="panel-card chart-card"><div className="panel-card-heading"><div><span className="eyebrow">Desempenho</span><h2>Vendas por período</h2></div><select><option>Últimos 7 dias</option><option>Últimos 30 dias</option></select></div><div className="chart"><div className="chart-y"><span>6k</span><span>4k</span><span>2k</span><span>0</span></div><div className="chart-plot"><div className="chart-bars">{[38, 52, 43, 68, 55, 86, 72].map((height, index) => <div key={index} className="chart-bar-wrap" title={`R$ ${(height * 68).toLocaleString('pt-BR')}`}><span className="chart-value">{index === 5 ? '5.8k' : ''}</span><div className={`chart-bar ${index === 5 ? 'highlight' : ''}`} style={{ height: `${height}%`, '--d': `${index * 70}ms` }} /><small>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][index]}</small></div>)}</div></div></div></section><section className="panel-card recent-card"><div className="panel-card-heading"><div><span className="eyebrow">Atenção</span><h2>Pedidos recentes</h2></div><button className="text-link" onClick={() => setTab('orders')}>ver todos <Icon name="arrow" size={14} /></button></div><div className="recent-list">{['SL-2048 · Colar ACIUM Essencial', 'SL-2047 · Pulseira ACIUM Urban', 'SL-2046 · Filtro Solar Adcos FPS 60'].map((item, index) => <div className="recent-item" key={item}><span className={`recent-avatar avatar-${index}`}>{['MC', 'JR', 'AL'][index]}</span><div><strong>{item}</strong><small>{['Aguardando separação', 'Pronto para retirada', 'Entregue ao cliente'][index]}</small></div><span className={`recent-status status-${index}`}>{['novo', 'pronto', 'finalizado'][index]}</span></div>)}</div></section></div><div className="panel-quick-actions"><button onClick={() => setTab('add')}><span className="quick-icon coral"><Icon name="plus" size={19} /></span><span><strong>Cadastrar produto</strong><small>Coloque uma novidade no ar.</small></span><Icon name="arrow" size={16} /></button><button onClick={() => navigate('/loja/acium')}><span className="quick-icon blue"><Icon name="store" size={19} /></span><span><strong>Ver minha vitrine</strong><small>Como os clientes enxergam.</small></span><Icon name="arrow" size={16} /></button></div></>}{tab === 'products' && <section className="panel-card products-panel"><div className="panel-card-heading"><div><span className="eyebrow">Catálogo</span><h2>{storeProducts.length} produtos publicados</h2></div><button className="button button-coral" onClick={() => setTab('add')}><Icon name="plus" size={16} /> Novo produto</button></div><div className="seller-product-list">{storeProducts.map((product) => <div className="seller-product-row" key={product.id}><span className="seller-thumb"><ProductVisual product={product} showNote={false} /></span><div><strong>{product.name}</strong><small>{product.category} · {product.stock} em estoque</small></div><span className="seller-price">{formatCurrency(product.price)}</span><span className="published-label"><i /> publicado</span><button className="icon-only" aria-label="Editar"><Icon name="edit" size={16} /></button></div>)}</div></section>}{tab === 'add' && <section className="panel-card form-panel"><div className="panel-card-heading"><div><span className="eyebrow">Novo anúncio</span><h2>Conte para o shopping o que você vende.</h2><p>Preencha os dados principais. Você poderá editar depois.</p></div><span className="form-required">* campos obrigatórios</span></div><div className="form-with-preview"><form className="product-form" onSubmit={submit} noValidate><div className="form-grid"><label><span>Nome do produto *</span><input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Ex.: Colar ACIUM Essencial" aria-invalid={Boolean(errors.name)} />{field('name')}</label><label><span>Categoria *</span><select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label><span>Preço atual *</span><div className="input-prefix"><b>R$</b><input type="number" step="0.01" value={form.price} onChange={(event) => update('price', event.target.value)} placeholder="0,00" aria-invalid={Boolean(errors.price)} /></div>{field('price')}</label><label><span>Preço anterior</span><div className="input-prefix"><b>R$</b><input type="number" step="0.01" value={form.oldPrice} onChange={(event) => update('oldPrice', event.target.value)} placeholder="0,00" /></div>{field('oldPrice')}</label><label><span>Estoque disponível</span><input type="number" value={form.stock} onChange={(event) => update('stock', event.target.value)} placeholder="Ex.: 10" /></label><label><span>Etiqueta da vitrine</span><select value={form.tag} onChange={(event) => update('tag', event.target.value)}><option>Novo</option><option>Oferta do dia</option><option>Mais vendido</option><option>Preço especial</option></select></label></div><label><span>URL da foto do produto</span><input value={form.image} onChange={(event) => update('image', event.target.value)} placeholder="https://... (opcional)" aria-invalid={Boolean(errors.image)} />{field('image')}<small className="field-help">Use apenas fotos da sua loja. Sem foto, a vitrine mostra uma ilustração do tipo de produto.</small></label><label><span>Descrição curta</span><textarea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Explique por que esse produto merece ser escolhido." rows="4" /></label><div className="form-actions"><button type="button" className="button button-ghost" onClick={() => setTab('products')}>Cancelar</button><button type="submit" className="button button-coral">Publicar produto <Icon name="arrow" size={16} /></button></div></form><aside className="form-preview"><span className="eyebrow">Pré-visualização</span><div className="preview-card"><span className="preview-media"><ProductVisual product={{ ...preview, kind: undefined }} /></span><strong>{preview.name}</strong><small>{form.category}</small><span className="current-price">{form.price ? formatCurrency(Number(form.price)) : 'R$ 0,00'}</span></div></aside></div></section>}{tab === 'orders' && <section className="panel-card products-panel"><div className="panel-card-heading"><div><span className="eyebrow">Operação</span><h2>Pedidos que precisam de você</h2></div><span className="orders-filter">Todos os pedidos <Icon name="chevron" size={14} /></span></div><div className="seller-orders">{[...orders, { id: 'SL-2047', item: 'Pulseira ACIUM Urban', store: store.name, total: 189.9, step: 2, date: 'Hoje, 13:54', method: 'Cartão' }].map((order) => <div className="seller-order-card" key={order.id}><div className="seller-order-id"><span className="recent-avatar avatar-1">{order.id.slice(-2)}</span><div><strong>{order.id}</strong><small>{order.date} · {order.method}</small></div></div><div><strong>{order.item}</strong><small>Cliente ShoppingLink</small></div><span className="seller-price">{formatCurrency(order.total)}</span><span className="order-pill">separar produto</span><button className="button button-small button-ghost">abrir <Icon name="arrow" size={14} /></button></div>)}</div></section>}</section></div></main>;
}

// ---------------- modais ----------------
function LoginModal({ onClose, onLogin }) {
  const [name, setName] = useState('Marina Costa');
  return <Modal onClose={onClose} labelledBy="login-title" className="login-modal"><div className="modal-mark">S<span>//</span></div><span className="eyebrow">Entrar</span><h2 id="login-title">Entre para finalizar<br /><span>o seu pedido.</span></h2><p>Crie uma conta demo em segundos para confirmar o pedido e acompanhar cada etapa.</p><form onSubmit={(event) => { event.preventDefault(); onLogin(name.trim() || 'Cliente ShoppingLink'); }}><label>Como podemos te chamar?<input value={name} onChange={(event) => setName(event.target.value)} data-autofocus /></label><button type="submit" className="button button-coral button-large">Entrar e continuar <Icon name="arrow" size={17} /></button></form><small>Ao continuar, você concorda com os termos de demonstração do projeto.</small></Modal>;
}

function QuickViewModal({ product, onClose, onAdd, navigate, cardProps }) {
  const store = getStore(product.storeId);
  const [quantity, setQuantity] = useState(1);
  const isFav = cardProps.isFavorite(product.id);
  return <Modal onClose={onClose} labelledBy="qv-title" className="quick-view" wide>
    <div className="qv-grid">
      <div className="qv-media"><ProductGallery product={product} /></div>
      <div className="qv-copy">
        <span className="eyebrow">{product.category} · {store.name}</span>
        <h2 id="qv-title">{product.name}</h2>
        <div className="detail-rating"><span>★</span> {product.rating} <em>({product.reviews} avaliações)</em></div>
        <p className="detail-description">{product.description}</p>
        <dl className="qv-facts"><div><dt>Marca / loja</dt><dd>{store.name}</dd></div><div><dt>Categoria</dt><dd>{product.category}</dd></div><div><dt>Onde fica</dt><dd>{store.floor.replace(' · Capim Dourado Shopping', '')}</dd></div><div><dt>Estoque</dt><dd>{product.stock} un.</dd></div></dl>
        <div className="qv-price"><strong>{formatCurrency(product.price)}</strong>{product.discount > 0 && <><span className="detail-old-price">{formatCurrency(product.oldPrice)}</span><span className="discount-pill">-{product.discount}%</span></>}</div>
        <span className="demo-price-note"><Icon name="info" size={12} /> Preço de demonstração — confirme na loja.</span>
        <div className="buy-row"><QuantityStepper value={quantity} onChange={setQuantity} max={product.stock} /><button className="button button-coral button-large" onClick={() => { onAdd(product, false, 'pickup', quantity); onClose(); }} data-autofocus><Icon name="cart" size={18} /> Adicionar</button></div>
        <div className="detail-secondary"><button className={`ghost-pill ${isFav ? 'active' : ''}`} onClick={() => cardProps.onToggleFavorite(product)}><Icon name="heart" size={15} /> {isFav ? 'Nos favoritos' : 'Favoritar'}</button><button className="ghost-pill" onClick={() => { onClose(); navigate(`/produto/${product.id}`); }}>Página completa <Icon name="arrow" size={14} /></button><button className="ghost-pill" onClick={() => { onClose(); navigate(`/loja/${store.id}`); }}><Icon name="store" size={14} /> Ver loja</button></div>
      </div>
    </div>
  </Modal>;
}

function StoreModal({ entry, products, onClose, navigate }) {
  const store = STORE_BY_DIR[entry.id];
  const storeProducts = store ? products.filter((p) => p.storeId === store.id) : [];
  const now = useNow();
  const status = now ? openStatus(entry.group === 'Gastronomia' ? 'food' : 'stores', now) : null;
  const hours = entry.group === 'Gastronomia' ? 'Seg. a sáb. 11h–22h · Dom. 11h–20h' : 'Seg. a sáb. 10h–22h · Dom. 14h–20h';
  return <Modal onClose={onClose} labelledBy="store-modal-title" className="store-modal">
    <div className="store-modal-head" style={{ '--tint': store?.accent || '#a8742a' }}><span className="store-modal-logo"><StoreLogo store={{ ...entry, accent: store?.accent }} size="lg" /></span></div>
    <div className="store-modal-body">
      <span className="eyebrow"><Icon name={GROUP_ICON[entry.group]} size={12} /> {entry.group}</span>
      <h2 id="store-modal-title">{entry.name}{entry.soon && <em className="badge-soon">Em breve</em>}</h2>
      <dl className="qv-facts"><div><dt>Categoria oficial</dt><dd>{entry.official || '—'}</dd></div><div><dt>Localização</dt><dd>{entry.floor}</dd></div><div><dt>Horário</dt><dd>{hours}</dd></div><div><dt>Agora</dt><dd>{entry.soon ? 'Inauguração em breve' : status ? <span className={`status-pill ${status.isOpen ? 'open' : 'closed'}`}><i /> {status.text}</span> : '—'}</dd></div></dl>
      {storeProducts.length > 0 ? <div className="store-modal-products"><span className="payment-label">Na vitrine online</span><div className="mini-products">{storeProducts.slice(0, 3).map((p) => <button key={p.id} onClick={() => { onClose(); navigate(`/produto/${p.id}`); }}><span className="mini-thumb"><ProductVisual product={p} showNote={false} /></span><small>{p.name}</small><b>{formatCurrency(p.price)}</b></button>)}</div></div> : <p className="store-modal-note"><Icon name="info" size={14} /> Esta loja ainda não publicou produtos no ShoppingLink. Veja contatos e redes no site oficial.</p>}
      <div className="store-modal-actions">{store && storeProducts.length > 0 && <button className="button button-coral" onClick={() => { onClose(); navigate(`/loja/${store.id}`); }} data-autofocus><Icon name="store" size={16} /> Ver vitrine ({storeProducts.length})</button>}<a className="button button-ghost" href={entry.url} target="_blank" rel="noopener noreferrer">Página no site do shopping <Icon name="external" size={14} /></a></div>
      <small className="source-note">Dados do diretório oficial do Capim Dourado Shopping.</small>
    </div>
  </Modal>;
}

function LightboxModal({ index, setIndex, onClose }) {
  const item = LIGHTBOX_ITEMS[index];
  const go = useCallback((dir) => setIndex((current) => (current + dir + LIGHTBOX_ITEMS.length) % LIGHTBOX_ITEMS.length), [setIndex]);
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'ArrowRight') go(1); if (event.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go]);
  return <Modal onClose={onClose} labelledBy="lightbox-title" className="lightbox" wide>
    <figure className="lightbox-figure" key={item.id}><img src={item.src} alt={item.title} /><figcaption><div><strong id="lightbox-title">{item.title}</strong><p>{item.text}</p></div>{item.creditUrl ? <a href={item.creditUrl} target="_blank" rel="noopener noreferrer">{item.credit} <Icon name="external" size={11} /></a> : <small>{item.credit}</small>}</figcaption></figure>
    <button className="carousel-arrow left" onClick={() => go(-1)} aria-label="Imagem anterior"><Icon name="chevronLeft" size={20} /></button>
    <button className="carousel-arrow right" onClick={() => go(1)} aria-label="Próxima imagem"><Icon name="chevron" size={20} /></button>
    <div className="lightbox-thumbs">{LIGHTBOX_ITEMS.map((thumb, i) => <button key={thumb.id} className={i === index ? 'active' : ''} onClick={() => setIndex(i)} aria-label={thumb.title}><img src={thumb.src} alt="" /></button>)}</div>
  </Modal>;
}

function CreditsModal({ onClose }) {
  return <Modal onClose={onClose} labelledBy="credits-title" className="credits-modal">
    <span className="eyebrow">Transparência</span>
    <h2 id="credits-title">Créditos das imagens</h2>
    <p>Usamos fotos reais do shopping com licença livre, materiais públicos do site oficial e ilustrações quando não há foto autorizada do produto.</p>
    <ul className="credits-list">{IMAGE_CREDITS.map((credit) => <li key={credit.what}><strong>{credit.what}</strong><span>{credit.who}</span><small>{credit.license}</small>{credit.url && <a href={credit.url} target="_blank" rel="noopener noreferrer">fonte <Icon name="external" size={11} /></a>}</li>)}</ul>
  </Modal>;
}

function Toast({ toast, onClose }) {
  if (!toast) return null;
  return <div className={`toast toast-${toast.type}`} role="status" aria-live="polite" key={toast.id}><span className="toast-check"><Icon name={toast.type === 'info' ? 'info' : toast.type === 'fav' ? 'heart' : 'check'} size={14} /></span><span>{toast.message}</span>{toast.action && <button className="toast-action" onClick={toast.action.run}>{toast.action.label}</button>}<button onClick={onClose} aria-label="Fechar aviso"><Icon name="close" size={15} /></button><span className="toast-timer" /></div>;
}

function ScrollChrome() {
  const barRef = useRef(null);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        setShowTop(window.scrollY > 700);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return <><div className="scroll-progress" ref={barRef} aria-hidden="true" /><button className={`back-to-top ${showTop ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })} aria-label="Voltar ao topo" tabIndex={showTop ? 0 : -1}><Icon name="arrowUp" size={18} /></button></>;
}

// ---------------- aplicativo ----------------
export default function ShoppingLinkApp() {
  const nextPathname = usePathname() || '/';
  const [path, setPath] = useState(nextPathname);
  const [searchValue, setSearchValue] = useState('');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [modal, setModal] = useState(null); // { type: 'login' | 'quick' | 'store' | 'lightbox' | 'credits', id }
  const [toast, setToast] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPath(`${window.location.pathname}${window.location.search}` || '/');
    const savedProducts = readStoredJSON('shoppinglink-products');
    const savedCart = readStoredJSON('shoppinglink-cart');
    const savedOrders = readStoredJSON('shoppinglink-orders');
    const savedUser = readStoredJSON('shoppinglink-user');
    const savedFavorites = readStoredJSON('shoppinglink-favorites');
    const savedRecent = readStoredJSON('shoppinglink-recent');
    if (savedProducts) setProducts([...savedProducts.filter((item) => String(item.id).startsWith('custom-')), ...INITIAL_PRODUCTS]);
    if (savedCart) setCart(savedCart);
    if (savedOrders) setOrders(savedOrders);
    if (savedUser) setUser(savedUser);
    if (Array.isArray(savedFavorites)) setFavorites(savedFavorites);
    if (Array.isArray(savedRecent)) setRecent(savedRecent);
    setHydrated(true);
    const onPopState = () => setPath(`${window.location.pathname}${window.location.search}`);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => { if (hydrated) writeStoredJSON('shoppinglink-products', products.filter((item) => String(item.id).startsWith('custom-'))); }, [products, hydrated]);
  useEffect(() => { if (hydrated) writeStoredJSON('shoppinglink-cart', cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) writeStoredJSON('shoppinglink-orders', orders); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) writeStoredJSON('shoppinglink-favorites', favorites); }, [favorites, hydrated]);
  useEffect(() => { if (hydrated) writeStoredJSON('shoppinglink-recent', recent); }, [recent, hydrated]);
  useEffect(() => { if (!hydrated) return; if (user) writeStoredJSON('shoppinglink-user', user); else { try { window.localStorage.removeItem('shoppinglink-user'); } catch { /* bloqueado */ } } }, [user, hydrated]);
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(null), 3600); return () => window.clearTimeout(timer); }, [toast]);

  // Elementos com data-reveal aparecem quando entram na tela.
  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined;
    root.classList.add('reveal-ready');
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.setAttribute('data-visible', ''); io.unobserve(entry.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    const observed = new WeakSet();
    const scan = () => document.querySelectorAll('[data-reveal]:not([data-visible])').forEach((el) => { if (observed.has(el)) return; observed.add(el); io.observe(el); });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); root.classList.remove('reveal-ready'); };
  }, []);

  const notify = useCallback((message, type = 'success', action) => setToast({ message, type, action, id: Date.now() }), []);
  const navigate = useCallback((to) => { setPath(to); window.history.pushState({}, '', to); window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); }, []);
  const onSearch = useCallback((term) => {
    const clean = term?.trim();
    if (clean) setRecent((current) => [clean, ...current.filter((item) => norm(item) !== norm(clean))].slice(0, 5));
    navigate(clean ? `/busca?q=${encodeURIComponent(clean)}` : '/busca');
  }, [navigate]);
  const onAdd = (product, goToCart = false, deliveryMode = 'pickup', quantity = 1) => {
    setCart((current) => { const found = current.find((line) => line.productId === product.id); return found ? current.map((line) => line.productId === product.id ? { ...line, quantity: line.quantity + quantity, deliveryMode: line.deliveryMode || deliveryMode } : line) : [...current, { productId: product.id, quantity, deliveryMode }]; });
    notify(`${quantity > 1 ? `${quantity}× ` : ''}${product.name} foi adicionado ao carrinho.`, 'success', goToCart ? undefined : { label: 'Ver carrinho', run: () => { setToast(null); navigate('/carrinho'); } });
    if (goToCart) navigate('/carrinho');
  };
  const onRemove = (productId) => {
    const line = cart.find((item) => item.productId === productId);
    setCart((current) => current.filter((item) => item.productId !== productId));
    const product = products.find((item) => item.id === productId);
    if (line && product) notify(`${product.name} removido.`, 'info', { label: 'Desfazer', run: () => { setCart((current) => [...current, line]); setToast(null); } });
  };
  const onChangeQuantity = (productId, quantity) => { if (quantity <= 0) return onRemove(productId); setCart((current) => current.map((line) => line.productId === productId ? { ...line, quantity } : line)); return undefined; };
  const finishOrder = ({ paymentMethod = 'pix', deliveryMode = 'delivery' } = {}) => { const first = cart[0]; const product = products.find((item) => item.id === first?.productId) || products[0]; const subtotal = cart.reduce((sum, line) => { const item = products.find((itemProduct) => itemProduct.id === line.productId); return sum + (item?.price || 0) * line.quantity; }, 0); const deliveryFee = deliveryMode === 'delivery' ? 12.9 : 0; const newOrder = { id: `SL-${Math.floor(2050 + Math.random() * 400)}`, date: 'Agora mesmo', store: getStore(product.storeId).name, item: cart.length > 1 ? `${product.name} e mais ${cart.length - 1}` : product.name, total: subtotal + deliveryFee, method: paymentMethod === 'card' ? 'Cartão' : 'Pix', mode: deliveryMode === 'pickup' ? 'Retirada no shopping' : 'Entrega em casa', step: 0, address: deliveryMode === 'pickup' ? 'Capim Dourado Shopping · Palmas/TO' : 'Av. Central, 840 · Apto 42' }; setOrders((current) => [newOrder, ...current]); setCart([]); setModal(null); notify('Pedido confirmado. Acompanhe tudo por aqui.'); navigate('/pedidos'); };
  const onCheckout = (options) => { if (!user) { setModal({ type: 'login' }); notify('Entre para confirmar seu pedido com segurança.', 'info'); return; } finishOrder(options); };
  const onLogin = (name) => { setUser({ name, email: 'cliente@shoppinglink.demo' }); setModal(null); notify('Login realizado. Agora você pode continuar.'); };
  const onCreateProduct = (product) => { setProducts((current) => [{ ...product, id: `custom-${Date.now()}`, kind: undefined }, ...current]); notify('Produto publicado na vitrine da ACIUM.'); };
  const toggleFavorite = useCallback((product) => {
    setFavorites((current) => {
      const has = current.includes(product.id);
      notify(has ? `${product.name} saiu dos favoritos.` : `${product.name} foi salvo nos favoritos.`, has ? 'info' : 'fav');
      return has ? current.filter((id) => id !== product.id) : [product.id, ...current];
    });
  }, [notify]);
  const openStore = useCallback((id) => setModal({ type: 'store', id }), []);
  const openLightbox = useCallback((index) => setModal({ type: 'lightbox', id: index }), []);
  const closeModal = useCallback(() => setModal(null), []);

  const query = useMemo(() => queryParams(path).get('q') || '', [path]);
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const pathname = path.split('?')[0];
  const pathParts = pathname.split('/').filter(Boolean);
  const product = pathParts[0] === 'produto' ? products.find((item) => item.id === pathParts[1]) : null;
  const store = pathParts[0] === 'loja' ? getStore(pathParts[1]) : null;
  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);
  // Props compartilhadas pelos cartões de produto (isFavorite é uma função id → boolean).
  const pageCardProps = { onProduct: (id) => navigate(`/produto/${id}`), onAdd, onQuickView: (id) => setModal({ type: 'quick', id }), onToggleFavorite: toggleFavorite, isFavorite };
  const searchProps = { value: searchValue, setValue: setSearchValue, onSearch, navigate, products, recent, onOpenStore: openStore };

  let content;
  if (pathname === '/' || pathname === '') content = <HomePage products={products} navigate={navigate} cardProps={pageCardProps} searchProps={searchProps} onOpenStore={openStore} onOpenLightbox={openLightbox} />;
  else if (pathname.startsWith('/busca')) content = <SearchPage products={products} navigate={navigate} cardProps={pageCardProps} query={query} path={path} favorites={favorites} />;
  else if (pathname.startsWith('/lojas')) content = <StoresPage navigate={navigate} path={path} products={products} onOpenStore={openStore} />;
  else if (pathname.startsWith('/loja/')) content = <StorePage store={store || STORES[0]} products={products} navigate={navigate} cardProps={pageCardProps} onToast={notify} />;
  else if (pathname.startsWith('/produto/')) content = product ? <ProductPage product={product} products={products} navigate={navigate} onAdd={onAdd} cardProps={pageCardProps} onToast={notify} /> : <SearchPage products={products} navigate={navigate} cardProps={pageCardProps} query="" path="/busca" favorites={favorites} />;
  else if (pathname === '/favoritos') content = <FavoritesPage products={products} favorites={favorites} navigate={navigate} cardProps={pageCardProps} />;
  else if (pathname === '/carrinho') content = <CartPage cart={cart} products={products} navigate={navigate} onRemove={onRemove} onChangeQuantity={onChangeQuantity} user={user} onCheckout={onCheckout} />;
  else if (pathname === '/pedidos') content = <OrdersPage orders={orders} navigate={navigate} />;
  else if (pathname === '/painel') content = <PanelPage products={products} navigate={navigate} onCreateProduct={onCreateProduct} orders={orders} />;
  else content = <HomePage products={products} navigate={navigate} cardProps={pageCardProps} searchProps={searchProps} onOpenStore={openStore} onOpenLightbox={openLightbox} />;
  const isPanel = pathname === '/painel';
  const quickProduct = modal?.type === 'quick' ? products.find((item) => item.id === modal.id) : null;
  const storeEntry = modal?.type === 'store' ? DIR_BY_ID[modal.id] : null;
  return <div className="app-shell">
    {!isPanel && <Header path={path} searchProps={searchProps} navigate={navigate} cartCount={cartCount} favoritesCount={favorites.length} user={user} onLogin={() => setModal({ type: 'login' })} />}
    <div className="page-transition" key={pathname}>{content}</div>
    {!isPanel && <Footer navigate={navigate} onCredits={() => setModal({ type: 'credits' })} />}
    {!isPanel && <ScrollChrome />}
    {modal?.type === 'login' && <LoginModal onClose={closeModal} onLogin={onLogin} />}
    {quickProduct && <QuickViewModal product={quickProduct} onClose={closeModal} onAdd={onAdd} navigate={navigate} cardProps={pageCardProps} />}
    {storeEntry && <StoreModal entry={storeEntry} products={products} onClose={closeModal} navigate={navigate} />}
    {modal?.type === 'lightbox' && <LightboxModal index={modal.id} setIndex={(updater) => setModal((current) => ({ ...current, id: typeof updater === 'function' ? updater(current.id) : updater }))} onClose={closeModal} />}
    {modal?.type === 'credits' && <CreditsModal onClose={closeModal} />}
    <Toast toast={toast} onClose={() => setToast(null)} />
  </div>;
}
