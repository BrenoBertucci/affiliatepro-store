import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Falha ao entrar. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-fade-in">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-600/30">
            <Lock size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Acesso Restrito</h2>
          <p className="text-slate-500 mt-2">Painel administrativo</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-start gap-3 border border-red-100">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5 text-base font-semibold"
            isLoading={loading}
          >
            Entrar
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Área exclusiva para administradores
        </p>
      </div>
    </div>
  );
};

export default Login;