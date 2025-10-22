'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Bot {
  id: string;
  name: string;
  description: string | null;
  status: string;
  conversationCount: number;
  messageCount: number;
  createdAt: string;
}

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const response = await api.get('/api/bots');
      setBots(response.data.bots);
    } catch (error) {
      console.error('Failed to fetch bots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">I Miei Bot</h1>
          <p className="text-gray-600 mt-2">
            Gestisci tutti i tuoi chatbot
          </p>
        </div>
        <Link href="/dashboard/bots/new">
          <Button size="lg">
            + Crea Nuovo Bot
          </Button>
        </Link>
      </div>

      {bots.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">Nessun bot ancora</h3>
            <p className="text-gray-600 mb-6">
              Crea il tuo primo chatbot per iniziare
            </p>
            <Link href="/dashboard/bots/new">
              <Button>Crea il Tuo Primo Bot</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <Card key={bot.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{bot.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {bot.description || 'Nessuna descrizione'}
                    </CardDescription>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    bot.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    bot.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bot.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-2xl font-bold">{bot.conversationCount}</div>
                    <div className="text-sm text-gray-600">Conversazioni</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{bot.messageCount}</div>
                    <div className="text-sm text-gray-600">Messaggi</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/dashboard/bots/${bot.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      Modifica
                    </Button>
                  </Link>
                  <Link href={`/dashboard/bots/${bot.id}/analytics`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
