import ShoppingLinkApp from '../page';

export function generateStaticParams() {
  const rotas = ['busca', 'carrinho', 'pedidos', 'painel', 'lojas', 'favoritos'];
  return rotas.map((rota) => ({ slug: [rota] }));
}

export default function CatchAllPage() {
  return <ShoppingLinkApp />;
}