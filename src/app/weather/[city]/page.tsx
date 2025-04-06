// Server Component
import { WeatherDetailClient } from './WeatherDetailClient';

export async function generateStaticParams() {
  // List of major cities to pre-render
  return [
    { city: 'london' },
    { city: 'new-york' },
    { city: 'tokyo' },
    { city: 'paris' },
    { city: 'sydney' },
  ];
}

interface Props {
  params: { city: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params }: Props) {
  return <WeatherDetailClient />;
} 