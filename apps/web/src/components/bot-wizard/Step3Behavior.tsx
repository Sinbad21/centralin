import { BotFormData } from '@/app/(dashboard)/dashboard/bots/new/page';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  formData: BotFormData;
  updateFormData: (data: Partial<BotFormData>) => void;
}

const personalities = [
  {
    value: 'friendly',
    label: 'Amichevole',
    description: 'Caloroso e cordiale, crea connessioni personali',
  },
  {
    value: 'professional',
    label: 'Professionale',
    description: 'Formale e rispettoso, orientato al business',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Rilassato e informale, conversazionale',
  },
  {
    value: 'empathetic',
    label: 'Empatico',
    description: 'Comprensivo e supportivo, orientato alle emozioni',
  },
  {
    value: 'expert',
    label: 'Esperto',
    description: 'Competente e autorevole, fornisce dettagli tecnici',
  },
];

const tones = [
  { value: 'professional', label: 'Professionale' },
  { value: 'friendly', label: 'Amichevole' },
  { value: 'enthusiastic', label: 'Entusiasta' },
  { value: 'helpful', label: 'Disponibile' },
  { value: 'concise', label: 'Conciso' },
];

export default function Step3Behavior({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Personalità del Bot</Label>
        <p className="text-sm text-gray-500 mb-3">
          Scegli come il bot dovrebbe comportarsi nelle conversazioni
        </p>

        <div className="grid gap-3">
          {personalities.map((personality) => (
            <Card
              key={personality.value}
              className={`cursor-pointer transition-all ${
                formData.personality === personality.value
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'hover:border-gray-400'
              }`}
              onClick={() => updateFormData({ personality: personality.value })}
            >
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      formData.personality === personality.value
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {formData.personality === personality.value && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{personality.label}</p>
                    <p className="text-sm text-gray-600">{personality.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="tone">Tono di Comunicazione</Label>
        <Select
          value={formData.tone}
          onValueChange={(value) => updateFormData({ tone: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Seleziona tono" />
          </SelectTrigger>
          <SelectContent>
            {tones.map((tone) => (
              <SelectItem key={tone.value} value={tone.value}>
                {tone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-1">
          Il tono generale delle risposte del bot
        </p>
      </div>

      <div>
        <Label htmlFor="systemInstructions">Istruzioni di Sistema (Opzionale)</Label>
        <Textarea
          id="systemInstructions"
          value={formData.systemInstructions}
          onChange={(e) => updateFormData({ systemInstructions: e.target.value })}
          placeholder="es. Sei un assistente per un e-commerce di elettronica. Fornisci sempre informazioni accurate sui prodotti e aiuta con gli ordini. Non fornire consigli medici o legali..."
          className="mt-1"
          rows={6}
        />
        <p className="text-sm text-gray-500 mt-1">
          Istruzioni specifiche su come il bot dovrebbe comportarsi. Queste regole hanno
          priorità su tutto il resto.
        </p>
      </div>

      <div>
        <Label htmlFor="fallbackMessage">Messaggio di Fallback</Label>
        <Textarea
          id="fallbackMessage"
          value={formData.fallbackMessage}
          onChange={(e) => updateFormData({ fallbackMessage: e.target.value })}
          placeholder="Mi dispiace, non ho capito. Puoi riformulare la domanda?"
          className="mt-1"
          rows={3}
        />
        <p className="text-sm text-gray-500 mt-1">
          Messaggio mostrato quando il bot non comprende la richiesta
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Suggerimento</h4>
        <p className="text-sm text-blue-800">
          Le istruzioni di sistema sono molto importanti per guidare il comportamento del
          bot. Sii specifico su cosa deve e non deve fare.
        </p>
      </div>
    </div>
  );
}
