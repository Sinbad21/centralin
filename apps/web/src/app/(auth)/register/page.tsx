'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    company: '',
    accountType: 'INDIVIDUAL',
    acceptTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Devi accettare i termini e condizioni');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/register', formData);
      const { user, tokens } = response.data;

      setAuth(user, tokens.accessToken, tokens.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.details?.[0]?.message || 'Errore durante la registrazione';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crea un Account</CardTitle>
          <CardDescription className="text-center">
            Inizia gratis, nessuna carta richiesta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Mario Rossi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mario.rossi@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Azienda (Opzionale)</Label>
              <Input
                id="company"
                placeholder="La Mia Azienda"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Almeno 8 caratteri"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="terms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                Accetto i{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  termini e condizioni
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registrazione...' : 'Crea Account'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Hai già un account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Accedi
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
