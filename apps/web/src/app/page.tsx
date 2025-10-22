import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            <span className="text-xl font-bold">Chatbot Platform</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Accedi</Button>
            </Link>
            <Link href="/register">
              <Button>Inizia Gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Crea Chatbot AI Potenti
            <br />
            In Pochi Minuti
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Piattaforma completa per creare, addestrare e deployare chatbot AI personalizzati.
            Senza codice, con analytics avanzate e marketplace integrato.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Inizia Gratis
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Scopri di Più
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tutto quello di cui hai bisogno
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <CardTitle>Wizard Guidato</CardTitle>
              <CardDescription>
                Crea il tuo chatbot in 5 semplici step. Nessuna esperienza tecnica richiesta.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <CardTitle>Training Avanzato</CardTitle>
              <CardDescription>
                Addestra il bot con documenti, siti web, API e conversazioni precedenti.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <CardTitle>Analytics Dettagliate</CardTitle>
              <CardDescription>
                Dashboard completa con metriche, sentiment analysis e report esportabili.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <CardTitle>Personalizzazione Totale</CardTitle>
              <CardDescription>
                Colori, font, messaggi e comportamento del bot completamente personalizzabili.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔌</span>
              </div>
              <CardTitle>20+ Integrazioni</CardTitle>
              <CardDescription>
                Shopify, Stripe, Google Calendar, HubSpot, Zendesk e molte altre.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <CardTitle>Marketplace</CardTitle>
              <CardDescription>
                Monetizza i tuoi bot o usa bot pronti creati dalla community.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Piani Semplici e Trasparenti
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfetto per iniziare</CardDescription>
              <div className="text-3xl font-bold mt-4">€0<span className="text-base font-normal text-muted-foreground">/mese</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 1 bot</li>
                <li>✓ 100 conversazioni/mese</li>
                <li>✓ 100MB storage</li>
                <li>✓ Support community</li>
              </ul>
              <Link href="/register">
                <Button className="w-full mt-6" variant="outline">
                  Inizia Gratis
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="text-xs font-semibold text-primary mb-2">PIÙ POPOLARE</div>
              <CardTitle>Professional</CardTitle>
              <CardDescription>Per business in crescita</CardDescription>
              <div className="text-3xl font-bold mt-4">€99<span className="text-base font-normal text-muted-foreground">/mese</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ 20 bot</li>
                <li>✓ 10.000 conversazioni/mese</li>
                <li>✓ 10GB storage</li>
                <li>✓ 200 scraping credits</li>
                <li>✓ Support prioritario</li>
                <li>✓ Marketplace listing</li>
              </ul>
              <Link href="/register">
                <Button className="w-full mt-6">
                  Inizia Prova Gratuita
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>Soluzioni custom</CardDescription>
              <div className="text-3xl font-bold mt-4">Custom</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>✓ Bot illimitati</li>
                <li>✓ Conversazioni illimitate</li>
                <li>✓ Storage custom</li>
                <li>✓ White-label</li>
                <li>✓ Support dedicato</li>
                <li>✓ SLA 99.99%</li>
              </ul>
              <Button className="w-full mt-6" variant="outline">
                Contattaci
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            © 2025 Chatbot Platform. Tutti i diritti riservati.
          </div>
        </div>
      </footer>
    </main>
  );
}
