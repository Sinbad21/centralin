import { useState } from 'react';
import { BotFormData } from '@/app/(dashboard)/dashboard/bots/new/page';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Copy, Check, Globe, Code } from 'lucide-react';

interface Props {
  formData: BotFormData;
  updateFormData: (data: Partial<BotFormData>) => void;
}

export default function Step5Deploy({ formData, updateFormData }: Props) {
  const [newDomain, setNewDomain] = useState('');
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const addDomain = () => {
    if (newDomain) {
      updateFormData({ allowedDomains: [...formData.allowedDomains, newDomain] });
      setNewDomain('');
    }
  };

  const removeDomain = (index: number) => {
    const newDomains = formData.allowedDomains.filter((_, i) => i !== index);
    updateFormData({ allowedDomains: newDomains });
  };

  const embedCode = `<!-- Chatbot Widget -->
<script>
  window.chatbotConfig = {
    botId: "YOUR_BOT_ID",
    apiKey: "YOUR_API_KEY"
  };
</script>
<script src="https://cdn.chatbot-studio.com/widget.js" async></script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Allowed Domains */}
      <div>
        <Label className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span>Domini Autorizzati</span>
        </Label>
        <p className="text-sm text-gray-500 mb-3">
          Specifica i domini dove il widget può essere incorporato (lascia vuoto per
          permettere tutti i domini)
        </p>

        <div className="flex space-x-2 mb-4">
          <Input
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="https://miosito.com"
            type="url"
          />
          <Button onClick={addDomain} disabled={!newDomain}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {formData.allowedDomains.length > 0 ? (
          <div className="space-y-2">
            {formData.allowedDomains.map((domain, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <p className="text-sm">{domain}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeDomain(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 text-center text-sm text-gray-500">
              Nessun dominio specificato - il widget funzionerà su qualsiasi dominio
            </CardContent>
          </Card>
        )}
      </div>

      {/* Embed Code */}
      <div>
        <Label className="flex items-center space-x-2 mb-3">
          <Code className="w-4 h-4" />
          <span>Codice di Integrazione</span>
        </Label>
        <p className="text-sm text-gray-500 mb-3">
          Dopo aver creato il bot, riceverai un codice personalizzato da inserire nel tuo
          sito
        </p>

        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
            {embedCode}
          </pre>
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
            onClick={copyEmbedCode}
          >
            {copiedEmbed ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Copiato!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                Copia
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Integration Options */}
      <div>
        <Label>Opzioni di Integrazione</Label>
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center">
                <Code className="w-4 h-4 mr-2 text-indigo-600" />
                Widget JavaScript
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Incorpora il widget direttamente nel tuo sito web
              </p>
              <p className="text-xs text-gray-500">
                Ideale per: siti web, landing pages, portali
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-2 text-indigo-600" />
                API REST
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Integra tramite chiamate API per applicazioni personalizzate
              </p>
              <p className="text-xs text-gray-500">
                Ideale per: app mobile, backend custom, integrazioni
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <h4 className="font-semibold text-indigo-900 mb-3 text-lg">
          🎉 Quasi fatto!
        </h4>
        <div className="space-y-2 text-sm text-indigo-800">
          <p className="flex items-start">
            <span className="font-bold mr-2">1.</span>
            Clicca su &quot;Crea Bot&quot; per finalizzare la creazione
          </p>
          <p className="flex items-start">
            <span className="font-bold mr-2">2.</span>
            Riceverai il codice di integrazione personalizzato con le tue chiavi API
          </p>
          <p className="flex items-start">
            <span className="font-bold mr-2">3.</span>
            Inserisci il codice nel tuo sito web prima del tag <code>&lt;/body&gt;</code>
          </p>
          <p className="flex items-start">
            <span className="font-bold mr-2">4.</span>
            Il bot sarà immediatamente operativo sul tuo sito!
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Importante</h4>
        <p className="text-sm text-yellow-800">
          Dopo la creazione, il bot sarà in modalità DRAFT. Attivalo quando sei pronto
          dalla pagina di gestione del bot.
        </p>
      </div>
    </div>
  );
}
