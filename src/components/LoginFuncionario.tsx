import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';

export default function LoginFuncionario() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && senha) {
      // Mock validation
      console.log('Login efetuado', { email });
      navigate('/funcionario/home');
    } else {
      setErro('Por favor, preencha e-mail e senha.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-alta-green/10 to-alta-green/5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-alta-pink/10 to-alta-orange/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-alta-green to-alta-green/80 rounded-2xl mb-4 backdrop-blur-sm border border-alta-green/30 shadow-lg transform hover:-translate-y-1 transition-transform">
             <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Acesso Restrito
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Área exclusiva para colaboradores do evento
          </p>
        </div>

        <div className="glass-effect rounded-3xl p-8 sm:p-10 transition-all duration-500 ease-in-out">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {erro && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center animate-in fade-in slide-in-from-top-2">
                {erro}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                       className="glass-input block w-full pl-10 pr-4 py-3 rounded-xl text-sm" placeholder="funcionario@evento.com.br" />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
                       className="glass-input block w-full pl-10 pr-4 py-3 rounded-xl text-sm" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-alta-green focus:ring-alta-green/30 border-gray-300 rounded cursor-pointer accent-alta-green" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">Lembrar-me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-alta-green hover:text-alta-green/80 transition-colors">Esqueceu a senha?</a>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full relative group overflow-hidden py-3.5 rounded-2xl bg-alta-green text-white font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(16,145,77,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(16,145,77,0.6)] transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10"></span>
                <span className="relative">Entrar no Sistema</span>
                <LogIn className="w-5 h-5 relative" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
