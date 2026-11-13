import './globals.css';
import './interactive.css';

export const metadata = {
  title: 'ShoppingLink · Capim Dourado Shopping',
  description: 'Encontre produtos, lojas e ofertas do Capim Dourado Shopping em Palmas–TO.',
  keywords: ['Capim Dourado Shopping', 'Palmas', 'Tocantins', 'lojas', 'ofertas', 'ShoppingLink'],
  openGraph: {
    title: 'ShoppingLink · Capim Dourado Shopping',
    description: 'A vitrine digital do Capim Dourado Shopping em Palmas–TO.',
    type: 'website',
    siteName: 'ShoppingLink'
  },
  twitter: { card: 'summary_large_image', title: 'ShoppingLink · Capim Dourado Shopping', description: 'A vitrine digital do Capim Dourado Shopping em Palmas–TO.' }
};

export default function RootLayout({ children }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
