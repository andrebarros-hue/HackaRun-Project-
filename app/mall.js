// ============================================================
//  CONTEÚDO DO SHOPPING — Capim Dourado Shopping (Palmas–TO)
//  Endereço, horários e serviços: site oficial (capimdouradosc.com.br),
//  consultado em 13/11/2026. Fotos: veja IMAGE_CREDITS no fim do arquivo.
// ============================================================

export const MALL = {
  name: 'Capim Dourado Shopping',
  city: 'Palmas–TO',
  address: 'Q. 107 Norte, Avenida NS 5, s/n — Plano Diretor Norte, CEP 77001-098, Palmas/TO',
  phone: '(63) 3219-4616',
  site: 'https://www.capimdouradosc.com.br/',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Capim+Dourado+Shopping+Palmas+TO',
  // dia da semana: 0 = domingo ... 6 = sábado  →  [abre, fecha] em horas
  hours: {
    stores: { label: 'Lojas e quiosques', week: [10, 22], sunday: [14, 20] },
    food: { label: 'Restaurantes', week: [11, 22], sunday: [11, 20] }
  }
};

export const SERVICES = [
  { name: 'Estacionamento', icon: 'car', note: 'Pagamento também pelo aplicativo' },
  { name: 'Wi-Fi', icon: 'wifi', note: 'Internet gratuita nos corredores' },
  { name: 'Pet friendly', icon: 'paw', note: 'Seu pet é bem-vindo' },
  { name: 'Espaço Família', icon: 'family', note: 'Fraldário e apoio às famílias' },
  { name: 'Carregadores elétricos', icon: 'bolt', note: 'Para veículos elétricos' },
  { name: 'Bicicletário', icon: 'bike', note: 'Vagas para bicicletas' },
  { name: 'Cadeiras de rodas', icon: 'access', note: 'Empréstimo no SAC' },
  { name: 'Achados e perdidos', icon: 'search', note: 'Atendimento no SAC' },
  { name: 'Correios, Detran e Resolve Palmas', icon: 'shield', note: 'Serviços públicos no shopping' }
];

// Fotos reais do shopping (licença livre) e materiais oficiais de divulgação.
export const GALLERY = [
  {
    id: 'aerea',
    src: '/shopping/aerea.webp',
    title: 'Vista aérea do Capim Dourado Shopping',
    text: 'Fachada, entrada principal e estacionamento, na Avenida NS 5, região norte de Palmas.',
    credit: 'Foto: Capim Dourado Shopping · Wikimedia Commons · CC BY-SA 4.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Imagem_a%C3%A9rea_do_shopping_capim_dourado..jpg'
  },
  {
    id: 'cinemark',
    src: '/shopping/cinemark.webp',
    title: 'Cinemark Capim Dourado',
    text: 'Corredor de acesso ao cinema, uma das áreas de convivência mais movimentadas do shopping.',
    credit: 'Foto: gugapalmas · Wikimedia Commons · CC BY-SA 3.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Cinemark_Palmas.jpg'
  }
];

// Campanhas atuais divulgadas pelo shopping (página "Eventos" do site oficial).
export const EVENTS = [
  {
    id: 'doce-natal',
    src: '/shopping/natal-quadrado.webp',
    wide: '/shopping/natal-wide.webp',
    kicker: 'Campanha de Natal 2026',
    title: 'Doce Natal',
    text: 'Um Natal cheio de sabor e magia no Capim Dourado Shopping.',
    credit: 'Imagem: divulgação Capim Dourado Shopping',
    url: 'https://www.capimdouradosc.com.br/eventos/'
  },
  {
    id: 'imerso-mar',
    src: '/shopping/imerso-mar.webp',
    kicker: 'Experiência imersiva',
    title: 'Imerso Mar',
    text: 'Experiência imersiva no fundo do mar, inédita no Tocantins.',
    credit: 'Imagem: divulgação Capim Dourado Shopping',
    url: 'https://www.capimdouradosc.com.br/eventos/'
  }
];

export const IMAGE_CREDITS = [
  { what: 'Vista aérea do shopping', who: 'Capim Dourado Shopping', license: 'CC BY-SA 4.0', url: GALLERY[0].creditUrl },
  { what: 'Cinemark Capim Dourado', who: 'gugapalmas', license: 'CC BY-SA 3.0', url: GALLERY[1].creditUrl },
  { what: 'Logos das lojas', who: 'Diretório oficial do Capim Dourado Shopping', license: 'Marcas dos respectivos titulares; uso apenas para identificação', url: 'https://www.capimdouradosc.com.br/lojas/' },
  { what: 'Banners Doce Natal e Imerso Mar', who: 'Capim Dourado Shopping (divulgação)', license: 'Material de divulgação do shopping', url: 'https://www.capimdouradosc.com.br/eventos/' },
  { what: 'Fotos de 8 produtos-demo', who: 'Unsplash', license: 'Licença Unsplash · imagens ilustrativas, não são fotos do produto da loja', url: 'https://unsplash.com/license' },
  { what: 'Demais produtos', who: 'ShoppingLink', license: 'Ilustrações próprias, usadas enquanto a loja não envia a foto real', url: '' }
];

const toMinutes = (hour) => hour * 60;
export function openStatus(kind = 'stores', date = new Date()) {
  const config = MALL.hours[kind];
  const [open, close] = date.getDay() === 0 ? config.sunday : config.week;
  const now = date.getHours() * 60 + date.getMinutes();
  const isOpen = now >= toMinutes(open) && now < toMinutes(close);
  const label = (hour) => `${String(hour).padStart(2, '0')}h`;
  if (isOpen) {
    const left = toMinutes(close) - now;
    return { isOpen, text: left <= 60 ? `Aberto · fecha em ${left} min` : `Aberto agora · até ${label(close)}` };
  }
  return { isOpen, text: now < toMinutes(open) ? `Fechado · abre às ${label(open)}` : 'Fechado · abre amanhã' };
}
