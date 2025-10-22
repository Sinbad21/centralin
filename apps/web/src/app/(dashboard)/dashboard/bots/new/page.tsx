'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';
import api from '@/lib/api';

// Import step components
import Step1BasicInfo from '@/components/bot-wizard/Step1BasicInfo';
import Step2Training from '@/components/bot-wizard/Step2Training';
import Step3Behavior from '@/components/bot-wizard/Step3Behavior';
import Step4Widget from '@/components/bot-wizard/Step4Widget';
import Step5Deploy from '@/components/bot-wizard/Step5Deploy';

export interface BotFormData {
  // Step 1 - Basic Info
  name: string;
  description: string;
  category: string;
  language: string;

  // Step 2 - Training & Knowledge Base
  documents: File[];
  faqs: Array<{ question: string; answer: string }>;
  urls: string[];

  // Step 3 - Behavior Configuration
  personality: string;
  tone: string;
  systemInstructions: string;
  fallbackMessage: string;

  // Step 4 - Widget Customization
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  welcomeMessage: string;
  avatar: string;
  headerText: string;
  placeholderText: string;

  // Step 5 - Integration & Deploy
  allowedDomains: string[];
  embedCode?: string;
}

const steps = [
  { number: 1, title: 'Informazioni Base', description: 'Nome, categoria e descrizione' },
  { number: 2, title: 'Training', description: 'Knowledge base e documenti' },
  { number: 3, title: 'Comportamento', description: 'Personalità e istruzioni' },
  { number: 4, title: 'Interfaccia', description: 'Personalizza il widget chat' },
  { number: 5, title: 'Deploy', description: 'Integrazione e pubblicazione' },
];

export default function NewBotWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BotFormData>({
    // Step 1
    name: '',
    description: '',
    category: 'CUSTOMER_SUPPORT',
    language: 'it',

    // Step 2
    documents: [],
    faqs: [],
    urls: [],

    // Step 3
    personality: 'friendly',
    tone: 'professional',
    systemInstructions: '',
    fallbackMessage: 'Mi dispiace, non ho capito. Puoi riformulare la domanda?',

    // Step 4
    primaryColor: '#6366f1',
    position: 'bottom-right',
    welcomeMessage: 'Ciao! Come posso aiutarti oggi?',
    avatar: '',
    headerText: 'Chat di supporto',
    placeholderText: 'Scrivi un messaggio...',

    // Step 5
    allowedDomains: [],
  });

  const updateFormData = (data: Partial<BotFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create bot
      const botResponse = await api.post('/api/bots', {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        language: formData.language,
        status: 'DRAFT',
        config: {
          personality: formData.personality,
          tone: formData.tone,
          systemInstructions: formData.systemInstructions,
          fallbackMessage: formData.fallbackMessage,
        },
        appearance: {
          primaryColor: formData.primaryColor,
          position: formData.position,
          welcomeMessage: formData.welcomeMessage,
          avatar: formData.avatar,
          headerText: formData.headerText,
          placeholderText: formData.placeholderText,
        },
        integration: {
          allowedDomains: formData.allowedDomains,
        },
      });

      const botId = botResponse.data.bot.id;

      // Upload documents if any
      if (formData.documents.length > 0) {
        const formDataUpload = new FormData();
        formData.documents.forEach((file) => {
          formDataUpload.append('documents', file);
        });
        await api.post(`/api/bots/${botId}/documents`, formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // Create FAQs as intents
      if (formData.faqs.length > 0) {
        await Promise.all(
          formData.faqs.map((faq) =>
            api.post(`/api/bots/${botId}/intents`, {
              name: faq.question.substring(0, 50),
              examples: [faq.question],
              response: faq.answer,
              priority: 5,
            })
          )
        );
      }

      router.push(`/dashboard/bots/${botId}`);
    } catch (error) {
      console.error('Failed to create bot:', error);
      alert('Errore durante la creazione del bot. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crea Nuovo Bot</h1>
        <p className="text-gray-600">
          Segui questi passaggi per configurare il tuo chatbot
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2 mb-4" />
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col items-center ${
                step.number === currentStep
                  ? 'text-indigo-600'
                  : step.number < currentStep
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step.number === currentStep
                    ? 'bg-indigo-600 text-white'
                    : step.number < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <div className="text-sm font-medium text-center hidden sm:block">
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <Step1BasicInfo formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <Step2Training formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <Step3Behavior formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <Step4Widget formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 5 && (
            <Step5Deploy formData={formData} updateFormData={updateFormData} />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Indietro
            </Button>

            {currentStep < 5 ? (
              <Button onClick={nextStep}>
                Avanti
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Creazione...' : 'Crea Bot'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
