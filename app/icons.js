// Ícones em SVG de traço (24×24). Use <Icon name="..." size={18} />.
const SHAPES = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  arrowUp: <><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>,
  external: <><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
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
  activity: <path d="M3 12h4l2-7 4 14 2-7h6" />,
  smile: <><circle cx="12" cy="12" r="8" /><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" /><path d="M9 9h.01M15 9h.01" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path d="M9 3v15M15 6v15" /></>,
  chat: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.2-.6L4 20l1.5-3.8A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>,
  truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  shield: <path d="M12 3 19 6v5c0 4.7-3 8.3-7 10-4-1.7-7-5.3-7-10V6l7-3Z" />,
  bag: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  graph: <><path d="M4 19V5M4 19h17" /><path d="m7 15 3-3 3 2 5-6" /></>,
  edit: <><path d="m4 16-.8 4.8L8 20l10.8-10.8a2.1 2.1 0 0 0-3-3L4 16Z" /><path d="m14.5 7.5 2 2" /></>,
  logout: <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />,
  info: <><circle cx="12" cy="12" r="8" /><path d="M12 11v5M12 8h.01" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-9 9" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />,
  film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>,
  food: <><path d="M7 3v8a2 2 0 0 0 2 2v8" /><path d="M5 3v6a2 2 0 0 0 2 2h0M11 3v6a2 2 0 0 1-2 2" /><path d="M17 21V3c-2 1.5-3 4-3 7s1 4 3 4" /></>,
  coffee: <><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" /><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" /><path d="M8 3v3M12 3v3" /></>,
  gift: <><rect x="3" y="9" width="18" height="5" rx="1" /><path d="M5 14v6h14v-6M12 9v11" /><path d="M12 9S10.5 4 8 4a2.5 2.5 0 0 0 0 5M12 9s1.5-5 4-5a2.5 2.5 0 0 1 0 5" /></>,
  car: <><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v3H3z" /><circle cx="7.5" cy="13" r=".8" /><circle cx="16.5" cy="13" r=".8" /></>,
  wifi: <><path d="M2.5 9a14 14 0 0 1 19 0" /><path d="M5.5 12.5a9.5 9.5 0 0 1 13 0" /><path d="M8.7 16a5 5 0 0 1 6.6 0" /><path d="M12 19.5h.01" /></>,
  paw: <><circle cx="7" cy="10" r="1.8" /><circle cx="10.5" cy="6.5" r="1.8" /><circle cx="14.5" cy="6.5" r="1.8" /><circle cx="18" cy="10" r="1.8" /><path d="M12.5 12c-3 0-5.5 3.5-5.5 5.5 0 1.5 1 2.5 2.5 2.5 1.2 0 2-.6 3-.6s1.8.6 3 .6c1.5 0 2.5-1 2.5-2.5 0-2-2.5-5.5-5.5-5.5Z" /></>,
  family: <><circle cx="8" cy="6" r="2.2" /><circle cx="16.5" cy="8" r="1.8" /><path d="M4.5 20v-6a3.5 3.5 0 0 1 7 0v6" /><path d="M13.5 20v-4a3 3 0 0 1 6 0v4" /></>,
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />,
  bike: <><circle cx="6" cy="16" r="3.5" /><circle cx="18" cy="16" r="3.5" /><path d="m6 16 4-7h5l3 7M10 9 8.5 6H6.5M15 9l-3 7" /></>,
  access: <><circle cx="11" cy="4.5" r="1.8" /><path d="M11 7.5V13h5l2 6" /><path d="M8 10.5a6 6 0 1 0 7.5 8" /></>,
  // ---- produtos (ilustrações de reserva) ----
  shirt: <><path d="m8 4 4 2 4-2 4 3-2 4-2-1v10H8V10l-2 1-2-4 4-3Z" /></>,
  tshirt: <><path d="m8.5 4 3.5 1.5L15.5 4l4.5 3-2 3.5-2-1V20H8V9.5l-2 1L4 7l4.5-3Z" /><path d="M10 4.6a2 2 0 0 0 4 0" /></>,
  collar: <><path d="m8 4 4 3.5L16 4l4 3-2 4-2-1v10H8V10l-2 1-2-4 4-3Z" /><path d="M12 7.5V20M12 11h.01M12 14h.01" /></>,
  dress: <><path d="M9 3h6l-1 4 4 13H6l4-13-1-4Z" /><path d="M10 7h4" /></>,
  jacket: <><path d="m8 3 4 3 4-3 4 3v14h-5V10h-6v10H4V6l4-3Z" /><path d="M12 6v14" /></>,
  baby: <><path d="M8 3h8l3 4-3 2v4l2 7h-4l-2-4-2 4H6l2-7V9L5 7l3-4Z" /><path d="M10 3a2 2 0 0 0 4 0" /></>,
  shorts: <path d="M5 5h14l1 12h-6l-2-6-2 6H4L5 5Z" />,
  skirt: <><path d="M8 4h8l4 16H4L8 4Z" /><path d="M10 4l-2 16M14 4l2 16M12 4v16" /></>,
  pants: <><path d="M6 3h12l1 18h-5l-2-12-2 12H5L6 3Z" /><path d="M6 7h12" /></>,
  swim: <><path d="M5 4c0 4 2.5 6 7 6s7-2 7-6" /><path d="M6 13c1.5 0 3 1 3.5 3l2.5 4 2.5-4c.5-2 2-3 3.5-3" /></>,
  sneaker: <><path d="M3 15.5V9l4 1 3-3 4 4 4 1.2c2 .6 3 1.8 3 3.3V17H3v-1.5Z" /><path d="M3 19.5h18M10 11l1.5-1.5M12.5 12.5 14 11" /></>,
  shoe: <><path d="M3 15.5V12l4.2-.8 2.3-4 3 2.3 3.6 1c2.7.7 5 1.9 5 4.5V16H3v-.5Z" /><path d="M3 19h18" /></>,
  flipflop: <><path d="M12 3c3.5 0 5 3 5 8.5S15.5 21 12 21s-5-4-5-9.5S8.5 3 12 3Z" /><path d="M9 13.5 12 8l3 5.5" /></>,
  sandal: <><path d="M3 17h18v2H3z" /><path d="M5 17c0-4 2-7 5-8M10 9c3 0 5 3 6 8M8 12.5h8" /></>,
  handbag: <><path d="M4.5 9h15l-1.5 11h-12L4.5 9Z" /><path d="M8 9V7a4 4 0 0 1 8 0v2" /><path d="M9 13h6" /></>,
  backpack: <><rect x="5" y="7" width="14" height="14" rx="3" /><path d="M9 7V5a3 3 0 0 1 6 0v2M8 13h8v4H8z" /></>,
  suitcase: <><rect x="5" y="7" width="14" height="12" rx="2" /><path d="M9 7V4h6v3M9 7v12M15 7v12M8 21h.01M16 21h.01" /></>,
  jewel: <><path d="M6 4c0 6 2.7 9 6 9s6-3 6-9" /><path d="m12 13-2.5 2.8L12 20l2.5-4.2L12 13Z" /></>,
  makeup: <><path d="M9 11V5l3-2 3 2v6" /><rect x="7.5" y="11" width="9" height="10" rx="1.5" /><path d="M7.5 15h9" /></>,
  perfume: <><rect x="6" y="9" width="12" height="12" rx="3" /><path d="M10 9V6h4v3M9 3h6M12 13v4" /></>,
  bottle: <><path d="M9 3h6v3l2 3v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9l2-3V3Z" /><path d="M7 12h10v5H7z" /></>,
  pill: <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M12 8v8M8 12h8" /></>,
  thermo: <><path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0Z" /><path d="M12 9v7" /></>,
  phone: <><rect x="7" y="3" width="10" height="18" rx="2.2" /><path d="M11 17.5h2" /></>,
  headphones: <><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="14" width="4" height="7" rx="1.5" /><rect x="17" y="14" width="4" height="7" rx="1.5" /></>,
  charger: <><rect x="7" y="8" width="10" height="10" rx="2" /><path d="M10 8V4M14 8V4M12 18v3" /><path d="m12.5 10.5-2 3h3l-2 3" /></>,
  battery: <><rect x="3" y="7" width="16" height="10" rx="2" /><path d="M21 10.5v3M6.5 10.5h4v3h-4z" /></>,
  pix: <><path d="m8 4 4 4 4-4 4 4-4 4 4 4-4 4-4-4-4 4-4-4 4-4-4-4 4-4Z" /><path d="m9 9 6 6M15 9l-6 6" /></>
};

export function Icon({ name, size = 18, className = '', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      {SHAPES[name] || SHAPES.spark}
    </svg>
  );
}

// Ícone por tipo de produto (ver kindOf em data.js)
export const KIND_ICON = { shirt: 'collar', tshirt: 'tshirt', dress: 'dress', jacket: 'jacket', baby: 'baby', shorts: 'shorts', skirt: 'skirt', pants: 'pants', swim: 'swim', sneaker: 'sneaker', shoe: 'shoe', flipflop: 'flipflop', sandal: 'sandal', handbag: 'handbag', backpack: 'backpack', suitcase: 'suitcase', jewel: 'jewel', makeup: 'makeup', perfume: 'perfume', bottle: 'bottle', pill: 'pill', thermo: 'thermo', phone: 'phone', headphones: 'headphones', charger: 'charger', battery: 'battery', bag: 'bag' };

// Ícone por grupo do diretório de lojas
export const GROUP_ICON = { 'Moda': 'tshirt', 'Calçados': 'sneaker', 'Acessórios': 'jewel', 'Beleza & cosméticos': 'perfume', 'Farmácia': 'pill', 'Eletrônicos': 'phone', 'Gastronomia': 'food', 'Casa & presentes': 'gift', 'Lazer & serviços': 'film' };
