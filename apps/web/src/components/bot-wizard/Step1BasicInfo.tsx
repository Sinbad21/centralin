import { BotFormData } from '@/app/(dashboard)/dashboard/bots/new/page';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  formData: BotFormData;
  updateFormData: (data: Partial<BotFormData>) => void;
}

const categories = [
  { value: 'CUSTOMER_SUPPORT', label: 'Supporto Clienti' },
  { value: 'SALES', label: 'Vendite' },
  { value: 'HR', label: 'Risorse Umane' },
  { value: 'EDUCATION', label: 'Educazione' },
  { value: 'HEALTHCARE', label: 'Sanità' },
  { value: 'ECOMMERCE', label: 'E-commerce' },
  { value: 'BOOKING', label: 'Prenotazioni' },
  { value: 'LEAD_GEN', label: 'Lead Generation' },
  { value: 'CUSTOM', label: 'Personalizzato' },
];

const languages = [
  { value: 'it', label: 'Italiano' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

export default function Step1BasicInfo({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Nome del Bot *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="es. Assistente Clienti"
          className="mt-1"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Scegli un nome descrittivo per il tuo chatbot
        </p>
      </div>

      <div>
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Breve descrizione del tuo bot e delle sue funzionalità..."
          className="mt-1"
          rows={4}
        />
        <p className="text-sm text-gray-500 mt-1">
          Descrivi lo scopo e le funzionalità principali del bot
        </p>
      </div>

      <div>
        <Label htmlFor="category">Categoria *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => updateFormData({ category: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Seleziona categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-1">
          Categoria principale del tuo chatbot
        </p>
      </div>

      <div>
        <Label htmlFor="language">Lingua *</Label>
        <Select
          value={formData.language}
          onValueChange={(value) => updateFormData({ language: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Seleziona lingua" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-1">
          Lingua principale delle conversazioni
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Suggerimento</h4>
        <p className="text-sm text-blue-800">
          Scegli un nome chiaro e una categoria appropriata per rendere il tuo bot
          facilmente identificabile. Potrai sempre modificare queste informazioni in
          seguito.
        </p>
      </div>
    </div>
  );
}
