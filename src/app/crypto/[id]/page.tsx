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

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params }: Props) {
  return <CryptoDetailClient />;
} 