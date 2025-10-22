import { BotFormData } from '@/app/(dashboard)/dashboard/bots/new/page';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

interface Props {
  formData: BotFormData;
  updateFormData: (data: Partial<BotFormData>) => void;
}

const positions = [
  { value: 'bottom-right', label: 'Basso Destra', icon: '↘️' },
  { value: 'bottom-left', label: 'Basso Sinistra', icon: '↙️' },
  { value: 'top-right', label: 'Alto Destra', icon: '↗️' },
  { value: 'top-left', label: 'Alto Sinistra', icon: '↖️' },
];

const presetColors = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

export default function Step4Widget({ formData, updateFormData }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Configuration */}
      <div className="space-y-6">
        <div>
          <Label htmlFor="primaryColor">Colore Primario</Label>
          <div className="flex items-center space-x-3 mt-2">
            <Input
              id="primaryColor"
              type="color"
              value={formData.primaryColor}
              onChange={(e) => updateFormData({ primaryColor: e.target.value })}
              className="w-20 h-10 cursor-pointer"
            />
            <Input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => updateFormData({ primaryColor: e.target.value })}
              placeholder="#6366f1"
              className="flex-1"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => updateFormData({ primaryColor: color })}
                className={`w-8 h-8 rounded-full border-2 ${
                  formData.primaryColor === color
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div>
          <Label>Posizione Widget</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {positions.map((pos) => (
              <Card
                key={pos.value}
                className={`cursor-pointer transition-all ${
                  formData.position === pos.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'hover:border-gray-400'
                }`}
                onClick={() =>
                  updateFormData({
                    position: pos.value as BotFormData['position'],
                  })
                }
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-1">{pos.icon}</div>
                  <p className="text-sm font-medium">{pos.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="headerText">Testo Intestazione</Label>
          <Input
            id="headerText"
            value={formData.headerText}
            onChange={(e) => updateFormData({ headerText: e.target.value })}
            placeholder="Chat di supporto"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="welcomeMessage">Messaggio di Benvenuto</Label>
          <Textarea
            id="welcomeMessage"
            value={formData.welcomeMessage}
            onChange={(e) => updateFormData({ welcomeMessage: e.target.value })}
            placeholder="Ciao! Come posso aiutarti oggi?"
            className="mt-1"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="placeholderText">Testo Placeholder Input</Label>
          <Input
            id="placeholderText"
            value={formData.placeholderText}
            onChange={(e) => updateFormData({ placeholderText: e.target.value })}
            placeholder="Scrivi un messaggio..."
            className="mt-1"
          />
        </div>
      </div>

      {/* Preview */}
      <div>
        <Label className="mb-3 block">Anteprima Widget</Label>
        <div className="bg-gray-100 rounded-lg p-6 h-[600px] relative">
          {/* Chat Widget Preview */}
          <div
            className={`absolute ${
              formData.position === 'bottom-right'
                ? 'bottom-6 right-6'
                : formData.position === 'bottom-left'
                ? 'bottom-6 left-6'
                : formData.position === 'top-right'
                ? 'top-6 right-6'
                : 'top-6 left-6'
            }`}
          >
            {/* Chat Button */}
            <div
              className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer mb-4"
              style={{ backgroundColor: formData.primaryColor }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </div>

            {/* Chat Window */}
            <div className="w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
              {/* Header */}
              <div
                className="p-4 text-white"
                style={{ backgroundColor: formData.primaryColor }}
              >
                <h3 className="font-semibold">{formData.headerText}</h3>
                <p className="text-xs opacity-90">Online</p>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
                <div className="flex items-start mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    AI
                  </div>
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[70%]">
                    <p className="text-sm">{formData.welcomeMessage}</p>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder={formData.placeholderText}
                    disabled
                  />
                  <button
                    className="p-2 rounded-lg text-white"
                    style={{ backgroundColor: formData.primaryColor }}
                    disabled
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">
            Questo è come apparirà il widget sul tuo sito
          </div>
        </div>
      </div>

      <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Suggerimento</h4>
        <p className="text-sm text-blue-800">
          Scegli colori che si abbinano al tuo brand. Puoi personalizzare ulteriormente
          l&apos;aspetto del widget in seguito tramite CSS personalizzato.
        </p>
      </div>
    </div>
  );
}
