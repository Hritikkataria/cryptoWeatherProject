// Server Component
import { CryptoDetailClient } from './CryptoDetailClient';

export async function generateStaticParams() {
  // List of common cryptocurrency IDs to pre-render
  return [
    { id: 'bitcoin' },
    { id: 'ethereum' },
    { id: 'binancecoin' },
    { id: 'ripple' },
    { id: 'cardano' },
  ];
}

export default function Page({ params }: { params: { id: string } }) {
  return <CryptoDetailClient />;
} 