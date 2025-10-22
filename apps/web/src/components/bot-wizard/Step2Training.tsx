import { useState } from 'react';
import { BotFormData } from '@/app/(dashboard)/dashboard/bots/new/page';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Plus, X, FileText } from 'lucide-react';

interface Props {
  formData: BotFormData;
  updateFormData: (data: Partial<BotFormData>) => void;
}

export default function Step2Training({ formData, updateFormData }: Props) {
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      updateFormData({ documents: [...formData.documents, ...files] });
    }
  };

  const removeDocument = (index: number) => {
    const newDocs = formData.documents.filter((_, i) => i !== index);
    updateFormData({ documents: newDocs });
  };

  const addFaq = () => {
    if (newQuestion && newAnswer) {
      updateFormData({
        faqs: [...formData.faqs, { question: newQuestion, answer: newAnswer }],
      });
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  const removeFaq = (index: number) => {
    const newFaqs = formData.faqs.filter((_, i) => i !== index);
    updateFormData({ faqs: newFaqs });
  };

  const addUrl = () => {
    if (newUrl) {
      updateFormData({ urls: [...formData.urls, newUrl] });
      setNewUrl('');
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = formData.urls.filter((_, i) => i !== index);
    updateFormData({ urls: newUrls });
  };

  return (
    <div className="space-y-6">
      {/* Document Upload */}
      <div>
        <Label>Carica Documenti</Label>
        <div className="mt-2">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              Clicca per caricare o trascina qui
            </span>
            <span className="text-xs text-gray-500 mt-1">
              PDF, DOCX, TXT (max 10MB)
            </span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {formData.documents.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.documents.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div>
        <Label>Domande e Risposte Frequenti</Label>
        <p className="text-sm text-gray-500 mb-3">
          Aggiungi coppie domanda/risposta per addestrare il bot
        </p>

        <Card className="p-4 mb-4">
          <div className="space-y-3">
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Domanda (es. Come posso contattare il supporto?)"
            />
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Risposta..."
              rows={3}
            />
            <Button onClick={addFaq} className="w-full" disabled={!newQuestion || !newAnswer}>
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi FAQ
            </Button>
          </div>
        </Card>

        {formData.faqs.length > 0 && (
          <div className="space-y-2">
            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-sm">Q: {faq.question}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFaq(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* URLs to Scrape */}
      <div>
        <Label>URL da Scansionare (Opzionale)</Label>
        <p className="text-sm text-gray-500 mb-3">
          Aggiungi URL di pagine web da cui il bot può apprendere
        </p>

        <div className="flex space-x-2 mb-4">
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://esempio.com/pagina"
            type="url"
          />
          <Button onClick={addUrl} disabled={!newUrl}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {formData.urls.length > 0 && (
          <div className="space-y-2">
            {formData.urls.map((url, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-sm truncate flex-1">{url}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUrl(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Suggerimento</h4>
        <p className="text-sm text-blue-800">
          Più informazioni fornisci, più accurato sarà il tuo bot. Puoi sempre
          aggiungere nuovi documenti e FAQ in seguito dalla sezione Knowledge Base.
        </p>
      </div>
    </div>
  );
}
