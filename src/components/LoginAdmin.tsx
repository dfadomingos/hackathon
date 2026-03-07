import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../lib/api';
import { Mail, Lock, LogIn, Crown } from 'lucide-react';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && senha) {
      setIsLoading(true);
      setErro('');
      try {
        const response = await fetch('/api/v1/user/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: email, senha: senha })
         });

         if (!response.ok) {
            throw new Error('E-mail ou senha incorretos.');
         }

         const data = await response.json();
         // Save the tokens in localStorage
         setTokens(data.access_token, data.refresh_token);
         
         navigate('/admin/home');
      } catch (err: any) {
         setErro(err.message || 'Erro ao efetuar o login. Tente novamente mais tarde.');
      } finally {
         setIsLoading(false);
      }
    } else {
      setErro('Por favor, preencha e-mail e senha administrativo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-alta-green/20 to-alta-green/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-alta-orange/10 to-alta-orange/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-alta-green/20 rounded-2xl mb-4 backdrop-blur-sm border border-alta-green/30 shadow-[0_0_15px_rgba(16,145,77,0.3)]">
             <Crown className="w-8 h-8 text-alta-green" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Administração Master
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Acesso exclusivo para gestão do evento
          </p>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-8 sm:p-10 transition-all duration-500 ease-in-out">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {erro && (
              <div className="bg-red-900/50 text-red-300 text-sm p-3 rounded-lg border border-red-800/50 text-center animate-in fade-in slide-in-from-top-2">
                {erro}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 ml-1">E-mail Master</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                       className="bg-gray-900/50 border border-gray-600 focus:bg-gray-900 focus:border-alta-green focus:ring-2 focus:ring-alta-green/50 text-white placeholder-gray-500 rounded-xl block w-full pl-10 pr-4 py-3 text-sm transition-all duration-300 outline-none" 
                       placeholder="admin@evento.com.br" />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-300 mb-1 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
                       className="bg-gray-900/50 border border-gray-600 focus:bg-gray-900 focus:border-alta-green focus:ring-2 focus:ring-alta-green/50 text-white placeholder-gray-500 rounded-xl block w-full pl-10 pr-4 py-3 text-sm transition-all duration-300 outline-none" 
                       placeholder="••••••••" />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full relative group overflow-hidden py-3.5 rounded-2xl bg-alta-green text-white font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(16,145,77,0.5)] transform transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-[0_12px_25px_-6px_rgba(16,145,77,0.6)]'}`}
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-20"></span>
                <span className="relative">{isLoading ? 'Autenticando...' : 'Acessar Painel'}</span>
                {!isLoading && <LogIn className="w-5 h-5 relative" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
