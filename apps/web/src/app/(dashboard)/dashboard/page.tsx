'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Benvenuto, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Ecco una panoramica della tua attività
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Bot Attivi</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Nessun bot creato ancora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversazioni</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ultimi 30 giorni
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sentiment Medio</CardDescription>
            <CardTitle className="text-3xl">-</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Nessun dato disponibile
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Crediti Scraping</CardDescription>
            <CardTitle className="text-3xl">{user?.scrapingCredits || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Disponibili
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Inizia Subito</CardTitle>
          <CardDescription>
            Scegli un'azione per iniziare a usare la piattaforma
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <a href="/dashboard/bots/new" className="block p-6 border rounded-lg hover:border-primary transition-colors">
            <div className="text-4xl mb-2">🤖</div>
            <h3 className="font-semibold mb-1">Crea il tuo primo bot</h3>
            <p className="text-sm text-muted-foreground">
              Wizard guidato in 5 step
            </p>
          </a>

          <a href="/dashboard/marketplace" className="block p-6 border rounded-lg hover:border-primary transition-colors">
            <div className="text-4xl mb-2">🛒</div>
            <h3 className="font-semibold mb-1">Esplora il Marketplace</h3>
            <p className="text-sm text-muted-foreground">
              Bot pronti all'uso
            </p>
          </a>

          <a href="/dashboard/scraping" className="block p-6 border rounded-lg hover:border-primary transition-colors">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="font-semibold mb-1">Genera Lead B2B</h3>
            <p className="text-sm text-muted-foreground">
              Scraping intelligente
            </p>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
