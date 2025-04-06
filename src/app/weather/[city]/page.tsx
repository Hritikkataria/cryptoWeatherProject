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

export default function Page({ params }: { params: { city: string } }) {
  return <WeatherDetailClient />;
} 